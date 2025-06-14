import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface AdminState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: AdminState = {
  loading: false,
  error: null,
  success: null,
};

// Thunk to add admin details and register admin in one go
export const addAdminDetails = createAsyncThunk<
  any, {formData: FormData}, { rejectValue: string }
>("admin/addAdminDetails", async ({formData}, { rejectWithValue }) => {
  try {
    // 1. Add admin details (profile, etc.)
    const detailsRes = await axios.post(
      `${backend_url}/admin/admins`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    // 2. Extract userId and password from formData
    console.log("UserId: ", formData.get("adminId"));
    const userId = formData.get("adminId") as string;
    const password = userId; // for initial registration

    if (!userId || !password) {
      return rejectWithValue("UserId and password are required for registration");
    }

    // 3. Register admin (userId, password)
    const registerRes = await axios.post(
      `${backend_url}/admin/auth/register`,
      { userId, password },
      { withCredentials: true }
    );

    return {
      details: detailsRes.data,
      register: registerRes.data,
      message: "Admin added and registered successfully",
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to add and register admin"
    );
  }
});

export const editAdminDetails = createAsyncThunk
< any, {formData: FormData; adminId: string}, {rejectValue: string}
>("admin/editAdminDetails", 
  async ({formData, adminId}, {rejectWithValue}) => {
  try {
    const response = await axios.put(
      `${backend_url}/admin/admins/${adminId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to edit admin details"
    )
  }
})

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminState(state) {
      state.loading = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAdminDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Admin added and registered";
        state.error = null;
      })
      .addCase(addAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add and register admin";
      })
      .addCase(editAdminDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(editAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message || "Admin details updated successfully";
        state.error = null;
      })
      .addCase(editAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit admin details";
      });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;