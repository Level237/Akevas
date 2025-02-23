import { fetchBaseQuery } from "@reduxjs/toolkit/query";    
import { RootState } from "../store";

export const baseQuery=fetchBaseQuery({
       baseUrl:"https://api-akevas.akevas.com",
     prepareHeaders:(headers,{getState})=>{
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        
        const token = (getState() as RootState).auth.usedToken;
        if(token){  
            headers.set('authorization',`Bearer ${token}`)
        }

        return headers;   
    }
})