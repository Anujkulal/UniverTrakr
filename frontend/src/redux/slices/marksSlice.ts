import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface MarksState {
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: MarksState = {
    loading: false,
    error: null,
    success: null,
};

export const uploadMarks = createAsyncThunk<
    any, { form: any; internalAvg: number, totalInternal: number, totalMarks: number }, { rejectValue: string }
    >("marks/uploadMarks", async ({form, internalAvg, totalInternal, totalMarks}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backend_url}/faculty/marks`, {...form, internalAvg, totalInternal, totalMarks}, { withCredentials: true });
            return response.data;
        }
        catch(err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to add marks");
        }
});

const marksSlice = createSlice({
  name: "marks",
  initialState,
  reducers: {
    clearMarksState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(uploadMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Marks added successfully";
        state.error = null;
      })
      .addCase(uploadMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add marks";
      })
      
  },
});

export const { clearMarksState } = marksSlice.actions;
export default marksSlice.reducer;