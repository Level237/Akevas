import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: "https://api-akevas.akevas.com",
    //baseUrl: "http://127.0.0.1:8000",
    credentials: 'include',
    prepareHeaders: (headers) => {

        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');

        return headers;
    }
})