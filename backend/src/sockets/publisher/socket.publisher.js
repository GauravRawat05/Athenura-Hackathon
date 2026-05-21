/**
  socket.publisher.js
  Centralised helpers for pushing events into Socket.IO rooms.
  Every socket emission in the app should go through one of these functions
  so that room names and event names stay consistent.
 */
import { getIO } from '../../config/socket.js';
import { SOCKET_EVENTS } from '../events.js';

/**
 * Emits a progress update only to clients that have joined a specific hackathon room.
 * @param {string} hackathonId  Client to target
 * @param {object} payload
 */
export const emitProgressUpdate = (hackathonId, payload) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.PROGRESS_UPDATE, payload);
  } catch (err) {
    console.error('Socket emitProgressUpdate error:', err.message);
  }
};

/**
 * Emits a score-submitted event to the hackathon room.
 * @param {string} hackathonId
 * @param {object} scoreData
 */
export const emitScoreSubmitted = (hackathonId, scoreData) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.SCORE_SUBMITTED, scoreData);
  } catch (err) {
    console.error('Socket emitScoreSubmitted error:', err.message);
  }
};

/**
 * Emits a score-approved event.
 */
export const emitScoreApproved = (hackathonId, scoreData) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.SCORE_APPROVED, scoreData);
  } catch (err) {
    console.error('Socket emitScoreApproved error:', err.message);
  }
};

/**
 * Emits a score-rejected event.
 */
export const emitScoreRejected = (hackathonId, scoreData) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.SCORE_REJECTED, scoreData);
  } catch (err) {
    console.error('Socket emitScoreRejected error:', err.message);
  }
};

/**
 * Emits a ranking-updated event after any aggregation / draft cycle.
 */
export const emitRankingUpdated = (hackathonId, data) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.RANKING_UPDATED, data);
  } catch (err) {
    console.error('Socket emitRankingUpdated error:', err.message);
  }
};

/**
 * Emits a draft-ready event after the draft (re-)generation/update cycle.
 */
export const emitDraftReady = (hackathonId, draftData) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.DRAFT_READY, draftData);
  } catch (err) {
    console.error('Socket emitDraftReady error:', err.message);
  }
};

/**
 * Emits a results-published event to the hackathon room.
 */
export const emitResultsPublished = (hackathonId, publishData) => {
  try {
    const io = getIO();
    io.to(`hackathon:${hackathonId}`).emit(SOCKET_EVENTS.SERVER.RESULTS_PUBLISHED, publishData);
  } catch (err) {
    console.error('Socket emitResultsPublished error:', err.message);
  }
};

export default {
  emitProgressUpdate,
  emitScoreSubmitted,
  emitScoreApproved,
  emitScoreRejected,
  emitRankingUpdated,
  emitDraftReady,
  emitResultsPublished
};
