import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import Papa from "papaparse";

const backend_url = baseUrl();

interface FacultyState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: FacultyState = {
  loading: false,
  error: null,
  success: null,
};

// Thunk to add faculty details and register faculty in one go
export const addFacultyDetails = createAsyncThunk<
  any, {formData: FormData; role: string;}, { rejectValue: string }
>("faculty/addFacultyDetails", async ({formData, role}, { rejectWithValue }) => {
  try {
    // 1. Add Faculty details (profile, etc.)
    const detailsRes = await axios.post(
      `${backend_url}/${role}/faculty`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    // 2. Extract userId and password from formData
    console.log("UserId: ", formData.get("facultyId"));
    const userId = formData.get("facultyId") as string;
    const password = userId; // for initial registration

    if (!userId || !password) {
      return rejectWithValue("UserId and password are required for registration");
    }

    // 3. Register faculty (userId, password)
    const registerRes = await axios.post(
      `${backend_url}/faculty/auth/register`,
      { userId, password },
      { withCredentials: true }
    );

    return {
      details: detailsRes.data,
      register: registerRes.data,
      message: "Faculty added and registered successfully",
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add and register faculty"
    );
  }
});

export const addMultipleFaculty = createAsyncThunk<
  any, {file: File, role: string}, { rejectValue: string }>
  ("faculty/addMultipleFaculty", async ({file, role}, {rejectWithValue}) => {
    try {
      // Await Papa.parse using a Promise wrapper
      const faculties: Array<{
      facultyId: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      department: string;
      experience: string;
      post: string;
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
    const validFaculties = faculties.filter(
      (s) =>
        s.facultyId &&
        s.firstName &&
        s.lastName &&
        s.email &&
        s.phoneNumber &&
        s.department &&
        s.experience &&
        s.post &&
        s.gender
    );

    if (validFaculties.length === 0) {
      return rejectWithValue("No valid faculties found in the file.");
    }

    const response = await axios.post(
      `${backend_url}/${role}/faculty/bulk`,
      { faculties: validFaculties },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add multiple faculties"
    );
  }
  })

export const editFacultyDetails = createAsyncThunk
< any, {formData: FormData; role: string; facultyId: string}, {rejectValue: string}
>("faculty/editFacultyDetails", 
  async ({formData, role, facultyId}, {rejectWithValue}) => {
  try {
    const response = await axios.put(
      `${backend_url}/${role}/faculty/${facultyId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to edit faculty details"
    )
  }
})

const facultySlice = createSlice({
  name: "faculty",
  initialState,
  reducers: {
    clearFacultyState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFacultyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addFacultyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Faculty added and registered";
        state.error = null;
      })
      .addCase(addFacultyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add and register faculty";
      })
      .addCase(addMultipleFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addMultipleFaculty.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Multiple faculties added successfully";
        state.error = null;
      })
      .addCase(addMultipleFaculty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add multiple faculties";
      })
      .addCase(editFacultyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editFacultyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Faculty details updated successfully";
        state.error = null;
      })
      .addCase(editFacultyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit faculty details";
      });
  },
});

export const { clearFacultyState } = facultySlice.actions;
export default facultySlice.reducer;