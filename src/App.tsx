import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'


function App() {
 

  return (
    <RouterProvider router={routes}>

    </RouterProvider>
  )
}

export default App