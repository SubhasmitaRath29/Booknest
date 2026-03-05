
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, CheckCircle, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookCard } from '@/components/BookCard';
import { useBooks } from '@/context/BookContext';
import { booksData, genres, Book } from '@/data/books';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const Library = () => {
  const { state } = useBooks();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wishlist');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and Sort State
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title-asc');

  // --- FIX STARTS HERE ---
  // Add a loading check to prevent crashes before the context is ready.
  if (!state || !state.wishlist || !state.currentlyReading || !state.completed || !state.downloaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading your library...</p>
      </div>
    );
  }
  // --- FIX ENDS HERE ---

  // Get books by IDs
  const getBooksByIds = (ids: string[]) => {
    return booksData.filter(book => ids.includes(book.id));
  };

  const wishlistBooks = getBooksByIds(state.wishlist);
  const currentlyReadingBooks = getBooksByIds(state.currentlyReading);
  const completedBooks = getBooksByIds(state.completed);
  const downloadedBooks = getBooksByIds(state.downloaded); // Get downloaded books

  const applyFiltersAndSorting = (books: Book[]) => {
    return books
      .filter(book => filterGenre === 'all' || book.genre === filterGenre)
      .sort((a, b) => {
        switch (sortBy) {
          case 'title-asc': return a.title.localeCompare(b.title);
          case 'title-desc': return b.title.localeCompare(a.title);
          case 'rating-desc': return parseFloat(b.rating) - parseFloat(a.rating);
          case 'rating-asc': return parseFloat(a.rating) - parseFloat(b.rating);
          case 'price-asc': return parseFloat(a.price) - parseFloat(b.price);
          case 'price-desc': return parseFloat(b.price) - parseFloat(a.price);
          default: return 0;
        }
      });
  };

  const filteredWishlist = useMemo(() => applyFiltersAndSorting(wishlistBooks), [wishlistBooks, filterGenre, sortBy]);
  const filteredReading = useMemo(() => applyFiltersAndSorting(currentlyReadingBooks), [currentlyReadingBooks, filterGenre, sortBy]);
  const filteredCompleted = useMemo(() => applyFiltersAndSorting(completedBooks), [completedBooks, filterGenre, sortBy]);
  const filteredDownloaded = useMemo(() => applyFiltersAndSorting(downloadedBooks), [downloadedBooks, filterGenre, sortBy]);

  const TabContent = ({ books, icon: Icon, title, emptyMessage }: {
    books: any[];
    icon: any;
    title: string;
    emptyMessage: string;
  }) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <span className="text-foreground/80">({books.length})</span>
      </div>
      
      {books.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Icon className="mx-auto h-16 w-16 text-foreground/50 mb-4" />
          <h3 className="text-xl font-bold mb-2 text-foreground">{emptyMessage}</h3>
          <p className="text-foreground/80 font-medium mb-6">
            Start exploring books to build your library
          </p>
          <Button variant="hero" onClick={() => navigate('/')}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Books
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      {/* Header */}
      <section className="relative bg-gradient-to-r from-primary/10 to-accent/10 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              My Library
            </h1>
            <p className="text-white/90 font-medium text-lg max-w-2xl mx-auto">
              Organize and track your reading journey with your personal library
            </p>
          </motion.div>
        </div>
      </section>

      {/* Library Content */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <TabsList className="grid w-full lg:w-auto grid-cols-4 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger
                  value="wishlist"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-hero data-[state=active]:text-white"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </TabsTrigger>
                <TabsTrigger
                  value="reading"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-hero data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Reading</span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-hero data-[state=active]:text-white"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Completed</span>
                </TabsTrigger>
                <TabsTrigger
                  value="downloaded"
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-hero data-[state=active]:text-white"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Downloaded</span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 lg:mt-0">
                <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter & Sort
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Filter & Sort</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="genre-filter" className="text-right">
                          Genre
                        </Label>
                        <Select value={filterGenre} onValueChange={setFilterGenre}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Genres</SelectItem>
                            {genres.map(genre => (
                              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sort-by" className="text-right">
                          Sort By
                        </Label>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select sorting" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                            <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                            <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
                            <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
                            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="wishlist">
              <TabContent
                books={filteredWishlist}
                icon={Heart}
                title="Wishlist"
                emptyMessage="No books in your wishlist yet"
              />
            </TabsContent>

            <TabsContent value="reading">
              <TabContent
                books={filteredReading}
                icon={BookOpen}
                title="Currently Reading"
                emptyMessage="No books currently being read"
              />
            </TabsContent>

            <TabsContent value="completed">
              <TabContent
                books={filteredCompleted}
                icon={CheckCircle}
                title="Completed Books"
                emptyMessage="No completed books yet"
              />
            </TabsContent>
            
            <TabsContent value="downloaded">
              <TabContent
                books={filteredDownloaded}
                icon={Download}
                title="Downloaded Books"
                emptyMessage="No downloaded books yet"
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Library;

