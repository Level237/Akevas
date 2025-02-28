import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCheckAuthQuery } from '@/services/auth'

export const PrivateRoute = () => {
    const location = useLocation()
    const { data, isLoading, isError } = useCheckAuthQuery()

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        data?.isAuthenticated === true ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
    )
}