'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import Link from 'next/link';
import { Product, Order } from '@/lib/data';
import { Package, ShoppingBag, DollarSign, Clock, ArrowRight, Plus, RefreshCw } from 'lucide-react';

export default function AdminOverviewPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (ordRes.ok) setOrders(await ordRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <AdminNavbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Owner Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Welcome back! Manage your KUN store products, customer orders, and sales metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <Link
                href="/admin/products"
                className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </Link>
            </div>
          </div>

          {/* Analytics Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                <Package size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Products</span>
                <h3 className="text-2xl font-extrabold text-slate-900">{products.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Orders</span>
                <h3 className="text-2xl font-extrabold text-slate-900">{orders.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Pending Orders</span>
                <h3 className="text-2xl font-extrabold text-amber-600">{pendingOrders}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Sales</span>
                <h3 className="text-2xl font-extrabold text-emerald-600">৳{totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

          </div>

          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Recent Customer Orders</h3>
                <p className="text-xs text-gray-500">Latest orders placed by customers</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-xs font-medium">
                  No orders placed yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 uppercase font-bold text-[11px] border-b border-gray-200">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">Address</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-pink-50/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{ord.orderNumber}</td>
                        <td className="p-4">{ord.customerName}</td>
                        <td className="p-4 font-mono text-gray-600">{ord.phone}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{ord.address}</td>
                        <td className="p-4 font-extrabold text-pink-600">৳{ord.totalAmount}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ord.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                            ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Link
                            href="/admin/orders"
                            className="text-pink-600 font-bold hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
