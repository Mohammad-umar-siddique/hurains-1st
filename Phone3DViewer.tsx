/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Rotate3d, Play, Eye, Compass, ShieldCheck } from 'lucide-react';

interface Phone3DViewerProps {
  color: string; // HEX string like "#ABA49C"
  phoneName?: string;
  isGaming?: boolean;
}

export default function Phone3DViewer({ color, phoneName = 'Flagship Tech', isGaming = false }: Phone3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // 3D angles in radians
  const [angles, setAngles] = useState({ x: -0.4, y: 0.6, z: 0 });
  const [wireframeMode, setWireframeMode] = useState(false);
  const [glowColor, setGlowColor] = useState<any>('#03f47c'); // Emerald Green or Blood Red
  const [spinMode, setSpinMode] = useState(true);
  const [screenGloss, setScreenGloss] = useState(true);
  
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Set default glow based on product characteristics
  useEffect(() => {
    if (isGaming) {
      setGlowColor('#8B0000'); // Blood Red glow
    } else {
      setGlowColor('#062E22'); // Forest Green glow
    }
  }, [isGaming]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    setSpinMode(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    setAngles(prev => ({
      x: prev.x + deltaY * 0.015,
      y: prev.y + deltaX * 0.015,
      z: prev.z
    }));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setSpinMode(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    setAngles(prev => ({
      x: prev.x + deltaY * 0.015,
      y: prev.y + deltaX * 0.015,
      z: prev.z
    }));

    previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Animation Loop
    let t = 0;
    const render = () => {
      t += 0.01;
      
      // Clear Screen with deep slate background gradient
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // Draw subtle holographic backdrop grid
      ctx.strokeStyle = 'rgba(6, 46, 34, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Automatically spin if spin mode is on
      let rotX = angles.x;
      let rotY = angles.y;
      if (spinMode) {
        rotY += t * 0.3; // rotate on Y
      }

      // Projection parameters
      const scale = Math.min(width, height) * 0.42;

      // 3D Box vertices (representing a premium smartphone)
      // Phone specs: Height 2, Width 1, Thickness 0.12
      const vertices = [
        // Front Face
        { x: -0.52, y: -1.0, z: 0.06 },  // 0: top left
        { x: 0.52, y: -1.0, z: 0.06 },   // 1: top right
        { x: 0.52, y: 1.0, z: 0.06 },    // 2: bottom right
        { x: -0.52, y: 1.0, z: 0.06 },   // 3: bottom left
        // Back Face
        { x: -0.52, y: -1.0, z: -0.06 }, // 4: top left
        { x: 0.52, y: -1.0, z: -0.06 },  // 5: top right
        { x: 0.52, y: 1.0, z: -0.06 },   // 6: bottom right
        { x: -0.52, y: 1.0, z: -0.06 },  // 7: bottom left
      ];

      // Camera Bump Vertices (placed on the back face upper center)
      const cameraBump = [
        { x: -0.22, y: -0.85, z: -0.06 }, // front corners of bump slightly protruding
        { x: 0.22, y: -0.85, z: -0.06 },
        { x: 0.22, y: -0.45, z: -0.06 },
        { x: -0.22, y: -0.45, z: -0.06 },
        // extruded parts
        { x: -0.22, y: -0.85, z: -0.09 },
        { x: 0.22, y: -0.85, z: -0.09 },
        { x: 0.22, y: -0.45, z: -0.09 },
        { x: -0.22, y: -0.45, z: -0.09 },
      ];

      // Screen Bezels Coordinates (inner frame)
      const screenVertices = [
        { x: -0.48, y: -0.94, z: 0.061 },
        { x: 0.48, y: -0.94, z: 0.061 },
        { x: 0.48, y: 0.94, z: 0.061 },
        { x: -0.48, y: 0.94, z: 0.061 },
      ];

      // Helper function to rotate 3D point
      const projectPoint = (p: { x: number; y: number; z: number }) => {
        // Rotate X
        let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
        let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);
        
        // Rotate Y
        let x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
        let z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

        // Perspective projection
        const d = 3.5; // distance of eyes from screen
        const fov = d / (d + z2);
        
        return {
          x: cx + x2 * scale * fov,
          y: cy + y1 * scale * fov,
          z: z2 // depth factor
        };
      };

      const pts = vertices.map(projectPoint);
      const scrPts = screenVertices.map(projectPoint);
      const camPts = cameraBump.map(projectPoint);

      // Determine face normal to handle depth layering & backface culling
      // Simple face sorting based on Average Z-Value
      const faces = [
        { name: 'front', indices: [0, 1, 2, 3], avgZ: (pts[0].z + pts[1].z + pts[2].z + pts[3].z) / 4 },
        { name: 'back', indices: [5, 4, 7, 6], avgZ: (pts[4].z + pts[5].z + pts[6].z + pts[7].z) / 4 },
        { name: 'left', indices: [4, 0, 3, 7], avgZ: (pts[4].z + pts[0].z + pts[3].z + pts[7].z) / 4 },
        { name: 'right', indices: [1, 5, 6, 2], avgZ: (pts[1].z + pts[5].z + pts[6].z + pts[2].z) / 4 },
        { name: 'top', indices: [4, 5, 1, 0], avgZ: (pts[4].z + pts[5].z + pts[1].z + pts[0].z) / 4 },
        { name: 'bottom', indices: [3, 2, 6, 7], avgZ: (pts[3].z + pts[2].z + pts[6].z + pts[7].z) / 4 }
      ];

      // Sort faces back to front (highest Z is farther, draw first; lowest Z is closer, draw last)
      faces.sort((a, b) => b.avgZ - a.avgZ);

      // Draw faces of the phone
      faces.forEach(face => {
        // Build path
        ctx.beginPath();
        const p0 = pts[face.indices[0]];
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < 4; i++) {
          const pi = pts[face.indices[i]];
          ctx.lineTo(pi.x, pi.y);
        }
        ctx.closePath();

        if (wireframeMode) {
          // Cyberpunk glowing green wireframe lines
          ctx.strokeStyle = isGaming ? 'rgba(139, 0, 0, 0.7)' : 'rgba(3, 244, 124, 0.7)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          
          // Outer vertices flare glow
          ctx.fillStyle = isGaming ? 'rgba(139, 0, 0, 0.3)' : 'rgba(3, 244, 124, 0.3)';
          ctx.fill();
          return;
        }

        // Draw solid colored panels
        if (face.name === 'front') {
          // Drawing the front Screen frame of the phone
          ctx.fillStyle = '#050505'; // Dark Bezel
          ctx.fill();
          
          // Draw Active Cyber Wave screen
          ctx.beginPath();
          ctx.moveTo(scrPts[0].x, scrPts[0].y);
          ctx.lineTo(scrPts[1].x, scrPts[1].y);
          ctx.lineTo(scrPts[2].x, scrPts[2].y);
          ctx.lineTo(scrPts[3].x, scrPts[3].y);
          ctx.closePath();

          // Create a premium dark-emerald or dark-crimson screen pattern
          const screenGrad = ctx.createLinearGradient(scrPts[0].x, scrPts[0].y, scrPts[2].x, scrPts[2].y);
          if (isGaming) {
            screenGrad.addColorStop(0, '#1a0000');
            screenGrad.addColorStop(0.5, '#400000');
            screenGrad.addColorStop(1, '#050505');
          } else {
            screenGrad.addColorStop(0, '#020f0b');
            screenGrad.addColorStop(0.5, '#05231a');
            screenGrad.addColorStop(1, '#050505');
          }
          ctx.fillStyle = screenGrad;
          ctx.fill();

          // Draw floating glowing technology lines on screen (Dynamic waves)
          ctx.strokeStyle = isGaming ? 'rgba(239, 68, 68, 0.5)' : 'rgba(16, 185, 129, 0.5)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          const pStart = scrPts[0];
          const pEnd = scrPts[3];
          const textYCenter = (scrPts[0].y + scrPts[3].y) / 2;
          const textXCenter = (scrPts[0].x + scrPts[1].x) / 2;

          // Drawing sine waves corresponding to time
          ctx.moveTo(scrPts[0].x, textYCenter);
          for (let step = 0; step <= 20; step++) {
            const ratio = step / 20;
            const x = scrPts[0].x * (1 - ratio) + scrPts[1].x * ratio;
            const yOffset = Math.sin(t * 3 + ratio * Math.PI * 4) * 15 * (1 - Math.abs(ratio - 0.5) * 2);
            const y = textYCenter + yOffset;
            ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Screen UI Overlay Text details
          ctx.font = '10px monospace';
          ctx.fillStyle = isGaming ? '#ff3b30' : '#10b981';
          ctx.textAlign = 'center';
          ctx.fillText('AETHERON PRO X', textXCenter, textYCenter - 30);
          ctx.fillText(`CPU: ${isGaming ? 'OVERCLOCKED' : 'OPTIMIZED'}`, textXCenter, textYCenter + 40);
          ctx.fillText(`POWER: 98%`, textXCenter, textYCenter + 55);

          // Render Glossy reflection glaze across the screen
          if (screenGloss) {
            ctx.beginPath();
            ctx.moveTo(scrPts[0].x, scrPts[0].y);
            ctx.lineTo(scrPts[1].x, scrPts[1].y);
            ctx.lineTo(scrPts[1].x * 0.3 + scrPts[2].x * 0.7, scrPts[1].y * 0.3 + scrPts[2].y * 0.7);
            ctx.closePath();
            const reflectionGen = ctx.createLinearGradient(scrPts[0].x, scrPts[0].y, scrPts[2].x, scrPts[2].y);
            reflectionGen.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
            reflectionGen.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
            reflectionGen.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = reflectionGen;
            ctx.fill();
          }

        } else if (face.name === 'back') {
          // Draw Luxury Casing color
          ctx.fillStyle = color;
          ctx.fill();

          // Draw metallic back cover details
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo((pts[4].x + pts[5].x)/2, pts[4].y);
          ctx.lineTo((pts[7].x + pts[6].x)/2, pts[7].y);
          ctx.stroke();

          // Draw Camera Bump (Layered on top of the back face)
          ctx.beginPath();
          ctx.moveTo(camPts[4].x, camPts[4].y);
          for (let k = 5; k < 8; k++) ctx.lineTo(camPts[k].x, camPts[k].y);
          ctx.closePath();
          ctx.fillStyle = '#111111'; // Black Camera Plate
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.stroke();

          // Draw camera lenses as glowing elements inside the camera bump area
          const lensCenter1 = projectPoint({ x: 0, y: -0.75, z: -0.095 });
          const lensCenter2 = projectPoint({ x: 0, y: -0.55, z: -0.095 });
          
          // Lens 1
          ctx.beginPath();
          ctx.arc(lensCenter1.x, lensCenter1.y, Math.abs(scale * 0.04), 0, Math.PI * 2);
          ctx.fillStyle = '#050505';
          ctx.fill();
          ctx.strokeStyle = isGaming ? 'rgba(139,0,0,0.8)' : 'rgba(16,185,129,0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Camera lens flare inside lens 1
          ctx.beginPath();
          ctx.arc(lensCenter1.x - scale*0.01, lensCenter1.y - scale*0.01, scale*0.01, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fill();

          // Lens 2
          ctx.beginPath();
          ctx.arc(lensCenter2.x, lensCenter2.y, Math.abs(scale * 0.04), 0, Math.PI * 2);
          ctx.fillStyle = '#050505';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Brand logo on back bottom center
          const logoPos = projectPoint({ x: 0, y: 0.6, z: -0.061 });
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fillText('⚡A E T H E R', logoPos.x, logoPos.y);

        } else {
          // Side frames (Metallic finishes)
          // Derive a slightly darker version of the main color or metal gray for rails
          const sideGrad = ctx.createLinearGradient(p0.x, p0.y, pts[face.indices[2]].x, pts[face.indices[2]].y);
          sideGrad.addColorStop(0, '#1a1a1a');
          sideGrad.addColorStop(0.5, color);
          sideGrad.addColorStop(1, '#050505');
          
          ctx.fillStyle = sideGrad;
          ctx.fill();
          
          // Border glow trace for side buttons or high-tech frame lighting
          ctx.strokeStyle = isGaming ? 'rgba(139, 0, 0, 0.4)' : 'rgba(16, 185, 129, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Render Floating cyber metrics / Holograms around the 3D phone
      ctx.textAlign = 'left';
      ctx.font = '10px monospace';
      ctx.fillStyle = isGaming ? 'rgba(220,38,38,0.7)' : 'rgba(52,211,153,0.7)';
      
      // Left indicator metrics
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy - 80);
      ctx.lineTo(cx - 130, cy - 80);
      ctx.lineTo(cx - 110, cy - 100);
      ctx.strokeStyle = isGaming ? 'rgba(220,38,38,0.3)' : 'rgba(52,211,153,0.3)';
      ctx.stroke();
      ctx.fillText('LIQUID COOLING: ACTIVE', cx - 250, cy - 77);

      // Right indicator metrics
      ctx.beginPath();
      ctx.moveTo(cx + 150, cy + 80);
      ctx.lineTo(cx + 130, cy + 80);
      ctx.lineTo(cx + 110, cy + 100);
      ctx.stroke();
      ctx.fillText('360° ENGINE: ACTIVE', cx + 160, cy + 83);

      // Request next frame
      requestRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [angles, wireframeMode, spinMode, screenGloss, color, isGaming]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-2xl border border-emerald-950/40 backdrop-blur-md relative overflow-hidden group">
      
      {/* Visual cyber mesh layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-10" />
      <div className="absolute top-3 left-4 flex items-center space-x-2 z-20">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase">
          AETHERON 3D INTERACTIVE RENDER
        </span>
      </div>

      <div className="absolute top-3 right-4 flex space-x-1 z-20">
        <span className="font-mono text-[9px] text-gray-500 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
          FPS: 60
        </span>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <canvas
          id="threed-viewer-canvas"
          ref={canvasRef}
          width={450}
          height={380}
          className="cursor-grab active:cursor-grabbing max-w-full touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Cyber Controls */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-3 border-t border-emerald-950/20 relative z-30">
        
        <button
          id="btn-spin-mode"
          onClick={() => setSpinMode(!spinMode)}
          className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center justify-center space-x-1.5 transition-all outline-none border ${
            spinMode 
              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
              : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{spinMode ? 'AUTOSPIN ON' : 'SPIN STATIC'}</span>
        </button>

        <button
          id="btn-wireframe-mode"
          onClick={() => setWireframeMode(!wireframeMode)}
          className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center justify-center space-x-1.5 transition-all outline-none border ${
            wireframeMode 
              ? 'bg-red-950/50 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
              : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>{wireframeMode ? 'WIREFRAME' : 'CYBER SOLID'}</span>
        </button>

        <button
          id="btn-glare-mode"
          onClick={() => setScreenGloss(!screenGloss)}
          className={`px-3 py-2 rounded-lg font-mono text-xs flex items-center justify-center space-x-1.5 transition-all outline-none border ${
            screenGloss 
              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' 
              : 'bg-zinc-900/60 text-zinc-500 border-zinc-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{screenGloss ? 'REFLECTIONS' : 'MATTE PANEL'}</span>
        </button>

        <div className="px-3 py-2 rounded-lg bg-zinc-900/20 border border-zinc-800 flex items-center justify-center space-x-1.5 text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-mono text-[10px] uppercase truncate">{phoneName.split(' ')[0]} PRO</span>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-zinc-600 font-mono text-center relative z-20">
        🖱️ Click and drag mouse / Swipe screen to freely rotate in 3D perspective
      </p>
    </div>
  );
}
