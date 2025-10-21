
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
      // Le `checkAuth` doit toujours être lancé au moins une fois au démarrage de l'app.
      // Il peut être skippé si vous voulez une détection purement locale au démarrage
      // et ne valider que sur les PrivateRoutes, mais ce n'est pas ce que vous cherchez ici.
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