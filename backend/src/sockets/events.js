/**
  socketEvents.js
  Shared socket event name constants — use these everywhere instead of raw strings.
 */
export const SOCKET_EVENTS = {
  // Client → Server
  CLIENT: {
    JOIN_HACKATHON: 'join-hackathon',
    LEAVE_HACKATHON: 'leave-hackathon',
    REQUEST_PROGRESS: 'request-progress'
  },

  // Server → Client
  SERVER: {
    // Progress
    PROGRESS_UPDATE: 'progress-update',
    // Scored / ranked
    SCORE_SUBMITTED: 'score-submitted',
    SCORE_UPDATED: 'score-updated',
    SCORE_APPROVED: 'score-approved',
    SCORE_REJECTED: 'score-rejected',
    RANKING_UPDATED: 'ranking-updated',
    // Draft / publish lifecycle
    DRAFT_READY: 'draft-ready',
    DRAFT_UPDATED: 'draft-updated',
    RESULTS_PUBLISHED: 'results-published',
    // Errors
    ERROR: 'error'
  }
};
