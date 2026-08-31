/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, Heart, ShoppingCart, ShieldAlert, Cpu, Hammer, Zap, Play, Check } from 'lucide-react';
import { Product, Review } from '../types';
import Phone3DViewer from './Phone3DViewer';

interface ProductDetailsViewProps {
  productId: string;
  onAddToCart: (product: Product, color: string) => void;
  onAddToWishlist: (product: Product) => void;
  onBackToShop: () => void;
  onNavigateToProduct: (id: string) => void;
  products: Product[];
}

export default function ProductDetailsView({
  productId,
  onAddToCart,
  onAddToWishlist,
  onBackToShop,
  onNavigateToProduct,
  products
}: ProductDetailsViewProps) {
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="bg-[#050505] text-zinc-500 py-24 text-center font-mono">
        <p>TECHNOLOGICAL EXCEPTION: ASSORTED ID UNVERIFIED.</p>
        <button onClick={onBackToShop} className="mt-4 px-4 py-2 bg-zinc-900 text-white rounded">RETRACT</button>
      </div>
    );
  }

  // Configurations states
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewNameInput, setReviewNameInput] = useState('');
  const [addingReview, setAddingReview] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'3d' | 'video'>('3d');
  const [cartSuccess, setCartSuccess] = useState(false);

  // Fetch reviews from endpoint
  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${product.id}`);
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
    setSelectedColor(product.colors[0]);
    setActiveMediaTab('3d');
  }, [productId, product]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewNameInput.trim() || !commentInput.trim()) return;
    setAddingReview(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewNameInput,
          rating: ratingInput,
          comment: commentInput
        })
      });

      if (response.ok) {
        setReviewNameInput('');
        setCommentInput('');
        fetchReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setAddingReview(false);
    }
  };

  // Filter 3 related models based on brand or type
  const relatedModels = products.filter(p => p.id !== product.id).slice(0, 3);

  const handleAddToCartWithNotification = () => {
    onAddToCart(product, selectedColor.name);
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 3000);
  };

  return (
    <div className="bg-[#050505] min-h-screen py-12 text-zinc-300 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Back navigation */}
        <button
          onClick={onBackToShop}
          className="font-mono text-[10px] text-zinc-500 hover:text-emerald-400 uppercase tracking-widest mb-8 flex items-center space-x-1 outline-none"
        >
          <span>← Back to store catalog</span>
        </button>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Left Hand: Interactive Viewports */}
          <div className="space-y-6">
            
            {/* View selectors tabs */}
            <div className="flex bg-[#080808] border border-zinc-900 rounded-lg p-1.5 w-fit">
              <button
                onClick={() => setActiveMediaTab('3d')}
                className={`px-4 py-1.5 font-mono text-[10px] tracking-wider uppercase rounded transition-all ${
                  activeMediaTab === '3d' ? 'bg-[#0a2f23] text-emerald-400' : 'text-zinc-500'
                }`}
              >
                🎮 3D INTERACTIVE RENDER
              </button>
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-4 py-1.5 font-mono text-[10px] tracking-wider uppercase rounded transition-all ${
                  activeMediaTab === 'video' ? 'bg-red-950/40 text-red-400 border border-red-900/15' : 'text-zinc-500'
                }`}
              >
                🎬 HD BENCHMARK VIDEO
              </button>
            </div>

            {/* View Port Render */}
            <div className="bg-[#080808] border border-zinc-900/60 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative min-h-100">
              {activeMediaTab === '3d' ? (
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <Phone3DViewer color={selectedColor.hex} phoneName={product.name} isGaming={product.isGaming} />
                </div>
              ) : (
                <iframe
                  src={`${product.videoUrl}?autoplay=1&mute=0`}
                  title={product.name}
                  className="w-full h-full object-cover"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                />
              )}
            </div>

            {/* Swatch options */}
            <div className="p-4 bg-[#080808] border border-zinc-900/60 rounded-xl">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Active swatch choice</span>
              <div className="flex space-x-3 mt-3">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all outline-none ${
                      selectedColor.name === col.name 
                        ? 'border-emerald-500 text-white bg-emerald-950/20' 
                        : 'border-zinc-800 text-zinc-500 bg-transparent'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-900 block" style={{ backgroundColor: col.hex }} />
                    <span className="uppercase text-[10px]">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Hand: Core Details */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Identity & Scoring details */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 font-mono text-[10px] uppercase">
                <span className="text-zinc-500">{product.brand}</span>
                <span className="text-zinc-700">//</span>
                <span className="text-emerald-500">certified flagship</span>
              </div>
              <h1 className="font-sans text-3xl font-extrabold text-white tracking-tight leading-tight uppercase">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 pt-1.5">
                <div className="flex items-center space-x-1 text-yellow-500 text-xs bg-[#080808] px-2.5 py-1 rounded border border-zinc-900/40 font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating} / 5.0</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">({reviews.length} VERIFIED REVIEWS)</span>
              </div>
            </div>

            {/* Price Segment */}
            <div className="p-5 bg-zinc-950/80 border border-zinc-900 rounded-xl text-left flex items-baseline space-x-3">
              <span className="font-mono text-2xl font-extrabold text-[#03f47c]">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="font-mono text-xs text-zinc-650 line-through">${product.originalPrice}</span>
              )}
              <span className="font-mono text-[9px] text-[#03f47c]/80 bg-emerald-950/40 px-2 py-0.5 border border-emerald-900/30 rounded ml-2 uppercase">CLEARANCE ACTIVE</span>
            </div>

            {/* Micro specs bullet points highlights */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#080808] border border-zinc-900/60 rounded-lg flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-[10px] font-mono uppercase leading-tight truncate">
                  <span className="text-zinc-500 block truncate">Chipset</span>
                  <span className="text-white font-bold block truncate">{product.processor.split(' ')[0]}</span>
                </div>
              </div>
              <div className="p-3 bg-[#080808] border border-zinc-900/60 rounded-lg flex items-center space-x-2">
                <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-[10px] font-mono uppercase leading-tight">
                  <span className="text-zinc-500 block">Battery</span>
                  <span className="text-white font-bold block">{product.battery.split(' ')[0]}</span>
                </div>
              </div>
              <div className="p-3 bg-[#080808] border border-zinc-900/60 rounded-lg flex items-center space-x-2">
                <Hammer className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-[10px] font-mono uppercase leading-tight">
                  <span className="text-zinc-500 block">Config</span>
                  <span className="text-white font-bold block">{product.ram} RAM</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed font-sans mt-2">{product.description}</p>

            {/* CTAs element */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900">
              <button
                onClick={handleAddToCartWithNotification}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500 text-white font-mono text-xs tracking-wider uppercase rounded flex items-center justify-center space-x-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] outline-none"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{cartSuccess ? '✓ DISPATCH ADDED' : 'ADD TO SECURE BASKET'}</span>
              </button>
              
              <button
                onClick={() => onAddToWishlist(product)}
                className="px-6 py-4 bg-[#080808] border border-zinc-800 hover:border-zinc-700 hover:text-red-500 text-zinc-400 rounded outline-none"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Secure certification pledge footer */}
            <div className="flex items-center space-x-2 text-[9px] text-zinc-500 font-mono uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-650" />
              <span>Full compliance verified. 2-Yr replacement shielding fully applicable.</span>
            </div>

          </div>

        </div>

        {/* Detailed technical Specifications Accordions */}
        <div className="mb-20">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2 mb-4">
            REFERENCE MANUAL (SPECIFICATIONS)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-3 bg-[#080808] border border-zinc-900/40 rounded">
                <span className="text-zinc-500">PROCESSOR CORE</span>
                <span className="text-white">{product.processor}</span>
              </div>
              <div className="flex justify-between p-3 bg-[#080808] border border-zinc-900/40 rounded">
                <span className="text-zinc-500">OPERATIONAL RAM</span>
                <span className="text-white">{product.ram}</span>
              </div>
              <div className="flex justify-between p-3 bg-[#080808] border border-zinc-900/40 rounded">
                <span className="text-zinc-500">PHYSICAL STORAGE</span>
                <span className="text-white">{product.storage}</span>
              </div>
              <div className="flex justify-between p-3 bg-[#080808] border border-zinc-900/40 rounded">
                <span className="text-zinc-500">SCREEN REFRESH/DISPLAY</span>
                <span className="text-white">{product.display}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between p-3 bg-[#080808] border border-zinc-900/40 rounded">
                  <span className="text-zinc-500 uppercase">{key}</span>
                  <span className="text-white text-right truncate max-w-xs">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW SECTION: EXPLODED PHYSICAL BLUEPRINT SPECS */}
        <div className="mb-20 py-12 border-t border-zinc-900 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest block">// HARDWARE SCHEMATIC LOGS</span>
              <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight">SILICON & CHASSIS ARCHITECTURE</h3>
              <p className="font-sans text-[12px] text-zinc-500 leading-relaxed font-light">
                A granular, physical breakdown of the smartphone's internal component placement and multi-layer structural compositions.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-[10.5px]">
              
              <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-lg space-y-2">
                <span className="text-[#03f47c] block font-bold">// 01. INTEGRATED MOTHERBOARD LAYER</span>
                <p className="text-zinc-500 leading-relaxed uppercase">
                  Multi-layered HDI PCB layout. Built with low-dielectric thermoset resin substrates to lower transmission signal distortion across 5G antennas and sub-6 channels.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-lg space-y-2">
                <span className="text-[#03f47c] block font-bold">// 02. CRYSTAL POLARIZER FILM</span>
                <p className="text-zinc-500 leading-relaxed uppercase">
                  High-transmittance polarizer laminate coated with reflection-cancelling surface finishes. Boosts visibility to 2,500 nits clear illumination during heavy solar exposure.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-lg space-y-2">
                <span className="text-blue-400 block font-bold">// 03. CALIBRATED COOLDOWN VAPOR CHAMBER</span>
                <p className="text-zinc-500 leading-relaxed uppercase">
                  Fused copper capillary columns containing deionized liquid distillates. Instantly triggers cooling phase transitions upon heavy processor workload bursts.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-900/60 rounded-lg space-y-2">
                <span className="text-amber-500 block font-bold">// 04. OPTICAL LENS ARRAYS</span>
                <p className="text-zinc-500 leading-relaxed uppercase">
                  calibrated glass lens elements treated with scratch-resistant layers. Eliminates chromatic aberration to output sharp colors across peripheral focal distances.
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* FEEDBACK & RATINGS CORNER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-zinc-900">
          
          {/* List reviews section */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
              COMMUNITY DISPATCH LOGS (REVIEWS)
            </h3>
            {reviews.length === 0 ? (
              <p className="font-mono text-xs text-zinc-600 uppercase">No telemetry reports filed. Be the first to deploy review.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-[#080808] border border-zinc-900/60 rounded-xl space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-emerald-400 capitalize">{rev.userName}</span>
                      <span className="font-mono text-[9px] text-zinc-600">{rev.date}</span>
                    </div>
                    <div className="flex space-x-1 text-yellow-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review input Form */}
          <div className="bg-[#080808]/80 border border-zinc-900 rounded-xl p-5 text-left h-fit">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4">
              SUBMIT SYSTEM LOG
            </h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-zinc-500 uppercase block">Name</label>
                <input
                  type="text"
                  placeholder="EXECUTIVE IDENTIFIER..."
                  value={reviewNameInput}
                  onChange={(e) => setReviewNameInput(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 font-mono outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-zinc-500 uppercase block">Scoring Grade</label>
                <select
                  value={ratingInput}
                  onChange={(e) => setRatingInput(Number(e.target.value))}
                  className="w-full bg-black border border-zinc-800 text-xs text-zinc-200 rounded px-3 py-2 font-mono outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (Aesthetic)</option>
                  <option value={3}>⭐⭐⭐ (Operable)</option>
                  <option value={2}>⭐⭐ (Throttling)</option>
                  <option value={1}>⭐ (Deficient)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-zinc-500 uppercase block">System commentary</label>
                <textarea
                  placeholder="PROVIDE DETAILED EXPERIMENTAL FEEDBACK..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 outline-none focus:border-emerald-500 h-24 font-sans uppercase"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={addingReview}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 py-2 rounded font-mono text-xs uppercase"
              >
                {addingReview ? 'DEPLOYING...' : 'DEPLOY ENCRYPTED LOG'}
              </button>
            </form>
          </div>

        </div>

        {/* Carousel of related smartphones */}
        <div className="mt-20 pt-10 border-t border-zinc-900">
          <h3 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-widest text-center mb-8">
            HYPOTHETICAL UPGRADES & ALTERNATIVES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedModels.map(prod => (
              <div
                key={prod.id}
                onClick={() => onNavigateToProduct(prod.id)}
                className="p-4 bg-[#080808] border border-zinc-900 hover:border-emerald-950/40 rounded-xl flex items-center justify-between text-left cursor-pointer transition-colors group"
              >
                <div className="w-16 h-16 flex-shrink-0 bg-[#0b0b0b] rounded flex items-center justify-center p-1.5 mr-4">
                  <img
                    referrerPolicy="no-referrer"
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-screen scale-95 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>
                <div className="flex-grow">
                  <span className="font-mono text-[8px] text-zinc-600 block uppercase">{prod.brand}</span>
                  <h4 className="font-sans text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-1 transition-colors">{prod.name}</h4>
                  <span className="font-mono text-[11px] text-emerald-400 mt-1 block">${prod.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
