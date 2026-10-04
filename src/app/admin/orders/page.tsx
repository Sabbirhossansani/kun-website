'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import { Order } from '@/lib/data';
import { Phone, MapPin, Calendar, Truck, Search, RefreshCw, MessageSquare, Trash2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer order?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatusFilter === 'All' || o.status === selectedStatusFilter;
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phone.includes(searchQuery) ||
                          o.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <AdminAuthGuard>
      <div className="min-h-screen flex flex-col bg-slate-100">
        <AdminNavbar />

        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Customer Orders Management</h1>
              <p className="text-xs text-gray-500 mt-0.5">View, update status, or delete incoming customer orders.</p>
            </div>

            <button
              onClick={fetchOrders}
              className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold text-xs flex items-center gap-2 self-start"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin text-pink-500' : ''} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Filter Pills & Search */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {statuses.map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedStatusFilter === st
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search name, phone or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-3.5 pr-8 text-xs focus:outline-none focus:border-pink-500"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-gray-400" />
            </div>

          </div>

          {/* Orders Card / Table view */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 text-gray-400 text-xs font-medium">
                No customer orders found.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                  
                  {/* Top Row: Order ID, Date, Status dropdown & Delete Order Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-base text-slate-900">
                        Order #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Status dropdown & Delete Order Action */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-500">Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order['status'])}
                          className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border cursor-pointer ${
                            ord.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      {/* Delete Order Button */}
                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>

                  {/* Details grid: Customer details & Items */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                    
                    {/* Left: Customer Info */}
                    <div className="md:col-span-5 bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                      <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider">Customer Info:</h4>
                      <p className="text-slate-900 font-extrabold text-sm">{ord.customerName}</p>
                      
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={14} className="text-pink-500 shrink-0" />
                        <a href={`tel:${ord.phone}`} className="font-mono font-bold text-pink-600 hover:underline">
                          {ord.phone}
                        </a>
                        <a
                          href={`https://wa.me/88${ord.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded flex items-center gap-1 hover:bg-emerald-200"
                          title="WhatsApp Chat"
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                      </div>

                      <div className="flex items-start gap-2 text-gray-600">
                        <MapPin size={14} className="text-pink-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{ord.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 pt-1">
                        <Truck size={14} className="text-pink-500 shrink-0" />
                        <span>Delivery Zone: <b>{ord.deliveryZone === 'outside_dhaka' ? 'Outside Dhaka (৳130)' : 'Inside Dhaka (৳70)'}</b></span>
                      </div>
                    </div>

                    {/* Right: Ordered Items */}
                    <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2">Ordered Items:</h4>
                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200">
                              {item.productImage && (
                                <img src={item.productImage} alt="" className="w-12 h-12 object-cover rounded shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-slate-900 text-xs truncate">{item.productTitle}</h5>
                                {item.selectedVariant && (
                                  <span className="text-[11px] text-pink-600 font-semibold">{item.selectedVariant}</span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-900">৳{item.price} × {item.quantity}</span>
                                <div className="text-pink-600 font-extrabold text-xs">৳{item.price * item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Summary */}
                      <div className="flex items-center justify-between border-t border-gray-200 pt-3 bg-slate-900 text-white p-3 rounded-xl">
                        <span className="text-xs text-gray-300">
                          Subtotal: ৳{ord.subtotal} + Delivery Fee: ৳{ord.deliveryFee}
                        </span>
                        <div className="text-right">
                          <span className="text-[10px] text-pink-300 block uppercase font-bold">Total Amount</span>
                          <span className="text-lg font-extrabold text-pink-400">৳{ord.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
