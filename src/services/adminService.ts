
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
    })
})

export const {
useRecentSellerQuery,
useListSellersQuery
}=adminService