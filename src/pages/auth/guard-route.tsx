import { useCheckAuthQuery } from '@/services/auth';
import { useEffect } from 'react';
import { useNavigate,Outlet } from 'react-router-dom';


//import { useCheckTokenQuery } from '@/services/checkService'
export const GuardRoute = () => {
    const { data, error, isLoading } = useCheckAuthQuery();
    const navigate = useNavigate();
    console.log(data)
    useEffect(() => {
    // ⏳ Tant que ça charge, on ne fait rien
    if (isLoading) return;

    if (data?.isAuthenticated) {

      navigate("/seller/dashboard", { replace: true });
      return;
    }

   

  }, [data,isLoading, navigate]);

    // If the user is NOT authenticated, they can proceed to view the login or register page.
    return error || !data?.isAuthenticated ? <Outlet /> : null;
}