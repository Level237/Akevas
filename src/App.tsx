
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'sonner';

function App() {
 

  return (
    <LoaderProvider>
       <Provider store={store}>
        <RouterProvider router={routes} />
       </Provider>
       <Toaster richColors position="top-center" />
    </LoaderProvider>
  )
}

export default App