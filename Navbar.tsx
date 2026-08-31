/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, ShieldCheck, Cpu, Menu, X, HelpCircle } from 'lucide-react';
import { Product } from '../types';

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  user: any;
  onLogout: () => void;
  onToggleChatbot: () => void;
}

export default function Navbar({
  activePage,
  onPageChange,
  cartCount,
  wishlistCount,
  user,
  onLogout,
  onToggleChatbot
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatar, setAvatar] = useState<string>(() => {
    return localStorage.getItem('aetheron_custom_avatar_siddique') || '';
  });

  useEffect(() => {
    const handleUpdate = () => {
      setAvatar(localStorage.getItem('aetheron_custom_avatar_siddique') || '');
    };
    window.addEventListener('avatar-changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('avatar-changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const navItems = [
    { id: 'HOME', label: 'Lounge' },
    { id: 'SHOP', label: 'Store' },
    { id: 'ABOUT_US', label: 'Vision' },
    { id: 'BLOG', label: 'News' },
    { id: 'CONTACT', label: 'Support' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/40 border-b border-white/5 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand with glowing text */}
          <div 
            onClick={() => onPageChange('HOME')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-[#8B0000] to-[#062E22] rounded-lg rotate-45 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_12px_rgba(139,0,0,0.4)] transition-all duration-300">
              <div className="w-4.5 h-4.5 bg-zinc-950 rounded-sm rotate-[-45deg] flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-white group-hover:text-[#FF4D4D] transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-sans text-xl font-black tracking-tighter italic text-white block">
                AETHERON <span className="text-[#FF4D4D]">X-NEON</span>
              </span>
              <p className="font-sans text-[8px] text-white/40 tracking-widest uppercase">Cyber-Evo Platform</p>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <div className="hidden md:flex space-x-2 bg-black/30 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                  activePage === item.id
                    ? 'text-[#FF4D4D] border-b-2 border-[#8B0000] bg-white/5 shadow-[0_4px_12px_rgba(139,0,0,0.15)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User Utilities Indicators */}
          <div className="hidden md:flex items-center space-x-5">
            
            {/* AI Assistant Floating Button trigger with Design's neon-red status dot */}
            <button
              onClick={onToggleChatbot}
              className="relative p-2 hover:bg-white/5 rounded-full text-white/70 hover:text-white transition-all outline-none"
              title="AERA Shopping AI"
            >
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#8B0000] rounded-full neon-red-glow"></span>
              <HelpCircle className="w-5 h-5 animate-pulse" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => onPageChange('WISHLIST')}
              className="relative p-2 text-white/70 hover:text-white transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B0000] text-[9px] font-bold text-white rounded-full flex items-center justify-center neon-red-glow animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon in Sleek Mode */}
            <button
              onClick={() => onPageChange('CART')}
              className="relative p-2 text-white/70 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#062E22] text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white/20">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Separate Space Separator */}
            <span className="h-5 w-px bg-white/10" />

            {/* User State & Admin control trigger in Sleek Interface Design */}
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onPageChange(user.role === 'admin' ? 'ADMIN_DASHBOARD' : 'USER_DASHBOARD')}
                  className="flex items-center space-x-2.5 font-sans text-xs tracking-wider font-semibold text-white/90 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[#8B0000] p-0.5 overflow-hidden shadow-[0_0_10px_rgba(139,0,0,0.3)] select-none">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile Avatar"
                        className="w-full h-full rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-800 rounded-full flex items-center justify-center text-[8px] font-black text-white">
                        {user.role === 'admin' ? 'ADMIN' : 'USER'}
                      </div>
                    )}
                  </div>
                  <span className="truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onPageChange('ADMIN_DASHBOARD')}
                    className="flex items-center space-x-1 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 border border-[#8B0000]/40 text-[#FF4D4D] text-[10px] px-2.5 py-1 rounded font-mono"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SYSTEM CONTROL</span>
                  </button>
                )}
                <button
                  onClick={onLogout}
                  className="font-mono text-[10px] text-zinc-500 hover:text-red-400 transition-colors"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => onPageChange('LOGIN')}
                className="font-sans text-xs font-bold tracking-widest text-white bg-[#8B0000] hover:bg-neutral-900 border border-transparent hover:border-white/10 px-5 py-2.5 rounded-none transition-all duration-300 neon-red-glow"
              >
                SIGN IN TERMINAL
              </button>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={onToggleChatbot}
              className="p-1.5 rounded bg-zinc-950 border border-emerald-950 text-emerald-400"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange('CART')}
              className="relative p-1.5 text-zinc-400"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-emerald-950/60 py-4 px-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded font-mono text-xs uppercase ${
                  activePage === item.id
                    ? 'bg-emerald-950 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-zinc-900 pt-3 flex flex-col space-y-2">
            <button
              onClick={() => {
                onPageChange('WISHLIST');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-1.5 text-zinc-400 hover:text-white font-mono text-xs flex items-center space-x-2"
            >
              <Heart className="w-4 h-4 text-zinc-500" />
              <span>My Wishlist ({wishlistCount})</span>
            </button>
            
            {user ? (
              <div className="space-y-2 px-3 pt-1">
                <p className="font-mono text-xs text-zinc-500 uppercase">
                  Connected: <span className="text-emerald-400">{user.name}</span>
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      onPageChange(user.role === 'admin' ? 'ADMIN_DASHBOARD' : 'USER_DASHBOARD');
                      setMobileMenuOpen(false);
                    }}
                    className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-mono px-3 py-1.5 rounded w-full"
                  >
                    DASHBOARD
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-red-950/20 text-red-500 text-[11px] font-mono px-3 py-1.5 rounded w-full"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onPageChange('LOGIN');
                  setMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500/50 text-white font-mono text-xs p-2.5 rounded text-center w-full shadow-md"
              >
                SIGN IN TERMINAL
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
