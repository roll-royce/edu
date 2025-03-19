import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookGrid from '../components/books/BookGrid'
import BookFilter from '../components/books/BookFilter'
import BookSearch from '../components/books/BookSearch'
import { useBooks } from '../contexts/BookContext'
import { motion } from 'framer-motion'

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { searchBooks, loading } = useBooks()
  const [books, setBooks] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Get initial search params
  const initialCategory = searchParams.get('category') || ''
  const initialSort = searchParams.get('sort') || 'newest'
  const initialSearch = searchParams.get('search') || ''
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsSearching(true)
        
        const filters = {
          category: initialCategory,
          sortBy: initialSort
        }
        
        const results = await searchBooks(initialSearch, filters)
        setBooks(results)
      } catch (error) {
        console.error('Error searching books:', error)
      } finally {
        setIsSearching(false)
      }
    }
    
    fetchBooks()
  }, [initialCategory, initialSort, initialSearch, searchBooks])
  
  const handleFilterChange = (filters) => {
    const newParams = {}
    if (filters.category) newParams.category = filters.category
    if (filters.sortBy) newParams.sort = filters.sortBy
    if (initialSearch) newParams.search = initialSearch
    
    setSearchParams(newParams)
  }
  
  const handleSearch = (searchTerm) => {
    const newParams = { ...Object.fromEntries(searchParams) }
    if (searchTerm) {
      newParams.search = searchTerm
    } else {
      delete newParams.search
    }
    
    setSearchParams(newParams)
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Explore Books</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover e-books shared by our community
        </p>
      </div>
      
      <div className="mb-6">
        <BookSearch onSearch={handleSearch} initialValue={initialSearch} />
      </div>
      
      <BookFilter onFilterChange={handleFilterChange} initialFilters={{ category: initialCategory, sortBy: initialSort }} />
      
      {loading || isSearching ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching books...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BookGrid 
            books={books} 
            title={initialSearch ? `Search results for "${initialSearch}"` : null}
          />
          
          {books.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
              <i className="bi bi-search text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Books Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                We couldn't find any books matching your search criteria.
              </p>
              <button 
                onClick={() => setSearchParams({})}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Explore
