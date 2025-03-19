import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BookGrid from '../components/books/BookGrid'
import BookSearch from '../components/books/BookSearch'
import { useBooks } from '../contexts/BookContext'
import { useInView } from 'react-intersection-observer'

const Home = () => {
  const { featuredBooks, trendingBooks, recentBooks, loading } = useBooks()
  const [searchTerm, setSearchTerm] = useState('')
  
  const { ref: featuredRef, inView: featuredInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { ref: howItWorksRef, inView: howItWorksInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { ref: recentRef, inView: recentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const { ref: trendingRef, inView: trendingInView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm)
    if (searchTerm) {
      window.location.href = `/explore?search=${encodeURIComponent(searchTerm)}`
    }
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
                Share Knowledge, <br />Connect Through Books
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-100">
                Upload, discover, and share e-books with a community of readers and learners.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/explore" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
                  Explore Books
                </Link>
                <Link to="/upload" className="btn bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500">
                  Upload a Book
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Books on a shelf"
                className="rounded-lg shadow-2xl animate-float"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/0ea5e9/ffffff?text=Digital+Library";
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-10 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-heading">Find Your Next Read</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Search for books by title, author, or category
            </p>
          </div>
          
          <BookSearch onSearch={handleSearch} />
          
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Popular:</span>
            {['Fiction', 'Business', 'Science', 'Self-Help', 'Academic'].map((category) => (
              <Link 
                key={category}
                to={`/explore?category=${category}`}
                className="badge badge-primary"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Books */}
      <section ref={featuredRef} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading">Featured Books</h2>
            <Link to="/explore" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
              View All
              <i className="bi bi-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {featuredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  className="card h-full flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative pt-[140%] overflow-hidden">
                    <img 
                      src={book.coverImage || `https://placehold.co/400x600/0ea5e9/ffffff?text=${encodeURIComponent(book.title)}`} 
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x600/0ea5e9/ffffff?text=${encodeURIComponent(book.title)}`;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-primary">
                        {book.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{book.author}</p>
                    
                    <div className="mt-auto">
                      <Link 
                        to={`/books/${book.id}`} 
                        className="btn btn-primary w-full text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No featured books available yet.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works */}
      <section ref={howItWorksRef} className="py-16 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              BookNest makes it easy to share and discover e-books in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'bi-cloud-upload',
                title: 'Upload Your E-Books',
                description: 'Share your knowledge by uploading PDF e-books up to 100MB in size. We automatically extract the cover image for you.'
              },
              {
                icon: 'bi-search',
                title: 'Discover New Content',
                description: 'Browse through categories or search for specific topics to find what you need. Save your favorites for easy access later.'
              },
              {
                icon: 'bi-share',
                title: 'Share with Others',
                description: 'Generate QR codes for easy sharing or download books for offline reading. Track your downloads and views.'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`bi ${step.icon} text-3xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recent Uploads */}
      <section ref={recentRef} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading">Recent Uploads</h2>
            <Link to="/explore?sort=newest" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
              View All
              <i className="bi bi-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={recentInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookGrid books={recentBooks} />
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Trending Books */}
      <section ref={trendingRef} className="py-12 bg-gray-50 dark:bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-heading">Trending Books</h2>
            <Link to="/explore?sort=popular" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
              View All
              <i className="bi bi-arrow-right ml-1"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={trendingInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookGrid books={trendingBooks} />
            </motion.div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Ready to Share Your Knowledge?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of users who are already sharing and discovering e-books on BookNest.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-white">
              Create an Account
            </Link>
            <Link to="/explore" className="btn bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500">
              Explore Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
