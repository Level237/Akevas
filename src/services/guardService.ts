
import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryNotAuth } from "./baseQueryNotAuth";
import { Product } from "@/types/products";
import { Shop } from "@/types/shop";




export const guardService = createApi({
    baseQuery: baseQueryNotAuth,
    reducerPath: "guardService",
    tagTypes: ['guard'],
    endpoints: builder => ({

        getCategories: builder.query({

            query: () => ({
                url: '/api/categories',
                method: 'GET',
            }),
            providesTags: ['guard'],

        }),
        getTowns: builder.query({
            query: () => ({
                url: "/api/towns",
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getQuarters: builder.query({
            query: () => ({
                url: `/api/quarters`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getShop: builder.query({
            query: (id) => `/api/shop/${id}`,
            providesTags: ['guard'],
        }),
        checkIfEmailExists: builder.mutation({
            query: (formData) => ({
                url: `/api/check/email-and-phone-number`,
                method: "POST",

                body: formData,
            }),
            invalidatesTags: ['guard'],
            //transformResponse: (response: { data: { message: string } }) => response.data.message,
        }),
        getCategoriesWithParentIdNull: builder.query({
            query: () => ({
                url: `/api/categories/with-parent-id-null`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getCategoriesWithParentId: builder.query({
            query: (id) => ({
                url: `/api/category/gender/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getCategoryByGender: builder.query({
            query: (id) => ({
                url: `/api/get/category/by-gender/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getSubCategories: builder.query({
            query: ({ arrayId, id }) => ({
                url: `/api/get/sub-categories/${arrayId}/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        filterProducts: builder.query({
            query: ({ arrayId}) => ({
                url: `/api/filter/products/${arrayId}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeShops: builder.query({
            query: () => ({
                url: `/api/home/shops`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getAllShops: builder.query({
            query: (page) => ({
                url: `/api/all/shops?page=${page}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Shop[], meta: { last_page: number, current_page: number, total: number } }) => ({
                shopList: response.data,
                totalPagesResponse: response.meta.last_page,
                currentPageResponse: response.meta.current_page,
                totalShopsResponse: response.meta.total,
            }),
            providesTags: ['guard'],
        }),
        getCurrentHomeByGender: builder.query({
            query: (id) => ({
                url: `/api/current/gender/${id}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeProducts: builder.query({
            query: () => ({
                url: `/api/home/products`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getProductByUrl: builder.query({
            query: (url) => ({
                url: `/api/product/detail/${url}`,
                method: "GET",
            }),
            providesTags: ['guard'],
        }),
        getAllProducts: builder.query({
            query: (page) => ({
                url: `/api/all/products?page=${page}`,
                method: "GET",
            }),
            transformResponse: (response: { data: Product[], meta: { last_page: number, current_page: number, total: number } }) => ({
                productList: response.data,
                totalPagesResponse: response.meta.last_page,
                currentPageResponse: response.meta.current_page,
                totalProductsResponse: response.meta.total,
            }),
            providesTags: ['guard'],
        }),
        createDelivery: builder.mutation({
            query: (formData) => ({
                url: `/api/create/delivery`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ['guard'],
        }),
        getAttributeValues: builder.query({
            query: (id) => ({
                url: `/api/attributes/value/${id}`,
                method: 'GET'
            })
        }),
        getSimilarProducts: builder.query({
            query: (id) => ({
                url: `/api/similar/products/${id}`,
                method: 'GET'
            })
        }),
        getCategoryProductsByUrl: builder.query({
            query: (url) => ({
                url: `/api/product/by-category/${url}`,
                method: 'GET'
            })
        }),
        getCategoryByUrl: builder.query({
            query: (url) => ({
                url: `/api/category/by-url/${url}`,
                method: 'GET'
            })
        }),
        searchByQuery:builder.query({
            query:({query,userId})=>({
                url:`/api/search/${query}/${userId}`,
                method:"GET"
            })
        }),
        getProfileShop:builder.query({
            query:()=>({
                url:'/api/get/profile/shop',
                method:"GET"
            })
        }),
        getModalShop:builder.query({
            query:()=>({
                url:"/api/get/modal/shop",
                method:"Get"
            })
        }),
        getCatalogSeller:builder.query({
            query:(shopKey)=>({
                url:`/api/catalogue/${shopKey}`,
                method:"GET"
            })
        })
        
    }),
})
export const {
    useGetShopQuery,
    useGetCategoriesQuery,
    useGetTownsQuery,
    useGetQuartersQuery,
    useCheckIfEmailExistsMutation,
    useGetCategoriesWithParentIdNullQuery,
    useGetCategoriesWithParentIdQuery,
    useGetCategoryByGenderQuery,
    useGetSubCategoriesQuery,
    useGetHomeShopsQuery,
    useGetAllShopsQuery,
    useGetCurrentHomeByGenderQuery,
    useGetHomeProductsQuery,
    useGetProductByUrlQuery,
    useGetAllProductsQuery,
    useCreateDeliveryMutation,
    useGetAttributeValuesQuery,
    useGetSimilarProductsQuery,
    useGetCategoryProductsByUrlQuery,
    useGetCategoryByUrlQuery,
    useSearchByQueryQuery,
    useGetProfileShopQuery,
    useGetModalShopQuery,
    useGetCatalogSellerQuery,
    useFilterProductsQuery
} = guardService