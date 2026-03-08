import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Home from './pages/Dahboard/Home'
import SettingsPage from './pages/Dahboard/SettingsPage'
import NotFound from './pages/auth/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import { Toaster } from 'react-hot-toast'
import Reports from './pages/Dahboard/Reports'

const App = () => {
  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path='/' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path='/register' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        
        {/* protected routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
          <Home />
          </ProtectedRoute>
          } />

        <Route path='/settings' element={
          <ProtectedRoute>
          <SettingsPage/>
          </ProtectedRoute>
          }/>

        <Route path='/reports' element={
          <ProtectedRoute>
          <Reports/>
          </ProtectedRoute>
          }/>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
