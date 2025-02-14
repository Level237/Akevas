import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { authService } from "@/services/auth";
import { checkTokenService } from "@/services/checkService";
import registerSlice from "./seller/registerSlice";
import { guardService } from "@/services/guardService";
import { adminService } from "@/services/adminService";
import { sellerService } from "@/services/sellerService";
export const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [authService.reducerPath]:authService.reducer,
        [checkTokenService.reducerPath]:checkTokenService.reducer,
        [registerSlice.name]:registerSlice.reducer,
        [guardService.reducerPath]:guardService.reducer,
        [adminService.reducerPath]:adminService.reducer,
        [sellerService.reducerPath]:sellerService.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    }).concat(
        authService.middleware,
        checkTokenService.middleware,
        guardService.middleware,
        adminService.middleware,
        sellerService.middleware
    )
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
