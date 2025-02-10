import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQueryNotAuth=fetchBaseQuery({
    baseUrl:"http://127.0.0.1:8000",
    credentials:"include",
    
    prepareHeaders:(headers)=>{
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return headers;
    }
})