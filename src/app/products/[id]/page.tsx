'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuickOrderModal from '@/components/QuickOrderModal';
import CartDrawer, { CartItem } from '@/components/CartDrawer';
import { Product } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Truck, ShieldCheck, Zap, RefreshCw, ShoppingBag } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [checkoutCartItems, setCheckoutCartItems] = useState<CartItem[] | null>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
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

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setActiveImage(data.images[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header cartCount={0} onOpenCart={() => {}} />
        <div className="flex-1 flex items-center justify-center py-20">
          <RefreshCw size={36} className="animate-spin text-amber-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header cartCount={0} onOpenCart={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
          <p className="text-xs text-gray-500">Sorry, no product was found with this ID.</p>
          <Link href="/" className="px-6 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-full shadow-md">
            View All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'];
  const currentImage = activeImage || images[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header cartCount={totalCartCount} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-amber-600 mb-6 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to All Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white p-5 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          
          {/* Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
              <img
                src={currentImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {!product.inStock && (
                <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      currentImage === img ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Info */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-100">
              <span className="text-3xl font-extrabold text-slate-900">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-semibold">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variants View */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 border-t border-b border-gray-100 py-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Available Variants:</h4>
                {product.variants.map((v, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">{v.name}:</span>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map(option => (
                        <span key={option} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-semibold text-gray-700">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description:</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                {product.description || 'Description for this product will be updated soon.'}
              </p>
            </div>

            {/* Order Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full sm:w-1/2 py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                    !product.inStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 shadow-sm active:scale-98'
                  }`}
                >
                  <ShoppingBag size={18} className="text-amber-600 shrink-0" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => setShowOrderModal(true)}
                  disabled={!product.inStock}
                  className={`w-full sm:w-1/2 py-3.5 px-4 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                    !product.inStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white shadow-amber-500/25 active:scale-98'
                  }`}
                >
                  <Zap size={18} className="fill-current shrink-0" />
                  <span>{product.inStock ? 'Order Now' : 'Out of Stock'}</span>
                </button>
              </div>

              <a
                href={`https://wa.me/8801858931317?text=${encodeURIComponent(`Hello KUN! I am interested in: ${product.title} (৳${product.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Contact via WhatsApp</span>
              </a>
            </div>

            {/* Delivery Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
              <div className="p-2">
                <Truck size={20} className="text-amber-500 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-gray-600 block">Fast Express Delivery</span>
              </div>
              <div className="p-2">
                <ShieldCheck size={20} className="text-amber-500 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-gray-600 block">100% Anti-Tarnish</span>
              </div>
              <div className="p-2">
                <CheckCircle2 size={20} className="text-amber-500 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-gray-600 block">100% Premium Quality</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <QuickOrderModal
        product={showOrderModal ? product : null}
        cartItems={checkoutCartItems}
        onClose={() => {
          setShowOrderModal(false);
          setCheckoutCartItems(null);
        }}
        onOrderCreated={() => {
          if (checkoutCartItems) {
            setCartItems([]);
          }
        }}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(index, delta) => {
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
        }}
        onRemoveItem={(index) => {
          setCartItems(prev => prev.filter((_, i) => i !== index));
        }}
        onProceedToCheckout={() => {
          setCartOpen(false);
          setCheckoutCartItems([...cartItems]);
        }}
      />

      <Footer />
    </div>
  );
}
