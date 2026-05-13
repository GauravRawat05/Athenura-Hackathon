/**
  adminAuth.controller.js
  Handles HTTP request/response flow for admin authentication.
 */
import ApiResponse from "../../../libs/apiResponse.js"
import ApiError from "../../../libs/apiError.js"
import adminAuthService from "./adminAuth.service.js"

class AdminAuthController {

  async registerAdmin(req, res) {
    const { email, password, adminSecretKey,confirmPassword,phone } = req.body

    const { user, accessToken, refreshToken } = await adminAuthService.registerAdminService({
      email,
      password,
      adminSecretKey,
      confirmPassword,
      phone
    })

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    }

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          201,
          { user, accessToken, refreshToken },
          "Admin registered successfully"
        )
      )
  }

  async loginAdmin(req, res) {
    const { email, password } = req.body

    const { user, accessToken, refreshToken } = await adminAuthService.loginAdminService(
      email,
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
          "Admin logged in successfully"
        )
      )
  }
}

const adminAuthController = new AdminAuthController()
export default adminAuthController
