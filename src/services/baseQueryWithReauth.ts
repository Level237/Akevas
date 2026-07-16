import { baseQuery } from "./baseQuery";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);

  // ==========================================
  // 1. GESTION DU RATE LIMITING (Erreur 429)
  // ==========================================
  if (result.error && result.error.status === 429) {
    // RTK Query expose les headers de la réponse dans result.meta.response.headers
    const retryAfterHeader = result.meta?.response?.headers?.get('Retry-After');
    const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 30;

    console.warn(`[Rate Limit] Trop de requêtes. Veuillez patienter ${retryAfterSeconds} secondes.`);

    // Optionnel : Déclencher une notification globale (Toast/Snackbar) via un dispatch Redux
    // api.dispatch(showNotification({ 
    //   type: 'warning', 
    //   message: `Trop d'actions. Réessayez dans ${retryAfterSeconds} secondes.` 
    // }));

    // IMPORTANT : On retourne l'erreur telle quelle. 
    // On NE RETENTE PAS automatiquement la requête ici, sinon on va boucler 
    // et le compteur de 30s de Laravel va recommencer à zéro à chaque tentative.
    return result;
  }

  // ==========================================
  // 2. GESTION DU TOKEN EXPIRÉ (Erreur 401) - Votre code existant
  // ==========================================
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery("/api/refresh", api, extraOptions);

    if (refreshResult.data) {
      // Le token a été rafraîchi avec succès.
      // On retente la requête originale qui a échoué
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Le rafraîchissement a échoué.
      // Déconnecter l'utilisateur (ex: api.dispatch(logout()))
      // et nettoyer les cookies/localStorage si nécessaire.
      console.warn("[Auth] Échec du refresh token, déconnexion requise.");
    }
  }

  return result;
};