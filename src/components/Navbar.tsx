import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    checkAdmin();
    // Add auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        checkAdmin();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkAdmin() {
    const session = await supabase.auth.getSession();
    if (session.data.session?.user.role === 'admin') {
      setIsAdmin(true);
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
            <img
            src="https://fhdcygdjolbkjpsqvflk.supabase.co/storage/v1/object/public/Images//image.png" 
              alt="Posspole Logo"
              className="h-8 w-auto" /* Adjust size as needed */
            />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-cyan-600">Home</Link>
            <Link to="/verticals" className="text-gray-700 hover:text-cyan-600">Verticals</Link>
            <Link to="/about" className="text-gray-700 hover:text-cyan-600">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-cyan-600">Contact</Link>
            {isAdmin && (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  <User className="w-5 h-5 mr-1" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            )}
            <Link to="/cart" className="text-gray-700 hover:text-cyan-600 relative">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-cyan-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/verticals"
              className="block px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
            >
              Verticals
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
            >
              Contact
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="block px-3 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-gray-50 font-medium"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
            <Link
              to="/cart"
              className="block px-3 py-2 text-gray-700 hover:text-cyan-600 hover:bg-gray-50"
            >
              Cart ({cartItemCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}