import React from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OrderActions from './OrderActions';
import StatusBadge from './StatusBadge';

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

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  vertical: string;
}

interface OrdersTableProps {
  orders: OrderDetails[];
  expandedOrders: Set<string>;
  selectedItem: any;
  onToggleExpand: (orderId: string) => void;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export default function OrdersTable({
  orders,
  expandedOrders,
  selectedItem,
  onToggleExpand,
  onUpdateStatus
}: OrdersTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const userDetails = order.rfq_request?.user_details || {};
              return (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`${
                      selectedItem && selectedItem.id === order.id ? 'bg-cyan-50' : ''
                    } cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => onToggleExpand(order.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 mr-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">
                            Order #{order.confirmation_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.products?.length || 0} items
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {userDetails.full_name || 'N/A'}
                        </div>
                        <div className="text-gray-500">
                          {userDetails.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.created_at), 'PPP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <OrderActions
                        status={order.status}
                        orderId={order.rfq_request.id}
                        onUpdateStatus={onUpdateStatus}
                      />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Customer Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Full Name</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {userDetails.full_name || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {userDetails.email || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {userDetails.phone || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Company</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {userDetails.company_name || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {order.shipping_details && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">
                                Shipping Details
                              </h4>
                              <div className="text-sm text-gray-600">
                                <p>{order.shipping_details.street}</p>
                                <p>
                                  {order.shipping_details.city},
                                  {order.shipping_details.state} 
                                  {order.shipping_details.postal_code}
                                </p>
                                <p>{order.shipping_details.country}</p>
                              </div>
                            </div>
                          )}

                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Order Items
                            </h4>
                            <div className="space-y-2">
                              {order.products?.map((product) => {
                                const quantity = order.rfq_request.products.find(
                                  (p: any) => p.id === product.id
                                )?.quantity || 0;
                                return (
                                  <div
                                    key={product.id}
                                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                      <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                          {product.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Quantity: {quantity}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {product.vertical}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}