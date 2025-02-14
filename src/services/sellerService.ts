import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const sellerService=createApi({
    baseQuery:baseQueryWithReauth,
    reducerPath:"sellerService",
    tagTypes:['seller'],
    endpoints:builder=>({
       
        currentSeller:builder.query({
           
                query:()=>'/api/v1/current/seller',
                providesTags: ['seller'],
               
        }),
        
})
})
export const {
useCurrentSellerQuery
}=sellerService