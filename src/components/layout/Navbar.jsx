import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white dark:bg-dark-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <i className="bi bi-book text-primary-600 text-3xl mr-2"></i>
              <span className="font-heading font-bold text-xl text-primary-600">BookNest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`
              }
            >
              Explore
            </NavLink>
            
            {currentUser ? (
              <>
                <NavLink 
                  to="/upload" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                >
                  Upload
                </NavLink>
                <div className="relative ml-3">
                  <div className="flex items-center space-x-3">
                    <NavLink 
                      to="/profile" 
                      className={({ isActive }) => 
                        `flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                          isActive 
                            ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                        }`
                      }
                    >
                      <i className="bi bi-person-circle"></i>
                      <span>Profile</span>
                    </NavLink>
                    <button 
                      onClick={handleLogout}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline text-sm"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <i className="bi bi-x text-2xl"></i>
              ) : (
                <i className="bi bi-list text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white dark:bg-dark-800 shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`
              }
              end
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${
                  isActive 
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </NavLink>
            
            {currentUser ? (
              <>
                <NavLink 
                  to="/upload" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link 
                  to="/login" 
                  className="btn btn-outline text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
