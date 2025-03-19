import { useRef } from 'react'
import QRCode from 'qrcode.react'

const QRCodeGenerator = ({ url, bookTitle }) => {
  const qrRef = useRef()
  
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas')
    const image = canvas.toDataURL("image/png")
    const link = document.createElement('a')
    link.href = image
    link.download = `${bookTitle.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-dark-700 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Scan to Download</h3>
      
      <div ref={qrRef} className="bg-white p-2 rounded-lg mb-4">
        <QRCode 
          value={url} 
          size={180}
          level="H"
          includeMargin={true}
          fgColor="#0ea5e9"
        />
      </div>
      
      <button 
        onClick={downloadQRCode}
        className="btn btn-outline flex items-center"
      >
        <i className="bi bi-download mr-2"></i>
        Download QR Code
      </button>
    </div>
  )
}

export default QRCodeGenerator
