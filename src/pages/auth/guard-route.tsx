import { useSelector } from 'react-redux'
import {  Outlet} from 'react-router-dom'


//import { useCheckTokenQuery } from '@/services/checkService'
export const GuardRoute = () => {
    const isAuthenticatedLocally = useSelector((state:any) => state.auth.isAuthenticated);
    
    
    // We also use the `getUser` query in the background to ensure the local state is fresh.
    // This is optional but good practice to catch stale local states.
    // However, for a simple guest route, relying on `isAuthenticatedLocally` is enough for a snappy UX.
    // If you already have `useCheckAuthQuery` running somewhere else (e.g., in your App.js),
    // you don't need another one here.

    // If the user is authenticated locally, we redirect them to the dashboard or home page.
    // We use a safe default like '/dashboard' or whatever your main protected page is.
    if (isAuthenticatedLocally) {
        window.location.href="/authenticate"
    }

    // If the user is NOT authenticated, they can proceed to view the login or register page.
    return <Outlet />;
}