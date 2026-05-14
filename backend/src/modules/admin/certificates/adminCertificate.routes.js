/**
  adminCertificate.routes.js
  Defines Express routes for admin certificate management.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminCertificateController from './adminCertificate.controller.js'
import { validate, certificateIdValidation, issueCertificateValidation, updateCertificateValidation } from './adminCertificate.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminCertificateController.listCertificates))
router.get('/:certificateId', verifyJWT, verifyAdmin, validate(certificateIdValidation, 'params'), asyncHandler(adminCertificateController.getCertificateById))
router.post('/', verifyJWT, verifyAdmin, validate(issueCertificateValidation), asyncHandler(adminCertificateController.issueCertificate))
router.patch('/:certificateId', verifyJWT, verifyAdmin, validate(certificateIdValidation, 'params'), validate(updateCertificateValidation), asyncHandler(adminCertificateController.updateCertificate))
router.patch('/:certificateId/revoke', verifyJWT, verifyAdmin, validate(certificateIdValidation, 'params'), asyncHandler(adminCertificateController.revokeCertificate))
router.post('/:certificateId/resend-email', verifyJWT, verifyAdmin, validate(certificateIdValidation, 'params'), asyncHandler(adminCertificateController.resendCertificateEmail))

export default router

