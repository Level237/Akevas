import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const adminService = createApi({
    baseQuery: baseQueryWithReauth,
    reducerPath: "adminService",
    tagTypes: ['admin'],
    endpoints: builder => ({

        recentSeller: builder.query({

            query: () => '/api/v1/recent/sellers',
            providesTags: ['admin'],

        }),
        listSellers: builder.query({

            query: () => '/api/v1/sellers',
            providesTags: ['admin'],

        }),
        getSeller: builder.query({
            query: (id) => `/api/v1/sellers/${id}`,
            providesTags: ['admin'],
        }),
        confirmOrNotShop: builder.mutation({
            query: ({ shop_id, formData }) => ({
                url: `/api/v1/shop/confirm/${shop_id}`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['admin']
        }),
        recentProducts: builder.query({
            query: () => '/api/v1/recent/products',
            providesTags: ['admin'],
        }),
        recentDelivery: builder.query({
            query: () => '/api/v1/recent/deliveries',
            providesTags: ['admin'],
        }),
        adminListDelivery: builder.query({
            query: () => '/api/v1/admin/deliveries',
            providesTags: ['admin'],
        }),
        adminListProducts: builder.query({
            query: () => '/api/v1/admin/products',
            providesTags: ['admin'],
        }),
        getDelivery: builder.query({
            query: (id) => `/api/v1/admin/deliveries/${id}`,
            providesTags: ['admin'],
        }),
        confirmOrNotDelivery: builder.mutation({
            query: ({ delivery_id, formData }) => ({
                url: `/api/v1/delivery/confirm/${delivery_id}`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['admin']
        }),
        adminListCustomers: builder.query({
            query: () => '/api/v1/admin/customers',
            providesTags: ['admin'],
        }),
        adminListOrders: builder.query({
            query: () => '/api/v1/admin/orders',
            providesTags: ['admin'],
        }),
        adminRecentOrders: builder.query({
            query: () => '/api/v1/admin/recent/orders',
            providesTags: ['admin'],
        }),

        adminDetailOrder: builder.query({
            query: (id) => ({
                url: `/api/v1/admin/order/${id}`,
                method: "GET"
            })
        }),
        adminActiveStats: builder.query({
            query: () => '/api/v1/admin/active/stats',
            providesTags: ['admin'],
        }),
        adminActiveSellerStats: builder.query({
            query: () => '/api/v1/admin/active/seller/stats',
            providesTags: ['admin'],
        }),
        adminDeliveryStats: builder.query({
            query: () => '/api/v1/admin/active/delivery/stats',
            providesTags: ['admin'],
        }),
        adminListReviews: builder.query({
            query: () => "/api/v1/admin/reviews",
            providesTags: ['admin']
        }),
        declineOrValidate: builder.mutation({
            query: ({ reviewId, status }) => ({
                url: `/api/v1/decline/or/validate/${reviewId}/${status}`,
                method: "POST",

            }),
            invalidatesTags: ['admin']
        }),
        adminListFeedback: builder.query({
            query: () => "/api/v1/admin/list/feedbacks",
            providesTags: ['admin']
        }),
        adminListShopReviews: builder.query({
            query: () => '/api/v1/admin/list/shop/reviews',
            providesTags: ['admin']
        }),
        declineOrValidateShopReview: builder.mutation({
            query: ({ reviewId, status }) => ({
                url: `/api/v1/decline/or/validate/shop/review/${reviewId}/${status}`,
                method: "POST",

            }),
            invalidatesTags: ['admin']
        }),
        sendCoinsToShop: builder.mutation({
            query: (body) => ({
                url: `/api/v1/give/coins`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ['admin']
        }),
        addShop: builder.mutation({
            query: (body) => ({
                url: '/api/v1/add/shop',
                body: body
            })

        }),
        togglePublish: builder.mutation({
            query: ({ product_id,formData }) => ({
                url: `/api/v1/published/product/${product_id}`,
                method: "POST",
                body:formData
            })
        }),
        allCategories: builder.query({
            query: () => '/api/v1/admin/all/categories',
            providesTags: ['admin']
        }),
        getCategory: builder.query({
            query: (id) => `/api/v1/admin/category/${id}`,
            providesTags: ['admin']
        }),
        addCategory: builder.mutation({
            query: (body) => ({
                url: `/api/v1/admin/add/category`,
                body: body,
                method: "POST"
            })
        }),
        updateCategory: builder.mutation({
            query: ({ id, body }) => ({
                url: `/api/v1/update/category/${id}`,
                body: body,
                method: "POST"
            }),
            invalidatesTags: ['admin']
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['admin']

        })
    })
})

export const {
    useRecentSellerQuery,
    useListSellersQuery,
    useGetSellerQuery,
    useConfirmOrNotShopMutation,
    useRecentProductsQuery,
    useRecentDeliveryQuery,
    useDeleteCategoryMutation,
    useAdminListProductsQuery,
    useAdminListDeliveryQuery,
    useGetDeliveryQuery,
    useAdminDetailOrderQuery,
    useConfirmOrNotDeliveryMutation,
    useAdminListCustomersQuery,
    useAdminListOrdersQuery,
    useAdminActiveStatsQuery,
    useAddCategoryMutation,
    useGetCategoryQuery,
    useUpdateCategoryMutation,
    useAdminActiveSellerStatsQuery,
    useAdminDeliveryStatsQuery,
    useAdminListReviewsQuery,
    useDeclineOrValidateMutation,
    useAdminListFeedbackQuery,
    useAdminListShopReviewsQuery,
    useDeclineOrValidateShopReviewMutation,
    useSendCoinsToShopMutation,
    useAddShopMutation,
    useTogglePublishMutation,
    useAllCategoriesQuery,
    useAdminRecentOrdersQuery
} = adminService