import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCheckAuthQuery } from "@/services/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated } from "@/store/authSlice";

export const PrivateRoute = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Le seul moyen de savoir si l'utilisateur est authentifié est ici :
    const { data, isLoading, isError } = useCheckAuthQuery(undefined, {
        // On veut absolument lancer la requête à chaque fois
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (data?.isAuthenticated === true) {
            dispatch(setAuthenticated());
        } else if (data?.isAuthenticated === false || isError) {
            dispatch(setUnauthenticated());
        }
    }, [data, isError]);

    // 1. Tant que le backend n'a pas répondu → on bloque le rendu
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed7e0f]"></div>
            </div>
        );
    }

    if (isError || data?.isAuthenticated === false) {
        const redirectPath = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
    }

    return <Outlet />;
};
