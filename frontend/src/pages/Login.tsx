import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Mail, Lock, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Reverted mock authentication
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        isAdmin: role === 'admin'
      };

      dispatch({ type: 'LOGIN', payload: mockUser });
      
      toast({
        title: "Welcome back!",
        description: `You have been logged in successfully as a ${role}.`,
        variant: "default",
      });
      
      setIsLoading(false);
      
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 1500);
  };

  const RoleToggle = () => (
    <div className="flex justify-center my-6">
      <div className="relative flex w-64 items-center rounded-full bg-muted p-1">
        <motion.div
          className="absolute h-9 w-1/2 rounded-full bg-gradient-hero z-0"
          animate={{ x: role === 'user' ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <button
          type="button"
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${role === 'user' ? 'text-white' : 'text-muted-foreground'}`}
          onClick={() => setRole('user')}
        >
          <User className="h-4 w-4" />
          User
        </button>
        <button
          type="button"
          className={`relative z-10 flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${role === 'admin' ? 'text-white' : 'text-muted-foreground'}`}
          onClick={() => setRole('admin')}
        >
          <Shield className="h-4 w-4" />
          Admin
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-reader border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">
              Welcome Back to Book Nest
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to continue your reading journey
            </p>
          </CardHeader>
          
          <CardContent>
            <RoleToggle />
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>

              <Button
                type="submit"
                variant="hero"
                className="w-full h-12 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-card/80 backdrop-blur-sm rounded-2xl border border-white/20"
        >
          <h4 className="text-sm font-medium text-white mb-2">Demo Credentials:</h4>
          <p className="text-xs text-white/80">
            Email: demo@booknest.com<br />
            Password: demo123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Login;

