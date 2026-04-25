import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { COLLECTIONS, ORIGINALS_BOX } from '../../data/collections';
import { useCart } from '../../components/CartProvider';
import { products } from '../../data/products';
import { getPriceRange } from '../../lib/pricing';
import { Filter } from 'lucide-react';

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
  const [activeFilter, setActiveFilter] = useState('Show All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filterOptions = [
    'Show All',
    'All Tees',
    'All Totes',
    'All Prints',
    'All Postcards',
    'All Originals'
  ];

  const getCategoryFromFilter = (filter: string) => {
    switch(filter) {
      case 'All Tees': return 'T-shirts';
      case 'All Totes': return 'Totes';
      case 'All Prints': return 'Prints';
      case 'All Postcards': return 'Postcards';
      case 'All Originals': return 'Originals';
      default: return null;
    }
  };

  const currentCategory = getCategoryFromFilter(activeFilter);
  const filteredProducts = currentCategory 
    ? products.filter(p => p.category === currentCategory)
    : [];

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

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / Filter Menu */}
        <div className="md:w-48 shrink-0">
          <div className="md:hidden mb-4">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-[#2D1F1C] font-medium uppercase tracking-widest text-sm bg-[#EAE6DF] px-4 py-3 rounded-full w-full justify-center border border-[#93312A]/10 transition-colors hover:bg-[#DED9D0]"
            >
              <Filter className="w-4 h-4" />
              Filter: {activeFilter}
            </button>
          </div>

          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block sticky top-24`}>
            <ul className="flex flex-col gap-4 font-medium text-sm tracking-widest uppercase pb-6 pl-1 md:pl-0">
              {filterOptions.map(option => (
                <li key={option}>
                  <button
                    onClick={() => {
                      setActiveFilter(option);
                      setIsFilterOpen(false);
                    }}
                    className={`transition-colors text-left w-full ${activeFilter === option ? 'text-[#93312A]' : 'text-[#2D1F1C]/60 hover:text-[#93312A]'}`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1">
          {activeFilter === 'Show All' ? (
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
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
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {filteredProducts.map((product, i) => (
                <AnimatedSection key={product.id} delay={i * 0.05} className="break-inside-avoid mb-6">
                  <Link
                    to={`/shop/${product.slug}`}
                    className="group block bg-transparent rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-[#93312A]/10"
                  >
                    <div className="overflow-hidden bg-transparent">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full aspect-square flex items-center justify-center">
                          <span className="text-[#2D1F1C]/25 text-xs uppercase tracking-widest">No preview</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg text-[#2D1F1C] mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-[#2D1F1C]/60 text-sm leading-relaxed line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      )}
                      <p className="text-[#93312A] font-medium">
                        {getPriceRange(product, region)}
                      </p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-24 text-[#2D1F1C]/50 w-full col-span-full">
                  No products found for this category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
