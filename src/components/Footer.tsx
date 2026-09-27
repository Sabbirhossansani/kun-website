'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Phone, MapPin, Mail, Gem, Heart } from 'lucide-react';

// Official TikTok SVG Icon
const TikTokIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89 2.84 2.84 0 0 1 1.48.41V9.66a6.34 6.34 0 0 0-1.48-.17 6.34 6.34 0 1 0 6.34 6.34V8.41a8.3 8.3 0 0 0 4.88 1.58V6.54a4.85 4.85 0 0 1-1.11.15z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 text-xs sm:text-sm pt-12 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/kun-logo.png"
                alt="KUN BY SAFA"
                className="w-9 h-9 object-cover rounded-full border border-pink-400/30"
              />
              <span className="font-extrabold text-2xl text-white font-serif tracking-widest">K U N</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-xs">
              ✨ <b>Shine that never fades!</b><br />
              Anti-Tarnish • Waterproof Jewellery<br />
              Made for everyday elegance 💍
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/ku.n_2530?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400 flex items-center justify-center text-pink-500 hover:scale-110 transition-transform"
                title="Instagram @ku.n_2530"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://www.facebook.com/share/1F2EhPLNtR/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400 flex items-center justify-center text-blue-500 hover:scale-110 transition-transform"
                title="Facebook Page"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://www.tiktok.com/search?q=ku.n_2530"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-400 flex items-center justify-center text-white hover:scale-110 transition-transform"
                title="TikTok @ku.n_2530"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quality Guarantee */}
          <div className="space-y-3 md:mx-auto">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Quality Guarantee</h4>
            <ul className="space-y-2">
              <li><span>✨ 100% Anti-Tarnish Protection</span></li>
              <li><span>💧 Waterproof & Daily Wear Safe</span></li>
              <li><span>💍 Premium Quality Plating</span></li>
              <li><span>🌸 Hypoallergenic & Skin Friendly</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 md:ml-auto">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-400 shrink-0" />
                <span>01858931317</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <span>Savar, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-400 shrink-0" />
                <span>kunbysafa@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} KUN Anti-Tarnish Jewellery. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-pink-500 fill-current" /> for KUN Jewellery
          </p>
        </div>
      </div>
    </footer>
  );
}
