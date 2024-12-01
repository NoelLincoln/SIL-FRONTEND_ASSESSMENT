import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const devUrl = process.env.DEV_URL;
const prodUrl = process.env.PROD_URL;
// Set base URL based on environment
const baseUrl =
  process.env.NODE_ENV === "production"
    ? prodUrl
    : devUrl;
// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// Define Photo type
interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

// Async thunk for fetching a photo by ID
export const fetchPhotoById = createAsyncThunk(
  "photos/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/photos/${id}`); // Use axios instance here
      console.log("photo slice fetch by id", response.data);
      return response.data; // Returning the fetched photo data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch photo");
    }
  }
);

// Async thunk for updating the photo title
export const updatePhotoTitle = createAsyncThunk(
  "photos/updateTitle",
  async ({ id, title }: { id: string; title: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/photos/${id}`, { title }); // Use axios instance here
      return response.data; // Returning the updated photo data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update title");
    }
  }
);

// Initial state for the slice
interface PhotoState {
  photos: Photo[];
  selectedPhoto: Photo | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photos: [],
  selectedPhoto: null,
  loading: false,
  error: null,
};

const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setPhotos: (state, action) => {
      state.photos = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotoById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPhotoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPhoto = action.payload; // Set the selected photo in the state
      })
      .addCase(fetchPhotoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePhotoTitle.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePhotoTitle.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPhoto: Photo = action.payload;
        // Update the title of the specific photo in the state
        const index = state.photos.findIndex((photo) => photo.id === updatedPhoto.id);
        if (index !== -1) {
          state.photos[index] = updatedPhoto;
        }
      })
      .addCase(updatePhotoTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPhotos } = photoSlice.actions;

export default photoSlice.reducer;
