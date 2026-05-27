import api from './api';

const teamService = {
  createTeam: (hackathonId, data) => api.post(`/teams/hackathons/${hackathonId}/teams`, data),
  getTeam: (teamId) => api.get(`/teams/${teamId}`),
  getMyTeams: () => api.get('/teams/me'),
  getMyInvitations: () => api.get('/teams/invitations'),
  updateTeam: (teamId, data) => api.patch(`/teams/${teamId}`, data),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}`),
  removeMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
  inviteMember: (teamId, email) => api.post(`/teams/${teamId}/invitations`, { email }),
  acceptInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/accept`),
  declineInvitation: (invitationId) => api.post(`/teams/invitations/${invitationId}/decline`),
};

export default teamService;
