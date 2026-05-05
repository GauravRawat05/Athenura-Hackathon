/**
  adminPayment.service.js
  Contains the core business rules for adminPayment.
 */

class AdminPaymentService {
  async listPayments({ page = 1, limit = 20, status, method, hackathonId }) {
    const skip = (page - 1) * limit
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    }
  }

  async getPaymentById(paymentId) {
    return {
      _id: paymentId,
      userId: null,
      hackathonId: null,
      amount: 0,
      currency: 'INR',
      method: null,
      status: 'pending',
      transactionId: null,
      refundedAmount: 0,
      createdAt: null,
      updatedAt: null
    }
  }

  async updatePayment(paymentId, updateData) {
    return {
      _id: paymentId,
      ...updateData,
      updatedAt: new Date()
    }
  }

  async refundPayment(paymentId, { amount, reason }) {
    return {
      paymentId,
      refundedAmount: amount || 0,
      currency: 'INR',
      reason: reason || 'Admin refund',
      refundedAt: new Date(),
      status: 'refunded'
    }
  }

  async getPaymentStats() {
    return {
      totalPayments: 0,
      totalRevenue: 0,
      totalRefunds: 0,
      refundRate: 0,
      byStatus: {
        pending: 0,
        completed: 0,
        failed: 0,
        refunded: 0
      },
      byMethod: {
        razorpay: 0,
        stripe: 0,
        paypal: 0,
        other: 0
      }
    }
  }
}

const adminPaymentService = new AdminPaymentService()
export default adminPaymentService
