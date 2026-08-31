/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Award, Compass, ShieldCheck, Mail, Cpu, Upload, Clock, UserCheck, HelpCircle } from 'lucide-react';

export default function AboutView() {
  
  // Local state to persist uploaded owner photo locally in browser
  const [ownerPic, setOwnerPic] = useState<string>('');
  const [liveUTC, setLiveUTC] = useState<string>('');

  useEffect(() => {
    // Sync live clocks
    const syncTime = () => {
      setLiveUTC(new Date().toUTCString());
    };
    syncTime();
    const interval = setInterval(syncTime, 1000);
    
    // Retrieve any persisted avatar
    const savedPic = localStorage.getItem('owner_avatar_custom');
    if (savedPic) setOwnerPic(savedPic);

    return () => clearInterval(interval);
  }, []);

  // Handle local owner photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setOwnerPic(base64);
      localStorage.setItem('owner_avatar_custom', base64);
    };
    reader.readAsDataURL(file);
  };

  const stats = [
    { label: 'DELIVERED SHIPMENTS', value: '143,500+' },
    { label: 'CORE RELIABILITY INDEX', value: '99.98%' },
    { label: 'LAB REPLACEMENT RETAINER', value: '48 Hour' },
    { label: 'COUNTRIES DEPLOYED', value: '18+' }
  ];

  const milestones = [
    { year: '2022', title: 'Laboratory Activation', desc: 'Siddique Umar establishes AETHERON labs under clean chamber protocols, focusing on custom graphite cooling frames.' },
    { year: '2024', title: 'Holographic Projections', desc: 'We rolled out our pioneer CSS 3D projections dashboard to model hardware assemblies in high fidelity.' },
    { year: '2025', title: 'The Hyper-Charge Wave', desc: 'Introduced adaptive 240W thermal shielding algorithms, multiplying lithium-ion battery lifespans of flagships.' },
    { year: '2026', title: 'Cyber Luxury Expansion', desc: 'Merged raw ROG gaming levels with Tesla executive materials, deploying a world-class online portal.' }
  ];

  return (
    <div className="bg-[#050505] min-h-screen py-16 text-zinc-300 text-left">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* About Header */}
        <div className="mb-14 text-center max-w-xl mx-auto">
          <span className="font-mono text-xs text-emerald-400 tracking-widest lowercase">// COGNITIVE BLUEPRINT</span>
          <h1 className="font-sans text-4xl font-extrabold text-white mt-1 border-b border-zinc-900 pb-3">OUR CORE VISION</h1>
        </div>

        {/* Narrative and Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-emerald-400 uppercase tracking-widest">AETHERON OPERATIVE PHILOSOPHY</h3>
            <p className="font-sans text-base text-zinc-400 leading-relaxed font-light">
              We do not distribute mere cellular items; we assemble physical endpoints for digital acceleration. Every flagship smartphone on our registry undergoes thermal inspections, multi-spectral camera calibration, and battery retention tests.
            </p>
            <p className="font-mono text-xs text-zinc-500 uppercase leading-relaxed font-light mt-4">
              Directed from our modern clean-rooms by Lead Architect Siddique Umar, we fuse materials science, high-refresh liquid-crystals, and artificial intelligence into a singular luxury boutique experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="p-5 bg-[#080808] border border-zinc-900/60 rounded-xl text-center">
                <span className="font-mono text-2xl font-extrabold text-[#03f47c] block">{s.value}</span>
                <span className="font-mono text-[9px] text-zinc-600 block mt-1 tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OWNER DIRECTIVE SECTION (SIDDIQUE UMAR) */}
        <section className="py-14 bg-black border border-zinc-900/40 rounded-2xl p-6 sm:p-12 mb-20 relative overflow-hidden">
          
          {/* Cyber accents background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 font-mono text-[8px] text-zinc-600 pointer-events-none uppercase">
            <Clock className="w-3 h-3 text-emerald-500 animate-spin [animation-duration:12s]" />
            <span>UTC TICK: {liveUTC || 'SYNCING...'}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative z-10">
            
            {/* Owner Photo / Interactive Hologram Column */}
            <div className="flex flex-col items-center">
              <div className="w-72 h-112 rounded-2xl overflow-hidden shadow-2xl bg-zinc-950 flex flex-col items-center justify-center border-2 border-emerald-950 group relative">
                
                {ownerPic ? (
                  /* Custom uploaded image casing */
                  <div className="w-full h-full relative">
                    <img
                      referrerPolicy="no-referrer"
                      src={ownerPic}
                      alt="Siddique Umar"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 pointer-events-none" />
                  </div>
                ) : (
                  /* Animated premium high-tech SVG fall-back frame represents the founder beautifully */
                  <div className="w-full h-full p-6 flex flex-col justify-between relative bg-neutral-950">
                    <div className="absolute inset-0 bg-radial-gradient from-emerald-950/15 to-transparent pointer-events-none" />
                    
                    {/* Glowing coordinate lines */}
                    <div className="absolute top-4 left-4 font-mono text-[8px] text-emerald-500/60">SYS_COR_OUT_7</div>
                    <div className="absolute bottom-4 right-4 font-mono text-[8px] text-emerald-500/60">NODE_LIVE_98</div>

                    {/* Styled High-Tech SVG Hologram representing Siddique Umar */}
                    <div className="w-full h-56 flex items-center justify-center pt-4">
                      <svg viewBox="0 0 100 100" className="w-36 h-36 text-emerald-500 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse">
                        {/* Mesh grid backdrop lines */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="1" strokeDasharray="3 3"/>
                        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth="1"/>
                        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
                        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />

                        {/* Portrait facial outline vectors representing short-hair, fine beard bearded young founder */}
                        {/* Shoulders */}
                        <path d="M 15 90 C 25 70, 75 70, 85 90" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        {/* Face */}
                        <path d="M 33 40 C 33 20, 67 20, 67 40 C 67 60, 63 67, 50 72 C 37 67, 33 60, 33 40" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        {/* Eyes */}
                        <circle cx="43" cy="38" r="1.5" fill="currentColor"/>
                        <circle cx="57" cy="38" r="1.5" fill="currentColor"/>
                        {/* Beard edge markings */}
                        <path d="M 34 45 Q 40 60, 50 67 Q 60 60, 66 45" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 1.5"/>
                        {/* Cool neck collar */}
                        <path d="M 43 73 L 50 82 L 57 73" fill="none" stroke="currentColor" strokeWidth="1.5"/>

                        {/* Scanner sweep line */}
                        <line x1="10" y1="50" x2="90" y2="50" stroke="#ef4444" strokeWidth="0.8" className="animate-[bounce_3s_infinite]" />
                      </svg>
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                      <span className="font-mono text-[9px] text-[#03f47c] tracking-widest block uppercase animate-pulse">
                        ■ PORTRAIT ENCRYPTED ■
                      </span>
                      <p className="font-mono text-[10px] text-zinc-550 max-w-[180px] mx-auto text-center leading-normal">
                        Reroute local profile or upload your personal photo down below to casing portrait.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cover file triggers inside card */}
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center z-20">
                  <Upload className="w-8 h-8 text-emerald-400 mb-2 animate-bounce" />
                  <p className="font-mono text-[11px] text-white uppercase tracking-widest font-bold">REPLACE PHOTO CAPTURE</p>
                  <p className="font-mono text-[9px] text-zinc-500 mt-2 max-w-[200px] leading-relaxed">
                    Select your personal image from local terminal disk to seed Owner Section instantly.
                  </p>
                  
                  {/* File Form overlay */}
                  <label className="mt-4 px-4 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-400 hover:text-white font-mono text-[10px] rounded cursor-pointer uppercase select-none transition-colors">
                    Upload Picture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {ownerPic && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOwnerPic('');
                        localStorage.removeItem('owner_avatar_custom');
                      }}
                      className="mt-2 font-mono text-[9px] text-zinc-500 hover:text-red-400 transition-colors uppercase outline-none"
                    >
                      Clear custom image
                    </button>
                  )}
                </div>

              </div>
              
              <span className="font-mono text-[8px] text-zinc-650 mt-2 tracking-widest uppercase">HARDWARE NODE ID: UM-92</span>
            </div>

            {/* Owner Text Bio details column */}
            <div className="lg:col-span-2 space-y-6 text-left">
              <div>
                <span className="font-mono text-xs text-emerald-400 tracking-wider font-bold">// CHIEF ARCHITECT DIRECTIVE</span>
                <h2 className="font-sans text-4xl font-extrabold text-white mt-1 border-b border-zinc-900 pb-3">
                  SIDDIQUE UMAR
                </h2>
                <span className="font-mono text-[10px] text-zinc-505 uppercase block mt-1">Founder, Lead Visual Engineer, & Systems Director</span>
              </div>

              <div className="space-y-4 font-sans text-[13.5px] text-zinc-400 leading-relaxed font-light">
                <p className="font-semibold text-emerald-400 uppercase font-mono text-xs tracking-wider">About the Founder</p>
                <p>
                  "Hello and welcome! I am a passionate tech enthusiast and software engineer currently pursuing my diploma in Computer Science. With a deep background in hardware maintenance, system architectures, and programming, I built this platform to blend my technical expertise with high-quality service."
                </p>
                <p>
                  "Whether it's optimizing digital solutions or managing the technical backend of this store, I am dedicated to ensuring a seamless, reliable, and modern experience for all our users."
                </p>
              </div>

              {/* Direct corporate email */}
              <div className="inline-flex items-center space-x-3 bg-zinc-950 p-4 border border-zinc-900 rounded-lg">
                <Mail className="w-4 h-4 text-emerald-400" />
                <div className="font-mono text-[11px] leading-tight select-all">
                  <span className="text-zinc-500 uppercase block">Secure Direct Link</span>
                  <span className="text-white font-bold block mt-0.5">siddique21umar@gmail.com</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Milestones timeline path visual details */}
        <div className="mb-24">
          <h3 className="font-mono text-xs font-bold text-center text-zinc-500 uppercase tracking-widest mb-12">
            MILESTONES & HISTORY ROADMAP
          </h3>
          <div className="border-l border-[#0a2f23] ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-4 gap-6 relative">
            {milestones.map((mil, idx) => (
              <div key={idx} className="relative pl-6 md:pl-0 md:pt-6 mb-8 md:mb-0 text-left border-l md:border-l-0 md:border-t border-zinc-900/60 pt-4 md:pt-6">
                
                {/* Visual node dot */}
                <div className="absolute top-0 left-[-6px] md:top-[-6px] md:left-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050505] shadow animate-pulse" />
                
                <span className="font-mono text-xs font-extrabold text-[#03f47c]">{mil.year}</span>
                <h4 className="font-sans text-sm font-bold text-white mt-1 uppercase">{mil.title}</h4>
                <p className="font-mono text-[11px] text-zinc-500 font-light mt-2 leading-relaxed uppercase">{mil.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NEW SECTION 1: THE RESEARCH & DEVELOPMENT COMPLEX */}
        <section className="py-16 border-t border-zinc-900/80 mb-20 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Title / Intro */}
            <div className="lg:col-span-1 space-y-4">
              <span className="font-mono text-xs text-[#FF4D4D] uppercase tracking-widest block">// FACILITY SCHEMATICS</span>
              <h2 className="font-sans text-3xl font-extrabold text-white mt-1 uppercase tracking-tight">R&D COMPLEX CHAMBERS</h2>
              <p className="font-sans text-[13px] text-zinc-400 leading-relaxed font-light">
                Our bespoke hardware isn't merely chosen; it is scientifically hardened. Each structural component runs through custom cleanrooms calibrated to premium aviation standards.
              </p>
              <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg">
                <span className="font-mono text-[9px] text-emerald-400 block uppercase tracking-wider">// CHIEF ENGINEER NOTE</span>
                <p className="font-mono text-[10px] text-zinc-500 mt-1 italic leading-relaxed">
                  "By running isolated chamber testing, we ensure that processors like Snapdragon survive high computational stresses without dropping frames or throttling." - S.U.
                </p>
              </div>
            </div>

            {/* Bento Chambers list */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  code: 'CHAMBER_Z1',
                  name: 'Cryogenic Thermodynamic Loop',
                  metric: 'TARGET TEMP: -4°C',
                  desc: 'Specializes in thermoelectric chip calibrations. We seal active centrifuges inside airlock vacuum spaces to monitor graphite dissipation rates.'
                },
                {
                  code: 'CHAMBER_H9',
                  name: 'Optics Calibration & Alignment',
                  metric: 'LUX RATIO: 1:1,000,000',
                  desc: 'Coordinates double periscopic sensors with Hasselblad arrays. We pass micro-lasers through multi-layered prism systems to correct mechanical frame deviations.'
                },
                {
                  code: 'CHAMBER_M4',
                  name: 'Anodized Pressure & Stress Test',
                  metric: 'LOAD BARRIER: 15,000 PSI',
                  desc: 'Pressurizes grade-5 natural titanium chassis structures. Checks seam tolerances to shield the delicate OLED substrates during heavy impact events.'
                },
                {
                  code: 'CHAMBER_T7',
                  name: 'Neural Link OS Simulator',
                  metric: 'COMPILE DELAY: 0.05ms',
                  desc: 'Compiles clean stock firmware profiles. Trims ambient data telemetry background trackers to prioritize system bus limits for user-initiated software queries.'
                }
              ].map((ch, i) => (
                <div key={i} className="p-6 bg-[#080808] border border-zinc-900 rounded-xl space-y-3 hover:border-zinc-850 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#FF4D4D] bg-red-950/20 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold">
                      {ch.code}
                    </span>
                    <span className="font-mono text-[9px] text-zinc-650 font-bold uppercase">{ch.metric}</span>
                  </div>
                  <h3 className="font-sans text-sm font-bold text-white uppercase">{ch.name}</h3>
                  <p className="font-sans text-[11.5px] text-zinc-500 font-light leading-relaxed">{ch.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* NEW SECTION 2: THE SACRED PRINCIPLES OF EXQUISITE INTEGRITY */}
        <section className="py-16 border-t border-zinc-900/80 text-left">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="font-mono text-xs text-emerald-400 tracking-widest block uppercase">// THE FOUNDATION</span>
            <h2 className="font-sans text-3xl font-extrabold text-white mt-1 uppercase tracking-tight">OPERATIONAL CORE PRINCIPLES</h2>
            <p className="font-sans text-[13px] text-zinc-500 text-center font-light uppercase mt-2">
              Our absolute guidelines when engineering premium systems for demanding operators worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px]">
            {[
              {
                num: '01',
                title: 'Hardware Sovereignty',
                detail: 'No compromises on raw chassis structural elements. We decline cheap plastics and generic alloys, keeping titanium and aircraft yellow aluminum at the core of all models.'
              },
              {
                num: '02',
                title: 'Cryo-Active Throttling Resist',
                detail: 'High performance is useless if it drops to safe modes under heat. Our phones prioritize centrifugal active liquid conduits, keeping frame speeds stabilized.'
              },
              {
                num: '03',
                title: 'Clean Native Emission OS',
                detail: 'Our software builds reject pre-installed adware layers. We supply raw Android profiles with responsive graphic systems calibrated purely to hardware refresh rates.'
              }
            ].map((pr, i) => (
              <div key={i} className="p-6 bg-black border border-zinc-900 rounded-xl relative overflow-hidden group hover:border-emerald-900/60 transition-all">
                <span className="absolute right-4 top-4 text-4xl font-black text-zinc-900 opacity-20 group-hover:text-emerald-500/10 group-hover:opacity-100 transition-all font-mono">
                  {pr.num}
                </span>
                <span className="text-[#03f47c] font-black uppercase text-xs block mb-2">{pr.title}</span>
                <p className="text-zinc-500 leading-relaxed uppercase">{pr.detail}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
