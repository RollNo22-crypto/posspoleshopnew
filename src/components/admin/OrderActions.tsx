import React, { useState } from 'react';
import { Check, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface OrderActionsProps {
  status: string;
  orderId: string;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}

export default function OrderActions({ status, orderId, onUpdateStatus }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setLoading(true);

      // First update RFQ request status
      const { error: rfqError } = await supabase
        .from('rfq_requests')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (rfqError) throw rfqError;

      // Map RFQ status to order confirmation status
      let confirmationStatus;
      switch (newStatus) {
        case 'approved':
          confirmationStatus = 'confirmed';
          break;
        case 'rejected':
          confirmationStatus = 'cancelled';
          break;
        case 'completed':
          confirmationStatus = 'completed';
          break;
        case 'pending':
          confirmationStatus = 'pending';
          break;
        default:
          confirmationStatus = newStatus;
      }

      // Update order confirmation status
      const { error: confirmationError } = await supabase
        .from('order_confirmations')
        .update({ status: confirmationStatus })
        .eq('rfq_request_id', orderId);

      if (confirmationError) throw confirmationError;

      // Call the parent handler to refresh the UI
      await onUpdateStatus(orderId, newStatus);
      
      toast.success(`Order ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const renderActions = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('approved');
              }}
              disabled={loading}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-1" />
              {loading ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('rejected');
              }}
              disabled={loading}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center disabled:opacity-50"
            >
              <X className="w-4 h-4 mr-1" />
              {loading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        );

      case 'approved':
      case 'confirmed':
        return (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('completed');
              }}
              disabled={loading}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              {loading ? 'Processing...' : 'Complete'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusUpdate('pending');
              }}
              disabled={loading}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {loading ? 'Processing...' : 'Revert'}
            </button>
          </div>
        );

      case 'rejected':
      case 'cancelled':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('pending');
            }}
            disabled={loading}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {loading ? 'Processing...' : 'Revert to Pending'}
          </button>
        );

      case 'completed':
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate('approved');
            }}
            disabled={loading}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {loading ? 'Processing...' : 'Revert to Approved'}
          </button>
        );

      default:
        return null;
    }
  };

  return renderActions();
}