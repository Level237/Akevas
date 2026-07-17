import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCheckAuthQuery } from "@/services/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated } from "@/store/authSlice";

export const PrivateRoute = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    // ✅ CORRECTION : On utilise le cache. Pas de refetch forcé au montage.
    const { data, isLoading, isError } = useCheckAuthQuery(undefined, {
        refetchOnMountOrArgChange: false, // Ne force pas l'appel réseau si en cache
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    useEffect(() => {
        if (data?.isAuthenticated === true) {
            dispatch(setAuthenticated());
        } else if (data?.isAuthenticated === false || isError) {
            dispatch(setUnauthenticated());
        }
    }, [data, isError, dispatch]);

    // 1. Chargement initial (seulement si le cache est vide/expiré)
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed7e0f]"></div>
            </div>
        );
    }

    // 2. Non authentifié → redirection vers login en sauvegardant la page demandée
    if (isError || data?.isAuthenticated === false) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // 3. Authentifié → affichage de la page protégée
    return <Outlet />;
};