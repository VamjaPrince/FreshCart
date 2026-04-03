import { configureStore } from "@reduxjs/toolkit";
import userSclice from "./userSlice";
import createSlice from "./cartSlice";

export const store = configureStore({
  reducer: {
    user:userSclice,
    cart:createSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
