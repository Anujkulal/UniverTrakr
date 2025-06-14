import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface ProfileState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: ProfileState = {
    loading: false,
    error: null,
    success: null,
}

export const editProfile = createAsyncThunk
<any,{formData: FormData; role: string; userId: string},{ rejectValue: string }
>("profile/editProfile", async ({formData, role, userId}, { rejectWithValue}) => {
    try {
        const response = await axios.put(
            `${backend_url}/${role}/${role}s/${userId}`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Failed to edit profile");
    }
})

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfileState(state){
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(editProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(editProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message || "Profile updated successfully";
                state.error = null;
            })
            .addCase(editProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update profile";
            });
    }
})

export const {clearProfileState} = profileSlice.actions;
export default profileSlice.reducer;