import BookCard from './BookCard'

const BookGrid = ({ books, title }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-10">
        <i className="bi bi-journal-x text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No books found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }
  
  return (
    <div className="py-6">
      {title && (
        <h2 className="text-2xl font-heading font-semibold mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}

export default BookGrid
