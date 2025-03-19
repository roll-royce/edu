import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BookCard = ({ book }) => {
  return (
    <motion.div 
      className="card h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
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
        <h3 className="font-medium text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{book.author}</p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mb-4 line-clamp-2">{book.description}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <i className="bi bi-download mr-1"></i>
            <span>{book.downloads}</span>
          </div>
          
          <Link 
            to={`/books/${book.id}`} 
            className="btn btn-primary py-1 px-3 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default BookCard
