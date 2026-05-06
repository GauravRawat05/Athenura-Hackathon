/**
  adminSetting.service.js
  Contains the core business rules for adminSetting.
 */
import AdminSetting from './adminSetting.model.js'

class AdminSettingService {
  async getSettings() {
    let settings = await AdminSetting.findOne().lean()
    if (!settings) {
      settings = await AdminSetting.create({})
      settings = settings.toObject()
    }
    return settings
  }

  async updatePaymentSettings(paymentSettings) {
    let settings = await AdminSetting.findOne()

    if (!settings) {
      const created = await AdminSetting.create({ payment: paymentSettings })
      return created.toObject()
    }

    settings.payment = {
      ...settings.payment,
      ...paymentSettings,
    }

    await settings.save()
    return settings.toObject()
  }
}

const adminSettingService = new AdminSettingService()
export default adminSettingService
