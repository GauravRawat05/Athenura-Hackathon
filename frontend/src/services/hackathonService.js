import api from './api';

export const hackathonService = {
  getAllHackathons: () => api.get('/hackathons'),
  getHackathonById: (id) => api.get(`/hackathons/${id}`),
  getRegistrations: () => api.get('/registrations/me'),
  getMyRegistrations: (status) => api.get(`/registrations/me${status ? `?status=${status}` : ''}`),
  register: (id, data) => api.post(`/registrations/${id}/register`, data),
  getMySubmission: (hackathonId) => api.get(`/submissions/hackathons/${hackathonId}/submissions/me`),
  createSubmission: (hackathonId, data) => api.post(`/submissions/hackathons/${hackathonId}/submissions`, data),
  updateSubmission: (submissionId, data) => api.patch(`/submissions/${submissionId}`, data),
  getWinners: (id) => api.get(`/hackathons/${id}/winners`),
};
