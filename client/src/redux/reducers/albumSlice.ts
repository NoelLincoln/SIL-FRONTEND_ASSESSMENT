import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface AlbumState {
  albums: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AlbumState = {
  albums: [],
  loading: false,
  error: null,
};

// Determine the base API URL based on the environment
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://sil-backend-production.onrender.com/api/albums"
    : "http://localhost:5000/api/albums";

// Async thunk to fetch all albums
export const fetchAlbums = createAsyncThunk(
  "albums/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Async thunk to create a new album
export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async (
    albumData: { title: string; userId: string; files: File[] },
    { rejectWithValue },
  ) => {
    const formData = new FormData();
    formData.append("title", albumData.title);
    formData.append("userId", albumData.userId);
    albumData.files.forEach((file, index) =>
      formData.append("files", file, file.name),
    );

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to create album");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Async thunk to update an album by ID
export const updateAlbum = createAsyncThunk(
  "albums/updateAlbum",
  async (albumData: { id: string; title: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/${albumData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: albumData.title }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update album");
      }

      return await response.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Async thunk to delete an album by ID
export const deleteAlbum = createAsyncThunk(
  "albums/deleteAlbum",
  async (albumId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseUrl}/${albumId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete album");
      }

      return albumId;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

const albumsSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch albums
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create album
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.push(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update album
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAlbumIndex = state.albums.findIndex(
          (album) => album.id === action.payload.id,
        );
        if (updatedAlbumIndex !== -1) {
          state.albums[updatedAlbumIndex] = action.payload;
        }
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete album
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = state.albums.filter(
          (album) => album.id !== action.payload,
        );
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default albumsSlice.reducer;
