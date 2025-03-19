import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUploader from '../components/upload/FileUploader'
import toast from 'react-hot-toast'
import { useBooks } from '../contexts/BookContext'
import { useAuth } from '../contexts/AuthContext'
import Confetti from 'react-confetti'

const Upload = () => {
  const navigate = useNavigate()
  const { uploadBook } = useBooks()
  const { currentUser } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [bookDetails, setBookDetails] = useState({
    title: '',
    author: '',
    category: '',
    language: 'English',
    description: '',
    tags: '',
    pages: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science & Technology',
    'Business',
    'Academic',
    'Self-Help',
    'Biography',
    'History',
    'Other'
  ]
  
  const languages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Russian',
    'Arabic',
    'Other'
  ]
  
  const handleFileSelected = (file, extractedCoverImage) => {
    setSelectedFile(file)
    
    if (extractedCoverImage) {
      setCoverImage(extractedCoverImage)
    }
    
    // Auto-fill title from filename (remove extension)
    const fileName = file.name.replace(/\.[^/.]+$/, '')
    setBookDetails(prev => ({
      ...prev,
      title: fileName
    }))
  }
  
  const handleCoverImageExtracted = (image) => {
    setCoverImage(image)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Please upload a PDF file')
      return
    }
    
    if (!bookDetails.title || !bookDetails.author || !bookDetails.category) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Upload book to Firebase
      await uploadBook(selectedFile, bookDetails, coverImage)
      
      // Show success state
      setUploadSuccess(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false)
        navigate('/profile')
      }, 3000)
    } catch (error) {
      console.error('Error uploading book:', error)
      toast.error('Failed to upload book. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (uploadSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Confetti 
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-check-lg text-4xl text-green-500"></i>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Upload Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Your e-book has been uploaded and is now available on BookNest.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate(`/profile`)}
              className="btn btn-primary"
            >
              Go to My Profile
            </button>
            <button
              onClick={() => {
                setUploadSuccess(false)
                setSelectedFile(null)
                setCoverImage(null)
                setBookDetails({
                  title: '',
                  author: '',
                  category: '',
                  language: 'English',
                  description: '',
                  tags: '',
                  pages: ''
                })
              }}
              className="btn btn-outline"
            >
              Upload Another Book
            </button>
          </div>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading mb-2">Upload E-Book</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your knowledge with the community
        </p>
      </div>
      
      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Upload PDF File</h2>
            <FileUploader 
              onFileSelected={handleFileSelected} 
              onCoverImageExtracted={handleCoverImageExtracted}
            />
          </div>
          
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">2. Book Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={bookDetails.title}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={bookDetails.author}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={bookDetails.category}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language *
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={bookDetails.language}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      {languages.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="pages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Number of Pages
                    </label>
                    <input
                      type="number"
                      id="pages"
                      name="pages"
                      value={bookDetails.pages}
                      onChange={handleInputChange}
                      className="input"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={bookDetails.tags}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="e.g. programming, javascript, web development"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={bookDetails.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="input"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    * Required fields
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setCoverImage(null)
                        setBookDetails({
                          title: '',
                          author: '',
                          category: '',
                          language: 'English',
                          description: '',
                          tags: '',
                          pages: ''
                        })
                      }}
                      className="btn btn-outline"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-upload mr-2"></i>
                          Upload Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Upload
