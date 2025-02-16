import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQueryNotAuth=fetchBaseQuery({
    baseUrl:"https://api-akevas.akevas.com",
    credentials:"same-origin",
    
    prepareHeaders:(headers)=>{
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return headers;
    }
})