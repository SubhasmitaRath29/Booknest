import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBooks } from '@/context/BookContext';
import { useToast } from '@/hooks/use-toast';
import { AnimatedBackground } from '@/components/AnimatedBackground';

const Profile = () => {
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form with the current user's data
    if (state.user) {
      setFormData({
        name: state.user.name || '',
        phone: state.user.phone || '',
      });
    }
  }, [state.user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    setIsLoading(true);

    // ✅ Just update context directly (no Supabase)
    dispatch({
      type: 'LOGIN',
      payload: {
        ...state.user,
        name: formData.name,
        phone: formData.phone,
      },
    });

    toast({
      title: "Profile Updated",
      description: "Your information has been successfully updated.",
    });

    navigate('/');
    setIsLoading(false);
  };

  if (!state.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src={state.user.avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-gradient">Edit Profile</CardTitle>
              <p className="text-muted-foreground">{state.user.email}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="h-12 pl-10" /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="h-12 pl-10" /></div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="w-full" onClick={() => navigate(-1)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
