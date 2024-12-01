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

interface UserState {
  users: User[];
  userDetails: User | null;
  userAlbums: Album[];
  loading: boolean;
  error: string | null;
  imageLoading: boolean;
  albumPhotos: Record<string, string>;
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
const devUrl = process.env.DEV_URL;
const prodUrl = process.env.PROD_URL;

const baseUrl =
  process.env.NODE_ENV === "production" ? prodUrl : devUrl;

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${baseUrl}/api/users`, {
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
    const response = await fetch(`${baseUrl}/api/users/${userId}`, {
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
    const response = await fetch(`${baseUrl}/api/albums?userId=${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch albums");
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
      `${baseUrl}/api/albums?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!albumsResponse.ok) {
      throw new Error("Failed to fetch user albums");
    }

    const albums = await albumsResponse.json();

    const photoFetches = albums.map(async (album: Album) => {
      const photosResponse = await fetch(
        `${baseUrl}/api/photos/albums/${album.id}`,
        { method: "GET", credentials: "include" }
      );

      if (!photosResponse.ok) {
        throw new Error(`Failed to fetch photos for album ${album.id}`);
      }

      const photosData = await photosResponse.json();
      const randomPhoto = photosData[Math.floor(Math.random() * photosData.length)];
      return { albumId: album.id, imageUrl: randomPhoto ? randomPhoto.imageUrl : "" };
    });

    const photosArray = await Promise.all(photoFetches);
    const photos = photosArray.reduce((acc, { albumId, imageUrl }) => {
      acc[albumId] = imageUrl;
      return acc;
    }, {} as Record<string, string>);

    return photos;
  } catch (err: any) {
    return rejectWithValue(err.message || "An unknown error occurred.");
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
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
        state.userDetails = action.payload;
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
        state.userAlbums = action.payload;
      })
      .addCase(fetchUserAlbums.rejected, (state, action) => {
        state.loading = false;
        state.userAlbums = [];
        state.error = action.payload || "Failed to fetch user albums.";
      })
      .addCase(fetchAlbumPhotos.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
      })
      .addCase(fetchAlbumPhotos.fulfilled, (state, action) => {
        state.imageLoading = false;
        state.albumPhotos = action.payload;
      })
      .addCase(fetchAlbumPhotos.rejected, (state, action) => {
        state.imageLoading = false;
        state.albumPhotos = {};
        state.error = action.payload || "Failed to fetch album photos.";
      });
  },
});

export default usersSlice.reducer;
