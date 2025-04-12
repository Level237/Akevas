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
                        url:"/api/v1/seller/products",
                        method:"POST",
                        body:formData
                }),
                invalidatesTags:["seller"]
        }),
        getProducts:builder.query({
                query:()=>'/api/v1/seller/products',
                providesTags:['seller']
        }),
        updateDocs:builder.mutation({
                query:(formData)=>({
                    url:"/api/v1/update/docs",
                    method:'POST',
                    body:formData
                })
            }),
            initCoinPayment:builder.mutation({
                query:(body)=>({
                    url:`/api/v1/init/payment/coins`,
                    method:'POST',
                    body:body
                }),
                invalidatesTags:['seller']
            }),
        
})
})
export const {
useCurrentSellerQuery,
useAddProductMutation,
useGetProductsQuery,
useUpdateDocsMutation,
useInitCoinPaymentMutation
}=sellerService