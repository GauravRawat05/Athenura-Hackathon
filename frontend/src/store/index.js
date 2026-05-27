import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import hackathonReducer from './hackathonSlice'
import notificationReducer from './notificationSlice'
import teamReducer from './teamSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hackathon: hackathonReducer,
    notification: notificationReducer,
    team: teamReducer,
  },
})