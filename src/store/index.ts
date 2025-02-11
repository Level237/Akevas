import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { authService } from "@/services/auth";
import { checkTokenService } from "@/services/checkService";
import registerSlice from "./seller/registerSlice";
export const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [authService.reducerPath]:authService.reducer,
        [checkTokenService.reducerPath]:checkTokenService.reducer,
        [registerSlice.name]:registerSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(authService.middleware,checkTokenService.middleware)
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
