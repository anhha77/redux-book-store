import { combineReducers, configureStore } from "@reduxjs/toolkit";
import bookStoreReducer from "./bookStoreSlice";

export const store = configureStore({
  reducer: combineReducers({
    bookStore: bookStoreReducer,
  }),
});
