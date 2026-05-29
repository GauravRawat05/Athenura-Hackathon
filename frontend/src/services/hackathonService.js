import api from './api';

export const hackathonService = {
  getAllHackathons: () => api.get('/hackathons'),
  getHackathonById: (id) => api.get(`/hackathons/${id}`),
  getRegistrations: () => api.get('/registrations/me'),
  getMyRegistrations: (status) => api.get(`/registrations/me${status ? `?status=${status}` : ''}`),
  register: (id, data) => api.post(`/registrations/${id}/initiate-registration`, data),
  getMySubmission: (hackathonId) => api.get(`/submissions/hackathons/${hackathonId}/submissions/me`),
  createSubmission: (hackathonId, data) => api.post(`/submissions/hackathons/${hackathonId}/submissions`, data),
  updateSubmission: (submissionId, data) => api.patch(`/submissions/${submissionId}`, data),
  // Admin APIs
  adminGetHackathons: () => api.get('/admin/hackathons/hackathons'),
  adminGetHackathonById: (id) => api.get(`/admin/hackathons/${id}`),
  adminCreateHackathon: (data) => {
    if (data instanceof FormData) {
      return api.post('/admin/hackathons/create-hackathon', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/admin/hackathons/create-hackathon', data);
  },
  adminUpdateHackathon: (id, data) => {
    if (data instanceof FormData) {
      return api.patch(`/admin/hackathons/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.patch(`/admin/hackathons/${id}`, data);
  },
  adminDeleteHackathon: (id) => api.delete(`/admin/hackathons/${id}`),
  adminListRegistrations: (hackathonId, params) => api.get(`/admin/hackathons/${hackathonId}/registrations`, { params }),
  adminGetResultProgress: (hackathonId) => api.get(`/admin/results/progress/${hackathonId}`),
  // GET /admin/results/hackathon/:hackathonId - Admin get results for a hackathon
// Accepts optional params for pagination/filters; defaults to empty object if not provided
adminGetHackathonResults: (hackathonId, params = {}) => api.get(`/admin/results/hackathon/${hackathonId}`, { params }),

  // POST /admin/results/draft/:hackathonId - Generate draft from approved scores
  adminComputeResults: (hackathonId, payload) => api.post(
    `/admin/results/draft/${hackathonId}`,
    payload
  ),

  // PATCH /admin/results/draft/:hackathonId - Single record override with draftId
  adminUpdateDraft: (hackathonId, payload) => api.patch(
    `/admin/results/draft/${hackathonId}`,
    payload
  ),

  // PATCH /admin/hackathons/:hackathonId/results/override - Bulk overrides from frontend
  // Transforms frontend format: { submissionId, finalRank, award, reason } to backend format
  adminSaveDraftOverrides: (hackathonId, overrides) => {
    // Transform frontend override format to backend format
    // Frontend: { submissionId, finalRank, award, reason }
    // Backend:  { submissionId, rank, awardCategory, notes }
    const transformedOverrides = overrides.map(o => ({
      submissionId: o.submissionId,
      rank: o.finalRank || o.rank,
      awardCategory: o.award || o.awardCategory || (o.finalRank <= 3 ? 
        (o.finalRank === 1 ? 'First Prize' : 
         o.finalRank === 2 ? 'Second Prize' : 
         o.finalRank === 3 ? 'Third Prize' : 'Participant') : 'Participant'),
      notes: o.reason || o.notes || ''
    }));
    return api.patch(`/admin/hackathons/${hackathonId}/results/override`, { overrides: transformedOverrides });
  },

  // POST /admin/results/publish/:hackathonId
  adminPublishResults: (hackathonId, payload) => api.post(
    `/admin/results/publish/${hackathonId}`,
    payload
  ),

  // GET /admin/results/all-scores/:hackathonId - Get all judge scores for a hackathon
  adminGetAllJudgeScores: (hackathonId) => api.get(`/admin/results/all-scores/${hackathonId}`),

  // GET /admin/review-queue - List review queue items for a hackathon (pending scores)
  adminGetReviewQueue: (hackathonId, status = 'pending') => api.get('/admin/review-queue', {
    params: { hackathonId, status }
  }),

  // POST /admin/review-queue/:queueId/resolve - Resolve a queue item (approve or reject)
  adminResolveQueueItem: (queueId, data) => api.post(`/admin/review-queue/${queueId}/resolve`, data),

  getWinners: (id) => api.get(`/hackathons/${id}/winners`),
};
