'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/data';
import { Eye, Zap, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickOrder: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickOrder, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80';
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Calculate discount percentage if original price exists
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
      
      {/* Product Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {!product.inStock && (
            <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
              Out of Stock
            </span>
          )}
          {product.inStock && discountPercent > 0 && (
            <span className="bg-pink-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
              -{discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              Hot
            </span>
          )}
        </div>

        {/* Quick View Link */}
        <Link
          href={`/products/${product.id}`}
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white text-gray-700 hover:text-pink-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="View Details"
        >
          <Eye size={16} />
        </Link>
      </div>

      {/* Product Details Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow text-center items-center">
        {/* Category Pill */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="group-hover:text-pink-600 transition-colors">
          <h3 className="font-semibold text-xs sm:text-base text-gray-800 line-clamp-2 min-h-[36px] leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Price & Variants info */}
        <div className="mt-auto pt-2.5 w-full">
          <div className="flex items-baseline justify-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-900 text-base sm:text-lg">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {hasVariants && (
            <p className="text-[11px] text-gray-500 mt-0.5">
              {product.variants.map(v => `${v.options.length} ${v.name}s`).join(' • ')}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons (Add to Cart & Order Now) */}
      <div className="p-3 pt-0 grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onAddToCart) onAddToCart(product);
          }}
          disabled={!product.inStock}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            !product.inStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 active:scale-95'
          }`}
          title="Add to Cart"
        >
          <ShoppingBag size={13} className="text-amber-600 shrink-0" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickOrder(product);
          }}
          disabled={!product.inStock}
          className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all ${
            !product.inStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white shadow-sm active:scale-95'
          }`}
          title="Order Now"
        >
          <Zap size={13} className="fill-current shrink-0" />
          <span>Order Now</span>
        </button>
      </div>

    </div>
  );
}
