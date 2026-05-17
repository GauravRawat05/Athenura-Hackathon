import { Router } from 'express';
import hackathonController from '../hackathons/hackathon.controller.js';
import publicWinnersController from '../results/publicWinners.controller.js';
import asyncHandler from '../../libs/asyncHandler.js';
import ApiResponse from '../../libs/apiResponse.js';

const router = Router();

// GET /public/hackathons
router.get('/hackathons', asyncHandler(hackathonController.getAllHackathons));

// GET /public/hackathons/{hackathonId}
router.get('/hackathons/:hackathonId', asyncHandler(hackathonController.getHackathonById));

// GET /public/hackathons/{hackathonId}/winners
router.get('/hackathons/:hackathonId/winners', asyncHandler(publicWinnersController.getWinners));

// GET /public/certificates/verify/{certificateCode}
router.get('/certificates/verify/:certificateCode', (req, res) => {
    const { certificateCode } = req.params;
    // Mock response since certificate module is not fully implemented yet
    res.json(new ApiResponse(200, { certificateCode, verified: true, issuedTo: "Mock User" }, "Certificate verified successfully"));
});

export default router;
