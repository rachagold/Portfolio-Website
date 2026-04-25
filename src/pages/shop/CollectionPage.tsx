import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { COLLECTIONS, CollectionDef, CollectionTileDef } from '../../data/collections';
import { products } from '../../data/products';
import { useCart } from '../../components/CartProvider';
import { getBasePrice, getPriceRange } from '../../lib/pricing';
import { ChevronRight } from 'lucide-react';

function OOSBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={`absolute z-10 bg-black/70 text-white uppercase tracking-widest rounded-full backdrop-blur-sm ${
        small ? 'top-2 right-2 text-[9px] px-2 py-0.5' : 'top-3 right-3 text-[10px] px-2.5 py-1'
      }`}
    >
      Out of Stock
    </span>
  );
}

interface TileProps {
  label: string;
  tile: CollectionTileDef;
}

function ProductTile({ label, tile }: TileProps) {
  const { region } = useCart();
  const product = products.find((p) => p.slug === tile.slug);
  const priceStr = product
    ? getPriceRange(product, region)
    : '';

  return (
    <Link to={`/shop/${tile.slug}`} className="group flex flex-col">
      {/* image card */}
      <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#EAE6DF]">
        {tile.thumbnail ? (
          <img
            src={tile.thumbnail}
            alt={label}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#2D1F1C]/25 text-xs uppercase tracking-widest">{label}</span>
          </div>
        )}
        {!tile.thumbnail && <OOSBadge small />}

        {/* hover label overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-sm font-medium uppercase tracking-widest">{label}</span>
        </div>
      </div>

      {/* below-card info */}
      <div className="mt-3 px-1">
        <p className="text-[#2D1F1C] font-medium">{label}</p>
        {priceStr && (
          <p className="text-[#2D1F1C]/60 text-sm">{priceStr}</p>
        )}
      </div>
    </Link>
  );
}

export function CollectionPage() {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();
  const navigate = useNavigate();

  const col: CollectionDef | undefined = COLLECTIONS.find((c) => c.slug === collectionSlug);

  if (!col) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-[#2D1F1C]/60">Collection not found.</p>
        <Link to="/shop" className="mt-6 inline-block text-[#93312A] hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const tiles: { label: string; tile: CollectionTileDef }[] = [
    { label: 'Prints', tile: col.tiles.prints },
    { label: 'Postcards', tile: col.tiles.postcards },
    { label: 'Tees', tile: col.tiles.tees },
    { label: 'Totes', tile: col.tiles.totes },
    { label: 'Original', tile: col.tiles.original },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#2D1F1C]/60 mb-10">
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2D1F1C] font-medium">{col.displayName}</span>
      </nav>

      {/* Header — [name] - All.png as full-width banner */}
      <AnimatedSection className="mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-[#EAE6DF]">
          {col.coverImage ? (
            <img
              src={col.coverImage}
              alt={col.displayName}
              className="w-full max-h-[480px] object-cover"
            />
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
              <span className="text-[#2D1F1C]/30 text-sm uppercase tracking-widest">Cover coming soon</span>
            </div>
          )}

          {/* title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
            <h1 className="text-4xl md:text-5xl font-serif text-white">{col.displayName}</h1>
          </div>
        </div>
      </AnimatedSection>

      {/* 5-tile product type grid */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8">
          {tiles.map(({ label, tile }, i) => (
            <AnimatedSection key={label} delay={i * 0.07}>
              <ProductTile label={label} tile={tile} />
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>

      {/* back link */}
      <AnimatedSection delay={0.35} className="mt-16 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#93312A] hover:underline font-medium"
        >
          ← Back to all collections
        </Link>
      </AnimatedSection>
    </div>
  );
}
