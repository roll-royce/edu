import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import LoadingSpinner from '../ui/LoadingSpinner'

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [scale, setScale] = useState(1.0)

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
  }

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset
      return Math.min(Math.max(1, newPageNumber), numPages)
    })
  }

  const previousPage = () => changePage(-1)
  const nextPage = () => changePage(1)

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 2.0))
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.6))

  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-100 dark:bg-dark-700 rounded-lg p-4 mb-4 w-full overflow-auto">
        {loading && <LoadingSpinner />}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error('Error loading PDF:', error)}
          loading={<LoadingSpinner />}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-lg"
          />
        </Document>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white dark:bg-dark-800 rounded-lg p-3 shadow-sm">
        <div className="flex items-center space-x-2 mb-3 sm:mb-0">
          <button 
            onClick={zoomOut} 
            disabled={scale <= 0.6}
            className="btn btn-outline py-1 px-2"
          >
            <i className="bi bi-zoom-out"></i>
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button 
            onClick={zoomIn} 
            disabled={scale >= 2.0}
            className="btn btn-outline py-1 px-2"
          >
            <i className="bi bi-zoom-in"></i>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={previousPage} 
            disabled={pageNumber <= 1}
            className="btn btn-outline py-1 px-3"
          >
            <i className="bi bi-chevron-left mr-1"></i>
            Previous
          </button>
          
          <p className="text-sm">
            Page <span className="font-medium">{pageNumber}</span> of <span className="font-medium">{numPages}</span>
          </p>
          
          <button 
            onClick={nextPage} 
            disabled={pageNumber >= numPages}
            className="btn btn-outline py-1 px-3"
          >
            Next
            <i className="bi bi-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
