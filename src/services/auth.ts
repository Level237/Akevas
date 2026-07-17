import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const authService = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "authService",
    // ✅ AJOUT : On sépare un peu les responsabilités pour éviter les bugs
    tagTypes: ['Auth', 'User', 'Order', 'Review'],

    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/api/login',
                method: 'POST',
                body: credentials
            }),

            invalidatesTags: ['Auth', 'User'], // ✅ Correct : on se connecte, on charge le User
            transformErrorResponse: (baseQueryResult) => {
                if (baseQueryResult.status === 400 || baseQueryResult.status === 401) {
                    return { error: "L'email ou le mot de passe est incorrect" };
                } else if (baseQueryResult.status === 500) {
                    return { error: "Erreur serveur, veuillez réessayer" };
                } else if (baseQueryResult.status === 429) {
                    return { error: "Trop de tentatives. Veuillez patienter un moment.", code: 429 };
                }
                return { error: baseQueryResult };
            },
        }),

        checkAuth: builder.query({
            query: () => ({
                url: '/api/v1/check-auth',
                method: 'GET',
            }),
            providesTags: ['Auth'], // ✅ Auth seulement ici,
            keepUnusedDataFor: 300,
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
            invalidatesTags: ['User'], // ✅ Créer un boutique met à jour le profil User, pas l'Auth
        }),

        logout: builder.mutation({
            query: () => ({
                url: "/api/v1/logout",
                method: "POST",
            }),
            invalidatesTags: ['Auth', 'User'] // ✅ Correct
        }),

        getUser: builder.query({
            query: () => '/api/v1/current/user',
            providesTags: ['User'],
            // ✅ OPTIMISATION : Garder le profil en cache 5 min. Évite de le re-télécharger à chaque changement de page.
            keepUnusedDataFor: 300,
            transformErrorResponse: (baseQueryResult) => {
                if (baseQueryResult.status === 401) return { error: "Non authentifié" };
                return { error: "Erreur lors de la récupération du profil" };
            },
        }),

        // --- PAIEMENTS (Pas de tags nécessaires, ce sont des actions ponctuelles) ---
        payStripe: builder.mutation({
            query: (formData) => ({ url: "/api/v1/payment/stripe", method: 'POST', body: formData }),
        }),
        initProductPayment: builder.mutation({
            query: (body) => ({ url: `/api/v1/init/payment/buy/product`, method: 'POST', body: body }),
        }),
        initPayin: builder.mutation({
            query: (body) => ({ url: `/api/v1/payin`, method: 'POST', body: body }),
        }),
        statePayment: builder.mutation({
            query: (body) => ({ url: `/api/v1/success/payment`, method: 'POST', body: body }),
        }),
        verifyPayment: builder.mutation({
            query: (formData) => ({ url: `/api/get/payment/status`, method: 'POST', body: formData }),
        }),
        verifyPayin: builder.mutation({
            query: (formData) => ({ url: `/api/status/payin`, method: 'POST', body: formData }),
        }),
        webhookPayment: builder.mutation({
            query: (body) => ({ url: `/api/v1/payment/product`, method: 'POST', body: body }),
        }),
        controlPayment: builder.mutation({
            query: (body) => ({ url: '/api/v1/control/payment', method: 'POST', body: body }),
        }),
        showPaymentWithReference: builder.query({
            query: (ref) => ({ url: `/api/v1/show/payment/${ref}`, method: "GET" }),
        }),

        // --- UTILISATEUR & PROFIL ---
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/update/user",
                method: "POST",
                body: formData,
            }),
            // ✅ CORRECTION CRITIQUE : Mettre à jour le profil invalide 'User', PAS 'Auth'. 
            // Invalider 'Auth' ici pourrait forcer une déconnexion ou un re-check auth inutile.
            invalidatesTags: ['User'],
        }),

        // --- COMMANDES ---
        getUserStats: builder.query({
            query: () => '/api/v1/current/stats',
            providesTags: ['User'], // ✅ C'est des stats utilisateur, pas Auth
        }),
        getRecentOrders: builder.query({
            query: () => '/api/v1/recent/orders',
            providesTags: ['Order'], // ✅ Séparé de Auth
        }),
        getOrderDetail: builder.query({
            query: (orderId) => `/api/v1/user/show/order/${orderId}`,
            providesTags: ['Order'],
        }),
        getOrders: builder.query({
            query: () => '/api/v1/list/orders',
            providesTags: ['Order'],
        }),

        // --- AVIS / REVIEWS ---
        makeReview: builder.mutation({
            query: ({ formData, productId }) => ({
                url: `/api/v1/make/comment/product/${productId}`,
                method: "POST",
                body: formData
            }),
            // ✅ CORRECTION CRITIQUE : Laisser un avis n'a RIEN à voir avec l'Auth. 
            // Si tu laisses 'Auth' ici, RTK Query va penser qu'il doit tout recharger.
            invalidatesTags: ['Review'],
        }),
        getListReviews: builder.query({
            query: (productId) => ({ url: `/api/list/reviews/${productId}`, method: 'GET' }),
            providesTags: ['Review'],
        }),
        getListShopReviews: builder.query({
            query: (shopId) => ({ url: `/api/list/reviews/shop/${shopId}`, method: 'GET' }),
            providesTags: ['Review'],
        }),
        makeReviewShop: builder.mutation({
            query: ({ formData, shopId }) => ({
                url: `/api/v1/make/comment/shop/${shopId}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ['Review'], // ✅ Idem ici
        }),

        // --- DIVERS ---
        getHistorySearch: builder.query({
            query: () => ({ url: '/api/v1/recents/histories', method: 'GET' }),
            providesTags: ['User'],
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({ url: "/api/password/forgot", method: "POST", body: data }),
        }),
        verifyOtp: builder.mutation({
            query: (data) => ({ url: "/api/password/verify", method: "POST", body: data }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({ url: "/api/password/reset", method: "POST", body: data }),
        }),
    })
})

// ... (Tes exports restent exactement les mêmes)
export const {
    useLoginMutation,
    useWebhookPaymentMutation,
    useControlPaymentMutation,
    useGetHistorySearchQuery,
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
    useShowPaymentWithReferenceQuery,
    useVerifyPaymentMutation,
    useInitPayinMutation,
    useVerifyPayinMutation,
    useUpdateUserMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation
} = authService