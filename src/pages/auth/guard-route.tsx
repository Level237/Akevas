import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery } from "@/services/auth";


export const GuardRoute = () => {

  // ✅ CORRECTION : Même logique de cache ici
  const { data, isLoading } = useCheckAuthQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  // Si on est en train de charger la toute première vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed7e0f]"></div>
      </div>
    );
  }

  // Si l'utilisateur EST authentifié et essaie d'aller sur /login ou /register
  // On le redirige immédiatement vers son espace membre
  if (data?.isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  }

  // Si non authentifié, on l'autorise à voir la page de login/register
  return <Outlet />;
};