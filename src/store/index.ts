import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import { authService } from "@/services/auth";
import { checkTokenService } from "@/services/checkService";
import registerSlice from "./seller/registerSlice";
import { guardService } from "@/services/guardService";
import { adminService } from "@/services/adminService";
import { sellerService } from "@/services/sellerService";
import cartSlice from "./cartSlice";
import deliverySlice from "./delivery/deliverySlice";
import categorySlice from "./features/categorySlice";
import loadingSlice from "./features/loadingSlice";
export const store = configureStore({
    reducer: {
        auth: authSlice,
        [authService.reducerPath]: authService.reducer,
        [cartSlice.name]: cartSlice.reducer,
        [checkTokenService.reducerPath]: checkTokenService.reducer,
        [registerSlice.name]: registerSlice.reducer,
        [loadingSlice.name]: loadingSlice.reducer,
        [guardService.reducerPath]: guardService.reducer,
        [adminService.reducerPath]: adminService.reducer,
        [sellerService.reducerPath]: sellerService.reducer,
        [deliverySlice.name]: deliverySlice.reducer,
        [categorySlice.name]: categorySlice.reducer,

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(
        authService.middleware,
        checkTokenService.middleware,
        guardService.middleware,
        adminService.middleware,
        sellerService.middleware
    )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
