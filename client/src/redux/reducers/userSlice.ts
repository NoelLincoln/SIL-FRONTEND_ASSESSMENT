import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:5000/api/users", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/fetchUserDetails", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Async thunk to fetch user albums
export const fetchUserAlbums = createAsyncThunk<
  Album[],
  string,
  { rejectValue: string }
>("users/fetchUserAlbums", async (userId, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/albums?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch albums");
    }
    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
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
      `http://localhost:5000/api/albums?userId=${userId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const albumsData = await albumsResponse.json();

    const photos: Record<string, string> = {};
    for (const album of albumsData) {
      const photosResponse = await fetch(
        `http://localhost:5000/api/photos/albums/${album.id}`,
        { method: "GET", credentials: "include" },
      );
      if (!photosResponse.ok) {
        throw new Error(`Failed to fetch photos for album ${album.id}`);
      }
      const photosData = await photosResponse.json();
      const randomPhoto =
        photosData[Math.floor(Math.random() * photosData.length)];
      photos[album.id] = randomPhoto ? randomPhoto.imageUrl : "";
    }
    return photos;
  } catch (err: any) {
    return rejectWithValue(err.message);
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })
      .addCase(fetchAlbumPhotos.pending, (state) => {
        state.imageLoading = true;
      })
      .addCase(fetchAlbumPhotos.fulfilled, (state, action) => {
        state.albumPhotos = action.payload;
        state.imageLoading = false;
      })
      .addCase(fetchAlbumPhotos.rejected, (state, action) => {
        state.imageLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
