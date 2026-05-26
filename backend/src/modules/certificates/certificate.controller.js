/**
* certificate.controller.js
* Handles HTTP request/response flow for certificate, including parsing inputs
* and returning standardized API responses.
*/
import ApiResponse from '../../libs/apiResponse.js';
import ApiError from '../../libs/apiError.js';
import certificateService from './certificate.service.js';

class CertificateController {
  // ── Admin: Issue / Re-issue ──────────────────────────────────────────────────

  /**
   * POST /api/v1/certificates
   * Issues a new certificate.
   *
   * Request body:
   *   { userId, hackathonId, certificateType, awardCategory?, rank?, submissionId? }
   *
   * The service already handles the idempotency gate — this handler only
   * wires the request body to the service.
   */
  async issueCertificate(req, res) {
    const { userId, hackathonId, certificateType, awardCategory, rank, submissionId, teamName } =
      req.body ?? {};

    const cert = await certificateService.issueCertificate({
      userId,
      hackathonId,
      certificateType,
      awardCategory,
      rank,
      submissionId,
      teamName,
    });

    // Return the freshly created record (still PENDING or COMPLETED in the happy path)
    return res
      .status(201)
      .json(new ApiResponse(201, cert, 'Certificate issued successfully'));
  }

  /**
   * PATCH /api/v1/certificates/:certificateId/regenerate
   * Re-issues an existing COMPLETED certificate.
   * The caller must confirm that the cert is currently COMPLETED so the state
   * machine allows COMPLETED → GENERATING.
   */
  async regenerateCertificate(req, res) {
    const { certificateId } = req.params;

    const cert = await certificateService.regenerateCertificate(certificateId);
    if (!cert) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Certificate not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cert, 'Certificate regeneration started'));
  }

  /**
   * GET /api/v1/certificates/:certificateId
   * Fetches a single certificate by id.
   */
  async getCertificateById(req, res) {
    const { certificateId } = req.params;

    const cert = await certificateService.getCertificateById(certificateId);
    if (!cert) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Certificate not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cert, 'Certificate fetched successfully'));
  }

  // ── Admin: State transitions ─────────────────────────────────────────────────

  /**
   * PATCH /api/v1/certificates/:certificateId/revoke
   * Marks a certificate as revoked.
   */
  async revokeCertificate(req, res) {
    const { certificateId } = req.params;

    const cert = await certificateService.revokeCertificate(certificateId);
    if (!cert) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Certificate not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, cert, 'Certificate revoked successfully'));
  }

  // ── Admin: Email ─────────────────────────────────────────────────────────────

  /**
   * POST /api/v1/certificates/:certificateId/resend-email
   * Resends the ready-email without regenerating the PDF.
   */
  async resendCertificateEmail(req, res) {
    const { certificateId } = req.params;

    await certificateService.resendCertificateEmail(certificateId);
    return res
      .status(200)
      .json(new ApiResponse(200, { success: true }, 'Certificate email sent successfully'));
  }

  // ── Admin / Listing ──────────────────────────────────────────────────────────

  /**
   * GET /api/v1/certificates
   * Lists all certificates with optional filters.
   *
   * Query params:
   *   ?page=1&limit=20&hackathonId=<id>&status=COMPLETED
   */
  async listCertificates(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const { hackathonId, status } = req.query;

    const result = await certificateService.listCertificates({
      page,
      limit,
      hackathonId,
      status,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Certificates fetched successfully'));
  }

  // ── Public ──────────────────────────────────────────────────────────────────

  /**
   * GET /api/v1/certificates/verify/:certificateCode
   * Public verification endpoint — returns only public-safe fields.
   */
  async verifyByCode(req, res) {
    const { certificateCode } = req.params;

    const cert = await certificateService.verifyCertificate(certificateCode);
    if (!cert) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Certificate not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cert,
          cert.isRevoked
            ? 'Certificate found but has been revoked'
            : 'Certificate verified successfully'
        )
      );
  }

  /**
   * GET /api/v1/certificates/:certificateId/download
   * Authenticated download of a certificate PDF.
   * Only the certificate owner or an admin may download.
   * Returns a 302 redirect to the Cloudinary CDN URL so the file is
   * served directly by the CDN rather than through the API server.
   */
  async downloadCertificate(req, res) {
    const { certificateId } = req.params;
    const authenticatedUserId = req.user?._id;   // set by verifyJWT middleware

    const cert = await certificateService.getCertificateById(certificateId);
    if (!cert) {
      throw new ApiError(ApiResponse.NOT_FOUND, 'Certificate not found');
    }

    if (!cert.certificateUrl) {
      throw new ApiError(409, 'Certificate is not yet generated. Please try again later.');
    }

    // Only the owner or an admin may download.
    const isOwner = authenticatedUserId && cert.userId.toString() === authenticatedUserId.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ApiError(ApiResponse.FORBIDDEN, 'You do not have permission to download this certificate');
    }

    if (cert.generationStatus !== 'COMPLETED' || cert.isRevoked) {
      throw new ApiError(410, 'This certificate is no longer available for download');
    }

    // Respond with the Cloudinary CDN URL — browsers follow the redirect
    // and download the file directly from the CDN.
    return res.redirect(302, cert.certificateUrl);
  }

  /**
   * GET /api/v1/certificates/me
   * Fetches all completed certificates belonging to the authenticated user.
   * This is the participant-facing endpoint for viewing their earned certificates.
   */
  async getUserCertificates(req, res) {
    const authenticatedUserId = req.user?._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await certificateService.getUserCertificates(authenticatedUserId, {
      page,
      limit
    });

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Certificates fetched successfully'));
  }
}

const certificateController = new CertificateController();
export default certificateController;