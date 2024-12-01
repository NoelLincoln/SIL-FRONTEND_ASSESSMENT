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

const devUrl = process.env.DEV_URL;
const prodUrl = process.env.PROD_URL;

const baseUrl =
  process.env.NODE_ENV === "production"
    ? prodUrl
    : devUrl;

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${baseUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error logging out");
    }
  },
);

// Async thunk for fetching user details
export const fetchAuthUser = createAsyncThunk(
  "auth/fetchAuthUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/me`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
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
      state.email = null;
      state.isAuthenticated = false;
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
        state.id = action.payload.id;
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
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
