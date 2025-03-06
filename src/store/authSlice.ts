import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    refreshToken: localStorage.getItem("refreshToken") || null,
    token: localStorage.getItem("token") || null,
    usedToken: localStorage.getItem("token") || null,
    userRole: localStorage.getItem("userRole") || null,
    user: JSON.parse(localStorage.getItem("userData") || "null"),
  },

  reducers: {
    authTokenChange: (state, action) => {

      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.usedToken = action.payload.accessToken;
      console.log(state.token)
    },
    getUserRole: (state, action) => {
      localStorage.setItem("userRole", action.payload.userRole);
      state.userRole = action.payload.userRole;
    },
    logoutUser: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      state.token = null;
      state.refreshToken = null;
      state.usedToken = null;
      state.userRole = null;
    },
    adjustUsedToken: (state, action) => {
      state.usedToken = action.payload;
    },
    setUser: (state, action) => {
      localStorage.setItem("userData", JSON.stringify(action.payload))
      state.user = action.payload
    },
    clearUser: (state) => {
      localStorage.removeItem("userData")
      state.user = null
    }
  }
})

export const { authTokenChange, logoutUser, getUserRole, adjustUsedToken, setUser, clearUser } = authSlice.actions;
export default authSlice;