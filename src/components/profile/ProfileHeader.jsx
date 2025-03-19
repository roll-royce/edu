import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const ProfileHeader = ({ user, userProfile }) => {
  const { updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    bio: userProfile?.bio || 'No bio yet',
    website: userProfile?.website || '',
    twitter: userProfile?.twitter || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      // Update profile in Firebase
      await updateUserProfile({
        name: profile.name,
        bio: profile.bio,
        website: profile.website,
        twitter: profile.twitter
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white dark:bg-dark-700 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <img 
            src={user?.photoURL || `https://placehold.co/200x200/0ea5e9/ffffff?text=${user?.displayName?.charAt(0) || 'U'}`} 
            alt={user?.displayName || 'User'}
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-dark-600 shadow-md"
            crossOrigin="anonymous"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/200x200/0ea5e9/ffffff?text=${user?.displayName?.charAt(0) || 'U'}`;
            }}
          />
          
          {!isEditing && (
            <button className="absolute bottom-0 right-0 bg-gray-100 dark:bg-dark-600 rounded-full p-1 shadow-sm border border-gray-200 dark:border-dark-500">
              <i className="bi bi-camera text-gray-600 dark:text-gray-400"></i>
            </button>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  className="input"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Username
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleChange}
                    className="input"
                    placeholder="username"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{user?.displayName || 'User'}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Member since {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'recently'}
                  </p>
                </div>
                
                <motion.button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline mt-3 md:mt-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-pencil mr-2"></i>
                  Edit Profile
                </motion.button>
              </div>
              
              <p className="mt-4 text-gray-700 dark:text-gray-300">
                {profile.bio}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-4">
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center"
                  >
                    <i className="bi bi-globe mr-1"></i>
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                
                {profile.twitter && (
                  <a 
                    href={`https://twitter.com/${profile.twitter.replace('@', '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm flex items-center"
                  >
                    <i className="bi bi-twitter mr-1"></i>
                    @{profile.twitter.replace('@', '')}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
