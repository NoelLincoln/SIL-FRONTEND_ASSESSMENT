import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the AuthState interface with a required 'id' property and correct types.
interface AuthState {
  [x: string]: any;
  id: string | null; // 'id' can now be a string or null
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state with 'id' set to null.
const initialState: AuthState = {
  id: null, // Initialize 'id' as null (can be string or null)
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Base URL based on environment
const devUrl = import.meta.env.VITE_DEV_URL;
const prodUrl = import.meta.env.VITE_PROD_URL;

const baseUrl =
  process.env.NODE_ENV === "production" ? prodUrl : devUrl;

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, {
        withCredentials: true,
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error logging out");
    }
  }
);

// Async thunk for fetching user details
export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/auth/me`, {
        withCredentials: true,
      });
      return response.data; // Return the user data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error fetching user details"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Normal logout without an API call
    logout(state) {
      state.email = null;
      state.isAuthenticated = false;
      state.id = null; // Ensure 'id' is cleared during logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id || null; // Ensure 'id' is set to null if not available
        state.email = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.email = null;
        state.isAuthenticated = false;
        state.id = null; // Ensure to clear 'id' on logout
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
