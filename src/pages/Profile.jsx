import { useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { motion } from 'framer-motion'
import BookGrid from '../components/books/BookGrid'
import ProfileHeader from '../components/profile/ProfileHeader'
import UserStats from '../components/profile/UserStats'
import { useAuth } from '../contexts/AuthContext'
import { useBooks } from '../contexts/BookContext'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import toast from 'react-hot-toast'

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const Profile = () => {
  const { currentUser, userProfile } = useAuth()
  const { getUserBooks, getFavoriteBooks } = useBooks()
  
  const [userBooks, setUserBooks] = useState([])
  const [favoriteBooks, setFavoriteBooks] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return
      
      try {
        setLoading(true)
        
        // Fetch user's uploaded books
        const books = await getUserBooks(currentUser.uid)
        setUserBooks(books)
        
        // Fetch user's favorite books
        if (userProfile && userProfile.favorites && userProfile.favorites.length > 0) {
          const favorites = await getFavoriteBooks(userProfile.favorites)
          setFavoriteBooks(favorites)
        }
        
        // For demo, just use some of the user's books as recently viewed
        setRecentlyViewed(books.slice(0, 3))
        
      } catch (error) {
        console.error('Error fetching user data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [currentUser, userProfile, getUserBooks, getFavoriteBooks])
  
  // Prepare chart data
  const categoryData = {
    labels: userBooks.reduce((categories, book) => {
      if (!categories.includes(book.category)) {
        categories.push(book.category)
      }
      return categories
    }, []),
    datasets: [
      {
        label: 'Books by Category',
        data: userBooks.reduce((counts, book) => {
          const index = counts.findIndex(item => item.category === book.category)
          if (index >= 0) {
            counts[index].count++
          } else {
            counts.push({ category: book.category, count: 1 })
          }
          return counts
        }, []).map(item => item.count),
        backgroundColor: [
          'rgba(14, 165, 233, 0.7)',
          'rgba(217, 70, 239, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(79, 70, 229, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  }
  
  const downloadsData = {
    labels: userBooks.slice(0, 5).map(book => book.title.length > 15 ? book.title.substring(0, 15) + '...' : book.title),
    datasets: [
      {
        label: 'Downloads',
        data: userBooks.slice(0, 5).map(book => book.downloads),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
      },
    ],
  }
  
  const userStats = {
    uploadedBooks: userBooks.length,
    totalDownloads: userBooks.reduce((sum, book) => sum + (book.downloads || 0), 0),
    totalViews: userBooks.reduce((sum, book) => sum + (book.views || 0), 0),
    favorites: favoriteBooks.length
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <ProfileHeader user={currentUser} userProfile={userProfile} />
          
          <div className="mb-8">
            <UserStats stats={userStats} />
          </div>
          
          <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
            <Tab.List className="flex space-x-1 rounded-xl bg-white dark:bg-dark-700 p-1 shadow-sm mb-6">
              {['My Uploads', 'Favorites', 'Analytics', 'Recently Viewed'].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-all duration-200
                     ${
                       selected
                         ? 'bg-primary-600 text-white shadow'
                         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                     }`
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {userBooks.length > 0 ? (
                    <BookGrid books={userBooks} />
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
                      <i className="bi bi-cloud-upload text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Uploads Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You haven't uploaded any e-books yet. Start sharing your knowledge!
                      </p>
                      <a href="/upload" className="btn btn-primary">
                        Upload Your First Book
                      </a>
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>
              
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {favoriteBooks.length > 0 ? (
                    <BookGrid books={favoriteBooks} />
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
                      <i className="bi bi-heart text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Favorites Yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You haven't added any books to your favorites yet.
                      </p>
                      <a href="/explore" className="btn btn-primary">
                        Explore Books
                      </a>
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>
              
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {userBooks.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4">Books by Category</h3>
                        <div className="h-64">
                          <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6">
                        <h3 className="text-xl font-semibold mb-4">Top Downloads</h3>
                        <div className="h-64">
                          <Bar 
                            data={downloadsData} 
                            options={{ 
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true
                                }
                              }
                            }} 
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold mb-4">Activity Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 dark:bg-dark-600 rounded-lg p-4">
                            <h4 className="text-lg font-medium mb-2">Most Popular Book</h4>
                            {userBooks.length > 0 ? (
                              <div>
                                <p className="font-semibold">{userBooks.sort((a, b) => b.downloads - a.downloads)[0].title}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {userBooks.sort((a, b) => b.downloads - a.downloads)[0].downloads} downloads
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">No data available</p>
                            )}
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-dark-600 rounded-lg p-4">
                            <h4 className="text-lg font-medium mb-2">Most Recent Upload</h4>
                            {userBooks.length > 0 ? (
                              <div>
                                <p className="font-semibold">{userBooks.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0].title}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {new Date(userBooks.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))[0].uploadDate).toLocaleDateString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">No data available</p>
                            )}
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-dark-600 rounded-lg p-4">
                            <h4 className="text-lg font-medium mb-2">Most Viewed Book</h4>
                            {userBooks.length > 0 ? (
                              <div>
                                <p className="font-semibold">{userBooks.sort((a, b) => b.views - a.views)[0].title}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {userBooks.sort((a, b) => b.views - a.views)[0].views} views
                                </p>
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400">No data available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
                      <i className="bi bi-bar-chart text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Analytics Available</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Upload books to see analytics about your content.
                      </p>
                      <a href="/upload" className="btn btn-primary">
                        Upload a Book
                      </a>
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>
              
              <Tab.Panel>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {recentlyViewed.length > 0 ? (
                    <BookGrid books={recentlyViewed} />
                  ) : (
                    <div className="text-center py-16 bg-white dark:bg-dark-700 rounded-xl shadow-sm">
                      <i className="bi bi-clock-history text-5xl text-gray-400 dark:text-gray-600 mb-4"></i>
                      <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Recently Viewed Books</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        You haven't viewed any books recently.
                      </p>
                      <a href="/explore" className="btn btn-primary">
                        Explore Books
                      </a>
                    </div>
                  )}
                </motion.div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </>
      )}
    </div>
  )
}

export default Profile
