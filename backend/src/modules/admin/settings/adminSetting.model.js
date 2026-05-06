import mongoose from 'mongoose'

const adminSettingSchema = new mongoose.Schema(
  {
    payment: {
      provider: {
        type: String,
        default: 'razorpay',
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      config: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
)

const AdminSetting = mongoose.model('AdminSetting', adminSettingSchema)
export default AdminSetting
