/**
  adminSetting.controller.js
  Handles HTTP request/response flow for adminSetting.
 */
import ApiResponse from '../../../libs/apiResponse.js'
import adminSettingService from './adminSetting.service.js'

class AdminSettingController {
  async getSettings(req, res) {
    const settings = await adminSettingService.getSettings()
    return res.status(200).json(new ApiResponse(200, settings, 'Admin settings fetched successfully'))
  }

  async updatePayment(req, res) {
    const paymentSettings = req.body
    const updatedSettings = await adminSettingService.updatePaymentSettings(paymentSettings)
    return res.status(200).json(
      new ApiResponse(200, updatedSettings, 'Payment configuration updated successfully')
    )
  }
}

const adminSettingController = new AdminSettingController()
export default adminSettingController
