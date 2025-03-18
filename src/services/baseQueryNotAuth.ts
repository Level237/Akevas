import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQueryNotAuth = fetchBaseQuery({
    baseUrl:"https://api-akevas.akevas.com",
    //baseUrl: "http://127.0.0.1:8000",
    credentials: "include",

    prepareHeaders: (headers) => {
        return headers;
    }
})