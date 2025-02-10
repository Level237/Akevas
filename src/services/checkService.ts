
import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryNotAuth } from "./baseQueryNotAuth";




export const checkTokenService=createApi({
    baseQuery:baseQueryNotAuth,
    reducerPath:"checkTokenService",
    tagTypes:['checkToken'],
    endpoints:builder=>({
       
        checkToken:builder.query({
           
                query:()=>'/api/check/token',
                providesTags: ['checkToken'],
               
        }),
    })
})

export const {
   
    useCheckTokenQuery,

}=checkTokenService