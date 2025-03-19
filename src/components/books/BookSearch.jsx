import { useState, useEffect } from 'react'

const BookSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  
  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for books, authors, or categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pr-12 py-3"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
        >
          <i className="bi bi-search text-xl"></i>
        </button>
      </div>
    </form>
  )
}

export default BookSearch
