import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import facultyReducer from './slices/facultySlice';
import profileReducer from './slices/profileSlice';
import branchReducer from './slices/branchSlice';
import timetableReducer from './slices/timetableSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        faculty: facultyReducer,
        profile: profileReducer,
        branch: branchReducer,
        timetable: timetableReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
