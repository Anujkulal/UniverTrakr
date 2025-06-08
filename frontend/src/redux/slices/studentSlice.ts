import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";

const backend_url = baseUrl();

interface StudentState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: StudentState = {
  loading: false,
  error: null,
  success: null,
};

// Thunk to add student details and register student in one go
export const addStudentDetails = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("student/addStudentDetails", async (formData, { rejectWithValue }) => {
  try {
    // 1. Add student details (profile, etc.)
    const detailsRes = await axios.post(
      `${backend_url}/admin/students`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    // 2. Extract userId and password from formData
    console.log("UserId: ", formData.get("enrollmentNo"));
    const userId = formData.get("enrollmentNo") as string;
    const password = userId; // for initial registration

    if (!userId || !password) {
      return rejectWithValue("UserId and password are required for registration");
    }

    // 3. Register student (userId, password)
    const registerRes = await axios.post(
      `${backend_url}/student/auth/register`,
      { userId, password },
      { withCredentials: true }
    );

    return {
      details: detailsRes.data,
      register: registerRes.data,
      message: "Student added and registered successfully",
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add and register student"
    );
  }
});

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Student added and registered";
        state.error = null;
      })
      .addCase(addStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add and register student";
      });
  },
});

export const { clearStudentState } = studentSlice.actions;
export default studentSlice.reducer;