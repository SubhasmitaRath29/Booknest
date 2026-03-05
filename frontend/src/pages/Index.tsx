import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Star, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { BookCard } from '@/components/BookCard';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { useBooks, useFilteredBooks } from '@/context/BookContext';
import { genres } from '@/data/books';
import { cn } from '@/lib/utils';

// A new, more subtle background animation for content sections
const SubtleAnimatedBackground = () => (
  <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
    <motion.div
      className="absolute top-1/4 -left-24 w-96 h-96 bg-secondary/10 rounded-full filter blur-3xl opacity-50"
      animate={{
        x: [-100, 100, -100],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 40,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute bottom-1/4 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"
      animate={{
        x: [100, -100, 100],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 50,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  </div>
);


const Index = () => {
  const { state, dispatch } = useBooks();
  const filteredBooks = useFilteredBooks();
  const navigate = useNavigate();

  const handleGenreFilter = (genre: string) => {
    const newGenre = state.selectedGenre === genre ? '' : genre;
    dispatch({ type: 'SET_GENRE_FILTER', payload: newGenre });
  };

  const handleStartReading = () => {
    if (state.isAuthenticated) {
      navigate('/library');
    } else {
      // Scroll to books section
      const booksSection = document.getElementById('books-section');
      booksSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJoinCommunity = () => {
    navigate('/community');
  };
  
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <AnimatedBackground />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Book Nest
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover, read, and connect with millions of books and fellow readers in our digital library community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="bg-white text-primary hover:bg-white/90 shadow-glow"
                  onClick={handleStartReading}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Reading
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="bg-white text-primary hover:bg-white/90 shadow-glow"
                  onClick={handleJoinCommunity}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold mb-2">50K+</div>
                <div className="text-white/80">Books Available</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-white/80">Active Readers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl font-bold mb-2">4.8★</div>
                <div className="text-white/80">Community Rating</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Genre Filter Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 text-gradient">Explore by Genre</h2>
            <p className="text-muted-foreground text-lg">
              Discover your next favorite book across all genres
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={state.selectedGenre === '' ? 'hero' : 'outline'}
              onClick={() => handleGenreFilter('')}
              className="transition-bouncy"
            >
              All Books
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={state.selectedGenre === genre ? 'hero' : 'outline'}
                onClick={() => handleGenreFilter(genre)}
                className="transition-bouncy"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Books Grid Section */}
      <section id="books-section" className="py-16 relative overflow-hidden">
        <SubtleAnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              {state.selectedGenre ? `${state.selectedGenre} Books` : 'Featured Books'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {filteredBooks.length} books available
            </p>
          </motion.div>

          {filteredBooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No books found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or genre filter
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="hover:shadow-glow transition-smooth"
                >
                  <BookCard book={book} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-accent/10 relative overflow-hidden">
        <SubtleAnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">Why Choose Book Nest?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience reading like never before with our comprehensive digital library platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-8 bg-card rounded-2xl shadow-card hover:shadow-glow transition-smooth cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Immersive Reading</h3>
              <p className="text-muted-foreground">
                Experience books with our 3D page-flip reader and customizable reading modes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-8 bg-card rounded-2xl shadow-card hover:shadow-glow transition-smooth cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Assistant</h3>
              <p className="text-muted-foreground">
                Get instant summaries, definitions, and personalized reading recommendations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-8 bg-card rounded-2xl shadow-card hover:shadow-glow transition-smooth cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Reading Community</h3>
              <p className="text-muted-foreground">
                Connect with fellow readers, join discussions, and share your thoughts
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

