import api from './api';

export const universityService = {
  getMe: () => api.get('/university/me'),
  getMyStudents: () => api.get('/university/me/students'),

  // Admin APIs
  adminListUniversities: (params) => api.get('/admin/universities', { params }),
  adminGetUniversityById: (id) => api.get(`/admin/universities/${id}`),
  adminCreateUniversity: (data) => api.post('/admin/universities', data),
  adminUpdateUniversity: (id, data) => api.patch(`/admin/universities/${id}`, data),
  adminDeleteUniversity: (id) => api.delete(`/admin/universities/${id}`),
  adminGetUniversityStats: (id) => api.get(`/admin/universities/${id}/stats`),
};
