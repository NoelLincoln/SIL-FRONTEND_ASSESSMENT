import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./reducers/userSlice";
import albumsReducer from "./reducers/albumSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    albums: albumsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
