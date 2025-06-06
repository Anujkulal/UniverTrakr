import { baseUrl } from "@/lib/baseUrl";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backend_url = baseUrl();

interface AuthState {
    user: null | object;
    // token: null | string;
    loading: boolean;
    error: null | string;
}

const initialState: AuthState = {
    user: null,
    // token: null,
    loading: false,
    error: null,
}

export const login = createAsyncThunk<
    // {user: AuthState['user']; token: string},
    {user: AuthState['user']},
    {email: string; password: string; role: string},
    {rejectValue: string}>('auth/login', async ({ email, password, role }, { rejectWithValue }) => {
        axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
    try{
        let url = "";
        if(role === "admin") url = `${backend_url}/admin/auth/login`;
        else if (role === 'faculty') url = `${backend_url}/faculty/auth/login`;
        else if (role === 'student') url = `${backend_url}/student/auth/login`;
        else return rejectWithValue('Invalid role')

        const response = await axios.post(url, {userId: email, password}, { withCredentials: true });
        // console.log('Login response:', response);
        
        if(response.data.user){
            localStorage.setItem("user", JSON.stringify(response.data.user))
        }
        return {
            user: response.data.user,
            // token: response.data.token,
        }
    }
    catch (err: any) {
        return rejectWithValue(err.response?.data?.message  || 'Login failed. Please try again.');
    }
})

export const logout = createAsyncThunk<void, {role: string}, {rejectValue: string}>(
    'auth/logout',
    async ({role}, {rejectWithValue}) => {
        try{
            let url = "";
            if(role === "admin") url = `${backend_url}/admin/auth/logout`;
            else if (role === 'faculty') url = `${backend_url}/faculty/auth/logout`;
            else if (role === 'student') url = `${backend_url}/student/auth/logout`;
            else return rejectWithValue('Invalid role')

            await axios.post(url, {}, { withCredentials: true });
            // localStorage.removeItem("user");
            return;
        }
        catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed. Please try again.');
  }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth(state){
            state.user = null;
            // state.token = null;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                // state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Login failed. Please try again.';
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                // state.token = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Logout failed. Please try again.';
            });
    }
})

export const {clearAuth} = authSlice.actions;
export default authSlice.reducer;