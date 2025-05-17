
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import { Provider } from 'react-redux'
import { store } from './store'
import ErrorBoundary, { NetworkBoundary } from './components/errors/error-boundary'


function App() {


  return (
    <>
     <NetworkBoundary>
     <ErrorBoundary>
        
      <LoaderProvider>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>

    </LoaderProvider>
    </ErrorBoundary>
    </NetworkBoundary>
    </>
    
  )
}

export default App