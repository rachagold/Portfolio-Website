import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { originalArtworks } from '../../data/originalArtworks';
import { useCart } from '../../components/CartProvider';
import { getBasePrice, getPriceRange } from '../../lib/pricing';
import { ChevronRight } from 'lucide-react';
import { truncateDescription } from '../../lib/utils';


export function OriginalsGallery() {
  const { region } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#2D1F1C]/60 mb-10">
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2D1F1C] font-medium">Originals</span>
      </nav>

      {/* Header */}
      <AnimatedSection className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-3">Original Artworks</h1>
        <p className="text-[#2D1F1C]/60 max-w-2xl leading-relaxed">
          Each piece is a one-of-a-kind original painting — acrylic on canvas or panel. All works are
          signed and accompanied by a certificate of authenticity.
        </p>
      </AnimatedSection>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {originalArtworks.map((product, i) => (
          <AnimatedSection key={product.id} delay={i * 0.05} className="break-inside-avoid mb-6">
            <Link
              to={`/shop/${product.slug}`}
              className="group block bg-transparent rounded-2xl overflow-hidden transition-all duration-300 border border-transparent hover:border-[#93312A]/10"
            >
              {/* image */}
              <div className="overflow-hidden bg-transparent">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center">
                    <span className="text-[#2D1F1C]/25 text-xs uppercase tracking-widest">No preview</span>
                  </div>
                )}
              </div>

              {/* info */}
              <div className="p-5">
                <h3 className="font-serif text-lg text-[#2D1F1C] mb-1">{product.name}</h3>
                {product.description && (
                  <p className="text-[#2D1F1C]/60 text-sm leading-relaxed mb-3">
                    {truncateDescription(product.description, 110)}
                  </p>
                )}
                <p className="text-[#93312A] font-medium">
                  {getPriceRange(product, region)}
                </p>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      {/* back link */}
      <AnimatedSection delay={0.3} className="mt-16 text-center">
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
