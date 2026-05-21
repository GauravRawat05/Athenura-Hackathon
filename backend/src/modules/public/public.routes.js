import { Router } from 'express';
import hackathonController from '../hackathons/hackathon.controller.js';
import publicWinnersController from '../results/publicWinners.controller.js';
import asyncHandler from '../../libs/asyncHandler.js';
import ApiResponse from '../../libs/apiResponse.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';
import certificateService from '../certificates/certificate.service.js';

const router = Router();

// GET /public/hackathons
router.get('/hackathons', asyncHandler(hackathonController.getAllHackathons));

// GET /public/hackathons/{hackathonId}
router.get('/hackathons/:hackathonId', asyncHandler(hackathonController.getHackathonById));

// GET /public/hackathons/{hackathonId}/winners
router.get('/hackathons/:hackathonId/winners', asyncHandler(publicWinnersController.getWinners));

// ── Public certificate verification ───────────────────────────────────────────
//
// GET /public/certificates/verify/:certificateCode
//
// Returns a public-safe snapshot: no PII, no internal DB fields.
// Any user (authenticated or not) can call this to verify a certificate.

router.get('/certificates/verify/:certificateCode', async (req, res) => {
  const { certificateCode } = req.params;
  const cert = await certificateService.verifyCertificate(certificateCode);

  if (!cert) {
    return res.status(404).json(
      new ApiResponse(404, null, 'Certificate not found')
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      cert,
      cert.isRevoked
        ? 'Certificate found but has been revoked'
        : 'Certificate verified successfully'
    )
  );
});

export default router;
