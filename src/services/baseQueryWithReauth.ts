import { baseQuery } from "./baseQuery";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  // 1. Première tentative de la requête
  let result = await baseQuery(args, api, extraOptions);

  // 🚨 CRITIQUE 1 : Si c'est une erreur 429, on arrête TOUT immédiatement.
  if (result.error && result.error.status === 429) {
    return result;
  }

  // 🚨 CRITIQUE 2 : Gestion du 401 (Token expiré)
  if (result.error && result.error.status === 401) {

    // On extrait l'URL de la requête qui vient d'échouer
    const url = typeof args === 'string' ? args : args.url;

    // 🎯 LISTE DES ROUTES QUI NE DOIVENT JAMAIS DÉCLENCHER UN REFRESH
    const skipRefreshRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-otp',
      '/refresh/token',      // 🚨 Éviter boucle infinie
      '/check-auth',         // 🚨 CRITIQUE : check-auth ne doit PAS refresh
      '/v1/check-auth',      // Au cas où
    ];

    // Vérifier si l'URL courante fait partie des routes à ignorer
    const shouldSkipRefresh = skipRefreshRoutes.some(route =>
      url.includes(route)
    );

    // Si c'est une route d'auth ou check-auth, on NE TENTE PAS de refresh
    if (shouldSkipRefresh) {
      console.log(`[Auth] Skip refresh pour: ${url}`);
      return result;
    }

    // Sinon (ex: appel à /api/v1/current/user), on tente le refresh
    console.log(`[Auth] Tentative de refresh pour: ${url}`);
    const refreshResult = await baseQuery("/api/refresh/token", api, extraOptions);

    if (refreshResult.data) {
      // Le token a été rafraîchi avec succès, on retente la requête originale
      console.log(`[Auth] Refresh réussi, retry de: ${url}`);
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Échec du refresh (cookie invalide ou expiré)
      console.log(`[Auth] Refresh échoué pour: ${url}`);
      // Ici, tu peux dispatcher une action de déconnexion si nécessaire
      // api.dispatch(logout());
    }
  }

  return result;
};