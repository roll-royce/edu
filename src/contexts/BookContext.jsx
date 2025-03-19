import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  where, 
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();

  // Fetch initial books data
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Get all books
        const booksQuery = query(collection(db, 'books'), orderBy('uploadDate', 'desc'));
        const querySnapshot = await getDocs(booksQuery);
        
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
        }));
        
        setBooks(booksData);
        
        // Set featured books (editor's picks or high-rated books)
        const featuredQuery = query(
          collection(db, 'books'), 
          where('featured', '==', true), 
          limit(5)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        
        if (!featuredSnapshot.empty) {
          const featuredData = featuredSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
          }));
          setFeaturedBooks(featuredData);
        } else {
          // If no featured books, use the first 5 books
          setFeaturedBooks(booksData.slice(0, 5));
        }
        
        // Set trending books (most downloaded)
        const trendingQuery = query(
          collection(db, 'books'), 
          orderBy('downloads', 'desc'), 
          limit(10)
        );
        const trendingSnapshot = await getDocs(trendingQuery);
        
        const trendingData = trendingSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
        }));
        setTrendingBooks(trendingData);
        
        // Set recent books
        const recentQuery = query(
          collection(db, 'books'), 
          orderBy('uploadDate', 'desc'), 
          limit(10)
        );
        const recentSnapshot = await getDocs(recentQuery);
        
        const recentData = recentSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
        }));
        setRecentBooks(recentData);
        
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Get a single book by ID
  const getBook = async (bookId) => {
    try {
      const bookDocRef = doc(db, 'books', bookId);
      const bookDoc = await getDoc(bookDocRef);
      
      if (bookDoc.exists()) {
        // Increment view count
        await updateDoc(bookDocRef, {
          views: increment(1)
        });
        
        // Return book data
        return {
          id: bookDoc.id,
          ...bookDoc.data(),
          uploadDate: bookDoc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
        };
      } else {
        throw new Error('Book not found');
      }
    } catch (error) {
      console.error("Error fetching book:", error);
      throw error;
    }
  };

  // Upload a new book
  const uploadBook = async (file, bookDetails, coverImage) => {
    if (!currentUser) throw new Error('You must be logged in to upload a book');
    
    try {
      // Generate a unique filename
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const filePath = `books/${currentUser.uid}/${fileName}`;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress tracking
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Error handling
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Upload cover image if provided
              let coverImageURL = null;
              if (coverImage) {
                const coverImageName = `${uuidv4()}.jpg`;
                const coverImagePath = `covers/${currentUser.uid}/${coverImageName}`;
                const coverStorageRef = ref(storage, coverImagePath);
                
                await uploadBytesResumable(coverStorageRef, coverImage);
                coverImageURL = await getDownloadURL(coverStorageRef);
              }
              
              // Add book document to Firestore
              const bookData = {
                title: bookDetails.title,
                author: bookDetails.author,
                description: bookDetails.description,
                category: bookDetails.category,
                language: bookDetails.language,
                tags: bookDetails.tags ? bookDetails.tags.split(',').map(tag => tag.trim()) : [],
                pages: bookDetails.pages || 0,
                fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                uploadDate: serverTimestamp(),
                uploadedBy: currentUser.uid,
                uploadedByName: currentUser.displayName || 'Anonymous',
                fileUrl: downloadURL,
                coverImage: coverImageURL,
                downloads: 0,
                views: 0,
                featured: false,
                isPublic: true
              };
              
              const docRef = await addDoc(collection(db, 'books'), bookData);
              
              // Update user's uploadedBooks count
              const userDocRef = doc(db, 'users', currentUser.uid);
              await updateDoc(userDocRef, {
                uploadedBooks: increment(1)
              });
              
              // Add the new book to the books state
              const newBook = {
                id: docRef.id,
                ...bookData,
                uploadDate: new Date().toISOString()
              };
              
              setBooks(prevBooks => [newBook, ...prevBooks]);
              setRecentBooks(prevBooks => [newBook, ...prevBooks].slice(0, 10));
              
              resolve(newBook);
            } catch (error) {
              console.error("Error adding book document:", error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error in upload process:", error);
      throw error;
    }
  };

  // Delete a book
  const deleteBook = async (bookId) => {
    if (!currentUser) throw new Error('You must be logged in to delete a book');
    
    try {
      // Get the book data
      const bookDocRef = doc(db, 'books', bookId);
      const bookDoc = await getDoc(bookDocRef);
      
      if (!bookDoc.exists()) throw new Error('Book not found');
      
      const bookData = bookDoc.data();
      
      // Check if the current user is the owner
      if (bookData.uploadedBy !== currentUser.uid) {
        throw new Error('You can only delete your own books');
      }
      
      // Delete the file from Storage
      if (bookData.fileUrl) {
        const fileRef = ref(storage, bookData.fileUrl);
        await deleteObject(fileRef);
      }
      
      // Delete the cover image from Storage
      if (bookData.coverImage) {
        const coverRef = ref(storage, bookData.coverImage);
        await deleteObject(coverRef);
      }
      
      // Delete the book document from Firestore
      await deleteDoc(bookDocRef);
      
      // Update user's uploadedBooks count
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        uploadedBooks: increment(-1)
      });
      
      // Update the books state
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setRecentBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setTrendingBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      setFeaturedBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      
      toast.success('Book deleted successfully');
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error(error.message || 'Failed to delete book');
      throw error;
    }
  };

  // Increment download count
  const incrementDownload = async (bookId) => {
    try {
      const bookDocRef = doc(db, 'books', bookId);
      
      // Increment download count
      await updateDoc(bookDocRef, {
        downloads: increment(1)
      });
      
      // If user is logged in, increment their total downloads
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          totalDownloads: increment(1)
        });
      }
      
      // Update local state
      setBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, downloads: (book.downloads || 0) + 1 } 
            : book
        )
      );
      
      setTrendingBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, downloads: (book.downloads || 0) + 1 } 
            : book
        )
      );
      
      setRecentBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, downloads: (book.downloads || 0) + 1 } 
            : book
        )
      );
      
      setFeaturedBooks(prevBooks => 
        prevBooks.map(book => 
          book.id === bookId 
            ? { ...book, downloads: (book.downloads || 0) + 1 } 
            : book
        )
      );
      
    } catch (error) {
      console.error("Error incrementing download count:", error);
    }
  };

  // Search books
  const searchBooks = async (searchTerm, filters = {}) => {
    try {
      setLoading(true);
      
      // Base query
      let booksQuery = collection(db, 'books');
      
      // We can't directly search text in Firestore without additional services
      // For a simple implementation, we'll fetch all books and filter client-side
      const querySnapshot = await getDocs(booksQuery);
      
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
      }));
      
      // Apply search term filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(book => 
          book.title.toLowerCase().includes(term) || 
          book.author.toLowerCase().includes(term) || 
          book.description.toLowerCase().includes(term) ||
          book.category.toLowerCase().includes(term) ||
          (book.tags && book.tags.some(tag => tag.toLowerCase().includes(term)))
        );
      }
      
      // Apply category filter
      if (filters.category) {
        results = results.filter(book => book.category === filters.category);
      }
      
      // Apply language filter
      if (filters.language) {
        results = results.filter(book => book.language === filters.language);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            results.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            break;
          case 'oldest':
            results.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
            break;
          case 'popular':
            results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            break;
          case 'az':
            results.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'za':
            results.sort((a, b) => b.title.localeCompare(a.title));
            break;
          default:
            break;
        }
      }
      
      return results;
    } catch (error) {
      console.error("Error searching books:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's uploaded books
  const getUserBooks = async (userId) => {
    try {
      const userBooksQuery = query(
        collection(db, 'books'),
        where('uploadedBy', '==', userId),
        orderBy('uploadDate', 'desc')
      );
      
      const querySnapshot = await getDocs(userBooksQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching user books:", error);
      throw error;
    }
  };

  // Get user's favorite books
  const getFavoriteBooks = async (favoriteIds) => {
    if (!favoriteIds || favoriteIds.length === 0) return [];
    
    try {
      const books = [];
      
      // Firestore doesn't support array contains with more than 10 items
      // So we need to fetch each book individually
      for (const bookId of favoriteIds) {
        const bookDocRef = doc(db, 'books', bookId);
        const bookDoc = await getDoc(bookDocRef);
        
        if (bookDoc.exists()) {
          books.push({
            id: bookDoc.id,
            ...bookDoc.data(),
            uploadDate: bookDoc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
          });
        }
      }
      
      return books;
    } catch (error) {
      console.error("Error fetching favorite books:", error);
      throw error;
    }
  };

  // Get related books
  const getRelatedBooks = async (bookId, category, limit = 4) => {
    try {
      const relatedQuery = query(
        collection(db, 'books'),
        where('category', '==', category),
        orderBy('downloads', 'desc'),
        limit(limit + 1) // +1 to account for the current book
      );
      
      const querySnapshot = await getDocs(relatedQuery);
      
      const relatedBooks = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadDate: doc.data().uploadDate?.toDate().toISOString() || new Date().toISOString()
        }))
        .filter(book => book.id !== bookId); // Remove the current book
      
      return relatedBooks.slice(0, limit);
    } catch (error) {
      console.error("Error fetching related books:", error);
      return [];
    }
  };

  const value = {
    books,
    featuredBooks,
    trendingBooks,
    recentBooks,
    loading,
    getBook,
    uploadBook,
    deleteBook,
    incrementDownload,
    searchBooks,
    getUserBooks,
    getFavoriteBooks,
    getRelatedBooks
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}
