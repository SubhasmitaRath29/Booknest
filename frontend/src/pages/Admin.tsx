import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, DollarSign, BookOpen, Users, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { Book, genres } from '@/data/books';
import { cn } from '@/lib/utils';
import { AdminNavbar } from '@/components/AdminNavbar'; // 1. Import the new Admin Navbar
import { AnimatedBackground } from '@/components/AnimatedBackground'; // 2. Import the animation

const Admin = () => {
  const { state, dispatch } = useBooks();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    genre: '',
    rating: '',
    year: new Date().getFullYear(),
    price: '',
    content: ''
  });

  if (!state || !state.books) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading book data...</p>
      </div>
    );
  }

  const filteredBooks = state.books.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const stats = {
    totalBooks: state.books.length,
    totalUsers: 10453, // Mock data
    totalSales: state.books.reduce((sum, book) => sum + parseFloat(book.price), 0),
    avgRating: state.books.length > 0 
      ? (state.books.reduce((sum, book) => sum + parseFloat(book.rating), 0) / state.books.length).toFixed(1)
      : '0.0'
  };

  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      genre: '',
      rating: '',
      year: new Date().getFullYear(),
      price: '',
      content: ''
    });
  };

  const handleAddBook = () => {
    setIsAddingBook(true);
    resetForm();
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      year: book.year,
      price: book.price,
      content: book.content.join('\n\n')
    });
  };

  const handleDeleteBook = (bookId: string) => {
    dispatch({ type: 'DELETE_BOOK', payload: bookId });
    toast({
      title: "Book deleted",
      description: "The book has been successfully deleted.",
      variant: "default",
    });
  };

  const handleSubmitBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookForm.title || !bookForm.author || !bookForm.genre || !bookForm.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const bookData: Book = {
      id: editingBook?.id || `${bookForm.genre.toLowerCase()}${Date.now()}`,
      title: bookForm.title,
      author: bookForm.author,
      genre: bookForm.genre,
      rating: bookForm.rating || '4.0',
      year: bookForm.year,
      cover: `https://placehold.co/300x450/8B5CF6/FFFFFF?text=${encodeURIComponent(bookForm.title)}`,
      content: bookForm.content.split('\n\n').filter(Boolean),
      price: bookForm.price
    };

    if (editingBook) {
      dispatch({ type: 'UPDATE_BOOK', payload: bookData });
      toast({
        title: "Book updated",
        description: "The book has been successfully updated.",
        variant: "default",
      });
    } else {
      dispatch({ type: 'ADD_BOOK', payload: bookData });
      toast({
        title: "Book added",
        description: "The book has been successfully added.",
        variant: "default",
      });
    }

    setIsAddingBook(false);
    setEditingBook(null);
    resetForm();
  };

  const handleCloseDialog = () => {
    setIsAddingBook(false);
    setEditingBook(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <AdminNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'from-primary to-accent' },
            { title: 'Active Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'from-accent to-primary' },
            { title: 'Total Revenue', value: `₹${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'from-primary to-secondary' },
            { title: 'Avg Rating', value: stats.avgRating, icon: Star, color: 'from-secondary to-accent' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="shadow-card hover:shadow-card-hover transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br",
                      stat.color
                    )}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  
                  <Select 
                    value={selectedGenre} 
                    onValueChange={(value) => {
                      setSelectedGenre(value === 'all' ? '' : value);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="hero" onClick={handleAddBook}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Books Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Books Library ({filteredBooks.length})</span>
                <Badge variant="outline" className="ml-2">
                  {filteredBooks.length} / {state.books.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="pb-3 font-medium">Book</th>
                      <th className="pb-3 font-medium">Author</th>
                      <th className="pb-3 font-medium">Genre</th>
                      <th className="pb-3 font-medium">Rating</th>
                      <th className="pb-3 font-medium">Price</th>
                      <th className="pb-3 font-medium">Year</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book, index) => (
                      <motion.tr
                        key={book.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-muted hover:bg-muted/30 transition-smooth"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium line-clamp-1">{book.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-muted-foreground">{book.author}</td>
                        <td className="py-4">
                          <Badge variant="outline">{book.genre}</Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{book.rating}</span>
                          </div>
                        </td>
                        <td className="py-4 font-medium">₹{book.price}</td>
                        <td className="py-4 text-muted-foreground">{book.year}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBook(book)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add/Edit Book Dialog */}
      <Dialog open={isAddingBook || !!editingBook} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter book title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Enter author name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Select value={bookForm.genre} onValueChange={(value) => setBookForm(prev => ({ ...prev, genre: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={bookForm.rating}
                  onChange={(e) => setBookForm(prev => ({ ...prev, rating: e.target.value }))}
                  placeholder="4.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1000"
                  max={new Date().getFullYear()}
                  value={bookForm.year}
                  onChange={(e) => setBookForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  value={bookForm.price}
                  onChange={(e) => setBookForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="299.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content Preview</Label>
              <Textarea
                id="content"
                value={bookForm.content}
                onChange={(e) => setBookForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter book content (separate pages with double line breaks)"
                rows={6}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="hero">
                {editingBook ? 'Update Book' : 'Add Book'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
