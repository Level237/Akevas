import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const sellerService = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "sellerService",
    tagTypes: ['seller'],
    endpoints: builder => ({

        currentSeller: builder.query({

            query: () => '/api/v1/current/seller',
            providesTags: ['seller'],

        }),
        addProduct: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/seller/products",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["seller"]
        }),
        getProducts: builder.query({
            query: () => '/api/v1/seller/products',
            providesTags: ['seller']
        }),
        updateDocs: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/update/docs",
                method: 'POST',
                body: formData
            })
        }),

        updateCategories: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/update/categories",
                method: 'POST',
                body: formData
            })
        }),

        updateImages: builder.mutation({
            query: (formData) => ({
                url: "/api/v1/update/images",
                method: 'POST',
                body: formData
            })
        }),
        initCoinPayment: builder.mutation({
            query: (body) => ({
                url: `/api/v1/init/payment/coins`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['seller']
        }),
        verifyCoinPayment: builder.mutation({
            query: (formData) => ({
                url: `/api/get/payment/status`,
                method: 'POST',
                body: formData
            })
        }),
        boostShop: builder.mutation({
            query: (body) => ({
                url: `/api/v1/boost/shop`,
                method: "POST",
                body: body
            })
        }),
        getOrders: builder.query({
            query: () => '/api/v1/seller/orders',
            providesTags: ['seller']
        }),
        showOrder: builder.query({
            query: (id) => `/api/v1/seller/order/${id}`,
            providesTags: ['seller']
        }),
        recentNotifications: builder.query({
            query: () => "/api/v1/seller/recents/notifications",
            providesTags: ['seller']
        }),
        getNotification: builder.query({
            query: (id) => `/api/v1/seller/get/notification/${id}`,
            providesTags: ['seller']
        }),
        allNotification: builder.query({
            query: () => '/api/v1/seller/notifications',
            providesTags: ['seller']
        }),
        putInTrash: builder.mutation({
            query: (id) => ({
                url: `/api/v1/put/in/trash/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['seller']
        }),
        restoreProduct: builder.mutation({
            query: (id) => ({
                url: `/api/v1/restore/product/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['seller']
        }),
        getProductsOfTrash: builder.query({
            query: () => ({
                url: '/api/v1/trash/products',
                method: 'GET'
            }),
            providesTags: ['seller']
        })
    }),

})
export const {
    useCurrentSellerQuery,
    useAddProductMutation,
    useGetProductsQuery,
    useGetProductsOfTrashQuery,
    useUpdateDocsMutation,
    usePutInTrashMutation,
    useInitCoinPaymentMutation,
    useVerifyCoinPaymentMutation,
    useBoostShopMutation,
    useUpdateCategoriesMutation,
    useUpdateImagesMutation,
    useGetOrdersQuery,
    useShowOrderQuery,
    useRecentNotificationsQuery,
    useGetNotificationQuery,
    useAllNotificationQuery,
    useRestoreProductMutation
} = sellerService