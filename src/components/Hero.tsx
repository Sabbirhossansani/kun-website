'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Droplets, Gem, Zap } from 'lucide-react';
import { Product } from '@/lib/data';
import Link from 'next/link';

interface HeroProps {
  featuredProduct?: Product | null;
  onQuickOrder?: (product: Product) => void;
}

export default function Hero({ featuredProduct, onQuickOrder }: HeroProps) {
  const heroImage = featuredProduct?.images?.[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-pink-50/30 to-slate-50 pt-8 pb-12 md:py-16">
      {/* Background Glow Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 ${featuredProduct ? 'lg:grid-cols-12' : ''} gap-8 items-center`}>
          
          {/* Left Text Banner */}
          <div className={`${featuredProduct ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl mx-auto text-center'} space-y-6 text-center ${featuredProduct ? 'lg:text-left' : ''}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-sm border border-amber-200">
              <Sparkles size={14} className="text-amber-600 animate-spin" />
              <span>Shine that never fades ✨</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Anti-Tarnish • Waterproof Jewellery by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-pink-600 to-rose-500 font-serif italic">KUN</span>
            </h1>

            <div className={`pt-2 flex flex-col sm:flex-row items-center justify-center ${featuredProduct ? 'lg:justify-start' : ''} gap-4`}>
              <a
                href="#products-section"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-pink-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Jewellery Collection</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

          {/* Right Dynamic Hero Image Card - ONLY RENDERED IF ADMIN SELECTED A HOT / FEATURED PRODUCT */}
          {featuredProduct && heroImage && (
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-white p-3 rounded-2xl shadow-xl border border-amber-100 transform hover:scale-[1.01] transition-transform duration-300">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-amber-50 relative group">
                  <img
                    src={heroImage}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay & Product Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
                    <div className="text-white space-y-2 w-full">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                          🔥 Hot Product
                        </span>
                        <span className="bg-white/20 backdrop-blur-md text-white font-extrabold text-sm px-3 py-1 rounded-full border border-white/30">
                          ৳{featuredProduct.price}
                        </span>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-white line-clamp-2 leading-snug">
                        {featuredProduct.title}
                      </h3>

                      {/* Action buttons */}
                      <div className="pt-1 flex gap-2">
                        {onQuickOrder && (
                          <button
                            onClick={() => onQuickOrder(featuredProduct)}
                            className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-extrabold text-xs rounded-lg shadow flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
                          >
                            <Zap size={14} className="fill-current" />
                            <span>Order Now</span>
                          </button>
                        )}
                        <Link
                          href={`/products/${featuredProduct.id}`}
                          className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-lg border border-white/30 transition-colors"
                        >
                          Details
                        </Link>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
