import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the AuthState interface with proper types
interface AuthState {
  id: string | null; // 'id' can be a string or null
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state with 'loading' set to true
const initialState: AuthState = {
  id: null,
  email: null,
  isAuthenticated: false,
  loading: true, // Set loading to true initially
  error: null,
};

// Determine the base URL based on the environment
const devUrl = import.meta.env.VITE_DEV_URL;
const prodUrl = import.meta.env.VITE_PROD_URL;
const baseUrl = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

// Async thunk for logging out
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error logging out. Please try again.",
      );
    }
  },
);

// Async thunk for fetching authenticated user details
export const fetchAuthUser = createAsyncThunk<
  { id: string; email: string }, // Payload type
  void, // No argument passed
  { rejectValue: string } // Reject value type
>("auth/fetchAuthUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}/auth/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Error fetching user details.",
    );
  }
});

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.id = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false; // Ensure loading is set to false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true; // Set loading to true when the request starts
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the request succeeds
        state.id = action.payload.id || null;
        state.email = action.payload.email || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.loading = false; // Ensure loading is set to false on failure
        state.error = action.payload || "Failed to fetch authentication state.";
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.id = null;
        state.email = null;
        state.isAuthenticated = false;
        // Redirect user to the landing page
        window.location.href = "/";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed. Please try again.";
      });
  },
});

// Export the logout action
export const { logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
