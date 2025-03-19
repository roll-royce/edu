import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner fullScreen />
  }
  
  return currentUser ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
