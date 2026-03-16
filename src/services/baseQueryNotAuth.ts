import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { retry } from "@reduxjs/toolkit/query";

// Fonction de retry personnalisée
const staggeredBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: "https://api.akevas.com",
    //baseUrl: "http://127.0.0.1:8000",
    credentials: "include",
    timeout: 10000,

    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },

    validateStatus: (response) => {
      if (!response) return false;
      return response.status >= 200 && response.status < 300;
    },
  });

  // Configuration du retry avec la nouvelle API
  const retryConfig = {
    maxRetries: 3,
    backoff: async (attempt: number) => {
      const delay = Math.min(1000 * 2 ** attempt, 30000);
      await new Promise(resolve => setTimeout(resolve, delay));
    },
  };

  return retry(baseQuery, retryConfig)(args, api, extraOptions);
};

export const baseQueryNotAuth = staggeredBaseQuery;