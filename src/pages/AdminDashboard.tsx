import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/supabase';
import AdminProductModal from '../components/AdminProductModal';
import AdminSearch from '../components/AdminSearch';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardStats from '../components/admin/DashboardStats';
import OrdersTable from '../components/admin/OrdersTable';
import OrderFilters from '../components/admin/OrderFilters';
import Pagination from '../components/admin/Pagination';
import { toast } from 'react-hot-toast';

interface OrderDetails {
  id: string;
  rfq_request_id: string;
  status: string;
  shipping_details: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  confirmation_number: string;
  created_at: string;
  rfq_request: {
    id: string;
    status: string;
    user_details: {
      full_name: string;
      email: string;
      phone: string;
      company_name: string;
    };
    products: Array<{
      id: string;
      quantity: number;
    }>;
  };
  products: Product[];
}

type ActiveView = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [selectedItem, setSelectedItem] = useState<OrderDetails | Product | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Filtering and sorting states
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    activeOrders: 0
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchStats();
      if (activeView === 'orders') {
        fetchOrders();
      } else if (activeView === 'products') {
        fetchProducts();
      }
    }
  }, [activeView, loading]);

  async function checkAdmin() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.email !== 'superadmin@posspole.com') {
        navigate('/admin/login');
        return;
      }
      setLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      navigate('/admin/login');
    }
  }

  async function fetchStats() {
    try {
      const [ordersData, productsData] = await Promise.all([
        supabase.from('order_confirmations').select('*'),
        supabase.from('products').select('*')
      ]);

      if (ordersData.error) throw ordersData.error;
      if (productsData.error) throw productsData.error;

      setStats({
        totalOrders: ordersData.data.length,
        pendingOrders: ordersData.data.filter(order => order.status === 'pending').length,
        totalProducts: productsData.data.length,
        activeOrders: ordersData.data.filter(order => order.status === 'approved').length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }

  async function fetchOrders() {
    try {
      // First, fetch all order confirmations
      const { data: confirmationsData, error: confirmationsError } = await supabase
        .from('order_confirmations')
        .select(`
          *,
          rfq_request:rfq_requests (
            id,
            status,
            user_details,
            products
          )
        `)
        .order('created_at', { ascending: false });

      if (confirmationsError) throw confirmationsError;

      // Get all product IDs from RFQ requests
      const productIds = new Set<string>();
      confirmationsData.forEach(confirmation => {
        if (confirmation.rfq_request?.products) {
          confirmation.rfq_request.products.forEach((p: any) => productIds.add(p.id));
        }
      });

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', Array.from(productIds));

      if (productsError) throw productsError;

      // Combine all the data
      const orderDetails = confirmationsData.map(confirmation => ({
        ...confirmation,
        products: productsData.filter(p => 
          confirmation.rfq_request?.products.some((rp: any) => rp.id === p.id)
        )
      }));

      setOrders(orderDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    }
  }

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  }

  async function updateRequestStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('rfq_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchOrders(); // Refresh the orders list
      toast.success(`Request ${status} successfully`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  }

  function handleEditProduct(product: Product) {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  }

  function handleAddProduct() {
    setSelectedProduct(undefined);
    setIsProductModalOpen(true);
  }

  function handleSearchResult(result: { type: 'order' | 'product'; data: any }) {
    setSelectedItem(result.data);
    setActiveView(result.type === 'order' ? 'orders' : 'products');
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.confirmation_number?.toLowerCase().includes(searchLower) ||
        order.rfq_request?.user_details?.full_name?.toLowerCase().includes(searchLower) ||
        order.rfq_request?.user_details?.email?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'date':
        comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'customer':
        comparison = (a.rfq_request?.user_details?.full_name || '').localeCompare(b.rfq_request?.user_details?.full_name || '');
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <AdminSearch onResultSelect={handleSearchResult} />
        </div>

        {activeView === 'dashboard' && (
          <DashboardStats stats={stats} />
        )}

        {activeView === 'orders' && (
          <div className="space-y-6">
            <OrderFilters
              statusFilter={statusFilter}
              searchQuery={searchQuery}
              sortField={sortField}
              sortOrder={sortOrder}
              onStatusFilterChange={setStatusFilter}
              onSearchQueryChange={setSearchQuery}
              onSortFieldChange={setSortField}
              onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            />

            <OrdersTable
              orders={paginatedOrders}
              expandedOrders={expandedOrders}
              selectedItem={selectedItem}
              onToggleExpand={toggleOrderExpansion}
              onUpdateStatus={updateRequestStatus}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredOrders.length}
                itemsPerPage={ordersPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {activeView === 'products' && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Products</h2>
              <button
                onClick={handleAddProduct}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    selectedItem && selectedItem.id === product.id ? 'ring-2 ring-cyan-500' : ''
                  }`}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-gray-600 hover:text-cyan-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeView === 'customers' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>
            <p className="text-gray-600">Customer management coming soon...</p>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">System settings coming soon...</p>
          </div>
        )}
      </main>

      <AdminProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          fetchProducts();
          setIsProductModalOpen(false);
        }}
      />
    </div>
  );
}

export default AdminDashboard;