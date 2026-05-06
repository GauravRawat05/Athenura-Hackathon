/**
  adminUser.controller.js
  Handles HTTP request/response flow for adminUser.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminUserService from './adminUser.service.js'

class AdminUserController {
  async listUsers(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const result = await adminUserService.listUsers({ page, limit })
    return res.status(200).json(new ApiResponse(200, result, 'Users fetched successfully'))
  }

  async getUserById(req, res) {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid userId format')
    }

    const user = await adminUserService.getUserById(userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return res.status(200).json(new ApiResponse(200, user, 'User details fetched successfully'))
  }

  async suspendUser(req, res) {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid userId format')
    }

    const user = await adminUserService.suspendUser(userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return res.status(200).json(new ApiResponse(200, user, 'User suspended successfully'))
  }

  async restoreUser(req, res) {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid userId format')
    }

    const user = await adminUserService.restoreUser(userId)
    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return res.status(200).json(new ApiResponse(200, user, 'User restored successfully'))
  }

  async resetPassword(req, res) {
    const { userId } = req.params
    const { password } = req.body

    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid userId format')
    }

    const result = await adminUserService.resetUserPassword(userId, password)
    if (!result) {
      throw new ApiError(404, 'User not found')
    }

    return res.status(200).json(
      new ApiResponse(200, result, 'Password reset successfully')
    )
  }
}

const adminUserController = new AdminUserController()
export default adminUserController
