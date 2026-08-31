/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Star, ChevronDown, Cpu, ShieldCheck, Heart, ShoppingCart, Info, Award, Film, Tv, Volume2, VolumeX, Activity, Wifi } from 'lucide-react';
import { Product } from '../types';
import Phone3DViewer from './Phone3DViewer';

const PHOTO_DECK = [
  {
    id: 'bumblebee-9pro',
    name: 'RedMagic 9 Pro Bumblebee Special Edition',
    brand: 'RedMagic',
    price: 949,
    image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800',
    badge: 'BUMBLEBEE SPECIAL',
    colorHex: '#FFCC00',
    description: 'The exclusive Cybernetic Bumblebee edition with stunning hazard-yellow CNC panels, Transformers mech decals, a magnetic thermoelectric cryo cooler, and an aerospace-grade active fan system.',
    specifications: {
      'Edition': 'Transformers Autobot Limited',
      'Armor': 'CNC Aviation Yellow Aluminum',
      'Processor': 'Snapdragon 8 Gen 3 (3.3GHz)',
      'Display': 'BOE Q9+ OLED Bezel-less'
    },
    features: ['Yellow Mech Shell', '6500mAh Dual-Cell', '22,000 RPM Active Fan', 'Transformers Custom UI']
  },
  {
    id: 'infinix-gt20',
    name: 'Infinix GT 20 Pro Mecha',
    brand: 'Infinix',
    price: 499,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
    badge: 'MECHA CYBER',
    colorHex: '#39FF14',
    description: 'Features a semi-translucent mecha back armor with custom addressable mini-LED glowing loops that sync with your gameplay frames per second and CPU performance metrics.',
    specifications: {
      'Platform': 'Dimensity 8200 Ultimate 4nm',
      'LED System': 'Mecha Loop Mini-LED Glow',
      'Display': '144Hz Bezel-less LTPS AMOLED',
      'Engine': 'Pixelworks X5 Turbo Coprocessor'
    },
    features: ['Cyber-mecha aesthetics', 'Dedicated gaming chip', 'Stereo bypass audio', 'Hyperspeed charging']
  },
  {
    id: 'oppo-find-x7',
    name: 'Oppo Find X7 Ultra Leather',
    brand: 'Oppo',
    price: 1049,
    image: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&q=80&w=800',
    badge: 'HASSELBLAD COUTURE',
    colorHex: '#8B5A2B',
    description: 'A design masterpiece blending luxury navy blue and sovereign brown handwoven vegan leather with a titanium base chassis. Driven by the 4th-gen Hasselblad quad periscope camera.',
    specifications: {
      'Sensors': '1-inch Sony LYT-900 Core',
      'Optics': 'Double 50MP Periscopic Lens',
      'Platform': 'Snapdragon 8 Gen 3',
      'Charge': '100W SUPERVOOC charging'
    },
    features: ['Handwoven vegan leather', 'True dual 3X & 6X Periscope', '1G+7P Glass-Plastic lens', 'IP68 Waterproofing']
  },
  {
    id: 'iphone-15-pro-titan',
    name: 'iPhone 15 Pro Max Natural Titanium',
    brand: 'Apple',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
    badge: 'AEROSPACE GRADE',
    colorHex: '#ABA49C',
    description: 'Forged in gorgeous satin Natural Titanium. Packed with Apple A17 Pro (3nm) GPU enabling hardware ray-tracing acceleration for high-fidelity console-level gaming on mobile.',
    specifications: {
      'Build': 'Natural Titanium Grade-5',
      'Processor': 'Apple A17 Pro (3nm Node)',
      'Camera': '48MP Pro Main Custom Lens',
      'Connector': 'USB-C 3.0 (10Gbps Speed)'
    },
    features: ['Satin finish premium texture', '5X telephoto 120mm prism', 'Action button programmable', 'ProRes raw recording']
  },
  {
    id: 'infinix-zero40-gold',
    name: 'Infinix Zero 40 Ultra Gold',
    brand: 'Infinix',
    price: 599,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    badge: 'GLAZE GOLD',
    colorHex: '#D4AF37',
    description: 'Elegant golden body displaying luxury 3D glaze gold finishes on an ultra-slim curved chassis. Fully integrated with GoPro pairing controls for seamless content creation.',
    specifications: {
      'Finish': '3D Glaze Gold Curved Armor',
      'Screen': '6.78" Curved AMOLED (144Hz)',
      'Vlog Link': 'Built-In GoPro Wireless Link',
      'Optics': '108MP OIS + 50MP Wide camera'
    },
    features: ['Ultra-thin curved design', 'Smooth dynamic status ring', '90W High-Speed Charge', 'Studio vlog software suite']
  },
  {
    id: 'oppo-reno12-nebula',
    name: 'Oppo Reno 12 Pro Cosmic Silver',
    brand: 'Oppo',
    price: 699,
    image: 'https://images.unsplash.com/photo-1583573636246-18cb2246697f?auto=format&fit=crop&q=80&w=800',
    badge: 'NEBULA LIQUID GLASS',
    colorHex: '#9370DB',
    description: 'Features a fluid magnetic ripple effect flowing across highly reflective nebula glass panels. Offers high-strength alloy shells to resist drop impacts easily.',
    specifications: {
      'Armor': 'High-tensile protective layout',
      'Sensor': '50MP Sony IMX890 custom',
      'AI Toolkit': 'AI Eraser 2.0 & AI Clear-Image',
      'Battery': '5000mAh with 80W flashing'
    },
    features: ['Galactic ripple reflection', 'Ultra-durable structural alloy', 'Double portrait optimization', 'LinkBoost communications engine']
  },
  {
    id: 'bumblebee-9pro-gold',
    name: 'RedMagic Wasp Dual-Mech Hornet',
    brand: 'RedMagic',
    price: 999,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800',
    badge: 'BUMBLEBEE HORNET SPECIAL',
    colorHex: '#FFD700',
    description: 'A custom supercar tribute series, boasting high-contrast Bumblebee sports stripes, yellow LED glowing cooling hardware, and full mechanical physical triggers.',
    specifications: {
      'Specialty': 'Transformers Autobot branding',
      'Heat sink': 'Large 10,182 mm² Cryo VC',
      'Trigger': '520Hz ultrasonic shoulder triggers',
      'Cooling': 'Active 22k RPM centrifugal system'
    },
    features: ['High-contrast sports yellow body', 'Autobot themed accessories', 'Under-panel seamless kamera', 'Custom active rumble motors']
  },
  {
    id: 'iphone-16-pro-gold',
    name: 'iPhone 16 Pro Desert Titanium',
    brand: 'Apple',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=800',
    badge: 'DESERT GOLD CONCEPT',
    colorHex: '#C5A059',
    description: 'Desert titanium matte luxury concept displaying ultra-immersive zero-bezel graphics using next-generation micro-lens active arrays.',
    specifications: {
      'Titanium': 'Desert Gold Grade-5 Alloy',
      'Screen': '6.9" Borderless Micro-lens OLED',
      'Controls': 'Dedicated pressure-sensitive capture key',
      'Engine': 'Apple A18 Pro Extreme GPU'
    },
    features: ['Zero-bezel concept screen', 'Tactile pressure camera key', '48MP Ultra-wide macro layout', 'Smart cooling design']
  },
  {
    id: 'vivo-x100-pro',
    name: 'Vivo X100 Pro Zeiss',
    brand: 'Vivo',
    price: 949,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
    badge: 'ZEISS T* OPTICS',
    colorHex: '#1D2128',
    description: 'A cosmic shift in imaging. Engineered together with Zeiss Optics, showcasing the pinnacle of T* anti-reflective coating.',
    specifications: {
      'Optics': 'Zeiss APO Floating Lens',
      'Processor': 'Dimensity 9300',
      'Display': 'Ultra-flicker-free AMOLED',
      'Battery': '5400 mAh'
    },
    features: ['Zeiss T* Coating', 'Periscope Telephoto', '100W FlashCharge', 'Ultrasonic Fingerprint']
  },
  {
    id: 'infinix-hot40-blue',
    name: 'Infinix Hot 40 Pro Horizon',
    brand: 'Infinix',
    price: 349,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&q=80&w=800',
    badge: 'HORIZON BLUE',
    colorHex: '#4287F5',
    description: 'Highly responsive youth flagship with an interactive notification status ring integrated around the front camera, backed by a blue reflection chassis.',
    specifications: {
      'Gradient': 'Horizon blue reflective shield',
      'Processor': 'MediaTek Helio G99 Ultra',
      'Dynamic UX': 'Magic notification ring system',
      'Audio': 'Stereo speakers with custom DTS link'
    },
    features: ['Prism light-bending blue tint', 'Interactive magical status ring', 'Ultra-low-latency 120Hz display', 'Large 5000mAh durable battery']
  },
  {
    id: 'oppo-find-n3-gold',
    name: 'Oppo Find N3 Folding Gold',
    brand: 'Oppo',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=800',
    badge: 'FOLDING GOLD MASTER',
    colorHex: '#FFDF00',
    description: 'Uncompromising luxury horizontal folding tablet-smartphone. Backed by solid gold textured hinges, weave desert-leather surfaces, and Hasselblad tuned lenses.',
    specifications: {
      'Hinge': 'Flexon aviation carbon-fiber hinge',
      'Display': 'Dual ProXDR high-contrast panels',
      'Optics': 'Hasselblad 48MP Stacked sensor system',
      'Chassis': 'Luxury gold weave leather finish'
    },
    features: ['Crease-free premium flex', 'Hasselblad pro color grading', 'Double-sided stereo audio', '67W SUPERVOOC charging']
  }
];

