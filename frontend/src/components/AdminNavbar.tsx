import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { useBooks } from '@/context/BookContext';

export const AdminNavbar: React.FC = () => {
  const { state, dispatch } = useBooks();
  const navigate = useNavigate();

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
            <span className="text-2xl font-bold text-gradient">Book Nest (Admin)</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {state.isAuthenticated && state.user && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {state.user.name ? state.user.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

