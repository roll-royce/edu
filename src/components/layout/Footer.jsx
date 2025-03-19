import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-dark-800 shadow-inner pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <i className="bi bi-book text-primary-600 text-3xl mr-2"></i>
              <span className="font-heading font-bold text-xl text-primary-600">BookNest</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Share, discover, and connect through e-books on BookNest.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                <i className="bi bi-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                <i className="bi bi-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                <i className="bi bi-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                <i className="bi bi-linkedin text-xl"></i>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Explore
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Upload
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Fiction
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Non-Fiction
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Science & Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Business
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Academic
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Copyright Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} BookNest. All rights reserved. Designed by WebSparks AI.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
