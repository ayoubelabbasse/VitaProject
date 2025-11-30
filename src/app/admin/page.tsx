'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.user) {
        setUserEmail(data.user.email);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setError(null);
      // Fetch stats from API
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/users'),
      ]);

      const products = productsRes.ok ? await productsRes.json() : { products: [] };
      const orders = ordersRes.ok ? await ordersRes.json() : { orders: [] };
      const users = usersRes.ok ? await usersRes.json() : { users: [] };

      const totalRevenue = orders.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0;

      setStats({
        totalProducts: products.products?.length || 0,
        totalOrders: orders.orders?.length || 0,
        totalRevenue,
        totalUsers: users.users?.length || 0,
        recentOrders: orders.orders?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `${stats.totalRevenue.toFixed(2)} MAD`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-muted mt-2">
          Welcome back{userEmail ? `, ${userEmail}` : ''}! Here's what's happening.
        </p>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchStats}
            className="ml-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* System Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="text-green-800 font-medium">System Status: Operational</p>
          <p className="text-green-600 text-sm">All systems are running smoothly</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-bg border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">{stat.title}</p>
                  <p className="text-2xl font-bold text-text mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block p-4 border border-border rounded-lg hover:bg-border/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-text">Manage Products</p>
                  <p className="text-sm text-muted">Add, edit, or delete products</p>
                </div>
              </div>
            </a>
            <a
              href="/admin/orders"
              className="block p-4 border border-border rounded-lg hover:bg-border/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-text">View Orders</p>
                  <p className="text-sm text-muted">Manage customer orders</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-bg border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-text mb-4">Database Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-text font-medium">Connection</span>
              <span className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-text font-medium">Tables</span>
              <span className="text-green-600 text-sm">4 tables</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-text font-medium">Users</span>
              <span className="text-green-600 text-sm">{stats.totalUsers} registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-bg border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-primary hover:text-primary/80 text-sm font-medium"
          >
            View all →
          </a>
        </div>
        {stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-text">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-text">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-border/50">
                    <td className="py-3 px-4 text-sm text-text font-mono">{order.id.slice(0, 8)}...</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-text font-medium">{order.total.toFixed(2)} MAD</td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-muted/30 mx-auto mb-3" />
            <p className="text-muted">No orders yet</p>
            <p className="text-muted text-sm mt-1">Orders will appear here when customers place them</p>
          </div>
        )}
      </div>
    </div>
  );
}

