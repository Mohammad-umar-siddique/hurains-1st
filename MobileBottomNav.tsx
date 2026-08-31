import React from 'react';
import { Home, ShoppingBag, MessageSquare, ShoppingCart, Search } from 'lucide-react';

interface MobileBottomNavProps {
  onPageChange: (page: string) => void;
  cartCount: number;
  onToggleChatbot: () => void;
}

export default function MobileBottomNav({ onPageChange, cartCount, onToggleChatbot }: MobileBottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-lg border-t border-zinc-900 z-50 py-2 px-6 flex justify-between items-center text-zinc-400">
      <button onClick={() => onPageChange('HOME')} className="flex flex-col items-center gap-1">
        <Home className="w-5 h-5" />
        <span className="text-[8px] uppercase">Home</span>
      </button>
      <button onClick={() => onPageChange('SHOP')} className="flex flex-col items-center gap-1">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[8px] uppercase">Store</span>
      </button>
      <button onClick={onToggleChatbot} className="flex flex-col items-center gap-1 -mt-6 bg-[#8B0000] p-3 rounded-full text-white shadow-lg">
        <MessageSquare className="w-6 h-6" />
      </button>
      <button onClick={() => onPageChange('CART')} className="flex flex-col items-center gap-1 relative">
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[8px] uppercase">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-emerald-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
      <button onClick={() => onPageChange('SEARCH')} className="flex flex-col items-center gap-1">
          <Search className="w-5 h-5" />
          <span className="text-[8px] uppercase">Search</span>
      </button>
    </div>
  );
}
