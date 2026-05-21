/**
 * adminCertificate.service.js
 * Contains the core business rules for adminCertificate.
 * Delegates to the real certificate.service.js for all DB-level operations;
 * implements admin-only helpers (update remarks, paginated listing, etc.) on top.
 */
import ApiError from '../../../libs/apiError.js';
import certificateService from '../../certificates/certificate.service.js';
import certificateRepository from '../../certificates/certificate.repository.js';

class AdminCertificateService {
  /**
   * GET /admin/certificates
   *
   * Supports the admin panel list view with optional hackathonId and status filters.
   */
  async listCertificates({ page = 1, limit = 20, hackathonId, status }) {
    const result = await certificateService.listCertificates({
      page,
      limit,
      hackathonId,
      status,
    });
    return result;
  }

  /**
   * GET /admin/certificates/:certificateId
   */
  async getCertificateById(certificateId) {
    const cert = await certificateService.getCertificateById(certificateId);
    if (!cert) {
      throw new ApiError(404, 'Certificate not found');
    }
    return cert;
  }

  /**
   * POST /admin/certificates
   *
   * Issues a new certificate record. The core service handles the idempotency gate:
   * if a certificate already exists for the same (userId, hackathonId, type) triple
   * the existing record is returned instead of a duplicate.
   */
  async issueCertificate({ userId, hackathonId, certificateType, awardCategory }) {
    if (!userId || !hackathonId || !certificateType) {
      throw new ApiError(400, 'userId, hackathonId, and certificateType are required');
    }

    return await certificateService.issueCertificate({
      userId,
      hackathonId,
      certificateType,
      awardCategory,
    });
  }

  /**
   * PATCH /admin/certificates/:certificateId
   *
   * Updates mutable fields on an existing certificate (awardCategory, remarks).
   * Remarks are stored as note metadata alongside the certificate record.
   */
  async updateCertificate(certificateId, { awardCategory, remarks }) {
    const updateData = {};
    if (awardCategory !== undefined) updateData.awardCategory = awardCategory;
    // remarks is stored as a plain string field — add it to the model if not present
    if (remarks !== undefined) updateData.remarks = remarks;

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, 'No fields provided to update');
    }

    const updated = await certificateRepository.updateById(certificateId, updateData);
    if (!updated) {
      throw new ApiError(404, 'Certificate not found');
    }

    return updated;
  }

  /**
   * PATCH /admin/certificates/:certificateId/revoke
   *
   * Marks the certificate as revoked. Revoked certificates remain in the DB so
   * the audit trail is preserved, but are excluded from public verification checks.
   */
  async revokeCertificate(certificateId) {
    const cert = await certificateService.revokeCertificate(certificateId);
    if (!cert) {
      throw new ApiError(404, 'Certificate not found');
    }
    return cert;
  }

  /**
   * POST /admin/certificates/:certificateId/resend-email
   *
   * Resends the CERTIFICATE_READY email. The certificate must be COMPLETED.
   */
  async resendCertificateEmail(certificateId) {
    return await certificateService.resendCertificateEmail(certificateId);
  }
}

const adminCertificateService = new AdminCertificateService();
export default adminCertificateService;
