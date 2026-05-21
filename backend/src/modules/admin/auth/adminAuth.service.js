/**
  adminAuth.service.js
  Business logic for admin AND judge authentication.
*/
import authRepository from "../../auth/auth.repository.js"
import envConfig from "../../../config/envConfig.js"
import { userRoles } from "../../users/user.constants.js"
import ApiError from "../../../libs/apiError.js"

class AdminAuthService {

  // ── Shared token helpers ──────────────────────────────────────────────────
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

  async getSanitizedUser(userId) {
    return await authRepository.findUserById(userId, "-password -refreshToken -emailOTP -emailVerificationToken")
  }

  // ── Register — role decides which secret key to check and which user type to create ──
  async registerAdminService(userInputData) {
    const { email, password, phone, role, adminSecretKey, judgeSecretKey, judgeId, confirmPassword } = userInputData

    // ── At least one role must be stated explicitly ──
    const validRoles = [userRoles.ADMIN, userRoles.JUDGE]
    if (!validRoles.includes(role)) {
      throw new ApiError(400, "Role must be either 'Admin' or 'Judge'")
    }

    // ── Validate the matching secret key ──
    if (role === userRoles.ADMIN) {
      if (!adminSecretKey) {
        throw new ApiError(400, "adminSecretKey is required when role is Admin")
      }
      if (adminSecretKey !== envConfig.adminSecretKey) {
        throw new ApiError(403, "Invalid admin secret key")
      }
    }

    if (role === userRoles.JUDGE) {
      if (!judgeSecretKey || !judgeId) {
        throw new ApiError(400, "judgeSecretKey and judgeId are required when role is Judge")
      }
      if (judgeSecretKey !== envConfig.judgeSecretKey) {
        throw new ApiError(403, "Invalid judge secret key")
      }
    }

    // ── Validate password confirmation ──
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match")
    }

    // ── Duplicate checks ──
    const existingUserByEmail = await authRepository.findUserByEmail(email)
    if (existingUserByEmail) {
      throw new ApiError(409, "User already exists with this email")
    }

    if (role === userRoles.JUDGE) {
      const existingUserByJudgeId = await authRepository.findByJudgeId(judgeId)
      if (existingUserByJudgeId) {
        throw new ApiError(409, "Judge ID is already registered")
      }
    }

    // ── Build user record — fields vary by role ──
    const userData = {
      fullName: role === userRoles.JUDGE ? "Judge" : "Admin",
      email,
      password,
      phone,
      role: role === userRoles.ADMIN ? userRoles.ADMIN : userRoles.JUDGE,
      isEmailVerified: true,
      dateOfBirth: new Date(),
      collegeOrUniversity: "N/A",
      graduationYear: new Date().getFullYear(),
      skills: []
    };

    // Only attach judgeId for judge accounts
    if (role === userRoles.JUDGE) {
      userData.judgeId = judgeId
    }

    const user = await authRepository.createUser(userData)

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user)

    const createdUser = await this.getSanitizedUser(user._id)

    return { user: createdUser, accessToken, refreshToken }
  }

  // ── Login — accepts either Admin or Judge; rejects other roles ────────────
  async loginAdminService(email, password) {
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    if (user.role !== userRoles.ADMIN && user.role !== userRoles.JUDGE) {
      throw new ApiError(403, "Access denied. Admin or Judge privileges required.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user)

    const sanitizedUser = await this.getSanitizedUser(user._id)

    return { user: sanitizedUser, accessToken, refreshToken }
  }
}

const adminAuthService = new AdminAuthService()
export default adminAuthService
