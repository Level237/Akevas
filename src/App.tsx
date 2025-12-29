
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import {  useDispatch } from 'react-redux'

import ErrorBoundary, { NetworkBoundary } from './components/errors/error-boundary'
import { Toaster } from 'sonner'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useCheckAuthQuery } from './services/auth'
import { useEffect } from 'react'
import { setAuthInitialized } from './store/authSlice'


function App() {

  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess, isUninitialized } = useCheckAuthQuery(undefined, {
  });
console.log(data)
  useEffect(() => {
    if (!isUninitialized && (isSuccess || isError || !isLoading)) { // checkAuth a terminé d'une manière ou d'une autre
        dispatch(setAuthInitialized());
    }
  }, [isUninitialized, isSuccess, isError, isLoading, dispatch]);

  
  
  return (
    <>
     
     <NuqsAdapter>
     <ErrorBoundary>
        <NetworkBoundary>
      <LoaderProvider>
     
        <RouterProvider router={routes} />
        
      <Toaster richColors position="top-center" />
    </LoaderProvider>
    </NetworkBoundary>
    </ErrorBoundary>
    </NuqsAdapter>
    </>
    
  )
}

export default App
