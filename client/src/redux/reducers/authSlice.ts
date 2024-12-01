import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  [x: string]: any;
  id: any;
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  email: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  id: undefined
};

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Logging out..."); // Log before sending logout request
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });
      console.log("Logged out successfully"); // Log if logout is successful
    } catch (error: any) {
      console.error("Error logging out:", error); // Log any error that occurs
      return rejectWithValue(error.response?.data || "Error logging out");
    }
  },
);

// Async thunk for fetching user details
export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user details..."); // Log before sending request
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      console.log("Fetched user details:", response.data); // Log successful response
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user details:", error); // Log any error
      return rejectWithValue(
        error.response?.data || "Error fetching user details",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Normal logout without an API call
    logout(state) {
      console.log("Logging out (normal logout without API call)"); // Log normal logout
      state.email = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        console.log("Fetching user details... pending..."); // Log before state is updated to loading
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        console.log("User details fetched successfully:", action.payload);
        state.loading = false;
        state.id = action.payload.id; // Set userId correctly
        state.email = action.payload.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        console.log("Failed to fetch user details:", action.payload); // Log error state update
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.pending, (state) => {
        console.log("Logout in progress... pending..."); // Log before state is updated to loading
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log("User logged out successfully"); // Log successful logout state update
        state.loading = false;
        state.email = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.log("Failed to log out:", action.payload); // Log error state update
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
