
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import { Provider } from 'react-redux'
import { store } from './store'


function App() {
 

  return (
    <LoaderProvider>
       <Provider store={store}>
        <RouterProvider router={routes} />
       </Provider>
   
    </LoaderProvider>
  )
}

export default App