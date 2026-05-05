/**
  adminPayment.controller.js
  Handles HTTP request/response flow for adminPayment.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminPaymentService from './adminPayment.service.js'

class AdminPaymentController {
  async listPayments(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const status = req.query.status
    const method = req.query.method
    const hackathonId = req.query.hackathonId

    const result = await adminPaymentService.listPayments({ page, limit, status, method, hackathonId })
    return res.status(200).json(new ApiResponse(200, result, 'Payments fetched successfully'))
  }

  async getPaymentById(req, res) {
    const { paymentId } = req.params
    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError(400, 'Invalid paymentId format')
    }

    const payment = await adminPaymentService.getPaymentById(paymentId)
    if (!payment) {
      throw new ApiError(404, 'Payment not found')
    }

    return res.status(200).json(new ApiResponse(200, payment, 'Payment details fetched successfully'))
  }

  async updatePayment(req, res) {
    const { paymentId } = req.params
    const updateData = req.body

    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError(400, 'Invalid paymentId format')
    }

    const payment = await adminPaymentService.updatePayment(paymentId, updateData)
    if (!payment) {
      throw new ApiError(404, 'Payment not found')
    }

    return res.status(200).json(new ApiResponse(200, payment, 'Payment updated successfully'))
  }

  async refundPayment(req, res) {
    const { paymentId } = req.params
    const { reason, amount } = req.body

    if (!mongoose.isValidObjectId(paymentId)) {
      throw new ApiError(400, 'Invalid paymentId format')
    }

    const refund = await adminPaymentService.refundPayment(paymentId, { amount, reason })
    if (!refund) {
      throw new ApiError(404, 'Payment not found or refund failed')
    }

    return res.status(200).json(new ApiResponse(200, refund, 'Refund processed successfully'))
  }

  async getPaymentStats(req, res) {
    const stats = await adminPaymentService.getPaymentStats()
    return res.status(200).json(new ApiResponse(200, stats, 'Payment statistics fetched successfully'))
  }
}

const adminPaymentController = new AdminPaymentController()
export default adminPaymentController
