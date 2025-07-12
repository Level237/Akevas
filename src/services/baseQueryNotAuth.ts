import { fetchBaseQuery } from "@reduxjs/toolkit/query";


export const baseQueryNotAuth = fetchBaseQuery({
    //baseUrl:"https://api-akevas.akevas.com",
    baseUrl: "http://127.0.0.1:8000",
    credentials: "include",
    timeout: 10000,

    prepareHeaders: (headers) => {
        return headers;
    },
    
    validateStatus: (response) => {
      if (response.status >= 200 && response.status < 300) {
        return true;
      }
      return false;
    },
})