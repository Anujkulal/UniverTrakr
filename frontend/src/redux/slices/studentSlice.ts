import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import Papa from "papaparse";

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
  any, {formData: FormData; role: string;}, { rejectValue: string }
>("student/addStudentDetails", async ({formData, role}, { rejectWithValue }) => {
  try {
    // 1. Add student details (profile, etc.)
    const detailsRes = await axios.post(
      `${backend_url}/${role}/students`,
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

export const addMultipleStudents = createAsyncThunk<
  any, {file: File, role: string}, { rejectValue: string }>
  ("student/addMultipleStudents", async ({file, role}, {rejectWithValue}) => {
    try {
      // Await Papa.parse using a Promise wrapper
      const students: Array<{
      enrollmentNo: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      semester: string;
      branch: string;
      gender: string;
    }> = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as any),
        error: (err) => reject(err),
      });
    });

    // Optionally filter out empty/invalid rows
    const validStudents = students.filter(
      (s) =>
        s.enrollmentNo &&
        s.firstName &&
        s.lastName &&
        s.email &&
        s.phoneNumber &&
        s.semester &&
        s.branch &&
        s.gender
    );

    if (validStudents.length === 0) {
      return rejectWithValue("No valid students found in the file.");
    }

    const response = await axios.post(
      `${backend_url}/${role}/students/bulk`,
      { students: validStudents },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add multiple students"
    );
  }
  })

export const editStudentDetails = createAsyncThunk
< any, {formData: FormData; role: string; enrollmentNo: string}, {rejectValue: string}
>("student/editStudentDetails", 
  async ({formData, role, enrollmentNo}, {rejectWithValue}) => {
  try {
    const response = await axios.put(
      `${backend_url}/${role}/students/${enrollmentNo}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to edit student details"
    )
  }
})

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
      })
      .addCase(addMultipleStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addMultipleStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Multiple students added successfully";
        state.error = null;
      })
      .addCase(addMultipleStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add multiple students";
      })
      .addCase(editStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Student details updated successfully";
        state.error = null;
      })
      .addCase(editStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit student details";
      });
  },
});

export const { clearStudentState } = studentSlice.actions;
export default studentSlice.reducer;