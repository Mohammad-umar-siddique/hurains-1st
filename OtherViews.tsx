/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, ShieldCheck, Mail, MapPin, Phone, HelpCircle, Star, Edit, Trash, Plus, Check, Clock, TrendingUp, DollarSign, Package, Camera, Upload, Truck, Compass, Navigation, RefreshCcw, ChevronDown, ChevronUp, Users, Activity, FileText, Settings, Key, FilePlus } from 'lucide-react';
import { Product, Order, BlogItem, User } from '../types';

/* ==========================================================================
   AUXILIARY 1: CART VIEW
   ========================================================================== */
interface CartViewProps {
  cart: { product: Product; color: string; quantity: number }[];
  onUpdateQuantity: (id: string, color: string, qty: number) => void;
  onRemoveItem: (id: string, color: string) => void;
  onNavigateToCheckout: () => void;
  onApplyCoupon: (code: string) => Promise<boolean>;
  discountMultiplier: number;
  couponCode: string;
}

export function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToCheckout,
  onApplyCoupon,
  discountMultiplier,
  couponCode
}: CartViewProps) {
  const [couponInput, setCouponInput] = useState('');
  const [couponState, setCouponState] = useState<'idle' | 'success' | 'fail'>('idle');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * (1 - discountMultiplier);
  const delivery = subtotal > 1000 ? 0 : 35;
  const total = subtotal - discountAmount + delivery;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = await onApplyCoupon(couponInput);
    setCouponState(ok ? 'success' : 'fail');
    if (ok) setCouponInput('');
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-10 text-left border-l-2 border-emerald-500 pl-4 py-1">
          <span className="font-mono text-xs text-emerald-400 tracking-widest">// ACTIVE BASKET LOCK</span>
          <h1 className="font-sans text-3xl font-extrabold text-white">YOUR SHOPPING CART</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center font-mono py-24 bg-[#080808] rounded-xl border border-dashed border-zinc-900">
            <p className="text-zinc-650">YOUR SHOPPING BASKET IS CURRENTLY VACANT.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.color}`}
                  className="p-4 bg-[#080808] border border-zinc-900 rounded-xl flex flex-col sm:flex-row items-center gap-6 justify-between"
                >
                  <div className="w-20 h-20 bg-[#0b0b0b] rounded flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      referrerPolicy="no-referrer"
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain mix-blend-screen mix-blend-screen"
                    />
                  </div>

                  <div className="flex-grow text-left space-y-1">
                    <h3 className="font-sans text-sm font-bold text-white uppercase">{item.product.name}</h3>
                    <p className="font-mono text-[9px] text-[#03f47c] uppercase">CASING: {item.color}</p>
                    <p className="font-mono text-xs text-zinc-400">${item.product.price} each</p>
                  </div>

                  <div className="flex items-center space-x-3 bg-black border border-zinc-900 rounded p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.color, item.quantity - 1)}
                      className="px-2 py-1 text-xs font-mono font-bold text-zinc-500 hover:text-white"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs text-white px-2">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.color, item.quantity + 1)}
                      className="px-2 py-1 text-xs font-mono font-bold text-zinc-500 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-white block">${item.product.price * item.quantity}</span>
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.color)}
                      className="font-mono text-[9px] text-zinc-650 hover:text-red-500 mt-1 uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations and Checkout Options Column */}
            <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 h-fit text-left space-y-6">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-3">
                FINANCIAL RECONCILIATION
              </h3>

              <div className="space-y-2 text-xs font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL DISPATCH</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                {discountMultiplier < 1 && (
                  <div className="flex justify-between text-red-400">
                    <span>COUPON WRAP ({couponCode})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>HYPERSONIC CARRIER FEE</span>
                  <span className="text-white">{delivery === 0 ? 'FREE' : `$${delivery}`}</span>
                </div>
                <div className="border-t border-zinc-900/60 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-zinc-300">TOTAL SECURITY CLEARANCE</span>
                  <span className="text-[#03f47c]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon inputs */}
              <form onSubmit={handleApply} className="pt-2">
                <label className="font-mono text-[9px] text-zinc-500 uppercase block mb-1">Apply Coupon Ticket</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="E.G. AERA_GAMING, AETHER_PRO..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="bg-black border border-zinc-800 rounded-l px-3 py-2 text-xs text-white uppercase font-mono w-full outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 border-l-0 px-4 py-2 font-mono text-xs uppercase"
                  >
                    ADD
                  </button>
                </div>
                {couponState === 'success' && (
                  <p className="font-mono text-[9px] text-[#03f47c] mt-1 uppercase">✓ Valid Coupon ticket configured successfully.</p>
                )}
                {couponState === 'fail' && (
                  <p className="font-mono text-[9px] text-red-500 mt-1 uppercase">✖ Invalid coupon code. Recalibrate ticket.</p>
                )}
              </form>

              <button
                onClick={onNavigateToCheckout}
                className="w-full bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500 text-white font-mono text-xs py-3.5 rounded uppercase tracking-wider hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
              >
                PROCEED TO SECURITY CHECKOUT
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
   AUXILIARY 2: CHECKOUT VIEW
   ========================================================================== */
interface CheckoutViewProps {
  cart: { product: Product; color: string; quantity: number }[];
  onCompleteOrder: (address: string, paymentMethod: string, email: string) => Promise<string>;
}

export function CheckoutView({ cart, onCompleteOrder }: CheckoutViewProps) {
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !email.trim()) return;
    setPlacing(true);

    try {
      const trackingCode = await onCompleteOrder(address, paymentMethod, email);
      setActiveToken(trackingCode);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  if (activeToken) {
    return (
      <div className="bg-[#050505] min-h-screen py-24 text-zinc-300 flex items-center justify-center">
        <div className="bg-[#080808] border border-zinc-900 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xl font-extrabold text-white">ORDER PLACEMENT CONFIRMED</h2>
          <p className="font-mono text-xs text-zinc-400 uppercase leading-relaxed">
            Your e-commerce hypersonic shipment ticket has been activated and safely recorded under database nodes.
          </p>
          <div className="p-4 bg-black border border-zinc-900 rounded font-mono select-all">
            <span className="text-[10px] text-zinc-650 block">TRACKING SECURITY CODE</span>
            <span className="text-[#03f47c] font-bold text-sm block mt-1 tracking-widest uppercase">{activeToken}</span>
          </div>
          <p className="font-sans text-[10px] text-zinc-650">Confirmation dispatch sent to: {email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-10 text-left border-l-2 border-emerald-500 pl-4 py-1">
          <span className="font-mono text-xs text-emerald-400 tracking-widest">// SECURED BILLING ENTRANCE</span>
          <h1 className="font-sans text-3xl font-extrabold text-white">GATEWAY PORTAL</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Inputs Section */}
          <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
              DISPATCH CO-ORDINATES
            </h3>

            <div className="space-y-1">
              <label className="font-mono text-[9px] text-zinc-500 block uppercase">Billing Email</label>
              <input
                type="email"
                placeholder="YOURNAME@GMAIL.COM..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[9px] text-zinc-500 block uppercase">Hypersonic Delivery Address</label>
              <textarea
                placeholder="POSTAL BOX, BUILDING, CITY, NATION PIN..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs outline-none focus:border-emerald-500 text-white h-20 uppercase font-sans font-light"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[9px] text-zinc-500 block uppercase">Vault Payment Gateway</label>
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded border text-center uppercase tracking-wider outline-none ${
                    paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-950/25 text-emerald-400' : 'border-zinc-800 text-zinc-500 bg-transparent'
                  }`}
                >
                  DEBIT/CREDIT CARD
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded border text-center uppercase tracking-wider outline-none ${
                    paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-950/25 text-emerald-400' : 'border-zinc-800 text-zinc-500 bg-transparent'
                  }`}
                >
                  DIGITAL UPI CODES
                </button>
              </div>
            </div>

            {paymentMethod === 'card' ? (
              <div className="space-y-3 pt-3 border-t border-zinc-900/60">
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-zinc-500 block uppercase">Digital card details</label>
                  <input
                    type="text"
                    placeholder="4111 8234 9284 3824"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500"
                  />
                  <p className="font-mono text-[8.5px] text-zinc-650 uppercase mt-1">// Safe 256-bit Stripe cipher shield active.</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded text-center text-[10px] font-mono uppercase">
                UPI Simulation QR will generate on dispatch query.
              </div>
            )}
          </div>

          {/* Checkout review Column */}
          <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 h-fit space-y-4">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
              DISPATCH AUDIT STATEMENT
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-3">
              {cart.map(item => (
                <div key={`${item.product.id}-${item.color}`} className="flex justify-between items-center text-xs font-mono border-b border-zinc-900 pb-2">
                  <div className="text-left">
                    <span className="text-white uppercase font-bold text-[11px] block">{item.product.name}</span>
                    <span className="text-[9px] text-zinc-500 block">CASING: {item.color} x{item.quantity}</span>
                  </div>
                  <span className="text-zinc-400">${item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-900 pt-3 flex justify-between font-mono text-xs">
              <span className="text-zinc-500">AGGREGATE CHARGES</span>
              <span className="text-white font-extrabold">${subtotal}</span>
            </div>

            <button
              type="submit"
              disabled={placing}
              className="w-full mt-4 bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500 text-white font-mono text-xs py-3.5 rounded uppercase tracking-wider hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              {placing ? 'DECRYPTING PAYMENT SIGNALS...' : 'DEPLOY ORDER ASSETS'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

/* ==========================================================================
   AUXILIARY 3: USER DASHBOARD
   ========================================================================== */
interface OrderShippingTrackerProps {
  order: Order;
}

export function OrderShippingTracker({ order }: OrderShippingTrackerProps) {
  // Local state to simulate live shipping progress
  const [currentStatus, setCurrentStatus] = useState<string>(order.status);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(true);
  const [gpsCoords, setGpsCoords] = useState({ lat: 37.7749, lng: -122.4194 });
  const [speed, setSpeed] = useState(0);
  const [etaText, setEtaText] = useState('Pending clearance...');

  const steps = [
    { key: 'Pending', label: 'Confirmed', desc: 'Secure payment certified & inventory allocated.', icon: ShieldCheck },
    { key: 'Processing', label: 'Processing', desc: 'Specs flashed & cleanroom diagnostics complete.', icon: Clock },
    { key: 'Shipped', label: 'In Transit', desc: 'Hyper-sonic priority dispatch active.', icon: Truck },
    { key: 'Delivered', label: 'Delivered', desc: 'Drone dropoff at coordinates finalized.', icon: Package }
  ];

  const getStepIndex = (status: string) => {
    if (status === 'Pending') return 0;
    if (status === 'Processing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return -1;
  };

  const activeIndex = getStepIndex(currentStatus);

  // Sync state if backing order state updates
  useEffect(() => {
    setCurrentStatus(order.status);
  }, [order.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStatus === 'Shipped') {
      setSpeed(1150);
      setEtaText('1.8 Hours remaining. Approaching destination geo-zone.');
      interval = setInterval(() => {
        setGpsCoords(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.005,
          lng: prev.lng + (Math.random() - 0.5) * 0.005
        }));
      }, 1500);
    } else if (currentStatus === 'Delivered') {
      setSpeed(0);
      setEtaText('Delivered and synchronized with cleanroom signature.');
      setGpsCoords({ lat: 51.5074, lng: -0.1278 });
    } else if (currentStatus === 'Processing') {
      setSpeed(0);
      setEtaText('Flashing CPU core parameters & custom vacuum seal.');
      setGpsCoords({ lat: 34.0522, lng: -118.2437 });
    } else {
      setSpeed(0);
      setEtaText('Invoice clearance & financial certification secure.');
      setGpsCoords({ lat: 37.7749, lng: -122.4194 });
    }
    return () => clearInterval(interval);
  }, [currentStatus]);

  const triggerNextStep = () => {
    if (currentStatus === 'Pending') setCurrentStatus('Processing');
    else if (currentStatus === 'Processing') setCurrentStatus('Shipped');
    else if (currentStatus === 'Shipped') setCurrentStatus('Delivered');
    else setCurrentStatus('Pending');
  };

  return (
    <div className="bg-[#0b0b0b] border border-zinc-900 rounded-xl p-5 space-y-5 text-left transition-all duration-300">
      
      {/* Header section with telemetry logs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900/60 pb-3">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-[#FF4D4D] tracking-widest block uppercase">// LOGISTICS INTEL GATEWAY</span>
          <div className="flex items-center gap-2">
            <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">TRACKING ID: {order.trackingNumber}</h4>
            <span className="font-mono text-[8px] bg-red-950/40 border border-red-500/20 text-[#FF4D4D] px-2 py-0.5 rounded uppercase font-semibold">
              Live Link Validated
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0 font-mono text-[9px]">
          <button
            onClick={triggerNextStep}
            className="flex items-center gap-1 bg-[#8B0000] hover:bg-red-700 text-white font-bold p-1.5 px-3 rounded text-[9px] uppercase border border-red-500/20 transition-all outline-none"
            title="Demonstrate shipping transitions locally on client panel"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Simulate Step</span>
          </button>
        </div>
      </div>

      {(currentStatus === 'Cancelled' || currentStatus === 'Returned') && (
        <div className="p-2.5 bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded uppercase">
          ⚠️ ORDER STATE STABILIZED: {currentStatus}. RE-ROUTE LOGISTICS ACTIVE USING BUTTON ABOVE.
        </div>
      )}

      {/* STEP CHECKPOINT INDICATOR */}
      <div className="relative pt-2 pb-4">
        {/* Horizontal Stepper (Desktop) */}
        <div className="hidden sm:block relative">
          
          <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-[2px] bg-zinc-900 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-500"
              style={{ width: `${activeIndex === -1 ? 0 : (activeIndex / 3) * 100}%` }}
            />
          </div>

          <div className="flex justify-between items-start relative z-10">
            {steps.map((st, idx) => {
              const IconComponent = st.icon;
              const isCompleted = idx < activeIndex;
              const isActive = idx === activeIndex;

              return (
                <div key={idx} className="flex flex-col items-center text-center w-[25%] px-1">
                  
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)]' 
                        : isActive 
                        ? 'border-red-500 bg-red-950/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.45)] ring-2 ring-red-500/20 animate-pulse' 
                        : 'border-zinc-800 bg-[#080808] text-zinc-650'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 font-extrabold" /> : <IconComponent className="w-4 h-4" />}
                  </div>

                  <span className={`font-sans tracking-wide uppercase font-bold text-[9.5px] mt-2.5 ${
                    isActive ? 'text-red-500 font-black' : isCompleted ? 'text-emerald-400' : 'text-zinc-600'
                  }`}>
                    {st.label}
                  </span>
                  
                  <span className="font-mono text-[7px] text-zinc-500 leading-tight mt-1 max-w-[120px] line-clamp-2">
                    {st.desc}
                  </span>

                </div>
              );
            })}
          </div>
        </div>

        {/* Vertical Stepper (Mobile) */}
        <div className="sm:hidden flex flex-col space-y-4 text-left pl-3 relative border-l border-zinc-900 pb-2 ml-4">
          {steps.map((st, idx) => {
            const IconComponent = st.icon;
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={idx} className="flex items-start gap-3 relative -left-[14px]">
                <div 
                  className={`w-6.5 h-6.5 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${
                    isCompleted 
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : isActive 
                      ? 'border-red-500 bg-red-950/30 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse' 
                      : 'border-zinc-800 bg-[#080808] text-zinc-650'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : <IconComponent className="w-3.5 h-3.5" />}
                </div>

                <div className="flex flex-col">
                  <span className={`font-sans font-bold text-[9px] uppercase leading-none ${
                    isActive ? 'text-red-500' : isCompleted ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {st.label}
                  </span>
                  <span className="font-mono text-[7.5px] text-zinc-500 mt-1 max-w-[240px]">
                    {st.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* COLLAPSIBLE SATELLITE TELEMETRY DRAW */}
      <div className="border border-zinc-900/80 rounded-lg overflow-hidden bg-black/60">
        <button
          onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
          className="w-full flex justify-between items-center bg-zinc-950 px-3.5 py-2 text-left text-xs font-mono text-zinc-400 border-b border-zinc-905"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-red-500 animate-spin-slow" />
            <span className="font-bold tracking-widest uppercase text-[8.5px]">// POLARIS DOWNLINK telemetry</span>
          </div>
          {isTelemetryOpen ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
        </button>

        {isTelemetryOpen && (
          <div className="p-3.5 grid grid-cols-1 md:grid-cols-3 gap-3.5 transition-all text-xs">
            
            {/* Visual sweeping radar screen */}
            <div className="md:col-span-1">
              <div className="relative w-full h-24 bg-black border border-zinc-900 rounded-lg overflow-hidden flex items-center justify-center font-mono">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                
                <svg className="absolute w-20 h-20 text-zinc-900" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
                  <line x1="50" y1="50" x2="80" y2="20" stroke="#8B0000" strokeWidth="0.8" className="opacity-40" />
                </svg>

                <div 
                  className={`absolute w-1.5 h-1.5 rounded-full transition-all duration-1000 ${
                    currentStatus === 'Delivered' 
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                      : 'bg-red-500 shadow-[0_0_8px_#f87171] animate-pulse'
                  }`}
                  style={{ 
                    transform: `translate(${currentStatus === 'Shipped' ? Math.floor(Math.sin(Date.now() / 2000) * 12) : 2}px, ${currentStatus === 'Shipped' ? Math.floor(Math.cos(Date.now() / 2000) * 12) : -12}px)` 
                  }}
                />

                <span className="absolute bottom-1 right-2 text-[6.5px] text-zinc-650 tracking-normal leading-none uppercase">
                  SATELLITE SYNC: LKD
                </span>
              </div>
            </div>

            {/* Readout stats logs */}
            <div className="md:col-span-2 space-y-2 flex flex-col justify-between font-mono text-[9px] text-zinc-400 text-left">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="bg-zinc-950 p-1.5 border border-zinc-900 rounded">
                  <span className="text-zinc-650 block text-[7px] uppercase tracking-wider">// DESTINATION TARGET</span>
                  <span className="text-zinc-400 font-bold block mt-0.5 truncate select-all">
                    {parseFloat(gpsCoords.lat.toFixed(5))}° N, {parseFloat(gpsCoords.lng.toFixed(5))}° W
                  </span>
                </div>
                <div className="bg-zinc-950 p-1.5 border border-zinc-900 rounded">
                  <span className="text-zinc-650 block text-[7px] uppercase tracking-wider">// HYPERSONIC SPEED</span>
                  <span className="text-white font-bold block mt-0.5">
                    {speed} KM/H {speed > 0 && <span className="text-red-500 animate-pulse text-[7.5px] font-black">⚡</span>}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-950 p-2 border border-zinc-900 rounded flex items-center justify-between gap-1.5">
                <div className="space-y-0.5 text-left">
                  <span className="text-zinc-650 block text-[7px] uppercase tracking-wider">// STATUS MESSAGE</span>
                  <p className="text-zinc-300 font-bold leading-tight">{etaText}</p>
                </div>
                <Navigation className="w-3.5 h-3.5 text-[#FF4D4D] flex-shrink-0" />
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}

interface UserDashboardProps {
  user: any;
  orders: Order[];
  onNavigate?: (page: string) => void;
}

export function UserDashboard({ user, orders, onNavigate }: UserDashboardProps) {
  const userOrders = orders.filter(o => o.customerEmail === user.email);
  const [activeTab, setActiveTab] = useState<'orders' | 'support' | 'settings'>('orders');

  // Profile Photo
  const [photo, setPhoto] = useState<string>(() => {
    return user.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400';
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPhoto(data.avatar);
        window.dispatchEvent(new Event('avatar-changed'));
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  // Support Tickets State
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketContent, setTicketContent] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/forms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'support') {
      fetchTickets();
    }
  }, [activeTab]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketContent.trim()) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: ticketTitle, content: ticketContent })
      });

      if (response.ok) {
        setTicketTitle('');
        setTicketContent('');
        setSupportSuccess('Support request deployed successfully.');
        fetchTickets();
        setTimeout(() => setSupportSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/auth/forms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!oldPassword.trim() || !newPassword.trim()) {
      setPasswordError('Empty values are not permitted.');
      return;
    }

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setOldPassword('');
        setNewPassword('');
        setPasswordSuccess('Password decryption token updated successfully.');
      } else {
        setPasswordError(data.error || 'Password update failed.');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Network encryption link error.');
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-10 text-left border-l-2 border-emerald-500 pl-4 py-1">
          <span className="font-mono text-xs text-emerald-400 tracking-widest lowercase">// INDIVIDUAL SECURE CODES</span>
          <h1 className="font-sans text-3xl font-extrabold text-white">CUSTOMER PORTAL</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details Sidebar with unified photo uploader */}
          <div className="bg-[#080808] border border-zinc-900/80 rounded-xl p-6 space-y-6 h-fit flex flex-col items-center">
            
            <div className="relative group w-24 h-24 rounded-full border-2 border-[#8B0000] p-0.5 overflow-hidden shadow-[0_0_12px_rgba(139,0,0,0.25)] bg-neutral-900 flex-shrink-0 select-none">
              <img
                src={photo}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
              />
              <div 
                onClick={() => onNavigate && onNavigate('EDIT_PROFILE')}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 rounded-full"
              >
                <Camera className="w-5 h-5 text-[#FF4D4D]" />
                <span className="text-[7px] font-mono text-white mt-0.5 uppercase">Edit</span>
              </div>
            </div>

            <div className="w-full space-y-4 font-mono text-xs text-left">
              <div>
                <span className="text-zinc-650 block text-[9px] uppercase">Client Name</span>
                <span className="text-white font-bold block mt-0.5">{user.name}</span>
              </div>
              <div>
                <span className="text-zinc-650 block text-[9px] uppercase">Secure Link</span>
                <span className="text-zinc-400 block mt-0.5">{user.email}</span>
              </div>
              <div>
                <span className="text-zinc-650 block text-[9px] uppercase">Rerouting Code</span>
                <span className="text-red-500 uppercase font-extrabold">ACC-T{user.id.toUpperCase()}</span>
              </div>

              <div className="pt-4 border-t border-zinc-905 space-y-2">
                <span className="text-[#FF4D4D] text-[9px] uppercase block tracking-wider font-extrabold">// ABOUT THE FOUNDER</span>
                <p className="font-sans text-[11px] text-zinc-400 leading-relaxed font-light">
                  Hello and welcome! I am a passionate tech enthusiast and software engineer currently pursuing my diploma in Computer Science. With a deep background in hardware maintenance, system architectures, and programming, I built this platform to blend my technical expertise with high-quality service.
                </p>
              </div>
            </div>
          </div>

          {/* Active Portal Views (Tabbed Layout) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab Links Navigation */}
            <div className="flex border-b border-zinc-900 mb-6 font-mono text-xs">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
                  activeTab === 'orders' ? 'border-[#03f47c] text-[#03f47c]' : 'border-transparent text-zinc-500 hover:text-white'
                }`}
              >
                Orders & Dispatch
              </button>
              <button
                onClick={() => onNavigate && onNavigate('FEEDBACK_SUPPORT')}
                className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
                  activeTab === 'support' ? 'border-[#03f47c] text-[#03f47c]' : 'border-transparent text-zinc-500 hover:text-white'
                }`}
              >
                Support Tickets
              </button>
              <button
                onClick={() => onNavigate && onNavigate('SETTINGS')}
                className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
                  activeTab === 'settings' ? 'border-[#03f47c] text-[#03f47c]' : 'border-transparent text-zinc-500 hover:text-white'
                }`}
              >
                Settings
              </button>
            </div>

            {/* TAB CONTENT: ORDERS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                  HISTORICAL DISPATCH TILES ({userOrders.length})
                </h3>

                {userOrders.length === 0 ? (
                  <div className="bg-[#080808] border border-zinc-900 rounded-xl p-12 text-center font-mono">
                    <p className="text-zinc-600 text-xs uppercase">No active historical shipments locked under account.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map(ord => (
                      <div key={ord.id} className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4 text-left">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-3">
                          <div className="font-mono text-[11px]">
                            <span className="text-zinc-500 mr-2">TOKEN:</span>
                            <span className="text-[#03f47c] font-bold tracking-wider select-all">{ord.trackingNumber}</span>
                          </div>
                          <span className="font-mono text-[9px] bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded mt-2 sm:mt-0 uppercase font-bold animate-pulse">
                            {ord.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between font-mono text-xs">
                              <span className="text-zinc-400 uppercase">{item.name} ({item.color}) x{item.quantity}</span>
                              <span className="text-white">${item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="py-2">
                          <OrderShippingTracker order={ord} />
                        </div>

                        <div className="pt-3 border-t border-zinc-900/40 flex justify-between font-mono text-xs font-bold text-white">
                          <span>AGGREGATED BILL</span>
                          <span>${ord.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SUPPORT TICKETS */}
            {activeTab === 'support' && (
              <div className="space-y-6">
                <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4">
                    SUBMIT SUPPORT PROTOCOL
                  </h3>

                  {supportSuccess && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase mb-4">
                      {supportSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSubmitTicket} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">ISSUE CATEGORY / TITLE</label>
                      <input
                        type="text"
                        placeholder="E.G. SCREEN STUTTER IN GAMEPLAY, DELAYED STATUS..."
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">DETAILS & DIAGNOSTICS</label>
                      <textarea
                        placeholder="DESCRIBE TERMINAL LOG FAULTS OR ACCESSORY FAULTS IN DETAIL..."
                        value={ticketContent}
                        onChange={(e) => setTicketContent(e.target.value)}
                        className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none h-28 focus:border-emerald-500 uppercase"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 rounded uppercase cursor-pointer"
                    >
                      DEPLOY SUPPORT TICKET
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                    ACTIVE TICKET LOOPS ({tickets.length})
                  </h3>

                  {tickets.length === 0 ? (
                    <p className="font-mono text-xs text-zinc-605 uppercase">No logged support tickets registered.</p>
                  ) : (
                    tickets.map((t: any) => (
                      <div key={t.id} className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-3">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                          <span className="font-mono text-xs font-bold text-white uppercase">{t.title}</span>
                          <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                            t.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' :
                            t.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                            'bg-red-950/40 text-red-400 border border-red-900/30'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 uppercase leading-relaxed">{t.content}</p>
                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 pt-2">
                          <span>LOGGED: {new Date(t.timestamp).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteTicket(t.id)}
                            className="text-red-500 hover:text-red-400 flex items-center gap-1 uppercase"
                          >
                            <Trash className="w-3 h-3" /> PURGE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-6">
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-3">
                  TERMINAL SECURITY KEYS
                </h3>

                {passwordSuccess && (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase">
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded uppercase">
                    {passwordError}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">CURRENT DECRYPTION PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">NEW DECRYPTION PASSWORD</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-red-950 to-[#5a0000] border border-red-500/40 text-white rounded uppercase cursor-pointer"
                  >
                    RESET PASS TERMCODE
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   AUXILIARY 4: ADMIN DASHBOARD
   ========================================================================== */
interface AdminDashboardProps {
  user?: any;
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, status: string) => void;
  onNavigate?: (page: string) => void;
}

export function AdminDashboard({
  user,
  products,
  orders,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onNavigate
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'deployments' | 'users' | 'logs' | 'reports'>('deployments');

  // Photo states for Admin Profile
  const [photo, setPhoto] = useState<string>(() => {
    return user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400';
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPhoto(data.avatar);
        window.dispatchEvent(new Event('avatar-changed'));
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  // States to add new smartphone model
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('ROG');
  const [newPrice, setNewPrice] = useState(999);
  const [newCpu, setNewCpu] = useState('Snapdragon 8 Elite');
  const [newRam, setNewRam] = useState('16GB');
  const [newStorage, setNewStorage] = useState('512GB');
  const [isGaming, setIsGaming] = useState(false);
  const [desc, setDesc] = useState('Premium high-performance gaming casing smartphone.');

  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);

  const handleSubmitNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newId = Math.random().toString(36).substring(2, 7);

    const dummyProd: Product = {
      id: `prod-${newId}`,
      name: newName,
      brand: newBrand,
      price: newPrice,
      originalPrice: newPrice + 150,
      description: desc,
      ram: newRam,
      storage: newStorage,
      processor: newCpu,
      display: '6.78-inch LTPO AMOLED, 165Hz',
      battery: '5500mAh, 65W charging',
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop'],
      colors: [{ name: 'Cosmic Slate', hex: '#1e293b' }],
      rating: 4.8,
      reviewCount: 1,
      isGaming: isGaming,
      isNewArrival: true,
      isBestSeller: false,
      videoUrl: 'https://www.youtube.com/embed/n3ZgofMreDo',
      demoVideoType: 'gaming',
      specifications: { 'Glass': 'Corning Victus', 'NFC': 'Supported' },
      camera: '50MP + 12MP + 8MP',
      stock: 10
    };

    onAddProduct(dummyProd);
    setNewName('');
    alert('Administrative: Product added to local memory successfully.');
  };

  // User Management State
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [createUserName, setCreateUserName] = useState('');
  const [createUserEmail, setCreateUserEmail] = useState('');
  const [createUserPassword, setCreateUserPassword] = useState('');
  const [createUserRole, setCreateUserRole] = useState<'customer' | 'admin' | 'staff'>('customer');
  const [userMsg, setUserMsg] = useState('');

  // Editing User State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<'customer' | 'admin' | 'staff'>('customer');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/admin/users${userSearch ? `?search=${userSearch}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUserName.trim() || !createUserEmail.trim() || !createUserPassword.trim()) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: createUserName,
          email: createUserEmail,
          password: createUserPassword,
          role: createUserRole
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCreateUserName('');
        setCreateUserEmail('');
        setCreateUserPassword('');
        setUserMsg('User record seeded successfully.');
        fetchUsers();
        setTimeout(() => setUserMsg(''), 3000);
      } else {
        alert(data.error || 'Failed to create user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (u: User) => {
    setEditingUserId(u.id);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserRole(u.role);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/admin/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole
        })
      });

      if (response.ok) {
        setEditingUserId(null);
        setUserMsg('User record updated successfully.');
        fetchUsers();
        setTimeout(() => setUserMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Confirm permanent deletion of this record?')) {
      try {
        const token = localStorage.getItem('aetheron_jwt_token');
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchUsers();
        } else {
          const data = await response.json();
          alert(data.error || 'Delete failed.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Activity Logs state
  const [logs, setLogs] = useState<any[]>([]);
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reports Stats state
  const [stats, setStats] = useState<any>(null);
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'reports') {
      fetchStats();
    }
  }, [activeTab, userSearch]);

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Banner with glow and stats */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-black/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-[#8B0000]/10 rounded-full blur-[80px]" />
          
          <div className="flex items-center space-x-5 text-left w-full lg:w-auto">
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-white/10 p-1 flex-shrink-0 bg-neutral-900 overflow-hidden shadow-[0_0_20px_rgba(139,0,0,0.15)]">
              <img
                src={photo}
                alt="System Architect"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
              />
              <div 
                onClick={() => onNavigate && onNavigate('EDIT_PROFILE')}
                className="absolute inset-1 rounded-lg bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
              >
                <Camera className="w-5 h-5 text-[#FF4D4D] mb-1 animate-pulse" />
                <span className="text-[8px] font-mono font-bold tracking-widest text-white/80 uppercase">Edit Profile</span>
              </div>
            </div>

            <div className="space-y-1.5 py-1">
              <div className="inline-block px-2 py-0.5 bg-[#8B0000]/20 border border-[#8B0000]/40 rounded font-mono text-[9px] font-extrabold text-[#FF4D4D] tracking-widest uppercase">
                Owner & Chief Architect
              </div>
              <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                {user?.name || 'Siddique Umar'}
              </h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60 font-mono">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  {user?.email || 'admin@aetheron.com'}
                </span>
                <span className="font-semibold text-[#FF4D4D] tracking-wider uppercase">
                  // Core Access: Authorized
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end text-right w-full lg:w-auto self-start sm:self-center border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Administrative Terminal</span>
            <span className="text-sm font-sans font-black text-[#FF4D4D] uppercase italic tracking-tighter">
              AETHERON CONSOLE v2.6.4
            </span>
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[9px] text-[#03f47c] tracking-widest font-bold uppercase">CRYPT LINK ENFORCE</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Link Grid */}
        <div className="flex border-b border-zinc-900 mb-6 font-mono text-xs">
          <button
            onClick={() => setActiveTab('deployments')}
            className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
              activeTab === 'deployments' ? 'border-[#FF4D4D] text-[#FF4D4D]' : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            Deployments
          </button>
          <button
            onClick={() => onNavigate && onNavigate('USER_MANAGEMENT')}
            className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
              activeTab === 'users' ? 'border-[#FF4D4D] text-[#FF4D4D]' : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => onNavigate && onNavigate('ACTIVITY_LOGS')}
            className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
              activeTab === 'logs' ? 'border-[#FF4D4D] text-[#FF4D4D]' : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            Activity Logs
          </button>
          <button
            onClick={() => onNavigate && onNavigate('REPORTS')}
            className={`pb-2 px-4 border-b-2 uppercase tracking-wider font-bold transition-all ${
              activeTab === 'reports' ? 'border-[#FF4D4D] text-[#FF4D4D]' : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            Reports
          </button>
        </div>

        {/* TAB CONTENT: DEPLOYMENTS (Orders & Seeding Products) */}
        {activeTab === 'deployments' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center space-x-1.5">
                <span>ACTIVE SYSTEM DEPLOYMENTS</span>
              </h3>

              {orders.length === 0 ? (
                <p className="font-mono text-xs text-zinc-650 uppercase py-6">No historical shipments stored in memory nodes.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(ord => (
                    <div key={ord.id} className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-left space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-900 pb-2 font-mono text-xs">
                        <div>
                          <span className="text-zinc-600 block text-[9px] uppercase">TRACKER</span>
                          <span className="text-[#03f47c] font-bold select-all lowercase">{ord.trackingNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-black border border-zinc-805 text-[10px] text-white rounded px-2 py-1 outline-none font-mono uppercase cursor-pointer"
                          >
                            <option value="pending">PENDING CLEARANCE</option>
                            <option value="processing">NODE PACKAGING</option>
                            <option value="shipped">HYPERSONIC TRAFFIC</option>
                            <option value="delivered">DELIVERED STATUS</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {ord.items.map((it, i) => (
                          <div key={i} className="font-mono text-[11px] text-zinc-500">
                            {it.name} ({it.color}) x{it.quantity} - ${it.price * it.quantity}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-900/40 text-right font-mono text-xs font-bold text-white">
                        AGGREGATE PAY: ${ord.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4 h-fit">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
                SEED NEW HARDWARE
              </h3>

              <form onSubmit={handleSubmitNewProduct} className="space-y-3 font-mono text-[11px]">
                <div className="space-y-1">
                  <label className="text-zinc-500 uppercase block">Device model name</label>
                  <input
                    type="text"
                    placeholder="EXECUTIVE SHIELD X..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs outline-none text-zinc-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-zinc-500 uppercase block">Manufacturer</label>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-white"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="OnePlus">OnePlus</option>
                      <option value="ROG">ASUS ROG</option>
                      <option value="Laser">Laser</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 uppercase block">Retail Cost ($)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1">
                  <input
                    type="text"
                    placeholder="CPU Chip"
                    value={newCpu}
                    onChange={(e) => setNewCpu(e.target.value)}
                    className="bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300"
                  />
                  <input
                    type="text"
                    placeholder="RAM"
                    value={newRam}
                    onChange={(e) => setNewRam(e.target.value)}
                    className="bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300"
                  />
                  <input
                    type="text"
                    placeholder="Storage"
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    className="bg-black border border-zinc-800 rounded px-2 py-1.5 text-xs text-zinc-300"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-zinc-400 font-bold uppercase">Optimized for Gaming</span>
                  <button
                    type="button"
                    onClick={() => setIsGaming(!isGaming)}
                    className={`px-3 py-1 text-[9px] rounded uppercase select-none transition-colors ${
                      isGaming ? 'bg-red-950 text-red-500 border border-red-900/30' : 'bg-zinc-900 text-zinc-650'
                    }`}
                  >
                    {isGaming ? 'active' : 'disabled'}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-emerald-950 to-emerald-900 border border-emerald-500/40 hover:border-emerald-500 text-white font-mono text-xs uppercase rounded"
                  >
                    COMMENCE SEEDING
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB CONTENT: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Users List & Search */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="SEARCH USER IDENTITIES BY NAME OR EMAIL..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#080808] border border-zinc-900 text-xs font-mono px-3 py-2 text-white outline-none focus:border-red-500"
                />
              </div>

              {userMsg && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase">
                  {userMsg}
                </div>
              )}

              <div className="space-y-3">
                {adminUsers.map(u => (
                  <div key={u.id} className="p-4 bg-[#080808] border border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0">
                        <img src={u.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-white block truncate max-w-[180px]">{u.name}</span>
                        <span className="text-zinc-500 text-[10px] block">{u.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-red-950 text-red-500 border border-red-900/20' :
                        u.role === 'staff' ? 'bg-amber-950 text-amber-500 border border-amber-900/20' :
                        'bg-zinc-900 text-zinc-400'
                      }`}>
                        {u.role}
                      </span>
                      <button
                        onClick={() => handleStartEdit(u)}
                        className="p-1 hover:text-[#03f47c]"
                        title="Edit User"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1 hover:text-red-500"
                        title="Delete User"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar form for Seeding/Editing */}
            <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4 h-fit">
              {editingUserId ? (
                <>
                  <h3 className="font-mono text-xs font-bold text-[#FF4D4D] uppercase tracking-widest border-b border-zinc-900 pb-2">
                    EDIT IDENT RECORD
                  </h3>
                  <form onSubmit={handleUpdateUser} className="space-y-3 font-mono text-[11px] text-left">
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Name</label>
                      <input
                        type="text"
                        value={editUserName}
                        onChange={(e) => setEditUserName(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Email</label>
                      <input
                        type="email"
                        value={editUserEmail}
                        onChange={(e) => setEditUserEmail(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Access Level</label>
                      <select
                        value={editUserRole}
                        onChange={(e) => setEditUserRole(e.target.value as any)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-950 border border-emerald-500/40 text-emerald-400 uppercase rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
                    SEED NEW CREDENTIAL
                  </h3>
                  <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-[11px] text-left">
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={createUserName}
                        onChange={(e) => setCreateUserName(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={createUserEmail}
                        onChange={(e) => setCreateUserEmail(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Temporary Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••"
                        value={createUserPassword}
                        onChange={(e) => setCreateUserPassword(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-zinc-500 block uppercase">Default Access Level</label>
                      <select
                        value={createUserRole}
                        onChange={(e) => setCreateUserRole(e.target.value as any)}
                        className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-red-950 to-[#5a0000] border border-red-500/40 text-white font-mono text-xs uppercase rounded mt-2"
                    >
                      COMMIT NEW USER
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
              REAL-TIME CRYPTO ACTIVITY MONITOR
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <p className="font-mono text-xs text-zinc-650 uppercase py-6">No logs stored in database nodes.</p>
              ) : (
                logs.map((l: any) => (
                  <div key={l.id} className="p-3 bg-black/40 border border-white/5 rounded font-mono text-[11px] text-zinc-400 text-left flex justify-between gap-4">
                    <div>
                      <span className="text-[#FF4D4D] font-bold mr-2">// {l.activity.toUpperCase()}</span>
                      <span className="text-white">{l.name}</span>
                      <span className="text-zinc-600 text-[10px] ml-2">({l.email})</span>
                    </div>
                    <span className="text-zinc-600 text-[10px]">{new Date(l.timestamp).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: REPORTS */}
        {activeTab === 'reports' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#080808] border border-zinc-900 rounded-xl relative overflow-hidden text-left flex items-center space-x-4">
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#8b8b8b] block uppercase">Aggregate Vault Revenue</span>
                  <span className="font-mono text-xl font-extrabold text-[#03f47c] block mt-0.5">${stats.totalSales.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-5 bg-[#080808] border border-zinc-900 rounded-xl relative overflow-hidden text-left flex items-center space-x-4">
                <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#8b8b8b] block uppercase">Orders Volume</span>
                  <span className="font-mono text-xl font-extrabold text-white block mt-0.5">{stats.totalOrdersCount} DISPATCHES</span>
                </div>
              </div>

              <div className="p-5 bg-[#080808] border border-[#8b0000]/20 rounded-xl text-left flex items-center justify-between col-span-1">
                <div>
                  <span className="font-mono text-[9px] text-zinc-550 block uppercase">Critical Warnings</span>
                  <span className="font-mono text-xs text-red-500 font-bold block mt-1">{stats.lowStockProducts.length} LOW STOCK ITEMS</span>
                </div>
                <div className="w-3 h-3 bg-red-650 rounded-full animate-ping" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Daily Sales Report */}
              <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-left">
                <h4 className="font-mono text-xs font-bold text-white uppercase border-b border-zinc-900 pb-2 mb-4">
                  DAILY REVENUE LEDGER
                </h4>
                <div className="space-y-2">
                  {stats.dailyReport.map((day: any, idx: number) => (
                    <div key={idx} className="flex justify-between font-mono text-xs py-1 border-b border-zinc-900/40 text-zinc-400">
                      <span>{day.date}</span>
                      <span className="text-white font-bold">${day.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning List */}
              <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-left">
                <h4 className="font-mono text-xs font-bold text-[#FF4D4D] uppercase border-b border-zinc-900 pb-2 mb-4">
                  INVENTORY SHORTFALL WARNINGS
                </h4>
                <div className="space-y-2">
                  {stats.lowStockProducts.length === 0 ? (
                    <p className="font-mono text-xs text-zinc-650 uppercase">Inventory levels nominal. Zero alerts in loop.</p>
                  ) : (
                    stats.lowStockProducts.map((p: any) => (
                      <div key={p.id} className="flex justify-between font-mono text-xs py-1 border-b border-zinc-900/40 text-zinc-400">
                        <span className="uppercase">{p.name}</span>
                        <span className="text-red-500 font-extrabold">{p.stock} LEFT</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
   AUXILIARY 5: BLOG/NEWS PORTAL
   ========================================================================== */
interface BlogViewProps {
  onBackToHome: () => void;
}

export function BlogView({ onBackToHome }: BlogViewProps) {
  const blogs: BlogItem[] = [
    {
      id: 'news-1',
      title: 'Snapdragon 9 Extreme Thermal benchmarks inside Clean Cleanrooms',
      category: 'Tech News',
      date: 'May 20, 2026',
      readTime: '4 Mins read',
      excerpt: 'Evaluating how active graphite casing structures eliminate mobile processor throttling in elite gaming scenarios.',
      commentsCount: 2,
      content: 'Detailed thermal throttling benchmarks in controlled cleanroom settings.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
      author: 'Aetheron Labs'
    },
    {
      id: 'news-2',
      title: 'Zeiss optics coordination with laser telephoto sensors explored',
      category: 'Tech News',
      date: 'April 14, 2026',
      readTime: '8 Mins read',
      excerpt: 'Comparing low-light lens dynamics and raw pixel storage buffers under extreme testing.',
      commentsCount: 0,
      content: 'Exploring Zeiss optics collaboration with advanced telephoto sensors.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
      author: 'Aetheron Labs'
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="mb-10 text-left border-l-2 border-emerald-500 pl-4 py-1">
          <span className="font-mono text-xs text-emerald-400 tracking-widest">// SECURED TELEMETRY RELEASES</span>
          <h1 className="font-sans text-3xl font-extrabold text-white">AETHERON NEWS ROOM</h1>
        </div>

        <div className="space-y-6">
          {blogs.map(item => (
            <div key={item.id} className="p-6 bg-[#080808] border border-zinc-900 rounded-xl space-y-3">
              <div className="flex space-x-3 items-center font-mono text-[9px] uppercase">
                <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/10 px-2 py-0.5 rounded">{item.category}</span>
                <span className="text-zinc-650">{item.date}</span>
                <span className="text-zinc-650">//</span>
                <span>{item.readTime}</span>
              </div>
              <h3 className="font-sans text-lg font-bold text-white hover:text-emerald-400 cursor-pointer block">{item.title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">{item.excerpt}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   AUXILIARY 6: CONTACT VIEW
   ========================================================================== */
export function ContactView() {
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleSubmitMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 3000);
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="mb-10 text-left border-l-2 border-emerald-500 pl-4 py-1">
          <span className="font-mono text-xs text-emerald-400 tracking-widest">// DIRECT DIALOG LINES</span>
          <h1 className="font-sans text-3xl font-extrabold text-white">CLEAN CLEANROOMS SUPPORT</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Coordinates and operating details */}
          <div className="space-y-6 bg-[#080808] border border-zinc-900 rounded-xl p-5">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
              OUR DEPOSITORY NODES
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-650 uppercase text-[9px] block">Location coordinates</span>
                  <span className="text-zinc-300 block mt-0.5 uppercase">Silicon Corridor, Sector 4, Clean Lab clean-room</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-650 uppercase text-[9px] block">Secure message loop</span>
                  <span className="text-zinc-300 block mt-0.5">support@aetheronlabs.secure</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-zinc-650 uppercase text-[9px] block">Telephony Node</span>
                  <span className="text-zinc-300 block mt-0.5 font-bold">+1-800-AETHER-ON</span>
                </div>
              </div>
            </div>

            {/* Custom interactive Map Iframe */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden h-44 bg-zinc-950">
              <iframe
                title="Depository coordinates"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.565012543056!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807bed2e5bbd%3A0x6bba84338877f394!2sSilicon%20Valley!5e0!3m2!1sen!2sus!4v1660000000000"
                className="w-full h-full border-none grayscale filter invert opacity-50"
                loading="lazy"
              />
            </div>
          </div>

          {/* Dialog message inputs */}
          <div className="bg-[#080808] border border-zinc-900 rounded-xl p-6">
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4">
              COMMENCE SUPPORT TRANSMISSION
            </h3>
            <form onSubmit={handleSubmitMsg} className="space-y-4 font-mono text-xs">
              <input
                type="text"
                placeholder="YOUR CORE IDENTIFY..."
                className="bg-black border border-zinc-805 text-white px-3 py-2 w-full rounded outline-none text-xs"
                required
              />
              <textarea
                placeholder="PROVIDE SECURE COMMUNICATIONS DETAILS..."
                className="bg-black border border-zinc-805 text-white px-3 py-2 w-full rounded outline-none h-32 text-xs uppercase"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/40 rounded uppercase"
              >
                DEPLOY MESSAGE
              </button>
              {feedbackSuccess && (
                <p className="text-[#03f47c] mt-2 text-[9px] uppercase">✓ Signal logged successfully. Standing by for response.</p>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 1: SETTINGS VIEW
   ========================================================================== */
interface SettingsViewProps {
  user: any;
  onBack?: () => void;
}
export function SettingsView({ user, onBack }: SettingsViewProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!oldPassword.trim() || !newPassword.trim()) {
      setPasswordError('Empty values are not permitted.');
      return;
    }

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setOldPassword('');
        setNewPassword('');
        setPasswordSuccess('Password updated successfully.');
      } else {
        setPasswordError(data.error || 'Password update failed.');
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Network encryption link error.');
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-2xl mx-auto px-4 pt-10">
        <div className="mb-8 border-l-2 border-red-500 pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-red-400 tracking-widest">// TERMINAL SECURITY KEYS</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">SETTINGS</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>
        
        <div className="bg-[#080808] border border-zinc-900 rounded-xl p-6 space-y-6">
          {passwordSuccess && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase">
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded uppercase">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-zinc-500 block uppercase">CURRENT DECRYPTION PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-500 block uppercase">NEW DECRYPTION PASSWORD</label>
              <input
                type="password"
                placeholder="••••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500 text-xs text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-red-950 to-[#5a0000] border border-red-500/40 text-white rounded uppercase cursor-pointer"
            >
              RESET PASS TERMCODE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 2: FEEDBACK & SUPPORT VIEW
   ========================================================================== */
interface FeedbackSupportViewProps {
  onBack?: () => void;
}
export function FeedbackSupportView({ onBack }: FeedbackSupportViewProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketContent, setTicketContent] = useState('');
  const [supportSuccess, setSupportSuccess] = useState('');

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/forms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketContent.trim()) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: ticketTitle, content: ticketContent })
      });

      if (response.ok) {
        setTicketTitle('');
        setTicketContent('');
        setSupportSuccess('Support request deployed successfully.');
        fetchTickets();
        setTimeout(() => setSupportSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/auth/forms/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-4xl mx-auto px-4 space-y-8 pt-10">
        <div className="mb-6 border-l-2 border-emerald-500 pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-emerald-400 tracking-widest">// SUPPORT TICKETS FEEDBACK</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">FEEDBACK & SUPPORT</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>

        <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-3 mb-4">
            SUBMIT SUPPORT PROTOCOL
          </h3>

          {supportSuccess && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase mb-4">
              {supportSuccess}
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-zinc-500 block uppercase">ISSUE CATEGORY / TITLE</label>
              <input
                type="text"
                placeholder="E.G. SCREEN STUTTER IN GAMEPLAY, DELAYED STATUS..."
                value={ticketTitle}
                onChange={(e) => setTicketTitle(e.target.value)}
                className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none focus:border-emerald-500 text-xs text-white"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-500 block uppercase">DETAILS & DIAGNOSTICS</label>
              <textarea
                placeholder="DESCRIBE TERMINAL LOG FAULTS OR ACCESSORY FAULTS IN DETAIL..."
                value={ticketContent}
                onChange={(e) => setTicketContent(e.target.value)}
                className="bg-black border border-zinc-800 text-white px-3 py-2 w-full rounded outline-none h-28 focus:border-emerald-500 uppercase text-xs text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 rounded uppercase cursor-pointer"
            >
              DEPLOY SUPPORT TICKET
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest">
            ACTIVE TICKET LOOPS ({tickets.length})
          </h3>

          {tickets.length === 0 ? (
            <p className="font-mono text-xs text-zinc-605 uppercase">No logged support tickets registered.</p>
          ) : (
            tickets.map((t: any) => (
              <div key={t.id} className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <span className="font-mono text-xs font-bold text-white uppercase">{t.title}</span>
                  <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    t.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' :
                    t.status === 'Approved' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' :
                    'bg-red-950/40 text-red-400 border border-red-900/30'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 uppercase leading-relaxed">{t.content}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-600 pt-2">
                  <span>LOGGED: {new Date(t.timestamp).toLocaleString()}</span>
                  <button
                    onClick={() => handleDeleteTicket(t.id)}
                    className="text-red-500 hover:text-red-400 flex items-center gap-1 uppercase"
                  >
                    <Trash className="w-3 h-3" /> PURGE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 3: EDIT PROFILE VIEW
   ========================================================================== */
interface EditProfileViewProps {
  user: any;
  onBack?: () => void;
}
export function EditProfileView({ user, onBack }: EditProfileViewProps) {
  const [photo, setPhoto] = useState<string>(() => {
    return user.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400';
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPhoto(data.avatar);
        window.dispatchEvent(new Event('avatar-changed'));
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-2xl mx-auto px-4 space-y-8 pt-10">
        <div className="mb-6 border-l-2 border-[#8B0000] pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-red-400 tracking-widest">// CUSTOMER CREDENTIALS EDIT</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">EDIT PROFILE</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>

        <div className="bg-[#080808] border border-zinc-900/80 rounded-xl p-6 space-y-6 flex flex-col items-center">
          <div className="relative group w-32 h-32 rounded-full border-2 border-[#8B0000] p-0.5 overflow-hidden shadow-[0_0_15px_rgba(139,0,0,0.35)] bg-neutral-900 flex-shrink-0 select-none">
            <img
              src={photo}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
            />
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-300 rounded-full">
              <Camera className="w-6 h-6 text-[#FF4D4D]" />
              <span className="text-[8px] font-mono text-white mt-1 uppercase">UPLOAD</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="w-full space-y-4 font-mono text-xs text-left max-w-md mx-auto">
            <div>
              <span className="text-zinc-650 block text-[9px] uppercase">Client Name</span>
              <span className="text-white font-bold block mt-0.5">{user.name}</span>
            </div>
            <div>
              <span className="text-zinc-650 block text-[9px] uppercase">Secure Link</span>
              <span className="text-zinc-400 block mt-0.5">{user.email}</span>
            </div>
            <div>
              <span className="text-zinc-650 block text-[9px] uppercase">Rerouting Code</span>
              <span className="text-red-500 uppercase font-extrabold">ACC-T{user.id.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-zinc-650 block text-[9px] uppercase">Access Level</span>
              <span className="text-zinc-400 uppercase font-bold block mt-0.5">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 4: USER MANAGEMENT VIEW
   ========================================================================== */
interface UserManagementViewProps {
  onBack?: () => void;
}
export function UserManagementView({ onBack }: UserManagementViewProps) {
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [createUserName, setCreateUserName] = useState('');
  const [createUserEmail, setCreateUserEmail] = useState('');
  const [createUserPassword, setCreateUserPassword] = useState('');
  const [createUserRole, setCreateUserRole] = useState<'customer' | 'admin' | 'staff'>('customer');
  const [userMsg, setUserMsg] = useState('');

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<'customer' | 'admin' | 'staff'>('customer');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/admin/users${userSearch ? `?search=${userSearch}` : ''}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userSearch]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUserName.trim() || !createUserEmail.trim() || !createUserPassword.trim()) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: createUserName,
          email: createUserEmail,
          password: createUserPassword,
          role: createUserRole
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCreateUserName('');
        setCreateUserEmail('');
        setCreateUserPassword('');
        setUserMsg('User record seeded successfully.');
        fetchUsers();
        setTimeout(() => setUserMsg(''), 3000);
      } else {
        alert(data.error || 'Failed to create user.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (u: User) => {
    setEditingUserId(u.id);
    setEditUserName(u.name);
    setEditUserEmail(u.email);
    setEditUserRole(u.role);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;

    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch(`/api/admin/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole
        })
      });

      if (response.ok) {
        setEditingUserId(null);
        setUserMsg('User record updated successfully.');
        fetchUsers();
        setTimeout(() => setUserMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Confirm permanent deletion of this record?')) {
      try {
        const token = localStorage.getItem('aetheron_jwt_token');
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          fetchUsers();
        } else {
          const data = await response.json();
          alert(data.error || 'Delete failed.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-7xl mx-auto px-4 space-y-8 pt-10">
        <div className="mb-6 border-l-2 border-red-500 pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-red-400 tracking-widest">// SYSTEM ACCESS CONTROL</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">USER MANAGEMENT</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="SEARCH USER IDENTITIES BY NAME OR EMAIL..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-[#080808] border border-zinc-900 text-xs font-mono px-3 py-2 text-white outline-none focus:border-red-500 rounded uppercase"
              />
            </div>

            {userMsg && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] rounded uppercase">
                {userMsg}
              </div>
            )}

            <div className="space-y-3">
              {adminUsers.map(u => (
                <div key={u.id} className="p-4 bg-[#080808] border border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-900 flex-shrink-0">
                      <img src={u.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-white block truncate max-w-[180px]">{u.name}</span>
                      <span className="text-zinc-500 text-[10px] block">{u.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-red-950 text-red-500 border border-red-900/20' :
                      u.role === 'staff' ? 'bg-amber-950 text-amber-500 border border-amber-900/20' :
                      'bg-zinc-900 text-zinc-400'
                    }`}>
                      {u.role}
                    </span>
                    <button onClick={() => handleStartEdit(u)} className="p-1 hover:text-[#03f47c]" title="Edit User">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-1 hover:text-red-500" title="Delete User">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4 h-fit">
            {editingUserId ? (
              <>
                <h3 className="font-mono text-xs font-bold text-[#FF4D4D] uppercase tracking-widest border-b border-zinc-900 pb-2">
                  EDIT IDENT RECORD
                </h3>
                <form onSubmit={handleUpdateUser} className="space-y-3 font-mono text-[11px] text-left">
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Name</label>
                    <input
                      type="text"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Email</label>
                    <input
                      type="email"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-805 text-white px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Access Level</label>
                    <select
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value as any)}
                      className="w-full bg-black border border-zinc-805 text-white px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="w-full py-2 bg-emerald-950 border border-emerald-500/40 text-emerald-400 uppercase rounded text-xs">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingUserId(null)} className="w-full py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase rounded text-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
                  SEED NEW CREDENTIAL
                </h3>
                <form onSubmit={handleCreateUser} className="space-y-3 font-mono text-[11px] text-left">
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={createUserName}
                      onChange={(e) => setCreateUserName(e.target.value)}
                      className="w-full bg-black border border-zinc-805 text-white px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={createUserEmail}
                      onChange={(e) => setCreateUserEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-805 text-white px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Temporary Password</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••"
                      value={createUserPassword}
                      onChange={(e) => setCreateUserPassword(e.target.value)}
                      className="w-full bg-black border border-zinc-850 text-white px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-500 block uppercase">Default Access Level</label>
                    <select
                      value={createUserRole}
                      onChange={(e) => setCreateUserRole(e.target.value as any)}
                      className="w-full bg-black border border-zinc-850 text-white px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-gradient-to-r from-red-950 to-[#5a0000] border border-red-500/40 text-white font-mono text-xs uppercase rounded mt-2">
                    COMMIT NEW USER
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 5: ACTIVITY LOGS VIEW
   ========================================================================= */
interface ActivityLogsViewProps {
  onBack?: () => void;
}
export function ActivityLogsView({ onBack }: ActivityLogsViewProps) {
  const [logs, setLogs] = useState<any[]>([]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-6xl mx-auto px-4 space-y-6 pt-10">
        <div className="mb-6 border-l-2 border-red-500 pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-red-400 tracking-widest">// SECURED SYSTEM METRICS</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">ACTIVITY LOGS</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>

        <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 space-y-4">
          <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-zinc-900 pb-2">
            REAL-TIME CRYPTO ACTIVITY MONITOR
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {logs.length === 0 ? (
              <p className="font-mono text-xs text-zinc-650 uppercase py-6">No logs stored in database nodes.</p>
            ) : (
              logs.map((l: any) => (
                <div key={l.id} className="p-3 bg-black/40 border border-white/5 rounded font-mono text-[11px] text-zinc-400 text-left flex justify-between gap-4">
                  <div>
                    <span className="text-[#FF4D4D] font-bold mr-2">// {l.activity.toUpperCase()}</span>
                    <span className="text-white">{l.name}</span>
                    <span className="text-zinc-600 text-[10px] ml-2">({l.email})</span>
                  </div>
                  <span className="text-zinc-600 text-[10px]">{new Date(l.timestamp).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STANDALONE VIEW 6: REPORTS VIEW
   ========================================================================== */
interface ReportsViewProps {
  onBack?: () => void;
}
export function ReportsView({ onBack }: ReportsViewProps) {
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('aetheron_jwt_token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-6xl mx-auto px-4 space-y-6 pt-10">
        <div className="mb-6 border-l-2 border-red-500 pl-4 py-1 flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-red-400 tracking-widest">// STRATEGIC REVENUE CHARTS</span>
            <h1 className="font-sans text-3xl font-extrabold text-white">REPORTS & ANALYTICS</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded font-mono text-xs uppercase cursor-pointer"
            >
              Return
            </button>
          )}
        </div>

        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-[#080808] border border-zinc-900 rounded-xl relative overflow-hidden text-left flex items-center space-x-4">
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-lg">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#8b8b8b] block uppercase">Aggregate Vault Revenue</span>
                  <span className="font-mono text-xl font-extrabold text-[#03f47c] block mt-0.5">${stats.totalSales.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-5 bg-[#080808] border border-zinc-900 rounded-xl relative overflow-hidden text-left flex items-center space-x-4">
                <div className="p-3 bg-red-950/20 border border-red-900/30 text-red-400 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#8b8b8b] block uppercase">Orders Volume</span>
                  <span className="font-mono text-xl font-extrabold text-white block mt-0.5">{stats.totalOrdersCount} DISPATCHES</span>
                </div>
              </div>

              <div className="p-5 bg-[#080808] border border-[#8b0000]/20 rounded-xl text-left flex items-center justify-between col-span-1">
                <div>
                  <span className="font-mono text-[9px] text-zinc-550 block uppercase">Critical Warnings</span>
                  <span className="font-mono text-xs text-red-500 font-bold block mt-1">{stats.lowStockProducts.length} LOW STOCK ITEMS</span>
                </div>
                <div className="w-3 h-3 bg-red-650 rounded-full animate-ping" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-left">
                <h4 className="font-mono text-xs font-bold text-white uppercase border-b border-zinc-900 pb-2 mb-4">
                  DAILY REVENUE LEDGER
                </h4>
                <div className="space-y-2">
                  {stats.dailyReport.map((day: any, idx: number) => (
                    <div key={idx} className="flex justify-between font-mono text-xs py-1 border-b border-zinc-900/40 text-zinc-400">
                      <span>{day.date}</span>
                      <span className="text-white font-bold">${day.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#080808] border border-zinc-900 rounded-xl p-5 text-left">
                <h4 className="font-mono text-xs font-bold text-[#FF4D4D] uppercase border-b border-zinc-900 pb-2 mb-4">
                  INVENTORY SHORTFALL WARNINGS
                </h4>
                <div className="space-y-2">
                  {stats.lowStockProducts.length === 0 ? (
                    <p className="font-mono text-xs text-zinc-650 uppercase">Inventory levels nominal. Zero alerts in loop.</p>
                  ) : (
                    stats.lowStockProducts.map((p: any) => (
                      <div key={p.id} className="flex justify-between font-mono text-xs py-1 border-b border-zinc-900/40 text-zinc-400">
                        <span className="uppercase">{p.name}</span>
                        <span className="text-red-500 font-extrabold">{p.stock} LEFT</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
