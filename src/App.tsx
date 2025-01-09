import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider, ScrollRestoration } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'


function App() {
 

  return (
    <LoaderProvider>
      
    <RouterProvider router={routes} />
   
    </LoaderProvider>
  )
}

export default App