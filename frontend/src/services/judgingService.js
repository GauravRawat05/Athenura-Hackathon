import api from './api';

export const judgingService = {
  adminGetJudges: () => api.get('/judge/admin/judges'),
  adminGetHackathonJudges: (hackathonId) => api.get(`/judge/admin/hackathons/${hackathonId}/judges`),
  adminAssignJudges: (hackathonId, judgeIds) => api.post(`/judge/admin/hackathons/${hackathonId}/assign`, { judgeIds }),
  
  // Judge APIs
  getAssignments: () => api.get('/judge/assignments'),
  getSubmissions: (hackathonId) => api.get(`/judge/hackathons/${hackathonId}/submissions`),
  submitScore: (submissionId, hackathonId, data) => api.post(`/judge/submissions/${submissionId}/scores?hackathonId=${hackathonId}`, data),
  updateScore: (scoreId, data) => api.patch(`/judge/scores/${scoreId}`, data),
};
