
import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryNotAuth } from "./baseQueryNotAuth";




export const guardService=createApi({
    baseQuery:baseQueryNotAuth,
    reducerPath:"guardService",
    tagTypes:['guard'],
    endpoints:builder=>({
       
        getCategories:builder.query({
           
                query:()=>({
                    url:'/api/categories',
                    method:'GET',
                }),
                providesTags: ['guard'],
               
        }),
        getTowns:builder.query({
            query:()=>({
                url:"/api/towns",
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getQuarters:builder.query({
            query:()=>({
                url:`/api/quarters`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getShop:builder.query({
            query:(id)=>`/api/shop/${id}`,
           providesTags: ['guard'],
        }),
        checkIfEmailExists:builder.mutation({
            query:(formData)=>({
                url:`/api/check/email-and-phone-number`,
                method:"POST",
               
                body:formData,
            }),
            invalidatesTags: ['guard'],
        }),
        getCategoriesWithParentIdNull:builder.query({
            query:()=>({
                url:`/api/categories/with-parent-id-null`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getCategoriesWithParentId:builder.query({
            query:(id)=>({
                url:`/api/category/gender/${id}`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getCategoryByGender:builder.query({
            query:(id)=>({
                url:`/api/get/category/by-gender/${id}`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getSubCategories:builder.query({
            query:(id)=>({
                url:`/api/get/sub-categories/${id}`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeShops:builder.query({
            query:()=>({
                url:`/api/home/shops`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getAllShops:builder.query({
            query:()=>({
                url:`/api/all/shops`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getCurrentHomeByGender:builder.query({
            query:(id)=>({
                url:`/api/current/gender/${id}`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
        getHomeProducts:builder.query({
            query:()=>({
                url:`/api/home/products`,
                method:"GET",
            }),
            providesTags: ['guard'],
        }),
    })
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
}=guardService