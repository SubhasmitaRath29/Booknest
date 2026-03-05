import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, User, Mail, Lock, Phone, Check, Shield } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Checkbox } from '@/components/ui/checkbox';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'user' | 'admin'>('user'); // 1. Add role state
  
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim()) {
      toast({ title: "Validation Error", description: "Name is required.", variant: "destructive" });
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return false;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return false;
    }
    if (password.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return false;
    }
    if (password !== confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return false;
    }
    if (!agreedToTerms) {
      toast({ title: "Terms of Service", description: "You must agree to the terms of service.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      // 3. Update newUser object to include isAdmin property
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name.trim(),
        email: formData.email,
        phone: formData.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`,
        isAdmin: role === 'admin'
      };

      dispatch({ type: 'LOGIN', payload: newUser });
      toast({ title: "Welcome to Book Nest!", description: "Your account has been created successfully." });
      setIsLoading(false);
      navigate(role === 'admin' ? '/admin' : '/'); // Navigate based on role
    }, 2000);
  };

  // 2. Add the RoleToggle component
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
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 py-8 overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="shadow-reader border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gradient">
              Join Book Nest
            </CardTitle>
            <p className="text-muted-foreground">
              Create your account and start your reading adventure
            </p>
          </CardHeader>
          
          <CardContent>
            <RoleToggle />
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields */}
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className="h-12 pl-10" required /></div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="h-12 pl-10" required /></div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input id="phone" type="tel" placeholder="Enter your 10-digit phone number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="h-12 pl-10" required maxLength={10} /></div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="h-12 pl-10 pr-12" required /><Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative"><Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="h-12 pl-10 pr-12" required /><Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
              </motion.div>

              {/* Terms of Service */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                </Label>
              </div>

              <Button type="submit" variant="accent" className="w-full h-12 text-lg" disabled={isLoading}>{isLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Create Account'}</Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">Already have an account?{' '}<Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;

