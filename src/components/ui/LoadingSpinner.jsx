import { motion } from 'framer-motion'

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-800 bg-opacity-75 dark:bg-opacity-75 z-50">
        <SpinnerContent />
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <SpinnerContent />
    </div>
  )
}

const SpinnerContent = () => (
  <div className="flex flex-col items-center">
    <motion.div
      className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <p className="mt-4 text-primary-600 dark:text-primary-400 font-medium">Loading...</p>
  </div>
)

export default LoadingSpinner
