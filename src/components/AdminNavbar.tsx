'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Store, ExternalLink } from 'lucide-react';

export default function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <img
                src="/kun-logo.png"
                alt="KUN BY SAFA"
                className="w-8 h-8 object-cover rounded-full border border-pink-400"
              />
              <span className="font-extrabold text-lg text-white font-serif">KUN Owner Dashboard</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'bg-pink-500 text-white'
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* View Website Button */}
          <Link
            href="/"
            target="_blank"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Store size={14} className="text-amber-400" />
            <span>Visit Storefront</span>
            <ExternalLink size={12} className="text-gray-400" />
          </Link>

        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-950">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-3 text-center text-[11px] font-bold flex flex-col items-center gap-1 ${
                isActive ? 'text-pink-400 border-b-2 border-pink-500' : 'text-gray-400'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
