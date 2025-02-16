import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const adminService=createApi({
    baseQuery:baseQueryWithReauth,
    reducerPath:"adminService",
    tagTypes:['admin'],
    endpoints:builder=>({
       
        recentSeller:builder.query({
           
                query:()=>'/api/v1/recent/sellers',
                providesTags: ['admin'],
               
        }),
        listSellers:builder.query({
           
                query:()=>'/api/v1/sellers',
                providesTags: ['admin'],
               
        }),
        getSeller:builder.query({
            query:(id)=>`/api/v1/sellers/${id}`,
           providesTags: ['admin'],
        }),
        confirmOrNotShop:builder.mutation({
            query:({shop_id, formData})=>({
                url:`/api/v1/shop/confirm/${shop_id}`,
                method:'POST',
                body:formData
            }),
            invalidatesTags:['admin']
        }),
        recentProducts:builder.query({
            query:()=>'/api/v1/recent/products',
            providesTags: ['admin'],
        }),
        adminListProducts:builder.query({
            query:()=>'/api/v1/admin/products',
            providesTags: ['admin'],
        })
    })
})

export const {
useRecentSellerQuery,
useListSellersQuery,
useGetSellerQuery,
useConfirmOrNotShopMutation,
useRecentProductsQuery,
useAdminListProductsQuery
}=adminService