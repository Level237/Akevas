import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCheckAuthQuery } from '@/services/auth'
import { useEffect } from 'react';
import { setAuthenticated, setUnauthenticated } from '@/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const PrivateRoute = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    // 1. Get local authentication state from Redux store
    const isAuthenticatedLocally = useSelector((state:any) => state.auth.isAuthenticated);

    // 2. Trigger the backend checkAuth query
    // skip: true means this query won't run initially if we already believe we're authenticated
    // and only runs when isAuthenticatedLocally is false (e.g., app first load, or after logout attempt)
    // or if we explicitly want to re-validate.
    const { 
        data: authData, 
        isLoading: isCheckingAuth, 
        isError: isAuthError, 
        error: authError,

    } = useCheckAuthQuery(undefined, {
        // Option 1: Always check on mount, but cache results aggressively (default RTK behavior)
        // Option 2: Only check if we are NOT locally authenticated, or explicitly want to refetch
        // For best UX, we want to show content quickly if local state says logged in.
        // So, we'll let RTK Query manage fetching in the background.
        // If you want to skip initial check when locally authenticated, uncomment below line
        // skip: isAuthenticatedLocally // This would prevent refetch on every visit if already authenticated
        // However, letting RTK Query fetch (even if cached) is often better for keeping state fresh.
    });

    // 3. Effect to handle backend authentication results and update local state
    useEffect(() => {
        if (authData?.isAuthenticated === true && !isAuthenticatedLocally) {
            dispatch(setAuthenticated());
        } else if (authData?.isAuthenticated === false && isAuthenticatedLocally) {
            // Server says not authenticated, but local state says yes. Local state is wrong.
            dispatch(setUnauthenticated());
        }
        // Handle explicit 401s from checkAuth if not caught by baseQueryWithReauth already
        // This is a failsafe; baseQueryWithReauth should handle most 401s by dispatching setUnauthenticated
        if (isAuthError) {
            dispatch(setUnauthenticated());
        }
    }, [authData, isAuthError, authError, isAuthenticatedLocally, dispatch]);


    // --- RENDERING LOGIC ---

    // A. Initial App Load / Re-check during current session (if not locally authenticated yet)
    // If we're currently checking auth from backend AND we're NOT locally authenticated yet,
    // show a loading spinner. This prevents flickering to login page if it's just slow.
    if (isCheckingAuth && !isAuthenticatedLocally) {
        return <div>Vérification de votre session...</div>;
    }

    // B. User is locally authenticated (most common case for seamless navigation)
    // We trust the local state first for a snappy UX.
    if (isAuthenticatedLocally) {
        // The background checkAuth query is running or has completed.
        // If it comes back as `false`, the useEffect above will dispatch `setUnauthenticated`,
        // and this component will re-render, falling into the next `if` block.
        return <Outlet />;
    }

    // C. Server explicitly says not authenticated (or local state was already false)
    // and we're not actively checking anymore, or the check failed with an auth error.
    if (!isAuthenticatedLocally && !isCheckingAuth) {
        // If we reach here, local state is false, and backend check is either done
        // or wasn't even attempted because local state was already false.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // D. Fallback for edge cases (should ideally not be hit)
    return <div>Chargement...</div>;
};