/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Cpu, ShieldCheck, Mail, Phone, Clock, MapPin } from 'lucide-react';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export default function Footer({ onPageChange }: FooterProps) {
  const [emailSub, setEmailSub] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSuccess(true);
    setEmailSub('');
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#050505] text-gray-400 border-t border-emerald-950/40 pt-16 pb-8 relative overflow-hidden">
      
      {/* Background radial matrix flare */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Why Choose Us Block with animated layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-zinc-900">
          <div className="flex items-start space-x-3.5 bg-zinc-950/60 p-5 rounded-lg border border-emerald-950/20">
            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-mono text-sm text-white font-bold tracking-wider">GENUINE SHIELD</h4>
              <p className="text-xs text-zinc-500 mt-1">100% factory-sealed original product lines direct from premium tech laboratories.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5 bg-zinc-950/60 p-5 rounded-lg border border-emerald-950/20">
            <Cpu className="w-8 h-8 text-emerald-400 flex-shrink-0 animate-pulse" />
            <div>
              <h4 className="font-mono text-sm text-white font-bold tracking-wider">HYPERSONIC DELIVERIES</h4>
              <p className="text-xs text-zinc-500 mt-1">State-of-the-art secure routing guarantees doorstep clearance within 24-48 hours.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3.5 bg-zinc-950/60 p-5 rounded-lg border border-emerald-950/20">
            <ShieldCheck className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="font-mono text-sm text-white font-bold tracking-wider">WARRANTY ARMOR</h4>
              <p className="text-xs text-zinc-500 mt-1">2 Year complete physical hardware waiver and hassle-free diagnostic replacement.</p>
            </div>
          </div>
        </div>

        {/* Mega Footer Sitemaps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12 pt-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <span className="font-mono text-lg font-extrabold tracking-wider text-white">
                AETHER<span className="text-emerald-500">ON</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Creating high-fidelity mobile electronics for visionaries, professional creators, and elite gamers. Experience luxury smartphones reimagined through physics projections and futuristic thermal nodes.
            </p>
            
            {/* Newsletter element */}
            <div className="pt-2">
              <h5 className="font-mono text-xs text-zinc-300 uppercase tracking-widest mb-2">Subscribe to Lab Notes</h5>
              <form onSubmit={handleSubscribe} className="flex max-w-xs">
                <input
                  type="email"
                  placeholder="ENTER SECURE EMAIL"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="bg-zinc-950 border border-emerald-950/80 text-white font-mono text-[10px] uppercase px-3 py-2 w-full rounded-l outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/50 px-4 rounded-r font-mono text-[10px]"
                >
                  JOIN
                </button>
              </form>
              {success && (
                <p className="text-[10px] text-emerald-500 font-mono mt-1 animate-pulse">✓ Encryption complete. Welcome aboard.</p>
              )}
            </div>
          </div>

          {/* Core Categories Links */}
          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Categories</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onPageChange('SHOP')} className="hover:text-emerald-400 transition-colors">
                  ⚡ Gaming Devices
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('SHOP')} className="hover:text-emerald-400 transition-colors">
                  📸 Executive Optics
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('SHOP')} className="hover:text-emerald-400 transition-colors">
                  🔋 Ultra endurance
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('SHOP')} className="hover:text-emerald-400 transition-colors">
                  🆕 New Launches
                </button>
              </li>
            </ul>
          </div>

          {/* Sitemap / Useful */}
          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Services</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onPageChange('HOME')} className="hover:text-emerald-400 transition-colors">
                  Product Unboxings
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('BLOG')} className="hover:text-emerald-400 transition-colors">
                  Technical News
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('CONTACT')} className="hover:text-emerald-400 transition-colors">
                  Live Tech Desk
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('ORDER_TRACKING')} className="hover:text-emerald-400 transition-colors">
                  Order Dispatch Log
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Legal Policies */}
          <div>
            <h5 className="font-mono text-xs text-white uppercase tracking-widest mb-4">Policies</h5>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button onClick={() => onPageChange('PRIVACY_POLICY')} className="hover:text-red-400 transition-colors">
                  // Privacy Guard
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('TERMS')} className="hover:text-red-400 transition-colors">
                  // Terms waiver
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('RETURN_POLICY')} className="hover:text-red-400 transition-colors">
                  // Return waiver
                </button>
              </li>
              <li>
                <button onClick={() => onPageChange('CONTACT')} className="hover:text-red-400 transition-colors">
                  // Support loop
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright segment */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <p>© 2026 AETHERON Laboratories Inc. Designed for premium technology and electronics visions.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 font-mono text-[10px]">
            <span className="hover:text-zinc-400 cursor-pointer">DISCORD.SHIELD</span>
            <span className="hover:text-zinc-400 cursor-pointer">X.HOLOGRAPH</span>
            <span className="hover:text-zinc-400 cursor-pointer">MATRIX.SECURE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
