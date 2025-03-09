import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import Cookies from "universal-cookie";

export const baseQuery = fetchBaseQuery({
    baseUrl: "https://api-akevas.akevas.com",
    credentials: 'include',
    prepareHeaders: (headers) => {

        const cookies = new Cookies();
        const token = cookies.get('accessToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers;
    }
})