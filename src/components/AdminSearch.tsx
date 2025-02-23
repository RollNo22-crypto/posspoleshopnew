import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RFQRequest, Product } from '../types/supabase';

interface SearchResult {
  type: 'order' | 'product';
  data: RFQRequest | Product;
}

interface AdminSearchProps {
  onResultSelect: (result: SearchResult) => void;
}

export default function AdminSearch({ onResultSelect }: AdminSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      // Search products first
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(5);

      // Search RFQ requests
      const { data: orders } = await supabase
        .from('rfq_requests')
        .select(`
          *,
          user_details (
            full_name,
            email
          )
        `)
        .limit(5);

      // Filter orders based on user details or ID match
      const filteredOrders = (orders || []).filter(order => {
        const userFullName = order.user_details?.full_name?.toLowerCase() || '';
        const userEmail = order.user_details?.email?.toLowerCase() || '';
        const orderId = order.id.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return userFullName.includes(query) || 
               userEmail.includes(query) || 
               orderId.includes(query);
      });

      const searchResults: SearchResult[] = [
        ...(filteredOrders.map(order => ({ type: 'order' as const, data: order })) || []),
        ...(products?.map(product => ({ type: 'product' as const, data: product })) || [])
      ];

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search orders or products..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {loading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              onClick={() => onResultSelect(result)}
            >
              {result.type === 'order' ? (
                <div>
                  <div className="font-medium text-gray-900">
                    Order #{(result.data as RFQRequest).id.slice(0, 8)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(result.data as any).user_details?.full_name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: {(result.data as RFQRequest).status}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium text-gray-900">
                    {(result.data as Product).name}
                  </div>
                  <div className="text-sm text-gray-500">
                    ${(result.data as Product).price}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}