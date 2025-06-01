import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Menu, X, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Utensils className="h-8 w-8 text-orange-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">TableSpot</h1>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <User className="h-5 w-5 mr-2" />
                  <span>{user.name}</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
                <Button asChild>
                  <Link to="/register">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span>{user.name}</span>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Button asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};