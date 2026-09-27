'use client';

import React from 'react';
import { Product } from '@/lib/data';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber-400" />
              <h2 className="font-bold text-base">Shopping Bag ({cartItems.length})</h2>
            </div>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="font-semibold text-gray-700">Your Cart is Empty</h3>
                <p className="text-xs text-gray-400 max-w-xs">
                  Browse our jewellery collection and add your favorite items.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-semibold text-xs rounded-full shadow-md"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200/80">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-gray-800 line-clamp-1">{item.product.title}</h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-pink-600 font-medium">{item.selectedVariant}</p>
                      )}
                      <div className="text-xs font-bold text-slate-900 mt-0.5">৳{item.product.price}</div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded bg-white text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQuantity(index, -1);
                          }}
                          className="px-2 py-0.5 text-gray-600 font-bold hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateQuantity(index, 1);
                          }}
                          className="px-2 py-0.5 text-gray-600 font-bold hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(index);
                        }}
                        className="text-gray-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Subtotal:</span>
                <span className="text-pink-600 text-lg">৳{subtotal}</span>
              </div>
              <p className="text-[11px] text-gray-500">
                * Shipping fee calculated at checkout.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
