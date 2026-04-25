import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { products } from '../../data/products';
import { useCart } from '../../components/CartProvider';
import { getBasePrice, getPriceRange } from '../../lib/pricing';
import { ChevronRight } from 'lucide-react';

export function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { region } = useCart();

  // Map slugs like 'postcards', 'tees', 'prints' back to correct Category name or display name.
  // Note: For now, we will perform a case-insensitive filtering against product.category.
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === categorySlug?.toLowerCase()
  );

  // Derive display name from the first matched product's category, fallback to stylized slug
  const title = categoryProducts.length > 0 
    ? categoryProducts[0].category 
    : (categorySlug ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1) : 'Category');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[#2D1F1C]/60 mb-10">
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2D1F1C] font-medium">{title}</span>
      </nav>

      {/* Header */}
      <AnimatedSection className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-3">All {title}</h1>
        <p className="text-[#2D1F1C]/60 max-w-2xl leading-relaxed">
          Browse our complete catalog of {title.toLowerCase()}.
        </p>
      </AnimatedSection>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {categoryProducts.map((product, i) => (
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
                    referrerPolicy="no-referrer"
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
      </div>

      {categoryProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-[#2D1F1C]/50">No products found for this category.</p>
        </div>
      )}

      {/* back link */}
      <AnimatedSection delay={0.3} className="mt-16 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-[#93312A] hover:underline font-medium"
        >
          ← Back to shop
        </Link>
      </AnimatedSection>
    </div>
  );
}
