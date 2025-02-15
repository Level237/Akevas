
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
        })
        
    })
})

export const {
   useGetShopQuery,
    useGetCategoriesQuery,
    useGetTownsQuery,
    useGetQuartersQuery,
}=guardService