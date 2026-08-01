import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import MasterLayout from './components/Layout/MasterLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home'
import Notfound from './components/Layout/Notfound/Notfound'
import AuthLayout from './components/Layout/Authlayout'
import Login from './components/Layout/Login/Login'
import Register from './components/Layout/Register/Register'
import DoctorDashboard from './Pages/Doctor/DoctorDashboard'

function App() {
  const routes = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        { path: '/', element: <Login /> },
        { path: '/register', element: <Register /> },
      ],
    },
    {
      element: <MasterLayout />,
      children: [
        { path: '/home', element: <Home /> },
      ],
    },
    {path: '/doctor/*', element: <DoctorDashboard />},
    {
      path: '*',
      element: <Notfound />,
    },
  ])

  return <RouterProvider router={routes} />
}

export default App