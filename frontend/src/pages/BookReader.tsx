import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, Moon, Sun, Minus, Plus, Sparkles, X, Send, Bot, User, BookText, BrainCircuit, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AnimatedBackground } from '@/components/AnimatedBackground';

// --- AI Assistant Component ---
const AIAssistant = ({ book, onClose }: { book: any; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);

  // Mock AI response generator (similar to Community page)
  const generateMockResponse = (promptType: string, query: string = '') => {
    setIsLoading(true);
    setResult('');
    
    // Simulate API call delay
    setTimeout(() => {
      let responseText = "Sorry, I couldn't generate a response for that.";

      if (promptType === 'summary') {
        responseText = `"${book.title}" is a compelling book by ${book.author}. It explores deep themes and follows the journey of its main characters through a series of challenging events. This summary is a placeholder, but the full book promises a rich and immersive experience.`;
      } else if (promptType === 'define') {
        const definitions: { [key: string]: string } = {
          'ubiquitous': 'Present, appearing, or found everywhere.',
          'ephemeral': 'Lasting for a very short time.',
          'sycophant': 'A person who acts obsequiously toward someone important in order to gain advantage.',
        };
        responseText = definitions[query.toLowerCase()] || `I don't have a definition for "${query}" right now, but it sounds like an interesting word!`;
      } else if (promptType === 'themes') {
        responseText = `Some key themes in "${book.title}" include love, loss, redemption, and the struggle between good and evil. These are common literary themes that the author explores in a unique way.`;
      } else if (promptType === 'chat') {
        const defaultResponses = [
          `That's a great question about "${book.title}"! While I'm a mock AI, I can tell you the book is highly rated.`,
          `Interesting point! The themes in "${book.title}" are definitely worth discussing further.`,
          `I can't give specific plot details, but the journey of the characters in this book is truly captivating.`,
        ];
        responseText = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      if (promptType === 'chat') {
        setChatMessages(prev => [...prev, { role: 'model' as const, text: responseText }]);
      } else {
        setResult(responseText);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleGenerateSummary = async () => {
    setActiveTab('summary');
    generateMockResponse('summary');
  };

  const handleDefineWord = async (e: React.FormEvent) => {
    e.preventDefault();
    const word = (e.target as HTMLFormElement).elements.namedItem('define-word-input') as HTMLInputElement;
    if (!word.value.trim()) return;
    setActiveTab('define');
    generateMockResponse('define', word.value);
  };
  
  const handleKeyThemes = async () => {
    setActiveTab('themes');
    generateMockResponse('themes');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setActiveTab('chat');
    const newUserMessage = { role: 'user' as const, text: userInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    generateMockResponse('chat', userInput);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-full w-96 bg-card shadow-reader z-30 border-l flex flex-col"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Assistant
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <Button variant={activeTab === 'summary' ? 'hero' : 'outline'} onClick={handleGenerateSummary}><BookText className="mr-2 h-4 w-4"/>Summary</Button>
          <Button variant={activeTab === 'themes' ? 'hero' : 'outline'} onClick={handleKeyThemes}><BrainCircuit className="mr-2 h-4 w-4"/>Themes</Button>
        </div>

        <form onSubmit={handleDefineWord} className="space-y-2">
            <Label htmlFor="define-word-input">Define a Word</Label>
            <div className="flex gap-2">
                <Input id="define-word-input" name="define-word-input" placeholder="e.g., ubiquitous" onChange={() => setActiveTab('define')}/>
                <Button type="submit">Define</Button>
            </div>
        </form>
        
        <Separator />

        <form onSubmit={handleSendMessage} className="space-y-2">
            <Label htmlFor="ask-question">Ask a Question</Label>
            <div className="flex-1 flex flex-col h-full">
                <Textarea id="ask-question" placeholder={`Ask about "${book.title}"...`} value={userInput} onChange={(e) => { setActiveTab('chat'); setUserInput(e.target.value); }} className="flex-1"/>
                <Button type="submit" className="mt-2"><Send className="h-4 w-4 mr-2"/>Send</Button>
            </div>
        </form>
        
        <Separator />

        <div className="min-h-[200px]">
            {isLoading ? <p>AI is thinking...</p> : (
                <>
                    {activeTab !== 'chat' && result && <p className="text-sm prose prose-sm dark:prose-invert">{result}</p>}
                    {activeTab === 'chat' && (
                        <div className="space-y-2">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'model' && <Bot className="h-4 w-4 text-primary flex-shrink-0 mt-1"/>}
                                    <p className={`text-sm p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{msg.text}</p>
                                    {msg.role === 'user' && <User className="h-4 w-4 flex-shrink-0 mt-1"/>}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </motion.div>
  );
};


const BookReader = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useBooks();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(0);
  const [isReaderDark, setIsReaderDark] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const book = state.books.find(b => b.id === bookId);

  useEffect(() => {
    if (bookId) {
      dispatch({ type: 'START_READING', payload: bookId });
    }
  }, [bookId, dispatch]);

  useEffect(() => {
    if (!book) {
      toast({
        title: "Book not found",
        description: "The requested book could not be found.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [book, navigate, toast]);

  if (!book) return null;

  const totalPages = book.content.length;

  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    setIsFlipping(true);
    
    if (direction === 'next' && currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (newPage === totalPages - 1) {
        dispatch({ type: 'COMPLETE_BOOK', payload: book.id });
        toast({
          title: "Book Completed!",
          description: `You've finished reading "${book.title}".`,
        });
      }
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }

    setTimeout(() => setIsFlipping(false), 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Reader Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Library
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}><Settings className="h-4 w-4" /></Button>
                <Button variant={showAI ? "hero" : "ghost"} size="icon" onClick={() => setShowAI(!showAI)} className="relative">
                  <Sparkles className="h-4 w-4" />
                  {showAI && <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className={cn("flex-1 transition-all duration-300 ease-in-out", showAI ? "mr-96" : "mr-0")}>
            <div className="container mx-auto px-4 py-8">
              <AnimatePresence>
                {showSettings && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
                    <Card className="p-4 shadow-card">
                      <div className="flex items-center justify-between gap-6">
                          <Button variant={isReaderDark ? "hero" : "outline"} size="sm" onClick={() => setIsReaderDark(!isReaderDark)}>
                            {isReaderDark ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                            {isReaderDark ? 'Dark' : 'Light'}
                          </Button>
                          <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(14, fontSize - 2))}><Minus className="h-4 w-4" /></Button>
                            <span className="text-sm min-w-12 text-center">{fontSize}px</span>
                            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(32, fontSize + 2))}><Plus className="h-4 w-4" /></Button>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}><X className="h-4 w-4" /></Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="max-w-4xl mx-auto">
                <div className={cn("relative min-h-[70vh] rounded-2xl shadow-2xl overflow-hidden", isReaderDark ? "bg-slate-800" : "bg-stone-50")}>
                  <motion.div key={currentPage} className="h-full p-8 lg:p-12">
                      <div className={cn("prose max-w-none", isReaderDark ? "prose-invert" : "prose-slate")}>
                        <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }} className={cn("text-justify", isReaderDark ? "text-slate-200" : "text-slate-800")}>
                          {book.content[currentPage]}
                        </p>
                      </div>
                      <div className="absolute bottom-4 right-6"><span className={cn("text-sm", isReaderDark ? "text-slate-400" : "text-slate-500")}>{currentPage + 1}</span></div>
                  </motion.div>
                  <div className="absolute inset-0 flex">
                    <button className="flex-1" onClick={() => handlePageTurn('prev')} disabled={currentPage === 0 || isFlipping} />
                    <button className="flex-1" onClick={() => handlePageTurn('next')} disabled={currentPage === totalPages - 1 || isFlipping} />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button variant="outline" onClick={() => handlePageTurn('prev')} disabled={currentPage === 0 || isFlipping}><ChevronLeft className="h-4 w-4 mr-2" />Previous</Button>
                  <Slider value={[currentPage]} onValueChange={([value]) => setCurrentPage(value)} max={totalPages - 1} step={1} className="flex-1 max-w-md" />
                  <Button variant="outline" onClick={() => handlePageTurn('next')} disabled={currentPage === totalPages - 1 || isFlipping}>Next<ChevronRight className="h-4 w-4 ml-2" /></Button>
                </div>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {showAI && <AIAssistant book={book} onClose={() => setShowAI(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookReader;

