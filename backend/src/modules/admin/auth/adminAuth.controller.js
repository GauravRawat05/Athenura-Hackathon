/**
  adminAuth.controller.js
  Handles HTTP request/response flow for admin AND judge authentication.
*/
import ApiResponse from "../../../libs/apiResponse.js"
import ApiError from "../../../libs/apiError.js"
import adminAuthService from "./adminAuth.service.js"

class AdminAuthController {

  // ── Register — role in body decides whether Admin or Judge is created ──────
  async registerAdmin(req, res) {
    const { email, password, confirmPassword, phone, role, adminSecretKey, judgeSecretKey, judgeId } = req.body

    const { user, accessToken, refreshToken } = await adminAuthService.registerAdminService({
      email,
      password,
      confirmPassword,
      phone,
      role,
      adminSecretKey,
      judgeSecretKey,
      judgeId
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
          `${ role === "Judge" ? "Judge" : "Admin" } registered successfully`
        )
      )
  }

  // ── Login — checks stored role to decide the privilege level ──────────────
  async loginAdmin(req, res) {
    const { email, password } = req.body

    const { user, accessToken, refreshToken } = await adminAuthService.loginAdminService(email, password)

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
          `${user.role === "Judge" ? "Judge" : "Admin"} logged in successfully`
        )
      )
  }
}

const adminAuthController = new AdminAuthController()
export default adminAuthController
