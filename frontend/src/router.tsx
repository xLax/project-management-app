import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './pages/ProjectDetails'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public route
      { path: '/', element: <LandingPage /> },

      // Protected routes — redirect to "/" if no token
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/projects/create', element: <CreateProject /> },
          { path: '/projects/:id', element: <ProjectDetails /> },
        ],
      },
    ],
  },
])

export default router
