import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Send, Bot, User, BookOpen, Star, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { genres } from '@/data/books';
import { cn } from '@/lib/utils';
import { AnimatedBackground } from '@/components/AnimatedBackground';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  bookRecommendation?: {
    id: string;
    title: string;
    author: string;
    cover: string;
    rating: string;
  };
}

const Community = () => {
  const { state } = useBooks();
  const { toast } = useToast();
  const navigate = useNavigate(); // 2. Initialize the navigate function
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to the Book Nest Community! I'm your AI reading companion. I can help you discover new books based on your preferences. What genre are you interested in today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBookRecommendation = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let recommendedBooks = state.books;

    const mentionedGenre = genres.find(genre => 
      lowerQuery.includes(genre.toLowerCase())
    );
    
    if (mentionedGenre) {
      recommendedBooks = recommendedBooks.filter(book => book.genre === mentionedGenre);
    }

    if (recommendedBooks.length > 0) {
      const randomBook = recommendedBooks[Math.floor(Math.random() * recommendedBooks.length)];
      return {
        id: randomBook.id,
        title: randomBook.title,
        author: randomBook.author,
        cover: randomBook.cover,
        rating: randomBook.rating
      };
    }

    return null;
  };

  const generateBotResponse = (userMessage: string): { text: string; bookRecommendation?: any } => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        text: "Hello! I'm excited to help you discover your next great read. What type of books do you enjoy? Are you looking for something specific today?"
      };
    }

    const recommendation = getBookRecommendation(userMessage);
    if (recommendation) {
        return {
            text: `Great choice! Here's a highly-rated book I found for you:`,
            bookRecommendation: recommendation
        };
    }
    
    const defaultResponses = [
      "That's interesting! Tell me more about what you're looking for in a book.",
      "I'd love to help you find the perfect book. What genres do you typically enjoy?",
      "What mood are you in for reading today?",
    ];

    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        bookRecommendation: botResponse.bookRecommendation
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, Math.random() * 2000 + 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    setInputMessage(`I'm interested in ${genre} books`);
  };

  const BookRecommendationCard = ({ book }: { book: any }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-3 p-4 bg-primary/5 rounded-lg border border-primary/20 max-w-sm"
    >
      <div className="flex gap-3">
        <img
          src={book.cover}
          alt={book.title}
          className="w-16 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h4 className="font-bold text-sm line-clamp-2 text-foreground">{book.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">by {book.author}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-semibold text-muted-foreground">{book.rating}</span>
          </div>
          {/* 3. Add the onClick handler to the button */}
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 h-6 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/book/${book.id}`);
            }}
          >
            View Book
          </Button>
        </div>
      </div>
    </motion.div>
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
                Community Hub
              </h1>
              <p className="text-white/90 font-medium text-lg max-w-2xl mx-auto">
                Connect with fellow readers and discover your next favorite book
              </p>
            </motion.div>
        </div>
      </section>

      {/* Community Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="chat">AI Book Assistant</TabsTrigger>
            <TabsTrigger value="forums">Discussion Forums</TabsTrigger>
            <TabsTrigger value="stats">Community Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Genre Quick Filters */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Filters</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {genres.map(genre => (
                      <Button
                        key={genre}
                        variant={selectedGenre === genre ? "hero" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleGenreClick(genre)}
                      >
                        {genre}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary" />
                      AI Reading Companion
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex",
                              message.isBot ? "justify-start" : "justify-end"
                            )}
                          >
                            <div className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-3",
                              message.isBot
                                ? "bg-card text-foreground"
                                : "bg-primary text-primary-foreground ml-auto"
                            )}>
                              <div className="flex items-start gap-2">
                                {message.isBot && (
                                  <Bot className="h-4 w-4 mt-0.5 text-primary" />
                                )}
                                {!message.isBot && (
                                  <User className="h-4 w-4 mt-0.5" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{message.text}</p>
                                  {message.bookRecommendation && (
                                    <BookRecommendationCard book={message.bookRecommendation} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Typing Indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                            <Bot className="h-4 w-4 text-primary" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask for book recommendations..."
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forums">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genres.map((genre, index) => (
                <motion.div
                  key={genre}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-card-hover transition-smooth cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-foreground">{genre} Discussion</h3>
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/80 font-medium">Active Discussions</span>
                          <Badge variant="secondary">{Math.floor(Math.random() * 50) + 10}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-foreground/80 font-medium">Members</span>
                          <span className="font-bold text-foreground">{(Math.floor(Math.random() * 1000) + 500).toLocaleString()}</span>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm text-foreground/80">
                            Latest: "What's your favorite {genre.toLowerCase()} book of 2024?"
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Members', value: '12,543', icon: Users, trend: '+15%' },
                { title: 'Books Discussed', value: '3,247', icon: BookOpen, trend: '+8%' },
                { title: 'Active Conversations', value: '847', icon: MessageCircle, trend: '+23%' },
                { title: 'Reading Streak', value: '145 days', icon: TrendingUp, trend: '+5%' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <stat.icon className="h-8 w-8 text-primary" />
                        <Badge variant="outline" className="text-green-600">
                          {stat.trend}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-2xl mb-1 text-foreground">{stat.value}</h3>
                      <p className="text-foreground/80 text-sm font-medium">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;

