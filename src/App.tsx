
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import ErrorBoundary, { NetworkBoundary } from './components/errors/error-boundary'
import { Toaster } from 'sonner'


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