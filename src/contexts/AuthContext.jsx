import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile data from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // Create user profile if it doesn't exist
            const newUserProfile = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              photoURL: user.photoURL || null,
              bio: '',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              uploadedBooks: 0,
              totalDownloads: 0,
              totalViews: 0,
              favorites: []
            };
            
            await setDoc(userDocRef, newUserProfile);
            setUserProfile(newUserProfile);
          }
          
          // Update last login time
          await updateDoc(userDocRef, {
            lastLogin: serverTimestamp()
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register function
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        photoURL: null,
        bio: '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        uploadedBooks: 0,
        totalDownloads: 0,
        totalViews: 0,
        favorites: []
      });
      
      toast.success('Registration successful!');
      return user;
    } catch (error) {
      let errorMessage = 'Registration failed';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already in use';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      let errorMessage = 'Login failed';
      
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Google sign-in
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          photoURL: user.photoURL,
          bio: '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          uploadedBooks: 0,
          totalDownloads: 0,
          totalViews: 0,
          favorites: []
        });
      } else {
        // Update last login time
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        });
      }
      
      toast.success('Login successful!');
      return user;
    } catch (error) {
      toast.error('Google sign-in failed');
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error('Failed to send password reset email');
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Update display name if provided
      if (data.name && data.name !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: data.name
        });
      }
      
      // Update Firestore document
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Fetch updated profile
      const updatedDoc = await getDoc(userDocRef);
      setUserProfile(updatedDoc.data());
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  // Add book to favorites
  const toggleFavorite = async (bookId) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) throw new Error('User profile not found');
      
      const favorites = userDoc.data().favorites || [];
      let newFavorites;
      let message;
      
      if (favorites.includes(bookId)) {
        // Remove from favorites
        newFavorites = favorites.filter(id => id !== bookId);
        message = 'Removed from favorites';
      } else {
        // Add to favorites
        newFavorites = [...favorites, bookId];
        message = 'Added to favorites';
      }
      
      await updateDoc(userDocRef, {
        favorites: newFavorites
      });
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        favorites: newFavorites
      }));
      
      toast.success(message);
      return newFavorites;
    } catch (error) {
      toast.error('Failed to update favorites');
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    register,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
