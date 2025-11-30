'use client';

import { useEffect, useState } from 'react';
import { Edit, Search, Package, User, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  paymentStatus: string;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      image: string;
    };
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-text">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Orders</h1>
        <p className="text-muted mt-2">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="bg-bg border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-border/50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-border/50">
                  <td className="py-3 px-4 text-sm text-text font-mono">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4 text-sm text-text">
                    <div>
                      <p className="font-medium">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-muted text-xs">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text">
                    {order.items.length} item(s)
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-text">
                    {order.total.toFixed(2)} MAD
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-primary hover:bg-primary/10 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-bg border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-text">Order Details</h2>
              <p className="text-muted text-sm mt-1">Order ID: {selectedOrder.id}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="bg-border/30 rounded-lg p-4">
                  <p className="text-text">
                    {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                  </p>
                  <p className="text-muted text-sm">{selectedOrder.user.email}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 bg-border/30 rounded-lg p-4"
                    >
                      <div className="w-16 h-16 bg-bg border border-border rounded-lg overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text">{item.product.name}</p>
                        <p className="text-sm text-muted">
                          Quantity: {item.quantity} × {item.price.toFixed(2)} MAD
                        </p>
                      </div>
                      <p className="font-semibold text-text">
                        {(item.quantity * item.price).toFixed(2)} MAD
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Order Summary
                </h3>
                <div className="bg-border/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-text">
                    <span>Subtotal:</span>
                    <span>{selectedOrder.subtotal.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-text">
                    <span>Tax:</span>
                    <span>{selectedOrder.tax.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-text border-t border-border pt-2">
                    <span>Total:</span>
                    <span>{selectedOrder.total.toFixed(2)} MAD</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold text-text mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        setSelectedOrder({ ...selectedOrder, status: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) =>
                        setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 border border-border rounded-lg text-text hover:bg-border"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    updateOrderStatus(
                      selectedOrder.id,
                      selectedOrder.status,
                      selectedOrder.paymentStatus
                    )
                  }
                  className="btn-primary px-6 py-2"
                >
                  Update Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







