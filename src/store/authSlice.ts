import { authService } from "@/services/auth";
import { guardService } from "@/services/guardService";
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";


const cookies = new Cookies();
const hasAccessToken = !!cookies.get('accessToken');

const initialState = {
  isAuthenticated: hasAccessToken, // Présuppose l'authentification si un token existe
  userRole: cookies.get('userRole') || null,
  isAuthInitialized: false, // Si le rôle est aussi dans les cookies
  // On ne stocke plus les tokens d'accès/refresh ici si HttpOnly
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state) => {
      state.isAuthenticated = true;
    },
    setUnauthenticated: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      // Nettoyage des cookies à la déconnexion
      const cookies = new Cookies();
      cookies.remove('accessToken', { path: '/' });
      cookies.remove('refreshToken', { path: '/' });
      cookies.remove('userRole', { path: '/' }); // Si stocké
    },
    setUserRole: (state, action) => { // Renommé pour plus de clarté
      state.userRole = action.payload;
      cookies.set('userRole', action.payload, { path: '/', secure: true, expires: new Date(Date.now() + 3600 * 1000 * 24 * 7) }); // Exemple d'expiration
    },
    // Si le token de rafraîchissement n'est PAS HttpOnly et est stocké dans Redux, ajoutez ceci:
    // setTokens: (state, action) => {
    //   state.token = action.payload.accessToken;
    //   state.refreshToken = action.payload.refreshToken;
    // }

    setAuthInitialized: (state) => {
      state.isAuthInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // Lors d'une connexion réussie via `login`
    builder.addMatcher(
      guardService.endpoints.login.matchFulfilled,
      (state, action) => {
        console.log(action)
        state.isAuthenticated = true;
        // Supposons que le backend envoie l'accessToken et refreshToken dans des cookies HttpOnly.
        // Si le backend renvoie le role, vous pouvez le stocker ici:
        // state.userRole = action.payload.user.role;
        // cookies.set('userRole', action.payload.user.role, { path: '/', secure: true });
        state.isAuthInitialized = true;
      }
    );

    // Lors d'une déconnexion réussie via `logout`
    builder.addMatcher(
      authService.endpoints.logout.matchFulfilled,
      (state) => {
        state.isAuthenticated = false;
        state.userRole = null;
        state.isAuthInitialized = true;
        // Les cookies doivent être effacés côté backend aussi
        const cookies = new Cookies();
        cookies.remove('accessToken', { path: '/' });
        cookies.remove('refreshToken', { path: '/' });
        cookies.remove('userRole', { path: '/' });
      }
    );

    // Écoute les succès de `checkAuth`
    builder.addMatcher(
      authService.endpoints.checkAuth.matchFulfilled,
      (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isAuthInitialized = true;
        // Si checkAuth renvoie le rôle de l'utilisateur
        // state.userRole = action.payload.user.role;
      }
    );

    // Écoute les échecs de `checkAuth` ou autres appels authService nécessitant une déconnexion
    builder.addMatcher(
      authService.endpoints.checkAuth.matchRejected,
      (state, action) => {
        // Si c'est une erreur 401 ou toute autre erreur d'authentification
        if (action.payload?.status === 401) { // Vérifier que l'erreur est bien 401
          state.isAuthenticated = false;
          state.userRole = null;
          // Nettoyer les cookies à l'échec d'authentification
          const cookies = new Cookies();
          cookies.remove('accessToken', { path: '/' });
          cookies.remove('refreshToken', { path: '/' });
          cookies.remove('userRole', { path: '/' });
        }
        state.isAuthInitialized = true;
      }
    );
  },
});

export const { setAuthenticated, setUnauthenticated, setUserRole, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer; // Important: