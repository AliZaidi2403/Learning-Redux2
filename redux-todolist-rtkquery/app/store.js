import { configureStore } from "@reduxjs/toolkit";
import apiReducer from "../features/api/apiSlice";
export default configureStore({
  reducer: {
    [apiReducer.reducerPath]: apiReducer.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware().concat([apiReducer.middleware]);
  },
});
