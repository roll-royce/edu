import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PDFViewer from '../components/books/PDFViewer'
import QRCodeGenerator from '../components/books/QRCodeGenerator'
import BookGrid from '../components/books/BookGrid'
import { useBooks } from '../contexts/BookContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { ShareButtons } from '../components/books/ShareButtons'

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBook, getRelatedBooks, incrementDownload, deleteBook } = useBooks()
  const { currentUser, userProfile, toggleFavorite } = useAuth()
  
  const [book, setBook] = useState(null)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('info') // 'info', 'read', 'qrcode'
  const [isFavorite, setIsFavorite] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)
        
        // Get book details
        const bookData = await getBook(id)
        setBook(bookData)
        
        // Check if current user is the owner
        if (currentUser && bookData.uploadedBy === currentUser.uid) {
          setIsOwner(true)
        }
        
        // Check if book is in user's favorites
        if (userProfile && userProfile.favorites && userProfile.favorites.includes(id)) {
          setIsFavorite(true)
        }
        
        // Get related books
        const related = await getRelatedBooks(id, bookData.category)
        setRelatedBooks(related)
        
      } catch (error) {
        console.error('Error fetching book:', error)
        toast.error('Failed to load book details')
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookData()
  }, [id, currentUser, userProfile, getBook, getRelatedBooks])
  
  const handleDownload = async () => {
    if (!book) return
    
    try {
      // Increment download count
      await incrementDownload(id)
      
      // Create a temporary anchor element
      const link = document.createElement('a')
      link.href = book.fileUrl
      link.download = `${book.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('Download started')
    } catch (error) {
      console.error('Error downloading book:', error)
      toast.error('Download failed')
    }
  }
  
  const handleToggleFavorite = async () => {
    if (!currentUser) {
      toast.error('Please log in to add books to favorites')
      navigate('/login')
      return
    }
    
    try {
      await toggleFavorite(id)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }
  
  const handleDeleteBook = async () => {
    try {
      await deleteBook(id)
      toast.success('Book deleted successfully')
      navigate('/profile')
    } catch (error) {
      console.error('Error deleting book:', error)
      toast.error('Failed to delete book')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <i className="bi bi-exclamation-triangle text-5xl text-yellow-500 mb-4"></i>
        <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The book you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/explore" className="btn btn-primary">
          Explore Other Books
        </Link>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/explore" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
          <i className="bi bi-arrow-left mr-2"></i>
          Back to Explore
        </Link>
      </div>
      
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="md:col-span-1">
              <motion.div 
                className="relative pt-[140%] overflow-hidden rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={book.coverImage || `https://placehold.co/400x600/0ea5e9/ffffff?text=${encodeURIComponent(book.title)}`} 
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x600/0ea5e9/ffffff?text=${encodeURIComponent(book.title)}`;
                  }}
                />
              </motion.div>
              
              <div className="mt-6 space-y-4">
                <button 
                  onClick={handleDownload}
                  className="btn btn-primary w-full flex items-center justify-center"
                >
                  <i className="bi bi-download mr-2"></i>
                  Download PDF
                </button>
                
                <button 
                  onClick={() => setViewMode(viewMode === 'qrcode' ? 'info' : 'qrcode')}
                  className="btn btn-outline w-full flex items-center justify-center"
                >
                  <i className="bi bi-qr-code mr-2"></i>
                  {viewMode === 'qrcode' ? 'Hide QR Code' : 'Show QR Code'}
                </button>
                
                {isOwner && (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn bg-red-600 hover:bg-red-700 text-white w-full flex items-center justify-center"
                  >
                    <i className="bi bi-trash mr-2"></i>
                    Delete Book
                  </button>
                )}
              </div>
            </div>
            
            {/* Book Details */}
            <div className="md:col-span-2">
              {viewMode === 'info' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="badge badge-primary">
                      {book.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Uploaded on {new Date(book.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">by {book.author}</p>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <i className="bi bi-download text-gray-500 dark:text-gray-400 mr-2"></i>
                      <span>{book.downloads} downloads</span>
                    </div>
                    <div className="flex items-center">
                      <i className="bi bi-eye text-gray-500 dark:text-gray-400 mr-2"></i>
                      <span>{book.views} views</span>
                    </div>
                    <div className="flex items-center">
                      <i className="bi bi-file-earmark text-gray-500 dark:text-gray-400 mr-2"></i>
                      <span>{book.pages} pages</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {book.description}
                    </p>
                  </div>
                  
                  {book.tags && book.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {book.tags.map((tag, index) => (
                          <Link 
                            key={index} 
                            to={`/explore?search=${encodeURIComponent(tag)}`}
                            className="badge badge-secondary"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Language</p>
                        <p className="font-medium">{book.language}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">File Size</p>
                        <p className="font-medium">{book.fileSize}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Format</p>
                        <p className="font-medium">PDF</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Uploaded By</p>
                        <p className="font-medium">{book.uploadedByName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setViewMode('read')}
                      className="btn btn-primary flex items-center"
                    >
                      <i className="bi bi-book mr-2"></i>
                      Read Online
                    </button>
                    <button 
                      onClick={handleToggleFavorite}
                      className={`btn btn-outline flex items-center ${isFavorite ? 'text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10' : ''}`}
                    >
                      <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} mr-2`}></i>
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                  </div>
                </motion.div>
              )}
              
              {viewMode === 'read' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{book.title}</h2>
                    <button 
                      onClick={() => setViewMode('info')}
                      className="btn btn-outline py-1 px-3"
                    >
                      <i className="bi bi-x-lg mr-1"></i>
                      Close Reader
                    </button>
                  </div>
                  
                  <PDFViewer pdfUrl={book.fileUrl} />
                </motion.div>
              )}
              
              {viewMode === 'qrcode' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-2xl font-bold mb-6">Share This Book</h2>
                  <QRCodeGenerator url={window.location.href} bookTitle={book.title} />
                  
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Or share via social media
                    </p>
                    <ShareButtons url={window.location.href} title={book.title} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold font-heading mb-6">Related Books</h2>
          <BookGrid books={relatedBooks} />
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-white dark:bg-dark-700 rounded-lg shadow-lg max-w-md w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Delete Book</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteBook}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BookDetails
