/**
 * certificate.repository.js
 * Encapsulates database reads/writes for certificate so query logic stays out of controllers and services.
 */
import Certificate from './certificate.model.js';
import { GENERATION_STATUS } from './certificate.constants.js';

class CertificateRepository {
  /**
   * Find a certificate by its internal MongoDB id.
   */
  async findById(certificateId) {
    return await Certificate.findById(certificateId);
  }

  /**
   * Find a certificate by its unique public verification code.
   */
  async findByCode(certificateCode) {
    return await Certificate.findOne({ certificateCode });
  }

  /**
   * Find a certificate by the (userId, hackathonId, certificateType) compound key.
   * Returns null when no match exists — the service layer uses this as an
   * idempotency gate before creating a new record.
   */
  async findByUserHackathonType({ userId, hackathonId, certificateType }) {
    return await Certificate.findOne({
      userId,
      hackathonId,
      certificateType,
      isDeleted: false,
    });
  }

  /**
   * List certificates with optional filters and pagination.
   * Returns both the data array and a pagination meta object so the
   * controller can send a consistent response shape to the front-end.
   */
  async list({ page = 1, limit = 20, hackathonId, status, sortBy = 'createdAt', sortOrder = 'desc' }) {
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false };

    if (hackathonId) {
      filter.hackathonId = hackathonId;
    }
    if (status) {
      filter.generationStatus = status;
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      Certificate.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Certificate.countDocuments(filter),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new certificate record.
   *
   * @param {object} payload — partial document; at minimum userId, hackathonId,
   *                            certificateType, and certificateCode must be set.
   * @returns {Promise<Certificate>}
   */
  async create(payload) {
    return await Certificate.create(payload);
  }

  /**
   * Update a single certificate by id.
   * By default only updates fields that were actually modified.
   *
   * @param {string}    certificateId
   * @param {object}    updateData   — flat key/value pairs to merge
   * @param {object}    [options]
   * @param {boolean}   [options.new=true]  — return the updated doc if true
   * @returns {Promise<Certificate | null>}
   */
  async updateById(certificateId, updateData, options = {}) {
    return await Certificate.findByIdAndUpdate(
      certificateId,
      updateData,
      { new: options.new !== false, ...options }
    );
  }

  /**
   * Atomically advance the generation status of a certificate.
   * Uses a filter-on-save so the write is a no-op if the status has already
   * moved past `currentStatus` (race-condition guard).
   *
   * @param {string}    certificateId
   * @param {string}    currentStatus  — expected current state before transition
   * @param {string}    nextStatus     — desired next state
   * @param {object}    [extraData={}] — additional fields to merge on transition
   * @returns {Promise<Certificate | null>}
   */
  async transitionStatus(certificateId, currentStatus, nextStatus, extraData = {}) {
    return await Certificate.findOneAndUpdate(
      {
        _id: certificateId,
        generationStatus: currentStatus,       // guard against stale writes
      },
      {
        $set: {
          generationStatus: nextStatus,
          ...extraData,
        },
      },
      { new: true }
    );
  }

  /**
   * Soft-delete a certificate by id.
   */
  async softDelete(certificateId) {
    return await Certificate.findByIdAndUpdate(
      certificateId,
      { isDeleted: true },
      { new: true }
    );
  }

  /**
   * Save certificate document instance directly (used after mutations on
   * an already-fetched doc, e.g. incrementing retryCount).
   */
  async save(certificateDoc, options = {}) {
    return await certificateDoc.save(options);
  }
}

const certificateRepository = new CertificateRepository();
export default certificateRepository;
