import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/userSlice";
import albumsReducer from "./slices/albumSlice";
import authReducer from "./slices/authSlice";
import photoReducer from "./slices/photoSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    albums: albumsReducer,
    auth: authReducer,
    photo: photoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
