/**
  adminPayment.routes.js
  Defines Express routes for admin payment management.
 */
import { Router } from 'express'
import asyncHandler from '../../../libs/asyncHandler.js'
import { verifyJWT, verifyAdmin } from '../../../middleware/auth.middleware.js'
import adminPaymentController from './adminPayment.controller.js'
import { validate, paymentIdValidation, refundPaymentValidation, updatePaymentValidation } from './adminPayment.validation.js'

const router = Router()

router.get('/', verifyJWT, verifyAdmin, asyncHandler(adminPaymentController.listPayments))
router.get('/:paymentId', verifyJWT, verifyAdmin, validate(paymentIdValidation, 'params'), asyncHandler(adminPaymentController.getPaymentById))
router.patch('/:paymentId', verifyJWT, verifyAdmin, validate(paymentIdValidation, 'params'), validate(updatePaymentValidation), asyncHandler(adminPaymentController.updatePayment))
router.post('/:paymentId/refund', verifyJWT, verifyAdmin, validate(refundPaymentValidation), asyncHandler(adminPaymentController.refundPayment))
router.get('/stats', verifyJWT, verifyAdmin, asyncHandler(adminPaymentController.getPaymentStats))

export default router
