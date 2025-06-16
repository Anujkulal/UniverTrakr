import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

const initialState = {
  loading: false,
  error: null as string | null,
  success: null as string | null,
};

export const saveTimetable = createAsyncThunk<
  any, { branch: string; semester: string; timings: string[]; data: string[][]; role: string }, { rejectValue: string }
>( "timetable/saveTimetable", async ({ branch, semester, timings, data, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backend_url}/${role}/timetable`,
        {
          branch,
          semester,
          timings,
          data,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save timetable"
      );
    }
  }
);

export const updateTimetable = createAsyncThunk<
  any, { branch: string; semester: string; timings: string[]; data: string[][]; role: string }, { rejectValue: string }
>( "timetable/updateTimetable", async ({ branch, semester, timings, data, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${backend_url}/${role}/timetable/${branch}/${semester}`,
        {
          timings,
          data,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update timetable"
      );
    }
  }
);

export const fetchTimetable = createAsyncThunk<
  any, { role: string },{ rejectValue: string }
>("timetable/fetchTimetable", async ({ role }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backend_url}/${role}/timetable`, {withCredentials: true});
      return response.data;
    }
    catch(err: any){
        return rejectWithValue(
            err.response?.data?.message || "Failed to fetch timetable"
        );
    }
});

const timetableSlice = createSlice({
    name: "timetable",
    initialState,
    reducers: {
        clearTimetableState(state) {
            state.loading = false;
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(saveTimetable.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(saveTimetable.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Timetable saved successfully!";
            state.error = null;
        })
        .addCase(saveTimetable.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to save timetable";
            state.success = null;
        })
        .addCase(fetchTimetable.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(fetchTimetable.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Timetable fetched successfully!";
            state.error = null;
        })
        .addCase(fetchTimetable.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch timetable";
            state.success = null;
        })
        .addCase(updateTimetable.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(updateTimetable.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Timetable updated successfully!";
            state.error = null;
        })
        .addCase(updateTimetable.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update timetable";
            state.success = null;
        });
    }
})

export const { clearTimetableState } = timetableSlice.actions;
export default timetableSlice.reducer;