/**
  judging.constants.js
  Shared constants for the judging module.
 */

export const scoreStatus = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const scoreStatusEnums = Object.values(scoreStatus);

export const MAX_SCORE_PER_CRITERION = 10;
export const MIN_SCORE_PER_CRITERION = 0;
