import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import profileReducer from './slices/profileSlice';
import branchReducer from './slices/branchSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        profile: profileReducer,
        branch: branchReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
