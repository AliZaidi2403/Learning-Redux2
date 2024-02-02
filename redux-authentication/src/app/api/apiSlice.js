import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  //it will send back the http secure cookie
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// we are wrapping our base query so that if it fails  we can reattempt after sending the refresh
//token and get a new access token

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  //we are recieving 403 status if the token is valid but expired
  if (result?.error?.originalStatus === 403) {
    console.log(`sending refresh token`);
    const refreshResult = await baseQuery(`/refresh`, api, extraOptions);
    console.log(refreshResult);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      api.dispatch(setCredentials(...refreshResult.data, user));
    }
    //retrying original query with new access token
    result = await baseQuery(args, api, extraOptions);
  } else {
    api.dispatch(logOut());
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
