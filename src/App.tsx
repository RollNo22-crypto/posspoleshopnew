import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import VerticalsOverview from './pages/VerticalsOverview';
import VerticalPage from './pages/VerticalPage';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import Contact from './pages/Contact';
import OrderConfirmation from './pages/OrderConfirmation';


function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verticals" element={<VerticalsOverview />} />
              <Route path="/verticals/:vertical" element={<VerticalPage />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </CartProvider>
    </Router>
  );
}

export default App;