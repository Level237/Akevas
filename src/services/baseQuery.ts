import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQuery = fetchBaseQuery({
    baseUrl: "https://api-akevas.akevas.com",
    //baseUrl: "http://127.0.0.1:8000",
    credentials: 'include',
    prepareHeaders: (headers) => {
        // Ne pas définir Content-Type automatiquement
        // RTK Query et le navigateur géreront automatiquement:
        // - application/json pour les objets normaux
        // - multipart/form-data pour FormData (avec boundary)
        return headers;
    }
})