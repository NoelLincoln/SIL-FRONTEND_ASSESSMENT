import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const devUrl = import.meta.env.VITE_DEV_URL;
const prodUrl = import.meta.env.VITE_PROD_URL;
// Set base URL based on environment
const baseUrl = process.env.NODE_ENV === "production" ? prodUrl : devUrl;
// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
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
      return response.data; // Returning the fetched photo data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch photo");
    }
  },
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
  },
);

// Async thunk for deleting a photo
export const deletePhoto = createAsyncThunk(
  "photos/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/photos/${id}`);
      return response.data; // Return success message
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to delete photo");
    }
  }
);

// Initial state for the slice
export interface PhotoState {
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
        const index = state.photos.findIndex(
          (photo) => photo.id === updatedPhoto.id,
        );
        if (index !== -1) {
          state.photos[index] = updatedPhoto;
        }
      })
      .addCase(updatePhotoTitle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      }) // Add delete photo case
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        const deletedPhotoId = action.payload.id;
        state.photos = state.photos.filter((photo) => photo.id !== deletedPhotoId);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      ;
  },
});

export const { setPhotos } = photoSlice.actions;

export default photoSlice.reducer;
