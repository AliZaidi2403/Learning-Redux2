import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice";
import { fetchPosts } from "./features/posts/postSlice";
const root = ReactDOM.createRoot(document.getElementById("root"));
store.dispatch(fetchUsers());
store.dispatch(fetchPosts());
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
