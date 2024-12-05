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
// Async thunk for fetching authenticated user details
export const fetchAuthUser = createAsyncThunk<
  { id: string; email: string }, // Payload type
  void, // No argument passed
  { rejectValue: string } // Reject value type
>("auth/fetchAuthUser", async (_, { rejectWithValue }) => {
  try {
    console.log("Fetching authenticated user details..."); // Log request initiation
    const response = await axios.get(`${baseUrl}/auth/me`, {
      withCredentials: true,
    });
    console.log("User details fetched successfully:", response.data); // Log successful response
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user details:", error); // Log error
    return rejectWithValue(
      error.response?.data || "Error fetching user details.",
    );
  }
});

// Create the auth slice
// Updated authSlice with suggested fixes
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.id = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        console.log("Fetching user details...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        console.log("Fetched user details successfully:", action.payload);
        state.loading = false;
        state.id = action.payload.id || null;
        state.email = action.payload.email || null;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        console.error("Failed to fetch authentication state:", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to fetch authentication state.";
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        console.log("Logging out user...");
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log("User logged out successfully");
        state.loading = false;
        state.id = null;
        state.email = null;
        state.isAuthenticated = false;
        // Ensure logout action is dispatched to reset the state
        // state.logout();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.error("Failed to log out:", action.payload);
        state.loading = false;
        state.error = action.payload || "Logout failed. Please try again.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

