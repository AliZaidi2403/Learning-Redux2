import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
//thunk is standard approach to write async logic in redux code, this will return a promise which will
//be diffrent states like idle,fulfilled,pending,error
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});
export const addNewpost = createAsyncThunk(
  "posts/addPost",
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);
const initialState = {
  posts: [],
  status: "idle",
  error: null,
};
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, body, userId) {
        return {
          payload: {
            userId,
            title,
            body,
            date: new Date().toISOString(),
            id: nanoid(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
            },
          },
        };
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
          };
          return post;
        });
        state.posts = [...loadedPosts];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewpost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
        };
        action.payload.date = new Date().toISOString();
        state.posts.push(action.payload);
      });
  },
});
//RTK uses immerjs under the hood that allows to write js likes this, this only works inside createSlice
export const { postAdded, reactionAdded } = postSlice.actions;
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
//by this way if in future our states shape changes we do not have to make change in every components
export default postSlice.reducer;
