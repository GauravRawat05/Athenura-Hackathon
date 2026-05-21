/**
 * certificateTypes.js
 * Certificate type constants for participation, rank, special awards, or future certificate variants.
 * These values are used as keys in the act of building EJS/React-PDF data payloads,
 * in schema enums, and throughout the certificates module.
 */

export const CERTIFICATE_TYPES = Object.freeze({
  /** Issued to anyone who completed registration / attended the event. */
  PARTICIPATION: 'participation',

  /** Issued to the 1st-place team or individual. */
  WINNER: 'winner',

  /** Issued to teams/individuals who reached the final presentation round. */
  FINALIST: 'finalist',

  /** Issued to hackathon judges for their contribution. */
  JUDGE: 'judge',
});

/**
 * All certificate types as a flat array — handy for Joi `.valid(...)` or
 * building dynamic select dropdowns in the admin UI.
 */
export const CERTIFICATE_TYPE_VALUES = Object.values(CERTIFICATE_TYPES);
