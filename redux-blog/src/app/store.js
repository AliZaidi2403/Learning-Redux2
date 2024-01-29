import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../features/posts/postSlice";
import userReducer from "../features/users/usersSlice";

const store = configureStore({
  reducer: {
    posts: postReducer,
    users: userReducer,
  },
});
export default store;
