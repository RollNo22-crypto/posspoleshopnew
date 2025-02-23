import React from 'react';
import { Filter, Search, ArrowUpDown } from 'lucide-react';

interface OrderFiltersProps {
  statusFilter: string;
  searchQuery: string;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onStatusFilterChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSortFieldChange: (value: string) => void;
  onSortOrderChange: () => void;
}

export default function OrderFilters({
  statusFilter,
  searchQuery,
  sortField,
  sortOrder,
  onStatusFilterChange,
  onSearchQueryChange,
  onSortFieldChange,
  onSortOrderChange
}: OrderFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="date">Sort by Date</option>
            <option value="status">Sort by Status</option>
            <option value="customer">Sort by Customer</option>
          </select>
          <button
            onClick={onSortOrderChange}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowUpDown className="h-5 w-5" />
            <span className="hidden sm:inline">
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}