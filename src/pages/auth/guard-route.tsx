import { useCheckAuthQuery } from '@/services/auth';
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

export const GuardRoute = () => {
  const { data, error, isLoading, isFetching } = useCheckAuthQuery();
  const navigate = useNavigate();

  const loading = isLoading || isFetching;

  useEffect(() => {
    if (loading) return;

    if (data?.isAuthenticated) {
      navigate("/authenticate", { replace: true });
    }
  }, [loading, data, navigate]);

  


  // 🔓 2. Non authentifié → accès Login / Register
  if (error || !data?.isAuthenticated) return <Outlet />;

  // 🛑 3. Authentifié → rien (redirect déjà fait)
  return null;
};