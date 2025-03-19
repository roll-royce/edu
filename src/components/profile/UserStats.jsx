import { motion } from 'framer-motion'

const UserStats = ({ stats }) => {
  const statItems = [
    { 
      icon: 'bi-book', 
      label: 'Uploaded Books', 
      value: stats.uploadedBooks,
      color: 'bg-blue-500'
    },
    { 
      icon: 'bi-download', 
      label: 'Total Downloads', 
      value: stats.totalDownloads,
      color: 'bg-green-500'
    },
    { 
      icon: 'bi-eye', 
      label: 'Total Views', 
      value: stats.totalViews,
      color: 'bg-purple-500'
    },
    { 
      icon: 'bi-heart', 
      label: 'Favorites', 
      value: stats.favorites,
      color: 'bg-red-500'
    }
  ]
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          className="card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white`}>
              <i className={`bi ${item.icon} text-xl`}></i>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default UserStats
