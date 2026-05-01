/**
  auth.service.js
  Contains the core business rules for auth.
 */
import AuthRepository from "./auth.repository.js"
import UserUtils from "../users/user.utils.js"
import jwt from "jsonwebtoken"
import envConfig from "../../config/envConfig.js"

class AuthService {

  /**
   * Generate access and refresh tokens for a user
   */
  async generateAccessAndRefreshTokens(user) {
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await authRepository.saveUser(user, { validateBeforeSave: false })

    return { accessToken, refreshToken }
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
    const { fullName, email, password, phone, dateOfBirth, collegeOrUniversity, graduationYear, resumeLink, skills, secretKey } = userInputData

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

      const otp = userUtils.generateOTP()
      const hashedOTP = await userUtils.hashOTP(otp)

      existingUser.emailOTP = hashedOTP
      existingUser.emailOTPExpiry = userUtils.getOTPExpiryTime()

      await authRepository.saveUser(existingUser, { validateBeforeSave: false })

      const updatedUser = await getSanitizedUser(existingUser._id)

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
      role
    })

    const user = await authRepository.createUser(userData)

    const otp = userUtils.generateOTP()
    const hashedOTP = await userUtils.hashOTP(otp)

    user.emailOTP = hashedOTP
    user.emailOTPExpiry = userUtils.getOTPExpiryTime()

    await authRepository.saveUser(user, { validateBeforeSave: false })

    const createdUser = await getSanitizedUser(user._id)

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
    user.emailVerificationToken = undefined
    user.emailVerificationTokenExpiry = undefined

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
      throw new Error("Please verify your email first. Check inbox or resend OTP")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user)

    const sanitizedUser = await getSanitizedUser(user._id)

    return { user: sanitizedUser, accessToken, refreshToken }
  }

  /**
   * Resend verification OTP
   */
  async resendVerificationService(email) {
    const user = await authRepository.findUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    if (user.isEmailVerified) {
      throw new Error("User already verified")
    }

    const plainOTP = userUtils.generateOTP()
    const hashedOTP = await userUtils.hashOTP(plainOTP)

    const tokenData = user.generateTemporaryToken()

    user.emailOTP = hashedOTP
    user.emailOTPExpiry = userUtils.getOTPExpiryTime()
    user.emailVerificationToken = tokenData.hashedToken
    user.emailVerificationTokenExpiry = tokenData.tokenExpiry

    await authRepository.saveUser(user, { validateBeforeSave: false })

    return { otp: plainOTP, token: tokenData.unHashedToken, fullName: user.fullName, email: user.email }
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
    const user = await getSanitizedUser(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessTokenService(incomingRefreshToken) {
    const decodedToken = jwt.verify(incomingRefreshToken, envConfig.refreshTokenSecret)

    const user = await authRepository.findUserById(decodedToken._id)

    if (!user) {
      throw new Error("User not found")
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new Error("Refresh token expired or used")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user)

    return { accessToken, refreshToken }
  }
}

const authService = new AuthService()
export default authService
