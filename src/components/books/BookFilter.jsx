import { useState, useEffect } from 'react'

const BookFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    sortBy: initialFilters.sortBy || 'newest'
  })
  
  useEffect(() => {
    setFilters({
      category: initialFilters.category || '',
      sortBy: initialFilters.sortBy || 'newest'
    })
  }, [initialFilters])
  
  const categories = [
    'All Categories',
    'Fiction',
    'Non-Fiction',
    'Science & Technology',
    'Business',
    'Academic',
    'Self-Help',
    'Biography',
    'History'
  ]
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' }
  ]
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }
  
  return (
    <div className="bg-white dark:bg-dark-700 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="input"
          >
            {categories.map((category, index) => (
              <option key={index} value={index === 0 ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="input"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default BookFilter
