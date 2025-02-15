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
        addProduct:builder.mutation({
                query:(formData)=>({
                        url:"/api/v1/products",
                        method:"POST",
                        body:formData
                }),
                invalidatesTags:["seller"]
        })
        
})
})
export const {
useCurrentSellerQuery,
useAddProductMutation
}=sellerService