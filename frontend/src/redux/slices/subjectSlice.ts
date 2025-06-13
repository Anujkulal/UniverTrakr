import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface SubjectState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: SubjectState = {
    loading: false,
    error: null,
    success: null,
}

export const addSubject = createAsyncThunk<
    any, { name: string; code: string; role: string; }, { rejectValue: string }
    >("subject/addSubject", async ({name, code, role}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backend_url}/${role}/subject`, {name, code}, { withCredentials: true });
            return response.data;
        }
        catch(err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to add subject");
        }
});

export const removeSubject = createAsyncThunk<
    any, {code: string; role: string;}, { rejectValue: string }
    > ("subject/removeSubject", async ({code, role}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(`${backend_url}/${role}/subject/${code}`, {withCredentials: true});
            return response.data;
        } catch (err: any) {
            return rejectWithValue (err.response?.data?.message || "Failed to remove subject");
        }
});

const subjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        resetSubjectState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addSubject.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(addSubject.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Subject added successfully";
            state.error = null;
        })
        .addCase(addSubject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to add subject";
            state.success = null;
        })
        .addCase(removeSubject.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(removeSubject.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Subject removed successfully";
            state.error = null;
        })
        .addCase(removeSubject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to remove subject";
            state.success = null;
        });
    }
})

export const { resetSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;