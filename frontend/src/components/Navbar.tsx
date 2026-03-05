import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  BookOpen,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { useBooks } from '@/context/BookContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDark, setIsDark] = useState(false);

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery });
    navigate('/');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Reverted logout function
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <nav className="bg-card/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gradient">Book Nest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-bold text-gradient hover:opacity-80 transition-smooth">Home</Link>
            <Link to="/library" className="font-bold text-gradient hover:opacity-80 transition-smooth">My Library</Link>
            <Link to="/shop" className="font-bold text-gradient hover:opacity-80 transition-smooth">Shop</Link>
            <Link to="/community" className="font-bold text-gradient hover:opacity-80 transition-smooth">Community</Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/library"><Button variant="ghost" size="icon" className="relative"><Heart className="h-5 w-5" />{wishlistCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-accent">{wishlistCount}</Badge>}</Button></Link>
            <Link to="/shop"><Button variant="ghost" size="icon" className="relative"><ShoppingCart className="h-5 w-5" />{cartItemsCount > 0 && <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-hero">{cartItemsCount}</Badge>}</Button></Link>

            {state.isAuthenticated && state.user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                <Link to="/profile" className="cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {state.user.name ? state.user.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button variant="hero" size="sm">Sign Up</Button></Link>
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex items-center space-x-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input type="text" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/></div></form>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="font-bold text-gradient hover:opacity-80 transition-smooth py-2">Home</Link>
                <Link to="/library" className="font-bold text-gradient hover:opacity-80 transition-smooth py-2">My Library</Link>
                <Link to="/shop" className="font-bold text-gradient hover:opacity-80 transition-smooth py-2">Shop</Link>
                <Link to="/community" className="font-bold text-gradient hover:opacity-80 transition-smooth py-2">Community</Link>
              </div>
              {!state.isAuthenticated && (<div className="flex space-x-2 pt-2"><Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link><Link to="/register" className="flex-1"><Button variant="hero" className="w-full">Sign Up</Button></Link></div>)}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

