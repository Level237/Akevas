
import { baseQuery } from "./baseQuery";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Cookies from "universal-cookie";
import { setUnauthenticated } from "@/store/authSlice";


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => { // Renommé 'store' en 'api' pour la clarté (c'est le param par défaut)
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Tenter de rafraîchir le token
    // La route /api/refresh doit être conçue pour prendre le refreshToken d'un cookie HttpOnly
    // et retourner un nouvel accessToken (dans un cookie HttpOnly)
    const refreshResult = await baseQuery("/api/refresh", api, extraOptions);

    if (refreshResult.data) {
      // Le token a été rafraîchi avec succès.
      // Le nouveau accessToken est supposé être stocké dans un cookie HttpOnly par le backend.
      // Nous n'avons pas besoin de le stocker manuellement ici si c'est HttpOnly.
      // On peut dispatch setAuthenticated si nécessaire, mais si checkAuth est appelé, il le fera.
      // api.dispatch(setAuthenticated()); 

      // Retenter la requête originale qui a échoué
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Le rafraîchissement a échoué (refreshToken invalide, expiré, ou erreur serveur).
      // Déconnecter l'utilisateur.
      api.dispatch(setUnauthenticated());
      // Nettoyage manuel des cookies si le backend ne le fait pas explicitement lors de l'échec du refresh
      

    }
  }
  return result;
};