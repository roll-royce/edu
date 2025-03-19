import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signInWithGoogle, resetPassword } = useAuth()
  
  // Get redirect path from location state or default to profile
  const from = location.state?.from?.pathname || '/profile'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await login(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true)
      await signInWithGoogle()
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Google sign-in error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (!resetEmail) {
      toast.error('Please enter your email address')
      return
    }
    
    try {
      setIsResetting(true)
      await resetPassword(resetEmail)
      setShowResetPassword(false)
      setResetEmail('')
    } catch (error) {
      console.error('Password reset error:', error)
    } finally {
      setIsResetting(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <motion.div
        className="bg-white dark:bg-dark-700 rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center">
              <i className="bi bi-book text-primary-600 text-3xl mr-2"></i>
              <span className="font-heading font-bold text-xl text-primary-600">BookNest</span>
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your account to continue
            </p>
          </div>
          
          {showResetPassword ? (
            <form onSubmit={handleResetPassword}>
              <div className="mb-6">
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isResetting}
              >
                {isResetting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="mt-4 text-center w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <button 
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                
                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-dark-700 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full btn btn-outline flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-google text-lg mr-2"></i>
                    Sign in with Google
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Login
