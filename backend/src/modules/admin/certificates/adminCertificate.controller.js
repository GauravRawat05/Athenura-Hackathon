/**
  adminCertificate.controller.js
  Handles HTTP request/response flow for adminCertificate.
 */
import mongoose from 'mongoose'
import ApiResponse from '../../../libs/apiResponse.js'
import ApiError from '../../../libs/apiError.js'
import adminCertificateService from './adminCertificate.service.js'

class AdminCertificateController {
  async listCertificates(req, res) {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 20)
    const hackathonId = req.query.hackathonId
    const status = req.query.status

    const result = await adminCertificateService.listCertificates({ page, limit, hackathonId, status })
    return res.status(200).json(new ApiResponse(200, result, 'Certificates fetched successfully'))
  }

  async getCertificateById(req, res) {
    const { certificateId } = req.params
    if (!mongoose.isValidObjectId(certificateId)) {
      throw new ApiError(400, 'Invalid certificateId format')
    }

    const certificate = await adminCertificateService.getCertificateById(certificateId)
    if (!certificate) {
      throw new ApiError(404, 'Certificate not found')
    }

    return res.status(200).json(new ApiResponse(200, certificate, 'Certificate details fetched successfully'))
  }

  async issueCertificate(req, res) {
    const { userId, hackathonId, certificateType, awardCategory } = req.body

    const certificate = await adminCertificateService.issueCertificate({
      userId,
      hackathonId,
      certificateType,
      awardCategory
    })

    return res.status(201).json(new ApiResponse(201, certificate, 'Certificate issued successfully'))
  }

  async updateCertificate(req, res) {
    const { certificateId } = req.params
    const { awardCategory, remarks } = req.body

    if (!mongoose.isValidObjectId(certificateId)) {
      throw new ApiError(400, 'Invalid certificateId format')
    }

    const certificate = await adminCertificateService.updateCertificate(certificateId, {
      awardCategory,
      remarks
    })

    if (!certificate) {
      throw new ApiError(404, 'Certificate not found')
    }

    return res.status(200).json(new ApiResponse(200, certificate, 'Certificate updated successfully'))
  }

  async revokeCertificate(req, res) {
    const { certificateId } = req.params
    if (!mongoose.isValidObjectId(certificateId)) {
      throw new ApiError(400, 'Invalid certificateId format')
    }

    const certificate = await adminCertificateService.revokeCertificate(certificateId)
    if (!certificate) {
      throw new ApiError(404, 'Certificate not found')
    }

    return res.status(200).json(new ApiResponse(200, certificate, 'Certificate revoked successfully'))
  }

  async resendCertificateEmail(req, res) {
    const { certificateId } = req.params
    if (!mongoose.isValidObjectId(certificateId)) {
      throw new ApiError(400, 'Invalid certificateId format')
    }

    const result = await adminCertificateService.resendCertificateEmail(certificateId)
    if (!result) {
      throw new ApiError(404, 'Certificate not found')
    }

    return res.status(200).json(new ApiResponse(200, { success: true }, 'Certificate email sent successfully'))
  }
}

const adminCertificateController = new AdminCertificateController()
export default adminCertificateController

