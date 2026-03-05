import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, BookOpen, Download } from 'lucide-react';
import { Book } from '@/data/books';
import { useBooks } from '@/context/BookContext';
import { Button } from '@/components/ui/enhanced-button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BookCardProps {
  book: Book;
  className?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, className }) => {
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isInWishlist = state.wishlist.includes(book.id);
  const isInCart = state.cart.some(item => item.book.id === book.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: book.id });
      toast({ title: "Removed from Wishlist" });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: book.id });
      toast({ title: "Added to Wishlist" });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: book });
    toast({
      title: "Added to Cart",
      description: `${book.title} has been added to your cart.`,
    });
  };
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch({ type: 'DOWNLOAD_BOOK', payload: book.id });
    toast({
      title: "Download Started",
      description: `Downloading "${book.title}"...`,
    });
  };

  const handleReadBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book/${book.id}`);
  };

  return (
    <motion.div
      className={cn(
        "group bg-card rounded-2xl shadow-card hover:shadow-glow transition-smooth overflow-hidden flex flex-col justify-between",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Top section with image and details */}
      <div onClick={handleReadBook} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-64 object-cover group-hover:scale-110 transition-smooth"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownload}
                className="transform transition-bouncy"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </motion.div>
          </div>
          
          {/* Genre Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-gradient-hero text-white px-2 py-1 rounded-lg text-xs font-medium">
              {book.genre}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg truncate text-card-foreground" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            by {book.author}
          </p>
        </div>
      </div>
      
      {/* Bottom section with price and actions */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{book.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">{book.year}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-lg font-bold text-primary">
              ₹{book.price}
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isInCart ? "success" : "hero"}
                size="sm"
                onClick={handleAddToCart}
                className="hover:shadow-glow"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isInCart ? "In Cart" : "Buy"}
              </Button>
            </motion.div>
          </div>
          
          <div className="flex space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className={cn("p-2 hover:shadow-glow", isInWishlist && "text-red-500")}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReadBook}
                className="p-2 hover:shadow-glow"
              >
                <BookOpen className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

