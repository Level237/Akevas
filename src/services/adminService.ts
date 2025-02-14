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
           
        }),
        confirmOrNotShop:builder.mutation({
            query:({shop_id, formData})=>({
                url:`/api/v1/shop/confirm/${shop_id}`,
                method:'POST',
                body:formData
            })
        })
    })
})

export const {
useRecentSellerQuery,
useListSellersQuery,
useGetSellerQuery,
useConfirmOrNotShopMutation
}=adminService