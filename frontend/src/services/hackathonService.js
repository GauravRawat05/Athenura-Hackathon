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

  getWinners: (id) => api.get(`/hackathons/${id}/winners`),
};

