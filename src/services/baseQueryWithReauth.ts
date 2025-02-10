import { adjustUsedToken, authTokenChange, logoutUser } from "@/store/authSlice";
import { baseQuery } from "./baseQuery";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../store";
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
    > = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);
  
  const authState = (store.getState() as RootState).auth;
    
  if (result.error && result.error.status === 401) {
    if (!authState.token || !authState.refreshToken) return result;

    // Update token to use refresh token
    store.dispatch(adjustUsedToken(authState.refreshToken as string));

    // Try to refresh the token
    const refreshResult = await baseQuery("/api/refresh", store, extraOptions);

    if (refreshResult.data) {
      // Store the new tokens
      store.dispatch(
        authTokenChange({
          accessToken: (refreshResult.data as {accessToken:string}).accessToken,
          refreshToken: authState.refreshToken as string,
        })
      );
      // Retry the original request
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(logoutUser());
    }
  }
  return result;
};