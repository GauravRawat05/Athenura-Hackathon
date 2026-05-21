/**
  result.routes.js
  Public read layer — immutable snapshot views from the Result model.
  GET /results/latest        → results from the most recently published hackathon
  GET /results/:hackathonId   → paginated rankings for a specific published hackathon
 */
import { Router } from 'express';
import asyncHandler from '../../libs/asyncHandler.js';
import resultService from './result.service.js';
import Hackathon from '../admin/hackathons/hackathon.model.js';

const router = Router();

// ── GET /results/latest ──────────────────────────────────────────────
// Returns results from the most recently published hackathon.
router.get(
  '/latest',
  asyncHandler(async (req, res) => {
    // Find the latest hackathon that has resultsPublished=true
    const latestHackathon = await Hackathon.findOne({ resultsPublished: true })
      .sort({ updatedAt: -1 })
      .select('_id title slug endDate resultsPublished')
      .lean();

    if (!latestHackathon) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No hackathon with published results found'
      });
    }

    const results = await resultService.getPublishedResults(latestHackathon._id);

    return res.status(200).json({
      success: true,
      data: results,
      hackathon: {
        _id: latestHackathon._id,
        title: latestHackathon.title,
        slug: latestHackathon.slug,
        endDate: latestHackathon.endDate
      },
      total: results.length
    });
  })
);

// ── GET /results/:hackathonId ─────────────────────────────────────────
// Returns paginated, sorted ranking list from the immutable Result snapshots.
// If the hackathon has not been published yet, an empty list is returned.
router.get(
  '/:hackathonId',
  asyncHandler(async (req, res) => {
    const { hackathonId } = req.params;

    if (!hackathonId?.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hackathonId format'
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const hackathon = await Hackathon.findById(hackathonId)
      .select('_id title resultsPublished')
      .lean();

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Return nothing if results haven't been published yet
    if (!hackathon.resultsPublished) {
      return res.status(200).json({
        success: true,
        data: [],
        hackathon: { _id: hackathonId, title: hackathon.title },
        total: 0,
        page,
        limit
      });
    }

    const [results, total] = await Promise.all([
      resultService.getPublishedResults(hackathonId, { skip, limit }),
      resultService.getPublishedResults(hackathonId) // total count (no skip/limit)
    ]);

    return res.status(200).json({
      success: true,
      data: results,
      hackathon: {
        _id: hackathon._id,
        title: hackathon.title
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

export default router;
