'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import QuickOrderModal from '@/components/QuickOrderModal';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import { Product } from '@/lib/data';
import { Sparkles, Package, RefreshCw } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Order Modal & Cart Checkout State
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [checkoutCartItems, setCheckoutCartItems] = useState<CartItem[] | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load Products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Categories list dynamically
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuickOrder = (product: Product) => {
    setCheckoutCartItems(null);
    setQuickOrderProduct(product);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    setCartItems(prev => {
      return prev.reduce<CartItem[]>((acc, item, i) => {
        if (i === index) {
          const newQty = item.quantity + delta;
          if (newQty > 0) {
            acc.push({ ...item, quantity: newQty });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamically get the featured product ONLY if explicitly selected as Hot/Featured by admin
  const featuredProduct = products.find(p => Boolean(p.featured)) || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Header Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* Hero Banner (Shows right card ONLY if admin checked a product as Hot / Featured) */}
      <Hero 
        featuredProduct={featuredProduct}
        onQuickOrder={handleQuickOrder}
      />

      {/* Main Catalog Section */}
      <main id="products-section" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Section Title & Filter Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={16} />
              <span>Explore KUN Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Jewellery</h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 max-w-full overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-amber-500 mx-auto" />
            <p className="text-sm font-semibold text-gray-500">Loading jewellery collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Search/Category State */
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 space-y-3 max-w-md mx-auto my-8">
            <Package size={48} className="text-amber-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-lg">No Products Found</h3>
            <p className="text-xs text-gray-500">
              {searchQuery ? `No products found matching "${searchQuery}".` : 'No products available in this category yet.'}
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-full transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickOrder={handleQuickOrder}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </main>

      {/* Quick Order Modal */}
      <QuickOrderModal
        product={quickOrderProduct}
        cartItems={checkoutCartItems}
        onClose={() => {
          setQuickOrderProduct(null);
          setCheckoutCartItems(null);
        }}
        onOrderCreated={() => {
          if (checkoutCartItems) {
            setCartItems([]);
          }
          fetchProducts();
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          if (cartItems.length > 0) {
            setQuickOrderProduct(null);
            setCheckoutCartItems([...cartItems]);
          }
        }}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
