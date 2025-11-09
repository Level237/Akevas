
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import {  useDispatch } from 'react-redux'
import { Provider } from 'react-redux'
import { store } from './store'
import ErrorBoundary, { NetworkBoundary } from './components/errors/error-boundary'
import { Toaster } from 'sonner'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { useCheckAuthQuery } from './services/auth'
import { useEffect } from 'react'
import { setAuthInitialized } from './store/authSlice'

function App() {
 
 
  return (

    <ErrorBoundary>
      
        <NetworkBoundary>
    <LoaderProvider>
       
        <RouterProvider router={routes} />
       
       <Toaster richColors position="top-center" />
    </LoaderProvider>
    </NetworkBoundary>
 
    </ErrorBoundary>
  )
}

export default App