/**
   auth.service.js
   Contains the core business rules for auth.
*/
import authRepository from "./auth.repository.js"
import UserUtils from "../users/user.utils.js"
import jwt from "jsonwebtoken"
import envConfig from "../../config/envConfig.js"
import ApiError from "../../libs/apiError.js"
import {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  EMAIL_TYPES
} from "../notifications/notification.mailer.js"

const userUtils = new UserUtils()

class AuthService {

  /**
   * Generate access and refresh tokens for a user
   * 
   * Use case:
   * - Access Token: Short-lived JWT for API authentication. Contains user identity 
   *   (_id, fullName, email, role) for quick auth checks on every request.
   *   Sent in Authorization header, expires quickly for security.
   * - Refresh Token: Long-lived JWT stored securely (httpOnly cookie). Used ONLY 
   *   to obtain new access tokens when they expire. Contains minimal data (_id only).
   * 
   * Security: Implements token rotation - new refresh token issued on each refresh,
   *   old one invalidated to prevent replay attacks.
   */
  async generateAccessAndRefreshTokens(user) {
    try {
      if (!user || !user.generateAccessToken || !user.generateRefreshToken) {
        throw new ApiError(500, "Invalid user object or missing token generation methods");
      }

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await authRepository.saveUser(user, { validateBeforeSave: false })

      return { accessToken, refreshToken }
    } catch (error) {
      throw new ApiError(500, `Token generation failed: ${error.message}`);
    }
  }

  /**
   * Get sanitized user data (without sensitive fields)
   */
  async getSanitizedUser(userId) {
    const excludeFields = userUtils.getSensitiveFieldsToExclude()
    return await authRepository.findUserById(userId, excludeFields)
  }

  /**
   * Register a new user
   */
  async registerUserService(userInputData) {
    const { fullName, email, password, phone, dateOfBirth, collegeOrUniversity, graduationYear, resumeLink, skills, secretKey, gender } = userInputData

    const existingUser = await authRepository.findUserByEmail(email)

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        throw new Error("User already exists, please login")
      }

      if (existingUser.emailOTPExpiry && existingUser.emailOTPExpiry > Date.now()) {
        throw new Error("OTP already sent. Please verify your email or wait for OTP to expire before re-registering")
      }

      const phoneExists = await authRepository.userExistsByPhone(phone)
      if (phoneExists && phoneExists.toString() !== existingUser._id.toString()) {
        throw new Error("Phone number already registered")
      }

      const role = userUtils.determineUserRole(secretKey)

      existingUser.fullName = fullName
      existingUser.password = password
      existingUser.phone = phone
      existingUser.dateOfBirth = dateOfBirth
      existingUser.collegeOrUniversity = collegeOrUniversity
      existingUser.graduationYear = graduationYear
      existingUser.resumeLink = resumeLink || existingUser.resumeLink
      existingUser.skills = skills && skills.length > 0 ? skills : []
      existingUser.role = role
      existingUser.gender = gender

      const otp = userUtils.generateOTP()
      console.log(otp);
      
      const hashedOTP = await userUtils.hashOTP(otp)

      existingUser.emailOTP = hashedOTP
      existingUser.emailOTPExpiry = userUtils.getOTPExpiryTime()

      await authRepository.saveUser(existingUser, { validateBeforeSave: false })

