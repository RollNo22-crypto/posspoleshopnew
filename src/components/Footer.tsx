import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Posspole</h3>
            <p className="text-gray-400">
              Your one-stop solution for industrial and commercial needs across multiple verticals.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-cyan-500">Home</Link></li>
              <li><Link to="/verticals" className="text-gray-400 hover:text-cyan-500">Verticals</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-cyan-500">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-cyan-500">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Verticals</h4>
            <ul className="space-y-2">
              <li><Link to="/verticals/fashion" className="text-gray-400 hover:text-cyan-500">Fashion</Link></li>
              <li><Link to="/verticals/food" className="text-gray-400 hover:text-cyan-500">Food</Link></li>
              <li><Link to="/verticals/defense" className="text-gray-400 hover:text-cyan-500">Defense</Link></li>
              <li><Link to="/verticals/energy" className="text-gray-400 hover:text-cyan-500">Energy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-500">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2">Newsletter</h5>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-md w-full text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 px-4 py-2 rounded-r-md hover:bg-cyan-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Posspole. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}