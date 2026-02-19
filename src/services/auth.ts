
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const authService = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "authService",
    tagTypes: ['Auth'],
    endpoints: builder => ({

        checkAuth: builder.query<{ isAuthenticated: boolean }, void>({
            query: () => ({
                url: '/api/v1/check-auth',
                method: 'GET',
            }),
            providesTags: ['Auth'],
        }),
        register: builder.mutation({
            query: (formData) => ({
                url: "/api/register",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/api/v1/logout",
                method: "POST",
            }),
            invalidatesTags: ['Auth']
        }),
        getUser: builder.query({

            query: () => '/api/v1/current/user',
            providesTags: ['Auth'],
            transformErrorResponse: (baseQueryResult) => {
                // Ici, vous pouvez personnaliser la réponse d'erreur
                console.log(baseQueryResult.status)
                console.log("dd")
                if (baseQueryResult.status === 400) {
                    return { error: "le numero de telephone est incorrect" };
                }

            },

        }),
        payStripe: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/payment/stripe",
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Auth']
        }),
        getUserStats: builder.query({
            query: () => '/api/v1/current/stats',
            providesTags: ['Auth'],
        }),
        getRecentOrders: builder.query({
            query: () => '/api/v1/recent/orders',
            providesTags: ['Auth'],
        }),
        getOrderDetail: builder.query({
            query: (orderId) => `/api/v1/show/order/${orderId}`,
            providesTags: ['Auth'],
        }),
        getOrders: builder.query({
            query: () => '/api/v1/list/orders',
            providesTags: ['Auth'],
        }),
        getListShopReviews: builder.query({
            query: (shopId) => ({
                url: `/api/list/reviews/shop/${shopId}`,
                method: 'GET'
            }),
            providesTags: ['Auth'],
        }),
        controlPayment: builder.mutation({
            query: (body) => ({
                url: '/api/v1/control/payment',
                method: 'POST',
                body: body
            })
        }),
        validatePaymentCoin: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/validate/payment/coins",
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Auth']
        }),
        verifyPayin: builder.mutation({
            query: (formData) => ({
                url: `/api/status/payin/coins`,
                method: 'POST',
                body: formData
            })
        }),

    })
})

export const {
    useValidatePaymentCoinMutation,
    useGetUserQuery,
    useLogoutMutation,
    useVerifyPayinMutation,
    useControlPaymentMutation,
    useRegisterMutation,
    useCheckAuthQuery,
    usePayStripeMutation,
    useGetUserStatsQuery,
    useGetRecentOrdersQuery,
    useGetOrderDetailQuery,
    useGetOrdersQuery,
    useGetListShopReviewsQuery
} = authService