import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./reducers/userSlice";
import albumsReducer from "./reducers/albumSlice";
import authReducer from "./reducers/authSlice";
import photoReducer from "./reducers/photoSlice";

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
