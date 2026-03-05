import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Book, booksData } from '@/data/books';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  isAdmin?: boolean;
}

// Cart item interface
interface CartItem {
  book: Book;
  quantity: number;
}

// Application state interface
interface BookState {
  user: User | null;
  isAuthenticated: boolean;
  books: Book[];
  wishlist: string[];
  cart: CartItem[];
  currentlyReading: string[];
  completed: string[];
  downloaded: string[];
  selectedGenre: string;
  searchQuery: string;
  isLoading: boolean;
}

// Action types
type BookAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_TO_CART'; payload: Book }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_GENRE_FILTER'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'DOWNLOAD_BOOK'; payload: string }
  | { type: 'START_READING'; payload: string }
  | { type: 'COMPLETE_BOOK'; payload: string };

// Initial state
const initialState: BookState = {
  user: null,
  isAuthenticated: false,
  books: booksData, // Reverted to using local mock data
  wishlist: [],
  cart: [],
  currentlyReading: [],
  completed: [],
  downloaded: [], 
  selectedGenre: '',
  searchQuery: '',
  isLoading: false, // Set isLoading to false
};

// Reducer function
function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        cart: [],
        wishlist: [],
      };
    
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
    
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload),
      };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.book.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.book.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { book: action.payload, quantity: 1 }],
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.book.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.book.id === action.payload.bookId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    
    case 'SET_GENRE_FILTER':
      return {
        ...state,
        selectedGenre: action.payload,
      };
    
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id ? action.payload : book
        ),
      };
    
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
        wishlist: state.wishlist.filter(id => id !== action.payload),
        cart: state.cart.filter(item => item.book.id !== action.payload),
      };
    
    case 'DOWNLOAD_BOOK':
      if (state.downloaded.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        downloaded: [...state.downloaded, action.payload],
      };
    
    case 'START_READING':
      if (state.currentlyReading.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        currentlyReading: [...state.currentlyReading, action.payload],
        completed: state.completed.filter(id => id !== action.payload),
      };

    case 'COMPLETE_BOOK':
      if (state.completed.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        currentlyReading: state.currentlyReading.filter(id => id !== action.payload),
        completed: [...state.completed, action.payload],
      };
    
    default:
      return state;
  }
}

// Create context
const BookContext = createContext<{
  state: BookState;
  dispatch: React.Dispatch<BookAction>;
} | null>(null);

// Provider component
export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  return (
    <BookContext.Provider value={{ state, dispatch }}>
      {children}
    </BookContext.Provider>
  );
};

// Custom hook to use the context
export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};

// Helper functions
export const useFilteredBooks = () => {
  const { state } = useBooks();
  
  let filteredBooks = state.books;
  
  if (state.selectedGenre) {
    filteredBooks = filteredBooks.filter(book => book.genre === state.selectedGenre);
  }
  
  if (state.searchQuery) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }
  
  return filteredBooks;
};

