import { baseUrl } from "@/lib/baseUrl";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface BranchState {
    loading: boolean;
    error: string | null;
    success: string | null;
    // branches: string[];
}

const initialState: BranchState = {
    loading: false,
    error: null,
    success: null,
    // branches: [],
}

export const addBranch = createAsyncThunk<
    any, { name:string; code: string; role: string; }, { rejectValue: string }
    >("branch/addBranch", async ({name, code, role}, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backend_url}/${role}/branch`, {name, code}, { withCredentials: true });
            return response.data;
        }
        catch(err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to add branch");
        }
});

export const removeBranch = createAsyncThunk<
    any, {code: string; role: string;}, { rejectValue: string }
    > ("branch/removeBranch", async ({code, role}, {rejectWithValue}) => {
        try {
            const response = await axios.delete(`${backend_url}/${role}/branch/${code}`, {withCredentials: true});
            return response.data;
        } catch (err: any) {
            return rejectWithValue (err.response?.data?.message || "Failed to remove branch");
        }
    })

const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        resetBranchState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addBranch.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(addBranch.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Branch added successfully";
            state.error = null;
            // state.branches.push(action.payload.branch);
        })
        .addCase(addBranch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to add branch";
            state.success = null;
        })
        .addCase(removeBranch.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
        })
        .addCase(removeBranch.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.message || "Branch removed successfully";
            state.error = null;
            // state.branches = state.branches.filter(branch => branch.name !== action.payload.name);
        })
        .addCase(removeBranch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to remove branch";
            state.success = null;
        });
    }
})

export const { resetBranchState } = branchSlice.actions;
export default branchSlice.reducer;