      // Send verification email
      try {
        await sendVerificationEmail(existingUser.email, otp, existingUser.fullName)
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError.message)
      }

      const updatedUser = await this.getSanitizedUser(existingUser._id)

      return { user: updatedUser, otp }
    }

    const phoneExists = await authRepository.userExistsByPhone(phone)
    if (phoneExists) {
      throw new Error("Phone number already registered")
    }

    const role = userUtils.determineUserRole(secretKey)

    const userData = userUtils.buildUserData({
      fullName,
      email,
      password,
      phone,
      dateOfBirth,
      collegeOrUniversity,
      graduationYear,
      resumeLink,
      skills,
      role,
      gender
    })

    const user = await authRepository.createUser(userData)

    const otp = userUtils.generateOTP()
    console.log(otp);
    
    const hashedOTP = await userUtils.hashOTP(otp)

    user.emailOTP = hashedOTP
    user.emailOTPExpiry = userUtils.getOTPExpiryTime()

    await authRepository.saveUser(user, { validateBeforeSave: false })

    // Send verification email
    try {
      await sendVerificationEmail(user.email, otp, user.fullName)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError.message)
    }

    const createdUser = await this.getSanitizedUser(user._id)

    return { user: createdUser, otp }
  }

  /**
   * Verify user account with OTP only
   */
  async verifyAccountService(email, otp) {
    const user = await authRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    if (user.isEmailVerified) {
      throw new Error("Already verified")
    }

    if (!user.emailOTPExpiry || user.emailOTPExpiry < Date.now()) {
      throw new Error("OTP expired")
    }

    const isOTPValid = await userUtils.compareOTP(otp, user.emailOTP)
    if (!isOTPValid) {
      throw new Error("Invalid OTP")
    }

    user.isEmailVerified = true
    user.emailOTP = undefined
    user.emailOTPExpiry = undefined

    await authRepository.saveUser(user, { validateBeforeSave: false })

    return { message: "Email verified successfully. You can now login." }
  }

  /**
   * Login user
   */
  async loginUserService(email, phone, password) {
    const user = await authRepository.findUserByEmailOrPhone(email, phone)

    if (!user) {
      throw new Error("User not found")
    }

    if (!user.isEmailVerified) {
      // Check if OTP is expired and auto-resend
      if (!user.emailOTPExpiry || user.emailOTPExpiry < Date.now()) {
        const plainOTP = userUtils.generateOTP()
        const hashedOTP = await userUtils.hashOTP(plainOTP)

        user.emailOTP = hashedOTP
        user.emailOTPExpiry = userUtils.getOTPExpiryTime()
        await authRepository.saveUser(user, { validateBeforeSave: false })

        // Send new OTP email via Brevo
        try {
          await sendVerificationEmail(user.email, plainOTP, user.fullName)
        } catch (emailError) {
          console.error("Failed to resend OTP email:", emailError.message)
        }

        throw new Error("Email not verified. New OTP sent to your email. Please verify before logging in.")
      }

      throw new Error("Email not verified. Please check your email for OTP or request a new one.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user)

    const sanitizedUser = await this.getSanitizedUser(user._id)

    return { user: sanitizedUser, accessToken, refreshToken }
  }

/**
    * Resend verification OTP
    */
   /**
    * Resend verification OTP
    */
   async resendVerificationService(email) {
     const user = await authRepository.findUserByEmail(email);
     if (!user) {
       throw new ApiError(404, "User not found");
     }

     if (user.isEmailVerified) {
       throw new ApiError(400, "User already verified");
     }

     const plainOTP = userUtils.generateOTP();
     console.log("OTP:",plainOTP);
     
     const hashedOTP = await userUtils.hashOTP(plainOTP);

     user.emailOTP = hashedOTP;
     user.emailOTPExpiry = userUtils.getOTPExpiryTime();

     await authRepository.saveUser(user, { validateBeforeSave: false });

     // Send verification email via Brevo
     try {
       await sendVerificationEmail(user.email, plainOTP, user.fullName);
     } catch (emailError) {
       console.error("Failed to resend verification email:", emailError.message);
       // Optionally: still return OTP in dev mode, or throw if email is critical
       // throw new ApiError(500, "Failed to send verification email");
     }

     return { otp: plainOTP, fullName: user.fullName, email: user.email };
   }

  /**
   * Logout user
   */
  async logoutUserService(userId) {
    await authRepository.unsetUserFields(userId, { refreshToken: 1 })
    return { message: "User logged out" }
  }

  /**
   * Get current user data
   */
  async getCurrentUserService(userId) {
    const user = await this.getSanitizedUser(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  /**
   * Forgot password service
   */
  async forgotPasswordService(email, phone) {
    let user

    if (email) {
      user = await authRepository.findUserByEmail(email)
    } else if (phone) {
      // Find user by phone specifically, assuming repository has this or use a generic filter
      user = await authRepository.findUserByEmailOrPhone(null, phone)
    }

    if (!user) {
      // Return generic success to prevent email enumeration
      return { message: "If an account exists, a reset code has been sent to the registered email" }
    }

    // Generate reset OTP
    const resetOTP = userUtils.generateOTP()
    const hashedOTP = await userUtils.hashOTP(resetOTP)
    console.log("Reset OTP:", resetOTP); // Log for debugging

    user.resetPasswordToken = hashedOTP
    user.resetPasswordTokenExpiry = userUtils.getOTPExpiryTime() // Using 10m OTP expiry

    await authRepository.saveUser(user, { validateBeforeSave: false })

    // Send password reset email via Brevo
    try {
      await sendPasswordResetEmail(user.email, resetOTP, user.fullName)
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError.message)
    }

    return { message: "Password reset code sent to your email" }
  }

  /**
  * Reset password service using OTP
  */
  async resetPasswordService(email, otp, newPassword) {
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
      throw new Error("Invalid request")
    }

    if (!user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < Date.now()) {
      throw new Error("Reset code has expired")
    }

    const isOTPValid = await userUtils.compareOTP(otp, user.resetPasswordToken)
    if (!isOTPValid) {
      throw new Error("Invalid reset code")
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiry = undefined

    await authRepository.saveUser(user)

    return { message: "Password reset successfully" }
  }

  /**
   * Refresh access token using a valid refresh token
   * Implements token rotation: new refresh token issued, old one invalidated
   */
  async refreshAccessTokenService(incomingRefreshToken) {
    try {
      // Verify the incoming refresh token
      const decodedToken = jwt.verify(incomingRefreshToken, envConfig.refreshTokenSecret)

      // Find user by ID from token payload
      const user = await authRepository.findUserById(decodedToken._id)

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // Check if the incoming token matches the stored refresh token
      // This prevents reuse of old/rotated tokens
      if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Invalid refresh token");
      }

      // Generate new tokens (rotation)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      // Save new refresh token to DB
      user.refreshToken = refreshToken
      await authRepository.saveUser(user, { validateBeforeSave: false })

      return { accessToken, refreshToken }
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        throw new ApiError(401, "Invalid or expired refresh token");
      }
      throw error
    }
  }
}

const authService = new AuthService()
export default authService
