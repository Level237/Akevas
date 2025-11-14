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
      navigate("/seller/dashboard", { replace: true });
    }
  }, [loading, data, navigate]);

  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed7e0f]"></div>
    </div>
  );

  // 🔓 2. Non authentifié → accès Login / Register
  if (error || !data?.isAuthenticated) return <Outlet />;

  // 🛑 3. Authentifié → rien (redirect déjà fait)
  return null;
};
