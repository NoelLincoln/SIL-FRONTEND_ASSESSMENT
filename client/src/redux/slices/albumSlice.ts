import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store"; // Assuming you have a RootState defined for your store


const devUrl = import.meta.env.VITE_DEV_URL;
const prodUrl = import.meta.env.VITE_PROD_URL;

console.log("Dev url",devUrl)

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

interface Album {
  id: string;
  title: string;
  userId: string;
  photos: Photo[];
  username: string;
}

interface AlbumState {
  albums: Album[];
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
    ? prodUrl
    : devUrl;

// Async thunk to fetch all albums
export const fetchAlbums = createAsyncThunk(
  "albums/fetchAlbums",
  async (_, { rejectWithValue }) => {
    try {
      const [albumResponse, userResponse] = await Promise.all([
        axios.get(`${baseUrl}/albums`, { withCredentials: true }),
        axios.get(`${baseUrl}/users`, { withCredentials: true }),
      ]);

      const albumData: Album[] = albumResponse.data;
      const userData = userResponse.data;

      // Create a mapping of userId to username
      const userMap = userData.reduce(
        (acc: Record<string, string>, user: { id: string; username: string }) => {
          acc[user.id] = user.username;
          return acc;
        },
        {} as Record<string, string>
      );

      // Fetch photos and add username to each album
      const updatedAlbums = await Promise.all(
        albumData.map(async (album) => {
          const photosResponse = await axios.get(
            `${baseUrl}/photos/albums/${album.id}`,
            { withCredentials: true }
          );
          const photos: Photo[] = photosResponse.data.map(
            (photo: { imageUrl: string; id: string; title: string }) => ({
              imageUrl: photo.imageUrl,
              id: photo.id,
              title: photo.title,
            })
          );

          return {
            ...album,
            photos,
            username: userMap[album.userId] || "Unknown",
          };
        })
      );

      return updatedAlbums;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to create a new album
export const createAlbum = createAsyncThunk(
  "albums/createAlbum",
  async (
    albumData: { title: string; files: File[] },
    { rejectWithValue, getState }
  ) => {
    // Retrieve the userId from the auth state
    const state = getState() as RootState;  // Type your state accordingly
    const userId = state.auth.id;

    if (!userId) {
      return rejectWithValue("User is not authenticated");
    }

    const formData = new FormData();
    formData.append("title", albumData.title);
    formData.append("userId", userId);  // Pass the userId
    albumData.files.forEach((file) =>
      formData.append("photos", file, file.name)
    );

    try {
      const response = await axios.post(`${baseUrl}/albums`, formData, {
        withCredentials: true,
      });
      const newAlbum = response.data;

      // Fetch the username using userId
      const userResponse = await axios.get(`${baseUrl}/users/${newAlbum.userId}`, {
        withCredentials: true,
      });
      const username = userResponse.data.username;

      // Fetch the photos for the new album
      const photosResponse = await axios.get(
        `${baseUrl}/photos/albums/${newAlbum.id}`,
        { withCredentials: true }
      );
      const photos = photosResponse.data.map((photo: Photo) => ({
        imageUrl: photo.imageUrl,
        id: photo.id,
        title: photo.title,
      }));

      // Update the new album with photos and username
      const updatedAlbum = {
        ...newAlbum,
        photos,
        username,
      };

      return updatedAlbum;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const albumSlice = createSlice({
  name: "albums",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
        state.loading = false;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.albums.push(action.payload);
        state.loading = false;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default albumSlice.reducer;
