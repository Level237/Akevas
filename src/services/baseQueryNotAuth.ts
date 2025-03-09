import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQueryNotAuth = fetchBaseQuery({
    baseUrl: "https://api-akevas.akevas.com",
    credentials: "include",

    prepareHeaders: (headers) => {
        return headers;
    }
})