import api from './api';

export const analyticsService = {
  getOverview: (params) => api.get('/admin/analytics/overview', { params }),
  getRegistrations: (params) => api.get('/admin/analytics/registrations', { params }),
  getRevenue: (params) => api.get('/admin/analytics/revenue', { params }),
  getUniversities: (params) => api.get('/admin/analytics/universities', { params }),
  getUserStats: (params) => api.get('/admin/analytics/users', { params }),
  getHackathonStats: (params) => api.get('/admin/analytics/hackathons', { params }),
};