interface HomeViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, color: string) => void;
  onAddToWishlist: (product: Product) => void;
  onNavigateToShop: () => void;
}

export default function HomeView({
  products,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist,
  onNavigateToShop
}: HomeViewProps) {
  
  // States for dynamic elements
  const [activeTab, setActiveTab] = useState<'all' | 'gaming' | 'new' | 'bestseller'>('all');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<string>('bumblebee-9pro'); // Default to bumblebee special

  // Interactive Smartphone Factory Customizer States
  const [customModel, setCustomModel] = useState<'neontitan' | 'redmagic' | 'sovereign'>('neontitan');
  const [customCpu, setCustomCpu] = useState<'dimensity' | 'snapdragon' | 'a18pro'>('snapdragon');
  const [customFinish, setCustomFinish] = useState<'titanium' | 'yellow' | 'leather' | 'glass'>('titanium');
  const [customCooling, setCustomCooling] = useState<'passive' | 'fan' | 'cryo'>('fan');
  const [customMemory, setCustomMemory] = useState<'12-256' | '16-512' | '24-1t'>('16-512');
  const [buildSimulated, setBuildSimulated] = useState<boolean>(false);
  const [simulatingLog, setSimulatingLog] = useState<string>('Ready for test deployment.');
  // Filters for featured smartphone categories
  const filteredFeatured = products.filter(p => {
    if (activeTab === 'gaming') return p.isGaming;
    if (activeTab === 'new') return p.isNewArrival;
    if (activeTab === 'bestseller') return p.isBestSeller;
    return true;
  }).slice(0, 4);

  const faqs = [
    { q: 'Is international dispatch supported?', a: 'Indeed. AETHERON coordinates priority secure worldwide dispatching, including premium customs clearance and fully insured delivery.' },
    { q: 'How does the 2-Year Warranty Armor operate?', a: 'Every purchase on our platform activates a 2-Year hardware waiver. In the event of diagnostic issues, we arrange premium shipping back to our core laboratory and supply an immediate factory-sealed replacement.' },
    { q: 'What is the refund process for return requests?', a: 'We honor a 30-day return policy. Submit your request via the User Dashboard, and on verification, we process full refunds or store credits, returning the asset back to active stock.' },
    { q: 'Can I finance my smartphone purchase?', a: 'Yes. Our secure payments portal manages interest-free digital installments via credit cards and selected online payment systems.' }
  ];

  const brands = [
    { name: 'Apple', logo: '' },
    { name: 'Samsung', logo: 'SAMSUNG' },
    { name: 'OnePlus', logo: 'ONEPLUS' },
    { name: 'Xiaomi', logo: 'XIAOMI' },
    { name: 'Vivo', logo: 'VIVO' },
    { name: 'Oppo', logo: 'OPPO' },
    { name: 'Realme', logo: 'REALME' },
    { name: 'Pixel', logo: 'GOOGLE' }
  ];

  return (
    <div className="bg-[#050505] text-[#b3b3b3]">
      
      {/* 1. CINEMATIC SPLIT HERO SECTION WITH SLEEK INTERFACE THEME */}
      <section className="relative min-h-[90vh] lg:h-screen flex items-center overflow-hidden border-b border-white/5 bg-black/80 pt-20">
        
        {/* Real-time Cinematic Video Backdrop */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none opacity-35 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/n3ZgofMreDo?autoplay=1&mute=1&controls=0&loop=1&playlist=n3ZgofMreDo&showinfo=0&rel=0&modestbranding=1"
            title="Aether Teaser Video"
            className="w-full h-full object-cover scale-150 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: '100vw', height: '115vh', border: 'none' }}
          />
        </div>

        {/* Cinematic Matrix Fade Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] z-0 pointer-events-none" />

        {/* Background Atmosphere */}
        <div className="absolute inset-0 gradient-bg opacity-20 pointer-events-none z-0"></div>
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#8B0000] rounded-full blur-[200px] opacity-15 pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          
          {/* Left Column Information / Branding */}
          <div className="space-y-6 text-left">
            <div className="inline-block px-3.5 py-1.5 bg-[#8B0000]/20 border border-[#8B0000]/40 rounded-full mb-2">
              <span className="text-[10px] font-bold text-[#FF4D4D] tracking-[0.2em] uppercase italic">
                Project Cyber-Evo 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black leading-none tracking-tighter">
              <span className="text-metallic block">NEON TITAN</span>
              <span className="text-[#8B0000] italic">PHONEX</span>
            </h1>

            <p className="text-white/50 text-sm max-w-md leading-relaxed font-sans">
              The world's premium liquid-emerald cooled smartphones. Powered by neural-link chipsets and wrapped in aerospace-grade metallic obsidian. Redefining high-performance diagnostics, cinematic capture, and absolute hardware sovereignty.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={onNavigateToShop}
                className="px-8 py-4 bg-[#8B0000] text-white font-bold rounded-none hover:bg-neutral-900 border border-transparent hover:border-white/20 transition-all duration-300 uppercase tracking-widest text-xs neon-red-glow cursor-pointer"
              >
                Pre-Order Now
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('featured-gallery');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border border-white/20 text-white font-bold rounded-none hover:bg-white/5 transition-all duration-300 uppercase tracking-widest text-xs cursor-pointer"
              >
                Technical Specs
              </button>
            </div>

            {/* Micro Metrics integrated nicely with our catalog values */}
            <div className="pt-8 flex flex-wrap gap-8 border-t border-white/5">
              <div>
                <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">Display</span>
                <span className="text-xl font-mono text-white font-medium">6.9" 240Hz OLED</span>
              </div>
              <div>
                <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">Processor</span>
                <span className="text-xl font-mono text-white font-medium">X-Z1 Neural</span>
              </div>
              <div>
                <span className="text-xs text-white/30 uppercase tracking-widest block mb-1">Defrosting</span>
                <span className="text-xl font-mono text-emerald-400 font-medium animate-pulse">Cryo-Active: 24°C</span>
              </div>
            </div>
          </div>

          {/* Right Column Interactive 3D Smartphone Representation */}
          <div className="w-full flex justify-center items-center lg:pl-6 relative">
            <div className="relative w-full max-w-md">
              {/* Decorative design highlight ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B0000]/10 to-[#062E22]/10 rounded-full blur-2xl -z-10 animate-pulse"></div>
              
              <Phone3DViewer color="#1a1a1a" phoneName="Neon Titan" isGaming={true} />

              {/* Float informational micro-cards */}
              <div className="absolute -top-6 -right-4 hidden sm:block glass-card p-3 rounded-lg w-40 border-l-2 border-l-[#062E22] shadow-xl z-20">
                <span className="text-[9px] text-white/40 uppercase block mb-0.5">Thermal Status</span>
                <span className="text-xs font-bold text-[#03f47c] italic">Cryo-Active: 24°C</span>
              </div>

              <div className="absolute -bottom-4 -left-4 hidden sm:block glass-card p-3 rounded-lg w-48 border-l-2 border-l-[#8B0000] shadow-xl z-20">
                <span className="text-[9px] text-white/40 uppercase block mb-0.5">Global Sales</span>
                <span className="text-xs font-semibold text-white">1.2M Units Reserved</span>
                <div className="w-full bg-white/10 h-1 mt-1.5 overflow-hidden">
                  <div className="bg-[#8B0000] w-3/4 h-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 2. INTERACTIVE BRAND SHOWCASE PANEL */}
      <section className="py-12 bg-black border-y border-emerald-950/25">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-mono text-[10px] text-zinc-600 tracking-widest uppercase mb-8">// ACCREDITED PARTNER CHANNELS</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {brands.map((b, idx) => (
              <div
                key={idx}
                onClick={onNavigateToShop}
                className="py-4 bg-[#080808] border border-zinc-900 rounded cursor-pointer text-zinc-500 hover:text-emerald-400 hover:border-emerald-950/50 hover:shadow-[0_0_12px_rgba(16,185,129,0.1)] transition-all flex flex-col items-center justify-center font-mono font-bold text-xs"
              >
                <span className="text-sm tracking-widest">{b.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS GRID */}
      <section id="item-grid" className="py-24 max-w-7xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="font-mono text-xs text-emerald-400 tracking-widest lowercase">// EXQUISITE VAULTS</span>
            <h2 className="font-sans text-3xl font-extrabold text-white mt-1">THE ELITE INVENTORY</h2>
          </div>
          
          {/* Custom Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 bg-[#080808] p-1.5 rounded-lg border border-zinc-900">
            {(['all', 'gaming', 'new', 'bestseller'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded text-xs font-mono uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? 'bg-[#0a2f23] text-[#03f47c] border border-emerald-500/35'
                    : 'text-zinc-500 hover:text-zinc-300 bg-transparent'
                }`}
              >
                {tab === 'all' ? 'LIVE FEEDS' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Rendering with premium glass styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeatured.map(prod => {
            const hasDiscount = prod.originalPrice > prod.price;
            const discountPct = hasDiscount 
              ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) 
              : 0;

            return (
              <div
                key={prod.id}
                className="glass-card rounded-xl hover:border-[#8B0000]/60 hover:shadow-[0_10px_35px_rgba(139,0,0,0.2)] group transition-all duration-300 text-left flex flex-col justify-between overflow-hidden relative"
              >
                
                {/* Image & badging */}
                <div className="relative aspect-square bg-[#0b0b0b]/60 flex items-center justify-center p-6 overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-screen scale-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Glowing tag indicators */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1 z-10 font-mono text-[9px] uppercase">
                    {hasDiscount && (
                      <span className="bg-[#8B0000]/80 border border-red-500/60 text-white px-2.5 py-0.5 rounded shadow">
                        -{discountPct}% EVO PRICE
                      </span>
                    )}
                    {prod.isGaming && (
                      <span className="bg-black/80 border border-[#8B0000]/50 text-[#FF4D4D] px-2.5 py-0.5 rounded shadow animate-pulse">
                        NEON T-CORE
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onAddToWishlist(prod); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/60 border border-white/5 text-white/50 hover:text-[#FF4D4D] transition-colors z-10 outline-none"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-black/20">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-550 block leading-tight">{prod.brand}</span>
                    <h3 
                      onClick={() => onSelectProduct(prod.id)}
                      className="font-sans text-sm font-bold text-white hover:text-[#FF4D4D] mt-1 cursor-pointer line-clamp-1 transition-colors"
                    >
                      {prod.name}
                    </h3>
                    
                    {/* Device core metrics shortcut */}
                    <div className="flex space-x-1.5 mt-2.5 font-mono text-[9px] text-white/40">
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{prod.ram}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{prod.storage}</span>
                      <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[80px]">{prod.processor}</span>
                    </div>
                  </div>

                  {/* Rating & CTA details */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono text-[11px] text-white/70 bg-black/40 px-1 py-0.5 rounded">{prod.rating}</span>
                      </div>
                      <div className="flex items-baseline space-x-1.5 mt-1.55">
                        <span className="font-mono text-sm font-black text-white">${prod.price}</span>
                        {hasDiscount && (
                          <span className="font-mono text-[10px] text-white/30 line-through">${prod.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(prod, prod.colors[0].name)}
                      className="flex items-center space-x-1 bg-white/5 hover:bg-[#8B0000] text-white/80 hover:text-white p-2.5 rounded border border-white/10 hover:border-transparent transition-all outline-none"
                    >
                      <ShoppingCart className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 4. PREMIUM SMARTPHONE GALLERY (10 FLAGSHIP PHOTO CHANNELS) */}
      <section id="featured-gallery" className="py-24 bg-black border-y border-red-950/15">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest">// HIGH-FIDELITY HARDWARE TELEMETRY</span>
            <h2 className="font-sans text-3xl font-extrabold text-white mt-1.5 uppercase">10-CHANNEL PHOTO MATRIX</h2>
            <p className="text-xs text-zinc-500 font-mono mt-2 uppercase">
              Inspect premium flagship models across Infinix, Oppo, RedMagic Bumblebee, and Apple iPhone with close-up micro-lens photographs and digital blueprints.
            </p>
          </div>

          {/* Setup active lookup variables */}
          {(() => {
            const activePhoto = PHOTO_DECK.find(p => p.id === activePhotoIndex) || PHOTO_DECK[0];
            
            return (
              <>
                {/* AETHER HIGH-FIDELITY ACTIVE PHOTO INSPECTOR MONITOR */}
                <div className="bg-[#080808]/90 border border-zinc-900 rounded-2xl overflow-hidden p-6 mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8 shadow-[0_0_35px_rgba(239,68,68,0.03)] text-left">
                  
                  {/* Active Screen Frame (Col span 2) */}
                  <div className="lg:col-span-2 relative aspect-video bg-black rounded-xl overflow-hidden border border-zinc-900 shadow-inner flex flex-col justify-between">
                    
                    {/* Telemetry overlay labels */}
                    <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-none">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] animate-pulse" />
                      <span className="font-mono text-[9px] bg-black/85 text-white/95 border border-white/10 px-2 py-0.5 rounded tracking-widest uppercase font-bold">
                        AETHER PHOTO INSPECTION FEED // RESOLUTION: PREDATOR 4K
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20 pointer-events-none">
                      <span className="font-mono text-[9px] bg-black/85 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                        COLOR ACCENT: {activePhoto.brand.toUpperCase()} ACTIVE
                      </span>
                    </div>

                    {/* Main Image Player with background glow */}
                    <div className="absolute inset-0 w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                      <div 
                        className="absolute w-72 h-72 rounded-full filter blur-[100px] opacity-25 transition-all duration-700"
                        style={{ backgroundColor: activePhoto.colorHex }}
                      />
                      <img
                        key={activePhoto.image}
                        src={activePhoto.image}
                        alt={activePhoto.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover z-10 hover:scale-105 transition-transform duration-700 select-none pointer-events-auto"
                      />
                    </div>

                    {/* Under-player audio togglers and stream frequency HUD */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-black/75 backdrop-blur-md border border-white/5 p-3 rounded-lg pointer-events-auto">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-[9px] text-[#FF4D4D] bg-red-950/40 px-2.5 py-1 rounded border border-red-500/20 uppercase font-semibold">
                          STATION INVENTORY ACTIVATE
                        </span>
                      </div>

                      <div className="hidden sm:flex items-center space-x-4 text-[9px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          <Activity className="w-3 h-3 text-[#FF4D4D] animate-pulse" />
                          ANALYSIS: ACTIVE
                        </span>
                        <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                          <Wifi className="w-3 h-3 text-emerald-500" />
                          TELEMETRY COMMITTED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Smartphone Device Status Deck */}
                  <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="border-b border-zinc-900 pb-3">
                        <span className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// SPECTRAL DEVICE INSIGHTS</span>
                        <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight mt-0.5 animate-fade-in">
                          {activePhoto.name}
                        </h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">
                          Manufacturer: <span className="text-emerald-400 font-bold">{activePhoto.brand}</span>
                        </p>
                      </div>

                      {/* Technical specifications dashboard */}
                      <div className="grid grid-cols-2 gap-3.5 font-mono text-[10px]">
                        {Object.entries(activePhoto.specifications).map(([key, val]) => (
                          <div key={key} className="bg-zinc-950 p-2 border border-zinc-900 rounded">
                            <span className="text-zinc-600 block uppercase text-[8px]">// {key}</span>
                            <span className="text-zinc-300 font-bold block truncate mt-1">{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Core Highlights Tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-zinc-600 font-mono block uppercase text-[8px]">// Core Highlights</span>
                        <div className="flex flex-wrap gap-1.5">
                          {activePhoto.features.map((feature, idx) => (
                            <span key={idx} className="font-mono text-[9px] bg-zinc-900/80 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Diagnostic Scrolling Log Terminal */}
                      <div className="bg-black/90 border border-zinc-900 rounded-lg p-3 font-mono text-[9.5px] text-zinc-500 space-y-1.5 h-32 overflow-y-auto select-none">
                        <div className="text-zinc-400 truncate font-semibold">// SPECIFICATION MATRIX:</div>
                        <p className="text-zinc-400 leading-normal normal-case italic">
                          "{activePhoto.description}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                      <div className="text-left">
                        <span className="font-mono text-[9px] text-zinc-600 uppercase block">Benchmark Valuation</span>
                        <span className="font-mono text-xl font-black text-white">${activePhoto.price}</span>
                      </div>
                      <button
                        onClick={() => {
                          const matchingProd = products.find(p => p.brand.toLowerCase().includes(activePhoto.brand.toLowerCase()) || activePhoto.name.toLowerCase().includes(p.name.toLowerCase()));
                          if (matchingProd) {
                            onSelectProduct(matchingProd.id);
                          } else {
                            onNavigateToShop();
                          }
                        }}
                        className="flex items-center space-x-2 bg-[#8B0000] hover:bg-red-650 text-white font-bold font-mono text-[10.5px] uppercase tracking-widest px-4 py-2.5 rounded border border-red-500/20 hover:shadow-[0_0_15px_rgba(139,0,0,0.25)] transition-all outline-none"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>INSPECT INTEGRATED PLATFORM</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* DUAL-STREAM CHANNEL CHASSIS */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4 mb-6">
                  <div className="text-left mb-2 sm:mb-0">
                    <h3 className="font-sans text-sm font-bold text-white uppercase tracking-tight">
                      MULTIPLE MULTI-MONITOR WALL (10 DECK CHANNELS)
                    </h3>
                    <p className="font-mono text-[10px] text-zinc-500 uppercase mt-0.5">
                      Select any stream channel below to view full-resolution telemetry metrics and structural photos.
                    </p>
                  </div>
                </div>

                {/* THE 10 LIVE CAMERAS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {PHOTO_DECK.map((photo, idx) => {
                    const isSelected = activePhotoIndex === photo.id;

                    return (
                      <div
                        key={photo.id}
                        onClick={() => setActivePhotoIndex(photo.id)}
                        className={`bg-[#080808] rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-red-500 shadow-[0_0_15px_rgba(139,0,0,0.15)] bg-red-950/5 scale-[1.02]' 
                            : 'border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        
                        {/* Monitor Screen Block */}
                        <div className="relative aspect-video bg-zinc-950 overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10 z-1" />
                          <img
                            key={photo.image}
                            referrerPolicy="no-referrer"
                            src={photo.image}
                            alt={photo.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Glow accent colored filter borders */}
                          <div 
                            className="absolute inset-x-0 bottom-0 h-[3px] opacity-70"
                            style={{ backgroundColor: photo.colorHex }}
                          />

                          {/* Static HUD labels on each live card */}
                          <div className="absolute top-2 left-2 z-20 flex space-x-1.5 font-mono text-[7px] text-white select-none">
                            <span className="bg-black/85 px-1 py-0.5 rounded border border-white/5 uppercase font-bold text-zinc-300">
                              DECK-{idx + 1}
                            </span>
                            {isSelected && (
                              <span className="bg-red-950/80 text-red-500 border border-red-500/30 px-1 py-0.5 rounded uppercase font-bold animate-pulse">
                                TUNED
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-2 right-2 z-20 font-mono text-[7px] text-zinc-400 bg-black/75 px-1 py-0.5 rounded select-none border border-white/5 uppercase">
                            {photo.brand}
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-3.5 space-y-3 relative z-10 flex-grow flex flex-col justify-between text-left">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[7.5px] text-[#FF4D4D] bg-red-950/20 px-2 py-0.5 rounded border border-red-500/20 uppercase font-semibold">
                                {photo.badge}
                              </span>
                              <span className="font-mono text-[8.5px] text-zinc-400">
                                {photo.brand}
                              </span>
                            </div>
                            <h4 className="font-sans text-xs font-bold text-white hover:text-[#FF4D4D] mt-2 line-clamp-1 transition-colors">
                              {photo.name}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between font-mono text-[10px]">
                            <span className="text-zinc-400 font-bold">${photo.price}</span>
                            <div className="text-red-400 font-semibold group-hover:text-red-300 transition-colors flex items-center space-x-1 hover:underline">
                              <span>VIEW PHOTO</span>
                              <Play className="w-2.5 h-2.5 fill-current" />
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()
          }

        </div>
      </section>

      {/* 4.8. AETHER INTERACTIVE SMARTPHONE CUSTOMIZER */}
      <section className="py-24 bg-black border-y border-zinc-950/60 relative overflow-hidden">
        {/* Futuristic scan grid indicator */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[550px] bg-red-950/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          {/* Header Block of configurator */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest block animate-pulse">// AETHERON INDUSTRIAL LABS // TERMINAL IV</span>
            <h2 className="font-sans text-3xl font-black text-white mt-2 uppercase tracking-tight">INTERACTIVE DEVICE CONSTRUCTOR</h2>
            <p className="text-xs text-zinc-500 font-mono mt-2 uppercase max-w-xl mx-auto">
              Calibrate and wire your custom flagship variant. Modify the base hardware core chassis, computational CPU chipsets, active cooling chambers, and system memory to instantly render telemetry valuation diagnostics.
            </p>
          </div>

          {(() => {
            // Compute real-time specs based on selections
            let basePrice = 699;
            let modelTitle = "";
            let coreColor = "#ef4444";
            if (customModel === 'neontitan') {
              basePrice = 749;
              modelTitle = "Neon Titan Prime Edition";
              coreColor = "#39FF14"; // Lime bright glow
            } else if (customModel === 'redmagic') {
              basePrice = 899;
              modelTitle = "RedMagic Cyber-Hornet";
              coreColor = "#FFCC00"; // Yellow transformers
            } else {
              basePrice = 1199;
              modelTitle = "Sovereign Dual-Fold Pro";
              coreColor = "#D4AF37"; // Gold metallic
            }

            let cpuMultiplier = 0;
            let cpuLabel = "";
            if (customCpu === 'dimensity') {
              cpuMultiplier = 0;
              cpuLabel = "Dimensity 8200 Ultra";
            } else if (customCpu === 'snapdragon') {
              cpuMultiplier = 150;
              cpuLabel = "Snapdragon 8 Gen 3 Hyper";
            } else {
              cpuMultiplier = 240;
              cpuLabel = "A18 Pro Extreme GPU";
            }

            let finishMultiplier = 0;
            let finishLabel = "";
            if (customFinish === 'titanium') {
              finishMultiplier = 0;
              finishLabel = "Grade-5 Machined Titanium";
            } else if (customFinish === 'yellow') {
              finishMultiplier = 50;
              finishLabel = "Autobot Hazard Yellow";
            } else if (customFinish === 'leather') {
              finishMultiplier = 90;
              finishLabel = "Sovereign Handwoven Leather";
            } else {
              finishMultiplier = 70;
              finishLabel = "Nebula Silver Ripple Glass";
            }

            let coolingMultiplier = 0;
            let coolingLabel = "";
            if (customCooling === 'passive') {
              coolingMultiplier = 0;
              coolingLabel = "Passive Vapor Chamber (Static)";
            } else if (customCooling === 'fan') {
              coolingMultiplier = 80;
              coolingLabel = "Active 22,000 RPM Air Intake";
            } else {
              coolingMultiplier = 160;
              coolingLabel = "Sub-Zero Thermoelectric TEC Chamber";
            }

            let memoryMultiplier = 0;
            let memoryLabel = "";
            if (customMemory === '12-256') {
              memoryMultiplier = 0;
              memoryLabel = "12GB LPDDR5X / 256GB Storage";
            } else if (customMemory === '16-512') {
              memoryMultiplier = 110;
              memoryLabel = "16GB LPDDR5X / 512GB Storage";
            } else {
              memoryMultiplier = 220;
              memoryLabel = "24GB LPDDR5X / 1TB Extreme Storage";
            }

            const livePrice = basePrice + cpuMultiplier + finishMultiplier + coolingMultiplier + memoryMultiplier;

            // Compute performance score
            let scorePct = 76;
            if (customCpu === 'snapdragon') scorePct += 10;
            if (customCpu === 'a18pro') scorePct += 15;
            if (customCooling === 'fan') scorePct += 3;
            if (customCooling === 'cryo') scorePct += 8;
            if (customMemory === '16-512') scorePct += 2;
            if (customMemory === '24-1t') scorePct += 5;
            if (scorePct > 99) scorePct = 99;

            // Temp
            let estTemp = 41;
            if (customCooling === 'fan') estTemp -= 8;
            if (customCooling === 'cryo') estTemp -= 17;

            // Latency
            let latencyMs = 2.4;
            if (customCpu === 'snapdragon') latencyMs -= 1.0;
            if (customCpu === 'a18pro') latencyMs -= 1.7;

            const handleSimulate = () => {
              setBuildSimulated(true);
              setSimulatingLog("WAKING UP ACTIVE HARDWARE NODE CHANNELS...");
              setTimeout(() => {
                setSimulatingLog("SECURE VOLTAGE INJECTION: CALIBRATING VOLUMETRIC REGULATORS... [SUCCESS]");
              }, 400);
              setTimeout(() => {
                setSimulatingLog(`PHYSICAL DIAGNOSTICS: Thermal load peak holds at ${estTemp}°C. Core I/O response latency benchmarked at ${latencyMs.toFixed(1)}ms. Spec evaluation verified.`);
              }, 800);
            };

            return (
              <div className="bg-[#080808] border border-zinc-900 rounded-3xl p-6 lg:p-10 shadow-[0_0_60px_rgba(139,0,0,0.08)]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Column Controls: Col Span 7 */}
                  <div className="lg:col-span-7 space-y-8 text-left">
                    
                    {/* Control Block 1: Base Chassis */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// 01: BASE HARDWARE CHASSIS</label>
                        <span className="font-mono text-[9.5px] text-zinc-550 capitalize">{customModel} standard</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px]">
                        <button
                          onClick={() => { setCustomModel('neontitan'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customModel === 'neontitan'
                              ? 'bg-zinc-900 border-emerald-500 text-white shadow-[0_0_12px_rgba(57,255,20,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">AETHER NEON TITAN</div>
                          <span className="text-zinc-650 block text-[7.5px] mt-0.5">// BASE CHAIR // +$749</span>
                        </button>
                        <button
                          onClick={() => { setCustomModel('redmagic'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customModel === 'redmagic'
                              ? 'bg-zinc-900 border-yellow-500 text-white shadow-[0_0_12px_rgba(255,204,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">CYBER MECHA REDMAGIC</div>
                          <span className="text-zinc-650 block text-[7.5px] mt-0.5">// PREMIUM RAW MECH // +$899</span>
                        </button>
                        <button
                          onClick={() => { setCustomModel('sovereign'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customModel === 'sovereign'
                              ? 'bg-zinc-900 border-amber-600 text-white shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">SOVEREIGN DUAL-FOLD</div>
                          <span className="text-zinc-650 block text-[7.5px] mt-0.5">// COUTURE LUXURY // +$1199</span>
                        </button>
                      </div>
                    </div>

                    {/* Control Block 2: CPU Engine */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// 02: NEURAL PROCESSOR ENGINE</label>
                        <span className="font-mono text-[9.5px] text-zinc-550 truncate font-semibold text-emerald-400">{cpuLabel}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px]">
                        <button
                          onClick={() => { setCustomCpu('dimensity'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCpu === 'dimensity'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">Dimensity 8200 Ultimate</div>
                          <span className="text-emerald-500/80 block text-[7.5px] mt-0.5">// 4nm Node // +$0</span>
                        </button>
                        <button
                          onClick={() => { setCustomCpu('snapdragon'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCpu === 'snapdragon'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">Snapdragon 8 Gen 3</div>
                          <span className="text-red-400/80 block text-[7.5px] mt-0.5">// Neural Accelerate // +$150</span>
                        </button>
                        <button
                          onClick={() => { setCustomCpu('a18pro'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCpu === 'a18pro'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8.5px]">Apple A18 Pro Extreme</div>
                          <span className="text-red-400/80 block text-[7.5px] mt-0.5">// 3nm High Precision // +$240</span>
                        </button>
                      </div>
                    </div>

                    {/* Control Block 3: Armor Materials & Finish */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// 03: AMULET MATERIALS / FINISHING</label>
                        <span className="font-mono text-[9.5px] text-zinc-550 truncate">{finishLabel}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[10px]">
                        {[
                          { id: 'titanium', label: 'Satin Titanium', fee: '+$0' },
                          { id: 'yellow', label: 'Autobot Yellow', fee: '+$50' },
                          { id: 'leather', label: 'Sovereign Leather', fee: '+$90' },
                          { id: 'glass', label: 'Nebula Wave Glass', fee: '+$70' }
                        ].map(fin => (
                          <button
                            key={fin.id}
                            onClick={() => { setCustomFinish(fin.id as any); setBuildSimulated(false); }}
                            className={`p-2.5 border rounded text-left transition-all duration-200 outline-none ${
                              customFinish === fin.id
                                ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.15)]'
                                : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                            }`}
                          >
                            <div className="font-bold text-white uppercase text-[8px] truncate">{fin.label}</div>
                            <span className="text-zinc-650 block text-[7px] mt-0.5">{fin.fee}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Control Block 4: Thermal Active Chambers */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// 04: COOLING DISPERSE MATRIX</label>
                        <span className="font-mono text-[9.5px] text-zinc-550 truncate font-semibold text-blue-400">{coolingLabel}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px]">
                        <button
                          onClick={() => { setCustomCooling('passive'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCooling === 'passive'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">Passive Vapor Chamber</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// 10,000 mm² Shield // +$0</span>
                        </button>
                        <button
                          onClick={() => { setCustomCooling('fan'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCooling === 'fan'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">Centrifuge Core Fan</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// 22,500 RPM Active // +$80</span>
                        </button>
                        <button
                          onClick={() => { setCustomCooling('cryo'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customCooling === 'cryo'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">Cryo Thermoelectric VC</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// Sub-Zero TEC Active // +$160</span>
                        </button>
                      </div>
                    </div>

                    {/* Control Block 5: Memory allocation */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// 05: MEMORY CALIBRATION RETAINS</label>
                        <span className="font-mono text-[9.5px] text-zinc-550 truncate">{memoryLabel}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[10px]">
                        <button
                          onClick={() => { setCustomMemory('12-256'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customMemory === '12-256'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">12GB LPDDR5X // UFS U4</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// 256GB Solid State // +$0</span>
                        </button>
                        <button
                          onClick={() => { setCustomMemory('16-512'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customMemory === '16-512'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">16GB LPDDR5X // UFS U4</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// 512GB Solid State // +$110</span>
                        </button>
                        <button
                          onClick={() => { setCustomMemory('24-1t'); setBuildSimulated(false); }}
                          className={`p-3 border rounded text-left transition-all duration-200 outline-none ${
                            customMemory === '24-1t'
                              ? 'bg-zinc-900 border-red-500 text-white shadow-[0_0_10px_rgba(139,0,0,0.1)]'
                              : 'bg-black border-zinc-900 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="font-bold text-white uppercase text-[8px]">24GB LPDDR5X // Solid</div>
                          <span className="text-zinc-650 block text-[7px] mt-0.5">// 1TB Cyber Solid // +$220</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right Column Monitor Panel: Col Span 5 */}
                  <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-zinc-900/80 pt-8 lg:pt-0 lg:pl-10 text-left space-y-6">
                    <div className="space-y-4">
                      
                      {/* Telemetry frame monitor title */}
                      <div className="border-b border-zinc-900 pb-4">
                        <span className="font-mono text-[9px] text-[#FF4D4D] tracking-widest uppercase">// VOLUMETRIC CONSTRUCT STATUS</span>
                        <h3 className="font-sans text-xl font-bold text-white uppercase tracking-tight mt-1 truncate">
                          {modelTitle}
                        </h3>
                        <p className="font-mono text-[9px] text-zinc-500 mt-1 uppercase">
                          CONFIG ID // COGNITIVE-CHASSIS-{customModel.toUpperCase()}
                        </p>
                      </div>

                      {/* Display rendered specifications specs */}
                      <div className="space-y-4 bg-black/40 border border-zinc-900 rounded-xl p-4 font-mono text-[10px]">
                        <div className="flex justify-between py-1 border-b border-zinc-900/60">
                          <span className="text-zinc-600">// PROCESSOR CORE:</span>
                          <span className="text-zinc-300 font-bold uppercase">{cpuLabel}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900/60">
                          <span className="text-zinc-600">// CASING MATERIAL:</span>
                          <span className="text-zinc-300 font-bold uppercase">{finishLabel}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900/60">
                          <span className="text-zinc-600">// SYSTEM MEMORY:</span>
                          <span className="text-zinc-300 font-bold uppercase">{memoryLabel}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-zinc-900/60">
                          <span className="text-zinc-600">// THERMO-MATRIX:</span>
                          <span className="text-blue-400 font-bold uppercase">{coolingLabel}</span>
                        </div>
                      </div>

                      {/* Telemetry metrics bar */}
                      <div className="space-y-4 pt-2 font-mono">
                        
                        {/* Metric 1: Spec Score */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase">
                            <span className="text-zinc-500">AETHER RATING SCORE:</span>
                            <span className="text-emerald-400 font-extrabold">{scorePct}% CAPABILITY</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full transition-all duration-500"
                              style={{ width: `${scorePct}%` }}
                            />
                          </div>
                        </div>

                        {/* Metric 2: Estimated Thermo output */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase">
                            <span className="text-zinc-500">THERMAL LOAD DIAGNOSTIC:</span>
                            <span className={`font-extrabold ${estTemp > 30 ? 'text-amber-500' : 'text-blue-400'}`}>{estTemp}°C LOAD</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${estTemp > 30 ? 'bg-amber-500' : 'bg-blue-400'}`}
                              style={{ width: `${(estTemp / 48) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Metric 3: Response latency */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] uppercase">
                            <span className="text-zinc-500">RESPONSE LATENCY CALIBRATION:</span>
                            <span className="text-red-400 font-extrabold">{latencyMs.toFixed(1)} MS</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded overflow-hidden">
                            <div 
                              className="bg-red-500 h-full transition-all duration-500"
                              style={{ width: `${(1 - (latencyMs - 0.7) / 1.7) * 100}%` }}
                            />
                          </div>
                        </div>

                      </div>

                      {/* Decoded system read-out console logs */}
                      <div className="bg-black border border-zinc-900 rounded-lg p-3.5 h-24 overflow-y-auto select-none mt-4">
                        <span className="font-mono text-[7.5px] text-[#FF4D4D] block uppercase tracking-widest mb-1">// TELEMETRY CONSOLE READOUT</span>
                        <p className="font-mono text-[9px] text-zinc-500 uppercase leading-relaxed animate-pulse">
                          {simulatingLog}
                        </p>
                      </div>

                    </div>

                    {/* Pricing, Sim Trigger & Pre-order buttons */}
                    <div className="pt-6 border-t border-zinc-900 flex flex-col gap-3.5">
                      <div className="flex items-center justify-between">
                        <div className="text-left font-mono">
                          <span className="text-zinc-650 text-[8px] uppercase block">// VOLUMETRIC PRICE</span>
                          <span className="text-2xl font-black text-white">${livePrice}</span>
                        </div>
                        
                        <button
                          onClick={handleSimulate}
                          className="px-4.5 py-2 bg-zinc-950 border border-zinc-800 hover:border-red-500/40 text-zinc-400 hover:text-white font-bold font-mono text-[9.5px] rounded uppercase tracking-wider transition-all duration-300"
                        >
                          SIMULATE DISPLACEMENT TEST
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const mockCustomProduct: Product = {
                            id: `custom-${customModel}-${Date.now()}`,
                            name: `Customized ${modelTitle} (${cpuLabel})`,
                            brand: 'AETHERON CUSTOM',
                            price: livePrice,
                            originalPrice: livePrice + 120,
                            images: ['https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&q=80&w=800'],
                            rating: 4.9,
                            reviewCount: 1,
                            description: `Bespoke curated system configured with a custom chassis, ${cpuLabel} engine, ${coolingLabel} thermal matrix, and premium ${finishLabel} materials. Perfect executive specification.`,
                            processor: cpuLabel,
                            ram: customMemory === '24-1t' ? '24GB' : customMemory === '16-512' ? '16GB' : '12GB',
                            storage: customMemory === '24-1t' ? '1TB' : customMemory === '16-512' ? '512GB' : '256GB',
                            display: '6.9" Infinite OLED 240Hz',
                            battery: '6500mAh Active Core',
                            colors: [{ name: customFinish, hex: coreColor }],
                            videoUrl: 'https://www.youtube.com/embed/n3ZgofMreDo',
                            isNewArrival: true,
                            isBestSeller: false,
                            isGaming: customCooling !== 'passive',
                            camera: '50MP Ultra-resolution',
                            stock: 10,
                            demoVideoType: 'design',
                            specifications: {}
                          };
                          onAddToCart(mockCustomProduct, customFinish);
                        }}
                        className="w-full py-3.5 bg-[#8B0000] hover:bg-neutral-900 border border-transparent hover:border-white/20 text-white font-bold font-mono text-xs rounded uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.25)] outline-none cursor-pointer text-center"
                      >
                        SUBMIT HARDWARE CONFIG TO DESTRUCTIVE DELIVERY CART
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 4.9. GLOBAL COMPETITIVE BENCHMARKING GRID TABLE */}
      <section className="py-24 bg-[#050505] border-b border-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-left">
          
          <div className="mb-14 text-left border-l-2 border-[#8B0050] pl-4 py-1">
            <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest">// GLOBAL RATING BOARD</span>
            <h2 className="font-sans text-3xl font-black text-white mt-1 uppercase tracking-tight text-metallic">CHIP ENGINE COMPETITIVE MATRIX</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 uppercase max-w-2xl">
              Calibrated computational benchmarks charting silicon and optical telemetry. View peak performance indices calculated across modern gaming flagships.
            </p>
          </div>

          <div className="bg-[#080808]/85 border border-zinc-900 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(30,30,30,0.1)]">
            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs text-zinc-400">
                <thead>
                  <tr className="bg-black/60 border-b border-zinc-900 text-zinc-500 uppercase tracking-wider">
                    <th className="py-4.5 px-6 text-left font-semibold">// Rank</th>
                    <th className="py-4.5 px-6 text-left font-semibold">Engine Blueprint</th>
                    <th className="py-4.5 px-6 text-left font-semibold">Silicon CPU Chipset</th>
                    <th className="py-4.5 px-6 text-center font-semibold">AnTuTu v10 Rating</th>
                    <th className="py-4.5 px-6 text-center font-semibold">Geekbench 6 (Multi)</th>
                    <th className="py-4.5 px-6 text-center font-semibold">Peak Thermal Loop</th>
                    <th className="py-4.5 px-6 text-right font-semibold">Status / Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 font-medium">
                  {[
                    { rank: '01', model: 'AETHER SHIELD NEON TITAN', chip: 'Apple A18 Pro (3nm Ultra Node)', antutu: '2,185,000', geek: '8,420', thermal: 'Cryo Sub-Zero // 19°C', latency: '0.4ms // SYNC_OK', glow: true },
                    { rank: '02', model: 'REDMAGIC 9 PRO SPECIAL', chip: 'Snapdragon 8 Gen 3 Hyper', antutu: '2,110,400', geek: '7,310', thermal: '22k Centrifuge // 24°C', latency: '0.6ms // LIVE_OK', glow: false },
                    { rank: '03', model: 'AETHERON SOVEREIGN FOLD', chip: 'Snapdragon 8 Gen 3 Dual-Core', antutu: '2,080,000', geek: '7,190', thermal: 'Vapor Chamber // 28°C', latency: '0.8ms // LIVE_OK', glow: false },
                    { rank: '04', model: 'XIAOMI 14 ULTRA HASSEL', chip: 'Snapdragon 8 Gen 3 Core', antutu: '1,990,000', geek: '6,920', thermal: 'Dual Graphite // 31°C', latency: '1.2ms // SECURE', glow: false },
                    { rank: '05', model: 'INFINIX GT 20 PRO HIGH', chip: 'Dimensity 8200 Ultimate LTPS', antutu: '1,894,000', geek: '6,450', thermal: 'Mecha LED Loop // 34°C', latency: '1.4ms // ACCREDITED', glow: false }
                  ].map((row, idx) => (
                    <tr 
                      key={idx}
                      className={`hover:bg-zinc-950/40 relative transition-colors ${row.glow ? 'bg-red-950/10/5' : ''}`}
                    >
                      <td className="py-4 px-6 text-left font-black text-red-500/80">#{row.rank}</td>
                      <td className="py-4 px-6 text-left font-bold text-white truncate max-w-[200px] uppercase">{row.model}</td>
                      <td className="py-4 px-6 text-left text-zinc-500 font-mono text-[11px] truncate uppercase">{row.chip}</td>
                      <td className="py-4 px-6 text-center font-bold text-white">{row.antutu}</td>
                      <td className="py-4 px-6 text-center font-bold text-emerald-400">{row.geek}</td>
                      <td className="py-4 px-6 text-center text-blue-400 font-semibold">{row.thermal}</td>
                      <td className="py-4 px-6 text-right font-mono text-zinc-500 font-semibold">{row.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Visual warning label frame */}
            <div className="bg-black/40 border-t border-zinc-900 px-6 py-4 flex items-center justify-between text-[10px] font-mono text-zinc-550">
              <span>// STANDARD DATA SYNC INTERVAL: 15 SECONDS // ACTIVE SEED PROTOCOL: ACTIVE</span>
              <span className="text-emerald-400 animate-pulse font-bold">ALL PLATFORM METRICS NOMINAL</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. FAQ SECTION */}

      <section className="py-24 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="font-mono text-xs text-emerald-400 tracking-widest lowercase">// ADMINISTRATIVE DIRECTIVES</span>
          <h2 className="font-sans text-3xl font-extrabold text-white mt-1.5 font-sans">FAQ BOARD</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFAQ === idx;
            return (
              <div
                key={idx}
                className="bg-[#080808] border border-zinc-900 rounded-lg p-4 transition-all"
              >
                <button
                  onClick={() => setActiveFAQ(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-sans text-sm font-bold text-white focus:outline-none"
                >
                  <span className="font-mono text-[11px] text-emerald-500 mr-2 uppercase">0{idx + 1}.</span>
                  <span className="flex-1 truncate">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {isOpen && (
                  <p className="font-mono text-[11.5px] text-zinc-500 leading-relaxed mt-3 pt-3 border-t border-zinc-900/60 uppercase">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
