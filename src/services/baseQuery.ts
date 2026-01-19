import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "universal-cookie";

export const baseQuery = fetchBaseQuery({
    baseUrl: "https://api.akevas.com",
    //baseUrl: "http://127.0.0.1:8000",
    credentials: 'include',
    prepareHeaders: (headers) => {

        const cookies = new Cookies();
        const token = cookies.get('tokenDelivery');
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers;
    }
})