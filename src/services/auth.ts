
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
            query: (orderId) => `/api/v1/user/show/order/${orderId}`,
            providesTags: ['Auth'],
        }),
        getOrders: builder.query({
            query: () => '/api/v1/list/orders',
            providesTags: ['Auth'],
        }),
        makeReview: builder.mutation({
            query: ({ formData, productId }) => ({
                url: `/api/v1/make/comment/product/${productId}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ['Auth']
        }),
        getListReviews:builder.query({
            query:(productId)=>({
                url:`/api/list/reviews/${productId}`,
                method:'GET'
            }),
            providesTags: ['Auth'],
        }),
        getListShopReviews:builder.query({
            query:(shopId)=>({
                url:`/api/list/reviews/shop/${shopId}`,
                method:'GET'
            }),
            providesTags: ['Auth'],
        }),
        makeReviewShop:builder.mutation({
            query: ({ formData, shopId }) => ({
                url: `/api/v1/make/comment/shop/${shopId}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ['Auth']
        }),
        initProductPayment:builder.mutation({
            query:(body)=>({
                url:`/api/v1/init/payment/buy/product`,
                method:'POST',
                body:body
            }),
            invalidatesTags:['Auth']
        }),
        statePayment:builder.mutation({
            query:(body)=>({
                url:`/api/v1/success/payment`,
                method:'POST',
                body:body
            }),
        }),
        verifyPayment:builder.mutation({
            query:(formData)=>({
                url:`/api/get/payment/status`,
                method:'POST',
                body:formData
            })
        }),
        webhookPayment:builder.mutation({
            query:(body)=>({
                url:`/api/v1/payment/product`,
                method:'POST',
                body:body
            }),
        }),
        controlPayment:builder.mutation({
            query:(body)=>({
                url:'/api/v1/control/payment',
                method:'POST',
                body:body
            })
        })
    })
})

export const {
    useLoginMutation,
    useWebhookPaymentMutation,
    useControlPaymentMutation,
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
    useMakeReviewMutation,
    useGetListReviewsQuery,
    useMakeReviewShopMutation,
    useGetListShopReviewsQuery,
    useInitProductPaymentMutation,
    useStatePaymentMutation,
    useVerifyPaymentMutation
} = authService