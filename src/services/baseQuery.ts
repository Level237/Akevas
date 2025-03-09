import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import Cookies from "universal-cookie";

export const baseQuery = fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {

        const cookies = new Cookies();
        const token = cookies.get('accessToken');
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }

        return headers;
    }
})