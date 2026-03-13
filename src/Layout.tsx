import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './components/CartProvider';

export function Layout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-[#E5DCCD] text-[#2D1F1C] font-sans selection:bg-[#93312A]/20">
        <Navigation/>
        <main className="flex-grow pt-24">
          <Outlet/>
        </main>
        <Footer/>
        <CartDrawer/>
        {/* Grain texture overlay — analog feel, 4% opacity */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-30"
          style={{ opacity: 0.04, mixBlendMode: 'multiply' as React.CSSProperties['mixBlendMode'] }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves={3}
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain)" />
          </svg>
        </div>
      </div>
    </CartProvider>
  );
}
