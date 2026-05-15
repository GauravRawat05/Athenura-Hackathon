/**
  user.controller.js
  Handles HTTP request/response flow for user.
 */
import ApiResponse from "../../libs/apiResponse.js"
import ApiError from "../../libs/apiError.js"
import userService from "./user.service.js"

class UserController {

  async getProfile(req, res) {
    const userId = req.user?._id

    if (!userId) {
      throw new ApiError(401, "Unauthorized")
    }

    const user = await userService.getProfileService(userId)

    return res.status(200).json(
      new ApiResponse(200, user, "Profile fetched successfully")
    )
  }

  async updateProfile(req, res) {
    const userId = req.user?._id

    if (!userId) {
      throw new ApiError(401, "Unauthorized")
    }

    const updateData = req.body

    const user = await userService.updateProfileService(userId, updateData)

    return res.status(200).json(
      new ApiResponse(200, user, "Profile updated successfully")
    )
  }

  async getMyResults(req, res) {
    const userId = req.user?._id

    if (!userId) {
      throw new ApiError(401, "Unauthorized")
    }

    // Placeholder for actual results fetching logic
    const results = await userService.getMyResultsService(userId)

    if (!results) {
      throw new ApiError(404, "User results not found")
    }
    return res.status(200).json(
      new ApiResponse(200, results, "User results fetched successfully")
    )
  }
}

const userController = new UserController()

export default userController