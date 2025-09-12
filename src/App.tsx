
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import { Provider } from 'react-redux'
import { store } from './store'
import ErrorBoundary, { NetworkBoundary } from './components/errors/error-boundary'
import { Toaster } from 'sonner'
import { NuqsAdapter } from 'nuqs/adapters/react'

function App() {


  return (
    <>
     
     <NuqsAdapter>
     <ErrorBoundary>
        <NetworkBoundary>
      <LoaderProvider>
      <Provider store={store}>
        <RouterProvider router={routes} />
        
      </Provider>
      <Toaster richColors position="top-center" />
    </LoaderProvider>
    </NetworkBoundary>
    </ErrorBoundary>
    </NuqsAdapter>
    </>
    
  )
}

export default App