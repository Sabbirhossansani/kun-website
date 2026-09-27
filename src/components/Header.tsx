'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Instagram, Facebook, Menu, X, Sparkles, Gem } from 'lucide-react';

// Official TikTok SVG Icon
const TikTokIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89 2.84 2.84 0 0 1 1.48.41V9.66a6.34 6.34 0 0 0-1.48-.17 6.34 6.34 0 1 0 6.34 6.34V8.41a8.3 8.3 0 0 0 4.88 1.58V6.54a4.85 4.85 0 0 1-1.11.15z" />
  </svg>
);

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch?: (query: string) => void;
}

export default function Header({ cartCount, onOpenCart, onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-pink-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src="/kun-logo.png"
              alt="KUN BY SAFA"
              className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-full shadow-md border border-pink-200 group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col shrink-0">
              <span className="font-extrabold text-xl sm:text-2xl tracking-wider sm:tracking-widest text-slate-900 font-serif whitespace-nowrap">K U N</span>
              <span className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-widest text-pink-600 uppercase font-bold -mt-1 whitespace-nowrap">BY SAFA</span>
            </div>
          </Link>

          {/* Search bar (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search anti-tarnish rings, necklaces, bracelets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-3 text-gray-400 hover:text-amber-500">
              <Search size={18} />
            </button>
          </form>

          {/* Right Actions & Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-2">
              <a 
                href="https://www.instagram.com/ku.n_2530?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-pink-600 bg-gray-50 hover:bg-pink-50 rounded-full border border-gray-200 transition-colors"
                title="Instagram @ku.n_2530"
              >
                <Instagram size={16} className="text-pink-500" />
              </a>

              <a 
                href="https://www.facebook.com/share/1F2EhPLNtR/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-full border border-gray-200 transition-colors"
                title="Facebook Page"
              >
                <Facebook size={16} className="text-blue-600" />
              </a>

              <a 
                href="https://www.tiktok.com/search?q=ku.n_2530" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-slate-900 bg-gray-50 hover:bg-slate-100 rounded-full border border-gray-200 transition-colors"
                title="TikTok @ku.n_2530"
              >
                <TikTokIcon size={16} className="text-slate-900" />
              </a>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-full transition-colors flex items-center justify-center shadow-sm"
              aria-label="View Cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-amber-500"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-3 px-2">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 rounded-md"
            >
              Home Page
            </Link>
            <a 
              href="#products-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-pink-50 hover:text-pink-600 rounded-md"
            >
              All Jewellery
            </a>
            
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <a 
                href="https://www.instagram.com/ku.n_2530" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-semibold text-pink-600 bg-pink-50 rounded-md flex items-center gap-2"
              >
                <Instagram size={16} /> Instagram @ku.n_2530
              </a>
              <a 
                href="https://www.facebook.com/share/1F2EhPLNtR/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md flex items-center gap-2"
              >
                <Facebook size={16} /> Facebook Page
              </a>
              <a 
                href="https://www.tiktok.com/search?q=ku.n_2530" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-md flex items-center gap-2"
              >
                <TikTokIcon size={16} /> TikTok @ku.n_2530
              </a>
            </div>

          </div>
        )}
      </div>
    </header>
  );
}
