import api from './api';

export const userService = {
  getProfile: () => api.get('/users/me'),
  getMyResults: () => api.get('/users/me/results'),
  getDashboardStats: () => api.get('/users/me/dashboard'),
  getUserActivity: (limit) => api.get(`/users/me/activity${limit ? `?limit=${limit}` : ''}`),
  updateProfile: (data) => api.patch('/users/me', data),
  getActiveHackathons: (limit) => api.get(`/users/me/active-hackathons${limit ? `?limit=${limit}` : ''}`),
  getUserCertificates: (limit) => api.get(`/users/me/certificates${limit ? `?limit=${limit}` : ''}`),

  // Admin User APIs
  adminListUsers: (page = 1, limit = 1000) => api.get(`/admin/users?page=${page}&limit=${limit}`),
  adminGetUserById: (id) => api.get(`/admin/users/${id}`),
  adminSuspendUser: (id) => api.patch(`/admin/users/${id}/suspend`),
  adminRestoreUser: (id) => api.patch(`/admin/users/${id}/restore`),
  adminResetPassword: (id, password) => api.post(`/admin/users/${id}/resetpassword`, { password }),
};

