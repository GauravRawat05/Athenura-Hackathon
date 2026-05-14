/**
   adminAuth.service.js
   Business logic for admin authentication.
*/
import authRepository from "../../auth/auth.repository.js"
import envConfig from "../../../config/envConfig.js"
import { userRoles } from "../../users/user.constants.js"
import ApiError from "../../../libs/apiError.js"

class AdminAuthService {

  /**
   * Generate access and refresh tokens for a user
   */
  async generateAccessAndRefreshTokens(user) {
    try {
      if (!user || !user.generateAccessToken || !user.generateRefreshToken) {
        throw new Error("Invalid user object or missing token generation methods")
      }

      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await authRepository.saveUser(user, { validateBeforeSave: false })

      return { accessToken, refreshToken }
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`)
    }
  }

  /**
   * Get sanitized user data (without sensitive fields)
   */
  async getSanitizedUser(userId) {
    return await authRepository.findUserById(userId, "-password -refreshToken -emailOTP -emailVerificationToken")
  }

  /**
    * Register a new admin user
    */
  async registerAdminService(userInputData) {
    const { email, password, phone, adminSecretKey, confirmPassword } = userInputData

    // Validate admin secret key
    if (adminSecretKey !== envConfig.admineSecretKey) {
      throw new ApiError(403, "Invalid admin secret key");
    }

    // Validate password match
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email)
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }

    // Create admin user data
    const userData = {
      fullName: "Admin",
      email,
      password,
      phone,
      role: userRoles.ADMIN,
      isEmailVerified: true,
      dateOfBirth: new Date(),
      collegeOrUniversity: "N/A",
      graduationYear: new Date().getFullYear(),
      skills: []
    }

    const user = await authRepository.createUser(userData)

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user)

    const createdUser = await this.getSanitizedUser(user._id)

    return { user: createdUser, accessToken, refreshToken }
  }

  /**
    * Login admin user
    */
  async loginAdminService(email, password) {
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Verify admin role
    if (user.role !== userRoles.ADMIN) {
      throw new ApiError(403, "Access denied. Admin privileges required.");
    }

    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user)

    const sanitizedUser = await this.getSanitizedUser(user._id)

    return { user: sanitizedUser, accessToken, refreshToken }
  }
}

const adminAuthService = new AdminAuthService()
export default adminAuthService
