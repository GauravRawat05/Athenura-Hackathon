/**
 * certificate.constants.js
 * Keeps enums, status values, event names, and fixed configuration used only by the certificate module.
 */

/**
 * All possible generation states a certificate can hold during its lifetime.
 */
export const GENERATION_STATUS = Object.freeze({
  PENDING: 'PENDING',
  GENERATING: 'GENERATING',
  UPLOADING: 'UPLOADING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

/**
 * Allowed transitions keyed by the current status.
 * Each key maps to an array of statuses the record may legally move to.
 */
export const VALID_TRANSITIONS = Object.freeze({
  [GENERATION_STATUS.PENDING]: [GENERATION_STATUS.GENERATING],

  [GENERATION_STATUS.GENERATING]: [
    GENERATION_STATUS.UPLOADING,
    GENERATION_STATUS.FAILED,
  ],

  [GENERATION_STATUS.UPLOADING]: [
    GENERATION_STATUS.COMPLETED,
    GENERATION_STATUS.FAILED,
  ],

  [GENERATION_STATUS.FAILED]: [GENERATION_STATUS.GENERATING],

  /**
   * COMPLETED may only re-enter GENERATING when the caller explicitly opts
   * in to a regeneration (e.g. the admin re-issued the certificate).
   * The `isRegenerating` flag on `validateTransition` gates this path.
   */
  [GENERATION_STATUS.COMPLETED]: [GENERATION_STATUS.GENERATING],
});

/**
 * Returns true when it is safe to move from `current` to `next`.
 *
 * @param {string} current          – current certificate status
 * @param {string} next             – desired next status
 * @param {object} [options]        – optional flags
 * @param {boolean} [options.isRegenerating=false] – set true only for an explicit regeneration
 * @returns {boolean}
 */
export function canTransition(current, next, options = {}) {
  return validateTransition(current, next, options) === true;
}

/**
  * Validates whether `next` is a permitted transition from `current`.
  *
  * - If the transition is valid, returns `true`.
  * - If the transition is invalid because it would require `isRegenerating`,
  *   returns the error string `'REQUIRES_REGENERATION_FLAG'`.
  * - For any other invalid transition, returns the offending `next` status.
  *
  * @param {string} current
  * @param {string} next
  * @param {object} [options]
  * @param {boolean} [options.isRegenerating=false]
  * @returns {true | string}
  */
 export function validateTransition(current, next, options = {}) {
   const { isRegenerating = false } = options;
   const allowed = VALID_TRANSITIONS[current];

   if (!allowed) {
     // Unknown current status — block everything.
     return next;
   }

   const isAllowed = allowed.includes(next);

   // COMPLETED → GENERATING is only valid when isRegenerating is true.
   if (
     current === GENERATION_STATUS.COMPLETED &&
     next === GENERATION_STATUS.GENERATING &&
     !isRegenerating
   ) {
     return 'REQUIRES_REGENERATION_FLAG';
   }

   // Return true if the transition is in the allowed list, otherwise return next (the invalid status)
   return isAllowed || next;
 }
