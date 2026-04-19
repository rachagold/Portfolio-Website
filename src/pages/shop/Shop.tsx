import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { COLLECTIONS, ORIGINALS_BOX } from '../../data/collections';
import { useCart } from '../../components/CartProvider';

function OOSBadge() {
  return (
    <span className="absolute top-3 right-3 z-10 bg-black/70 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
      Out of Stock
    </span>
  );
}

function CollectionBox({ col }: { col: (typeof COLLECTIONS)[number] }) {
  return (
    <Link
      to={`/shop/collection/${col.slug}`}
      className="group relative overflow-hidden rounded-2xl bg-[#EAE6DF] block aspect-[3/2]"
    >
      {col.coverImage ? (
        <img
          src={col.coverImage}
          alt={col.displayName}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-85"
        />
      ) : (
        <div className="aspect-[4/3] bg-[#EAE6DF] flex items-center justify-center">
          <span className="text-[#2D1F1C]/30 text-sm font-medium uppercase tracking-widest">
            {col.name}
          </span>
        </div>
      )}

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* OOS badge */}
      {!col.coverImage && <OOSBadge />}

      {/* title */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-white font-serif text-xl leading-tight drop-shadow-md">{col.displayName}</p>
      </div>
    </Link>
  );
}

function OriginalsBox() {
  return (
    <Link
      to={ORIGINALS_BOX.href}
      className="group relative overflow-hidden rounded-2xl bg-[#2D1F1C] block aspect-[3/2]"
    >
      <img
        src={ORIGINALS_BOX.thumbnail}
        alt="See More Originals"
        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-75"
      />
      {/* dark scrim */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none" />
      {/* CTA button — centre-aligned, no title */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="px-6 py-3 bg-white text-[#2D1F1C] text-sm font-semibold uppercase tracking-widest rounded-full transition-all duration-300 group-hover:bg-[#93312A] group-hover:text-white shadow-lg">
          See More Originals
        </span>
      </div>
    </Link>
  );
}

export function Shop() {
  const { region } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Page header */}
      <AnimatedSection className="mb-10">
        <h1 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-2">Shop</h1>
        <p className="text-[#2D1F1C]/60">
          Browse by collection or explore all original artworks.
        </p>
      </AnimatedSection>

      {/* Region info banners */}
      {region === 'Cambodia' && (
        <AnimatedSection className="mb-8">
          <div className="bg-[#F5F0E8] border-l-4 border-[#779C91] rounded-r-2xl p-5">
            <p className="text-[#2D1F1C]/80">
              <span className="font-semibold text-[#93312A]">Cambodia Shop —</span>{' '}
              Payment via ABA&nbsp;|&nbsp;Delivery via Grab Phnom Penh.
            </p>
          </div>
        </AnimatedSection>
      )}
      {region === 'International' && (
        <AnimatedSection className="mb-8">
          <div className="bg-[#F5F0E8] border-l-4 border-[#93312A] rounded-r-2xl p-5">
            <p className="text-[#2D1F1C]/80">
              <span className="font-semibold text-[#93312A]">International Pre-Orders Only —</span>{' '}
              Order before June 5th&nbsp;|&nbsp;Delivering July 2026.
            </p>
          </div>
        </AnimatedSection>
      )}
      {region === 'Other' && (
        <AnimatedSection className="mb-8">
          <div className="bg-[#F5F0E8] border-l-4 border-[#93312A] rounded-r-2xl p-5">
            <p className="text-[#2D1F1C]/80 mb-3">
              <span className="font-semibold text-[#93312A]">Browse Only —</span>{' '}
              Rachagold does not currently deliver to your location. Contact Rachel directly to arrange a special order.
            </p>
            <div className="flex gap-5 text-sm font-medium text-[#93312A]">
              <a href="https://instagram.com/rachagold.art" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
              <a href="https://t.me/rachagold" target="_blank" rel="noopener noreferrer" className="hover:underline">Telegram</a>
              <a href="https://wa.me/12406889866" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* 8-box collection grid */}
      <AnimatedSection>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {COLLECTIONS.map((col, i) => (
            <AnimatedSection key={col.slug} delay={i * 0.05}>
              <CollectionBox col={col} />
            </AnimatedSection>
          ))}
          <AnimatedSection delay={COLLECTIONS.length * 0.05}>
            <OriginalsBox />
          </AnimatedSection>
        </div>
      </AnimatedSection>
    </div>
  );
}
