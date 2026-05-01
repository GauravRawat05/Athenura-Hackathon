/**
  auth.controller.js
  Handles HTTP request/response flow for auth.
 */
import ApiResponse from "../../libs/apiResponse.js"
import ApiError from "../../libs/apiError.js"
import authService from "./auth.service.js"

class AuthController {

  async registerUser(req, res) {
    const {
      fullName,
      email,
      password,
      phone,
      dateOfBirth,
      collegeOrUniversity,
      graduationYear,
      resumeLink,
      secretKey,
      skills
    } = req.body

    const { user, otp } = await authService.registerUserService({
      fullName,
      email,
      password,
      phone,
      dateOfBirth,
      collegeOrUniversity,
      graduationYear,
      resumeLink,
      skills,
      secretKey
    })

    // 🧪 Dev logs (remove in production)
    console.log("OTP:", otp)

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "OTP has been sent to your email"))
  }

  async verifyAccount(req, res) {
    const { email, otp } = req.body

    const result = await authService.verifyAccountService(email, otp)

    return res.status(200).json(new ApiResponse(200, {}, result.message))
  }

  async loginUser(req, res) {
    const { email, phone, password } = req.body

    const { user, accessToken, refreshToken } = await authService.loginUserService(
      email,
      phone,
      password
    )

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user, accessToken, refreshToken },
          "User logged in successfully"
        )
      )
  }

  async reverifyUser(req, res) {
    const { email } = req.body

    const result = await authService.resendVerificationService(email)

    console.log(result)

    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "New OTP and verification link sent to email")
      )
  }

  async logoutUser(req, res) {
    await authService.logoutUserService(req.user._id)

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"))
  }

  async getMe(req, res) {
    const userId = req.user?._id

    if (!userId) {
      throw new ApiError(401, "Unauthorized")
    }

    const user = await authService.getCurrentUserService(userId)

    return res.status(200).json(
      new ApiResponse(200, user, "User fetched successfully")
    )
  }

  async refreshAccessToken(req, res) {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token is required")
    }

    const { accessToken, refreshToken } = await authService.refreshAccessTokenService(incomingRefreshToken)

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      )
  }
}

const authController = new AuthController()

export default authController
