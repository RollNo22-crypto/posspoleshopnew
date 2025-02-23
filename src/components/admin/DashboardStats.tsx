import React from 'react';

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    activeOrders: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
        <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingOrders}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
        <p className="text-3xl font-bold text-cyan-600 mt-2">{stats.totalProducts}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-gray-500 text-sm font-medium">Active Orders</h3>
        <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeOrders}</p>
      </div>
    </div>
  );
}