import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyAccount: (data) => api.post('/auth/verify-account', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  adminLogin: (credentials) => api.post('/admin/auth/loginAdminOrJudge', credentials),
  adminRegister: (userData) => api.post('/admin/auth/registerAdminOrJudge', userData),
  adminForgotPassword: (data) => api.post('/admin/auth/forgotPassword', data),
};
