
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const authService = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "authService",
    tagTypes: ['Auth'],
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => (
                {
                    url: '/api/login',
                    method: 'POST',
                    body: credentials
                }),

            transformErrorResponse: (baseQueryResult) => {
                // Ici, vous pouvez personnaliser la réponse d'erreur

                if (baseQueryResult.status === 400) {
                    return { error: "l'email et le mot de passe ne peut pas etre vide" };
                } else if (baseQueryResult.status === 500) {
                    return { error: "l'email out le mot de passe sont incorrect" };
                }
                else {

                    return { error: baseQueryResult.data };
                }
            },
        },

        ),
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
        newStore: builder.mutation({
            query: (formData) => ({
                url: "/api/create/seller",
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

            query: () => '/api/v1/current/delivery',
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
        getOrderByTown: builder.query({
            query: () => `/api/v1/orders/towns`,
            providesTags: ['Auth'],
        }),
        getOrderByPreferences: builder.query({
            query: () => `/api/v1/preference/orders`,
            providesTags: ['Auth'],
        }),
        showOrder: builder.query({
            query: (orderId) => `/api/v1/show/order/${orderId}`,
            providesTags: ['Auth'],
        }),
        getOrdersByQuarter: builder.query({
            query: (quarterId) => `/api/v1/orders/quarter/${quarterId}`,
            providesTags: ['Auth'],
        }),
        takeOrder: builder.mutation({
            query: (orderId) => ({
                url: `/api/v1/take/order/${orderId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        orderHistory: builder.query({
            query: () => '/api/v1/orders/history',
            providesTags: ['Auth'],
        })
    })
})

export const {
    useLoginMutation,
    useGetUserQuery,
    useLogoutMutation,
    useNewStoreMutation,
    useRegisterMutation,
    useCheckAuthQuery,
    usePayStripeMutation,
    useGetUserStatsQuery,
    useGetRecentOrdersQuery,
    useGetOrderDetailQuery,
    useGetOrdersQuery,
    useGetOrderByTownQuery,
    useGetOrderByPreferencesQuery,
    useShowOrderQuery,
    useGetOrdersByQuarterQuery,
    useTakeOrderMutation,
    useOrderHistoryQuery
} = authService