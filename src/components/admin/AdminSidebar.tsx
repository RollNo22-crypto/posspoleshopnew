import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  activeView: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';
  setActiveView: (view: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings') => void;
  onLogout: () => void;
}

export default function AdminSidebar({ activeView, setActiveView, onLogout }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
            activeView === 'dashboard' ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600' : ''
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveView('products')}
          className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
            activeView === 'products' ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600' : ''
          }`}
        >
          <Package className="w-5 h-5 mr-3" />
          Products
        </button>
        <button
          onClick={() => setActiveView('orders')}
          className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
            activeView === 'orders' ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600' : ''
          }`}
        >
          <ShoppingCart className="w-5 h-5 mr-3" />
          Orders
        </button>
        <button
          onClick={() => setActiveView('customers')}
          className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
            activeView === 'customers' ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600' : ''
          }`}
        >
          <Users className="w-5 h-5 mr-3" />
          Customers
        </button>
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
            activeView === 'settings' ? 'bg-cyan-50 text-cyan-600 border-r-4 border-cyan-600' : ''
          }`}
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 mt-auto"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  );
}