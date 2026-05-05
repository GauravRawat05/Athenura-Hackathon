/**
  adminCertificate.service.js
  Contains the core business rules for adminCertificate.
 */
import ApiError from '../../../libs/apiError.js'

class AdminCertificateService {
  async listCertificates({ page = 1, limit = 20, hackathonId, status }) {
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

  async getCertificateById(certificateId) {
    return {
      _id: certificateId,
      userId: null,
      hackathonId: null,
      certificateType: null,
      awardCategory: null,
      certificateCode: null,
      issuedAt: null,
      revokedAt: null,
      status: 'active'
    }
  }

  async issueCertificate({ userId, hackathonId, certificateType, awardCategory }) {
    const certificateCode = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    return {
      _id: null,
      userId,
      hackathonId,
      certificateType,
      awardCategory,
      certificateCode,
      issuedAt: new Date(),
      revokedAt: null,
      status: 'active'
    }
  }

  async updateCertificate(certificateId, { awardCategory, remarks }) {
    return {
      _id: certificateId,
      awardCategory,
      remarks,
      updatedAt: new Date()
    }
  }

  async revokeCertificate(certificateId) {
    return {
      _id: certificateId,
      status: 'revoked',
      revokedAt: new Date()
    }
  }

  async resendCertificateEmail(certificateId) {
    return true
  }
}

const adminCertificateService = new AdminCertificateService()
export default adminCertificateService

