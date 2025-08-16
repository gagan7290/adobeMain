import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Workspace from './components/workspace/Workspace.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext.jsx'
const routes = createBrowserRouter([
  {
    path : "/",
    element: <App/>,
    children: [
      {
        path : "Workspace",
        element : <Workspace/>
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
