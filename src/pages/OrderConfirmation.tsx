import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

interface OrderConfirmation {
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
  payment_details: Record<string, any>;
  confirmation_number: string;
  downloaded: boolean;
  download_timestamp: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  vertical: string;
}

interface RFQRequest {
  id: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  user_details: {
    full_name: string;
    email: string;
    phone: string;
    company_name: string;
  };
  status: string;
  created_at: string;
}

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [rfqRequest, setRfqRequest] = useState<RFQRequest | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchOrderConfirmation() {
      try {
        if (!id) {
          setError('Order ID is required');
          return;
        }

        // Fetch order confirmation
        const { data: confirmations, error: confirmationError } = await supabase
          .from('order_confirmations')
          .select('*')
          .eq('id', id);

        if (confirmationError) throw confirmationError;
        if (!confirmations || confirmations.length === 0) {
          throw new Error('Order confirmation not found');
        }

        const confirmationData = confirmations[0];
        setConfirmation(confirmationData);

        // Fetch RFQ request
        const { data: rfqData, error: rfqError } = await supabase
          .from('rfq_requests')
          .select('*')
          .eq('id', confirmationData.rfq_request_id)
          .single();

        if (rfqError) throw rfqError;
        if (!rfqData) throw new Error('RFQ request not found');
        
        setRfqRequest(rfqData);

        // Fetch products
        if (rfqData?.products) {
          const productIds = rfqData.products.map((p: any) => p.id);
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds);

          if (productsError) throw productsError;
          setProducts(productsData || []);
        }
      } catch (err) {
        console.error('Error fetching order confirmation:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order confirmation');
      } finally {
        setLoading(false);
      }
    }

    fetchOrderConfirmation();
  }, [id]);

  const generatePDF = async () => {
    if (!confirmation || !rfqRequest || downloading) return;

    try {
      setDownloading(true);

      const { error: updateError } = await supabase
        .from('order_confirmations')
        .update({ 
          downloaded: true, 
          download_timestamp: new Date().toISOString() 
        })
        .eq('id', confirmation.id);

      if (updateError) throw updateError;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = margin;

      // Add logo/header
      doc.setFillColor(0, 148, 136); // Cyan-600 color
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('POSSPOLE', margin, 28);

      // Reset text color for rest of the document
      doc.setTextColor(0, 0, 0);
      y = 60;

      // Order Details Section
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Order Confirmation', margin, y);
      y += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Confirmation Number: ${confirmation.confirmation_number}`, margin, y);
      y += 8;
      doc.text(`Date: ${format(new Date(confirmation.created_at), 'PPP')}`, margin, y);
      y += 8;
      doc.text(`Status: ${confirmation.status.toUpperCase()}`, margin, y);
      y += 20;

      // Customer Details Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Details', margin, y);
      y += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${rfqRequest.user_details.full_name}`, margin, y);
      y += 6;
      doc.text(`Email: ${rfqRequest.user_details.email}`, margin, y);
      y += 6;
      doc.text(`Phone: ${rfqRequest.user_details.phone}`, margin, y);
      y += 6;
      doc.text(`Company: ${rfqRequest.user_details.company_name}`, margin, y);
      y += 15;

      // Shipping Details Section
      if (confirmation.shipping_details) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Shipping Details', margin, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const address = [
          confirmation.shipping_details.street,
          `${confirmation.shipping_details.city}, ${confirmation.shipping_details.state} ${confirmation.shipping_details.postal_code}`,
          confirmation.shipping_details.country
        ];
        address.forEach(line => {
          doc.text(line, margin, y);
          y += 6;
        });
        y += 15;
      }

      // Products Section
      if (products.length > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Products', margin, y);
        y += 15;

        // Table Header
        const tableHeaders = ['Product', 'Vertical', 'Quantity'];
        const columnWidths = [100, 60, 30];
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y - 6, pageWidth - (margin * 2), 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        
        let xOffset = margin;
        tableHeaders.forEach((header, index) => {
          doc.text(header, xOffset, y);
          xOffset += columnWidths[index];
        });
        y += 10;

        // Table Content
        doc.setFont('helvetica', 'normal');
        products.forEach((product) => {
          const quantity = rfqRequest.products.find(p => p.id === product.id)?.quantity || 0;
          
          if (y > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            y = margin;
          }

          xOffset = margin;
          doc.text(product.name, xOffset, y, { maxWidth: columnWidths[0] - 5 });
          xOffset += columnWidths[0];
          doc.text(product.vertical, xOffset, y);
          xOffset += columnWidths[1];
          doc.text(quantity.toString(), xOffset, y);
          
          y += 10;
        });
      }

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(0, 148, 136);
      doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('POSSPOLE PVT LTD', margin, pageHeight - 8);
      doc.text('www.posspole.com', pageWidth - margin - 30, pageHeight - 8);

      // Save PDF
      doc.save(`order-confirmation-${confirmation.confirmation_number}.pdf`);
      toast.success('Order confirmation downloaded successfully');

      // Refresh confirmation data
      const { data: refreshedData, error: refreshError } = await supabase
        .from('order_confirmations')
        .select('*')
        .eq('id', confirmation.id)
        .single();

      if (refreshError) throw refreshError;
      setConfirmation(refreshedData);

    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download confirmation');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (error || !confirmation || !rfqRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          {error || 'Order confirmation not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
                <p className="text-gray-600">
                  {format(new Date(confirmation.created_at), 'PPP')}
                </p>
                <p className="text-gray-600">
                  Confirmation #: {confirmation.confirmation_number}
                </p>
              </div>
              <div className="flex space-x-4">
                {!confirmation.downloaded ? (
                  <button
                    onClick={generatePDF}
                    disabled={downloading}
                    className="flex items-center text-cyan-600 hover:text-cyan-700"
                  >
                    <Download className="w-5 h-5 mr-1" />
                    {downloading ? 'Downloading...' : 'Download PDF'}
                  </button>
                ) : (
                  <div className="text-gray-500 flex items-center">
                    <Download className="w-5 h-5 mr-1" />
                    Downloaded on {format(new Date(confirmation.download_timestamp!), 'PPP')}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Customer Details
                  </h2>
                  <p className="text-gray-600">{rfqRequest.user_details.full_name}</p>
                  <p className="text-gray-600">{rfqRequest.user_details.email}</p>
                  <p className="text-gray-600">{rfqRequest.user_details.phone}</p>
                  <p className="text-gray-600">{rfqRequest.user_details.company_name}</p>
                </div>
                {confirmation.shipping_details && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Shipping Details
                    </h2>
                    <p className="text-gray-600">{confirmation.shipping_details.street}</p>
                    <p className="text-gray-600">
                      {confirmation.shipping_details.city}, {confirmation.shipping_details.state} {confirmation.shipping_details.postal_code}
                    </p>
                    <p className="text-gray-600">{confirmation.shipping_details.country}</p>
                  </div>
                )}
              </div>
            </div>

            {products.length > 0 && (
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Products
                </h2>
                <div className="space-y-4">
                  {products.map((product) => {
                    const quantity = rfqRequest.products.find(p => p.id === product.id)?.quantity || 0;
                    return (
                      <div key={product.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="ml-4">
                            <p className="text-gray-900 font-medium">{product.name}</p>
                            <p className="text-gray-600">Quantity: {quantity}</p>
                            <p className="text-gray-600">{product.vertical}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Link
                to="/"
                className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}