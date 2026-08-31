/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Star, Heart, ShoppingCart, SlidersHorizontal, Scale, X, Check } from 'lucide-react';
import { Product } from '../types';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, color: string) => void;
  onAddToWishlist: (product: Product) => void;
}

export default function ShopView({
  products,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist
}: ShopViewProps) {
  
  // Layout states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1400);
  const [selectedRam, setSelectedRam] = useState<string>('all');
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [onlyGaming, setOnlyGaming] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  
  // Comparison drawer entries
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Unique list of brands available
  const availableBrands = useMemo(() => {
    const brands = new Set(products.map(p => p.brand));
    return ['all', ...Array.from(brands)];
  }, [products]);

  // Handle addition/removal from comparison checklist
  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        return prev.filter(item => item.id !== product.id);
      }
      if (prev.length >= 3) {
        alert('Technological notice: You can compare a maximum of 3 devices simultaneously.');
        return prev;
      }
      return [...prev, product];
    });
  };

  // Perform multi-metric cascade filtering
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.brand.toLowerCase().includes(search.toLowerCase()) ||
                            p.processor.toLowerCase().includes(search.toLowerCase());
      
      const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
      const matchesPrice = p.price <= maxPrice;
      const matchesRam = selectedRam === 'all' || p.ram === selectedRam;
      const matchesStorage = selectedStorage === 'all' || p.storage === selectedStorage;
      const matchesGaming = !onlyGaming || p.isGaming;

      return matchesSearch && matchesBrand && matchesPrice && matchesRam && matchesStorage && matchesGaming;
    });

    // Sorting algorithm application
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'bestsellers') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [products, search, selectedBrand, maxPrice, selectedRam, selectedStorage, onlyGaming, sortBy]);

  return (
    <div className="bg-[#050505] min-h-screen py-10 text-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Banner Section Header with Sleek Interface Theme */}
        <div className="mb-10 text-left border-l-2 border-[#8B0000] pl-4 py-1">
          <span className="font-mono text-xs text-[#FF4D4D] tracking-widest uppercase">// SECURE ACTIVE STOCK</span>
          <h1 className="font-sans text-3xl font-black text-white tracking-tighter uppercase text-metallic">THE AETHER DEPOSITORY</h1>
        </div>

        {/* Search, Layout & Sort bar Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="SEARCH SPECIFICATIONS OR ENGINES..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-none py-3.5 pl-11 pr-4 font-mono text-xs text-white outline-none focus:border-[#8B0000] uppercase tracking-wider"
            />
            <Search className="absolute left-4 top-4 w-4 h-4 text-white/40" />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#080808] border border-zinc-900 rounded-lg px-4 py-3 font-mono text-xs text-zinc-400 outline-none focus:border-emerald-500 uppercase cursor-pointer"
            >
              <option value="featured">SIMULATION FEATURED</option>
              <option value="price-low">PRICE: INCREASING</option>
              <option value="price-high">PRICE: DECREASING</option>
              <option value="rating">HIGH CORE RATING</option>
              <option value="bestsellers">BEST SELLERS</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 p-1 bg-[#080808] border border-zinc-900 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded w-full flex justify-center items-center cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-zinc-900 text-[#03f47c]' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded w-full flex justify-center items-center cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-zinc-900 text-[#03f47c]' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Content Area split with left Filters Column */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column Controls */}
          <div className="bg-[#080808] border border-zinc-900/60 rounded-xl p-5 text-left h-fit space-y-6">
            <div className="flex items-center space-x-2 text-white border-b border-zinc-900 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider">CALIBRATE FILTERS</h3>
            </div>

            {/* Brands checkboxes */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-zinc-500 uppercase block tracking-wider">Manufacturer</label>
              <div className="flex flex-col space-y-1.5 font-mono text-[11px]">
                {availableBrands.map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`text-left px-2 py-1 rounded transition-colors truncate uppercase ${
                      selectedBrand === b 
                        ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/40' 
                        : 'text-zinc-500 hover:text-zinc-300 bg-transparent border border-transparent'
                    }`}
                  >
                    {b === 'all' ? 'show all' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                <span>Maximum boundary</span>
                <span className="text-white font-bold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min={600}
                max={1400}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
              />
            </div>

            {/* RAM options */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-zinc-500 uppercase block">RAM Allocation</label>
              <div className="grid grid-cols-3 gap-1 grid-rows-1 font-mono text-[10px]">
                {['all', '12GB', '16GB', '24GB'].map(ram => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={`p-1.5 rounded text-center border uppercase transition-all ${
                      selectedRam === ram 
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' 
                        : 'border-zinc-900 text-zinc-500'
                    }`}
                  >
                    {ram === 'all' ? 'All' : ram}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage options */}
            <div className="space-y-2">
              <label className="font-mono text-[9px] text-zinc-500 uppercase block">Storage Space</label>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                {['all', '256GB', '512GB', '1TB'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`p-1.5 rounded text-center border uppercase transition-all ${
                      selectedStorage === st 
                        ? 'border-emerald-500 bg-emerald-950/20 text-emerald-400' 
                        : 'border-zinc-900 text-zinc-500'
                    }`}
                  >
                    {st === 'all' ? 'All storage' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Gaming trigger toggle */}
            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-400 uppercase tracking-wider">Gaming Engines only</span>
              <button
                onClick={() => setOnlyGaming(!onlyGaming)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  onlyGaming ? 'bg-red-800' : 'bg-zinc-800'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${onlyGaming ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Column Results */}
          <div className="lg:col-span-3 space-y-6">
            
            {filteredProducts.length === 0 ? (
              <div className="bg-[#080808] rounded-xl border border-dashed border-zinc-900 p-20 text-center font-mono">
                <p className="text-zinc-600 text-sm">NO FLAGSHIPS RETRIEVED MEETING CALIBRATION DIRECTIVES.</p>
                <button
                  onClick={() => {
                    setSelectedBrand('all');
                    setMaxPrice(1400);
                    setSelectedRam('all');
                    setSelectedStorage('all');
                    setOnlyGaming(false);
                    setSearch('');
                  }}
                  className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded hover:bg-zinc-850"
                >
                  RESET CALIBRATION KEYS
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              
              /* GRID LAYOUT WITH GLASS CARDS AND CRIMSON REON ACCENTS */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map(prod => {
                  const compared = compareList.some(item => item.id === prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="glass-card hover:border-[#8B0000]/60 rounded-xl p-4 flex flex-col justify-between group overflow-hidden relative transition-all duration-300"
                    >
                      <div className="relative aspect-square bg-[#0b0b0b]/60 rounded-lg flex items-center justify-center p-6 mb-4 overflow-hidden">
                        <img
                          referrerPolicy="no-referrer"
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-contain mix-blend-screen scale-95 group-hover:scale-100 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToWishlist(prod); }}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-black/60 border border-white/5 rounded-full text-white/50 hover:text-[#FF4D4D] transition-colors z-10"
                        >
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-left space-y-1">
                        <span className="font-mono text-[9px] text-[#FF4D4D] leading-none block uppercase tracking-widest">{prod.brand}</span>
                        <h3 
                          onClick={() => onSelectProduct(prod.id)}
                          className="font-sans text-sm font-bold text-white hover:text-[#FF4D4D] cursor-pointer line-clamp-1 truncate transition-colors"
                        >
                          {prod.name}
                        </h3>
                        <div className="flex items-center space-x-1 text-amber-500 text-[10px] py-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-mono text-white/60">{prod.rating} ({prod.reviewCount})</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="text-left">
                          <span className="font-mono text-sm font-black text-white block">${prod.price}</span>
                          <button
                            onClick={() => toggleCompare(prod)}
                            className={`font-mono text-[9px] mt-1 flex items-center space-x-1 outline-none transition-colors ${
                              compared ? 'text-emerald-400' : 'text-zinc-550 hover:text-white'
                            }`}
                          >
                            <Scale className="w-3 h-3" />
                            <span>{compared ? 'COMPARED' : 'COMPARE'}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => onAddToCart(prod, prod.colors[0].name)}
                          className="p-2.5 rounded bg-white/5 hover:bg-[#8B0000] text-white/80 hover:text-white border border-white/10 hover:border-transparent transition-all cursor-pointer"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              
              /* LIST LAYOUT */
              <div className="space-y-4">
                {filteredProducts.map(prod => {
                  const compared = compareList.some(item => item.id === prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="bg-[#080808] border border-zinc-900 hover:border-emerald-950/50 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-6 text-left relative transition-all group"
                    >
                      <div className="w-32 h-32 flex-shrink-0 bg-[#0b0b0b] rounded-lg flex items-center justify-center p-3">
                        <img
                          referrerPolicy="no-referrer"
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-contain mix-blend-screen mix-blend-screen"
                        />
                      </div>

                      <div className="flex-grow space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-500 uppercase">{prod.brand}</span>
                          {prod.isGaming && <span className="font-mono text-[9px] bg-red-950/20 text-red-500 px-2 py-0.5 rounded border border-red-900/10">GAMING HARDWARE</span>}
                        </div>
                        <h3 
                          onClick={() => onSelectProduct(prod.id)}
                          className="font-sans text-base font-bold text-white hover:text-emerald-400 cursor-pointer mt-1"
                        >
                          {prod.name}
                        </h3>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                        
                        <div className="flex items-center space-x-1 text-yellow-500 text-[10px] pt-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-mono text-zinc-400 mr-4">{prod.rating}</span>
                          <span className="font-mono text-zinc-600">// PROC: {prod.processor}</span>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-zinc-900 pt-4 sm:pt-0 gap-4">
                        <div className="text-left sm:text-right">
                          <span className="font-mono text-base font-extrabold text-white block">${prod.price}</span>
                          <button
                            onClick={() => toggleCompare(prod)}
                            className={`font-mono text-[9px] mt-1 flex items-center space-x-1 outline-none ${
                              compared ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                          >
                            <Scale className="w-3 h-3" />
                            <span>{compared ? 'COMPARED' : 'COMPARE SPEC'}</span>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onAddToWishlist(prod); }}
                            className="p-2.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-red-500 border border-zinc-800"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAddToCart(prod, prod.colors[0].name)}
                            className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/50 px-4 py-2 rounded text-xs font-mono uppercase"
                          >
                            ADD ASSET
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Spec Comparison Drawer Panel */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#050505]/95 border-t border-emerald-950/80 shadow-2xl z-40 p-5 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4.5 h-4.5 text-emerald-500" />
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                    COMPARISON TERMINAL ({compareList.length} / 3 DEVICES)
                  </h4>
                </div>
                <button
                  onClick={() => setCompareList([])}
                  className="font-mono text-[9px] text-zinc-500 hover:text-red-500 border border-zinc-800 hover:border-red-950 px-2 py-1 rounded"
                >
                  CLEAR GRID
                </button>
              </div>

              {/* Comparison Matrix Table */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
                <div className="hidden md:flex flex-col justify-around font-mono text-[10px] text-zinc-650 uppercase text-left space-y-2 py-4">
                  <div className="h-10">Product Identity</div>
                  <div>Processor Engine</div>
                  <div>RAM Config</div>
                  <div>Storage Boundary</div>
                  <div>Display Parameters</div>
                  <div>Base Price</div>
                </div>

                {compareList.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#080808] border border-zinc-900 rounded p-3 text-left relative flex flex-col justify-between font-mono text-[11px]"
                  >
                    <button
                      onClick={() => toggleCompare(item)}
                      className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="h-10 truncate font-bold text-white pr-6 uppercase">{item.name}</div>
                    <div className="py-2 border-t border-zinc-900/60 text-zinc-400 capitalize truncate font-sans text-xs">{item.processor}</div>
                    <div className="py-2 border-t border-zinc-900/60 text-[#03f47c]">{item.ram}</div>
                    <div className="py-2 border-t border-zinc-900/60 text-zinc-400">{item.storage}</div>
                    <div className="py-2 border-t border-zinc-900/60 text-zinc-500 truncate text-[10px]">{item.display}</div>
                    <div className="py-2 border-t border-zinc-900/60 font-bold text-white text-xs">${item.price}</div>
                  </div>
                ))}

                {/* Empty block overlays */}
                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                  <div
                    key={i}
                    className="hidden md:flex items-center justify-center border border-dashed border-zinc-900/40 rounded p-8 font-mono text-[10px] text-zinc-700 uppercase"
                  >
                    Select device parameter
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NEW SECTION: PRE-ORDER ACCELERATOR & DISPATCH PROTOCOLS */}
        <section className="py-20 mt-24 border-t border-zinc-900/80 text-left">
          <div className="mb-14 text-left border-l-2 border-red-850 pl-4 py-1">
            <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest">// DEPOST-LOG DEPLOYMENT</span>
            <h2 className="font-sans text-2xl font-black text-white mt-1 uppercase tracking-tight text-metallic">WARRANTY ARMOR & EXTREME DISPATCH</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 uppercase max-w-2xl">
              Fully insured global transport pathways. Every device shipment is routed through optimized air freight channels inside sealed graphite container casings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-[10.5px]">
            
            <div className="p-6 bg-[#080808]/80 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-emerald-400 font-bold uppercase block tracking-wider">// PROTOCOL 01: GRAPHITE SHIELD</span>
              <h3 className="font-sans text-sm font-bold text-white uppercase">Thermal Pack Armor</h3>
              <p className="text-zinc-500 leading-relaxed uppercase">
                We pack our premium flagships inside sealed thermal graphite outer container frames to prevent severe pressure anomalies during high-altitude aircraft shipping.
              </p>
            </div>

            <div className="p-6 bg-[#080808]/80 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-emerald-400 font-bold uppercase block tracking-wider">// PROTOCOL 02: LUX DESK REF</span>
              <h3 className="font-sans text-sm font-bold text-white uppercase">Direct Developer Desk</h3>
              <p className="text-zinc-500 leading-relaxed uppercase">
                Your credentials whitelist you for direct email correspondence with Chief Lead Siddique Umar. Have custom firmware requested or spec mods arranged natively before delivery.
              </p>
            </div>

            <div className="p-6 bg-[#080808]/80 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-emerald-400 font-bold uppercase block tracking-wider">// PROTOCOL 03: 48H SHIP RET</span>
              <h3 className="font-sans text-sm font-bold text-white uppercase">Express Flight Escrow</h3>
              <p className="text-zinc-500 leading-relaxed uppercase">
                Orders qualify for priority dispatch within 12 hours. Average delivery to regional logistics nodes completes in 48 hours, protected by full escrow replacement guarantees.
              </p>
            </div>

            <div className="p-6 bg-[#080808]/80 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-[#FF4D4D] font-bold uppercase block tracking-wider">// PROTOCOL 04: SYS RECOVERY</span>
              <h3 className="font-sans text-sm font-bold text-white uppercase">2-Year Core Warranty</h3>
              <p className="text-zinc-500 leading-relaxed uppercase">
                Every customized asset is associated with an active system waiver. If physical drop damage occurs, receive dedicated clean-chamber replacements at core labor expenses.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
