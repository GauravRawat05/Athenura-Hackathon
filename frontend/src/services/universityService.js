import api from './api';

export const universityService = {
  getMe: () => api.get('/university/me'),
  getMyStudents: () => api.get('/university/me/students'),
};
