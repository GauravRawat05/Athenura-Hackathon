import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teamService from '../services/teamService';

export const fetchTeam = createAsyncThunk('team/fetch', async (teamId) => {
  const response = await teamService.getTeam(teamId);
  return response.data.data;
});

export const fetchMyTeams = createAsyncThunk('team/fetchMyTeams', async () => {
  const response = await teamService.getMyTeams();
  return response.data.data;
});

export const fetchMyInvitations = createAsyncThunk('team/fetchMyInvitations', async () => {
  const response = await teamService.getMyInvitations();
  return response.data.data;
});

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    currentTeam: null,
    myTeams: [],
    myInvitations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTeam: (state) => {
      state.currentTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeam = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.myTeams = action.payload;
      })
      .addCase(fetchMyTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyInvitations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.myInvitations = action.payload;
      })
      .addCase(fetchMyInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearTeam } = teamSlice.actions;
export default teamSlice.reducer;
