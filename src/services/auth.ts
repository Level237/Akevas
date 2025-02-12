
import {createApi} from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQueryWithReauth";




export const authService=createApi({
    baseQuery:baseQueryWithReauth,
    reducerPath:"authService",
    tagTypes:['Auth'],
    endpoints:builder=>({
        login:builder.mutation({
            query:(credentials)=>(
                {
                url:'/api/login',
                method:'POST',
                body:credentials
            }),
            
            transformErrorResponse: (baseQueryResult) => {
                // Ici, vous pouvez personnaliser la réponse d'erreur
               
                 if(baseQueryResult.status===400){
                    return { error: "l'email et le mot de passe ne peut pas etre vide" };
                }else if(baseQueryResult.status===500){
                    return { error: "l'email out le mot de passe sont incorrect" };
                }
                else {
                    
                  return { error: baseQueryResult.data };
                }
              },
        },
        
        ),
        newStore:builder.mutation({
            query:(formData)=>({
                url:"/api/create/seller",
                method:"POST",
                body:formData,
                
            }),
            invalidatesTags: ['Auth'],
        }),
        logout:builder.mutation({
            query:()=>({
                url:"/api/v1/logout",
                method:"POST",
            }),
            invalidatesTags:['Auth']
        }),
        getUser:builder.query({
           
                query:()=>'/api/v1/current/user',
                providesTags: ['Auth'],
                transformErrorResponse: (baseQueryResult) => {
                    // Ici, vous pouvez personnaliser la réponse d'erreur
                    
                     if(baseQueryResult.status===401){
                        return { error: "l'email et le mot de passe ne peut pas etre vide" };
                    }else if(baseQueryResult.status===500){
                        return { error: "l'email out le mot de passe sont incorrect" };
                    }
                    else {
                       
                      return { error: baseQueryResult.data };
                    }
                  },
        }),
    })
})

export const {
    useLoginMutation,
    useGetUserQuery,
    useLogoutMutation,
    useNewStoreMutation
}=authService