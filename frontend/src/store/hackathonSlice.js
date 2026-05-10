import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hackathons: [],
  selectedHackathon: null,
  loading: false,
}

const hackathonSlice = createSlice({
  name: 'hackathon',
  initialState,
  reducers: {
    setHackathons: (state, action) => {
      state.hackathons = action.payload
    },
    setSelectedHackathon: (state, action) => {
      state.selectedHackathon = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { setHackathons, setSelectedHackathon, setLoading } = hackathonSlice.actions
export default hackathonSlice.reducer