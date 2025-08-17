import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Library from './components/library/library.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext.jsx'
const routes = createBrowserRouter([
  {
    path : "/",
    element: <App/>,
    children: [
      {
        path : "library",
        element : <Library/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={routes}/>
    </ThemeProvider>
  </StrictMode>
)
