import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Types for the state and API responses
interface User {
  id: string;
  username: string;
  email: string;
}

interface Album {
  id: string;
  title: string;
}

export interface UserState {
  users: User[]; // Array of users
  userDetails: User | null; // Single user details
  userAlbums: Album[]; // Array of albums
  loading: boolean;
  error: string | null;
  imageLoading: boolean;
  albumPhotos: Record<string, string>; // Photos related to albums
}

const initialState: UserState = {
  users: [],
  userDetails: null,
  userAlbums: [],
  loading: false,
  error: null,
  imageLoading: false,
  albumPhotos: {},
};

// Dynamically set base URL based on environment
const devUrl = import.meta.env.VITE_DEV_URL;
const prodUrl = import.meta.env.VITE_PROD_URL;
const baseUrl = process.env.NODE_ENV === "production" ? prodUrl : devUrl;

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/users`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message || "An unknown error occurred.");
  }
});

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchUserDetails", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/users/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message || "An unknown error occurred.");
  }
});

// Async thunk to fetch user albums
export const fetchUserAlbums = createAsyncThunk<
  Album[],
  string,
  { rejectValue: string }
>("users/fetchUserAlbums", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/albums/users/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("No albums found for this user");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message || "An unknown error occurred.");
  }
});

// Async thunk to fetch photos for albums
export const fetchAlbumPhotos = createAsyncThunk<
  Record<string, string>,
  string,
  { rejectValue: string }
>("users/fetchAlbumPhotos", async (userId, { rejectWithValue }) => {
  try {
    const albumsResponse = await fetch(
      `${baseUrl}/albums?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!albumsResponse.ok) {
      throw new Error("Failed to fetch user albums");
    }

    const albums = await albumsResponse.json();
    const photoFetches = albums.map(async (album: Album) => {
      const photosResponse = await fetch(
        `${baseUrl}/photos/albums/${album.id}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
      if (!photosResponse.ok) {
        throw new Error(`Failed to fetch photos for album ${album.id}`);
      }

      const photosData = await photosResponse.json();
      const randomPhoto =
        photosData[Math.floor(Math.random() * photosData.length)];
      return { albumId: album.id, imageUrl: randomPhoto?.imageUrl || "" };
    });

    const photosArray = await Promise.all(photoFetches);
    return photosArray.reduce(
      (acc, { albumId, imageUrl }) => {
        acc[albumId] = imageUrl;
        return acc;
      },
      {} as Record<string, string>,
    );
  } catch (err: any) {
    return rejectWithValue(err.message || "An unknown error occurred.");
  }
});

// Slice with improved error handling
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // Payload is an array of users
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users.";
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userDetails = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload; // Payload is a single user
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.userDetails = null;
        state.error = action.payload || "Failed to fetch user details.";
      })
      .addCase(fetchUserAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.userAlbums = [];
      })
      .addCase(fetchUserAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.userAlbums = action.payload; // Payload is an array of albums
      })
      .addCase(fetchUserAlbums.rejected, (state, action) => {
        state.loading = false;
        state.userAlbums = [];
        state.error = action.payload || "No albums found for this user.";
      })
      .addCase(fetchAlbumPhotos.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
      })
      .addCase(fetchAlbumPhotos.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.albumPhotos = action.payload; // Payload is a record of album photos
      })
      .addCase(fetchAlbumPhotos.rejected, (state, action) => {
        state.imageLoading = false;
        state.albumPhotos = {};
        state.error = action.payload || "Failed to fetch album photos.";
      });
  },
});

export const { resetError } = usersSlice.actions;

export default usersSlice.reducer;
