import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { authService } from "@/services/auth";

export const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [authService.reducerPath]:authService.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(authService.middleware)
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
