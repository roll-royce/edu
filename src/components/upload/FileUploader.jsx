import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { pdfjs } from 'react-pdf'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const FileUploader = ({ onFileSelected, onCoverImageExtracted }) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const canvasRef = useRef(null)
  
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are accepted')
      return
    }
    
    // Check file size (100MB = 100 * 1024 * 1024 bytes)
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size exceeds 100MB limit')
      return
    }
    
    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Extract first page as cover image
      const coverImageBlob = await extractCoverImage(file)
      setCoverImage(coverImageBlob)
      
      if (onCoverImageExtracted) {
        onCoverImageExtracted(coverImageBlob)
      }
      
      // Simulate upload progress
      simulateUpload(file)
    } catch (error) {
      console.error('Error extracting cover image:', error)
      toast.error('Failed to extract cover image')
      
      // Continue with upload even if cover extraction fails
      simulateUpload(file)
    }
  }, [onCoverImageExtracted])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false
  })
  
  const extractCoverImage = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result)
          
          // Load the PDF document
          const loadingTask = pdfjs.getDocument(typedArray)
          const pdf = await loadingTask.promise
          
          // Get the first page
          const page = await pdf.getPage(1)
          
          // Render the page to a canvas
          const viewport = page.getViewport({ scale: 1.5 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width
          
          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            resolve(blob)
          }, 'image/jpeg', 0.75)
        } catch (error) {
          console.error('Error rendering PDF:', error)
          reject(error)
        }
      }
      
      fileReader.onerror = function() {
        reject(new Error('Failed to read file'))
      }
      
      fileReader.readAsArrayBuffer(file)
    })
  }
  
  const simulateUpload = (file) => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            onFileSelected(file, coverImage)
            toast.success('File processed successfully!')
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 300)
  }
  
  const cancelUpload = () => {
    setSelectedFile(null)
    setCoverImage(null)
    setIsUploading(false)
    setUploadProgress(0)
  }
  
  return (
    <div className="w-full">
      {!isUploading && !selectedFile ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center">
            <i className={`bi bi-cloud-upload text-5xl mb-4 ${isDragActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'}`}></i>
            
            <h3 className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              or click to browse files
            </p>
            
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Maximum file size: 100MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <i className="bi bi-file-earmark-pdf text-2xl text-red-500 mr-3"></i>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(selectedFile?.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            
            {isUploading ? (
              <button 
                onClick={cancelUpload}
                className="ml-4 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            ) : (
              <i className="bi bi-check-circle-fill text-green-500 ml-4"></i>
            )}
          </div>
          
          {coverImage && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Preview:
              </p>
              <div className="w-32 h-44 bg-gray-100 dark:bg-dark-600 rounded-md overflow-hidden">
                <img 
                  src={URL.createObjectURL(coverImage)} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          {isUploading && (
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>Processing...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-primary-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Hidden canvas for PDF rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default FileUploader
