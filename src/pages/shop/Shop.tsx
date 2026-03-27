import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { products } from '../../data/products';
import { useCart } from '../../components/CartProvider';
import { getBasePrice, hasSizePricing } from '../../lib/pricing';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Shop() {
  const { region, setRegion, addToCart } = useCart();
  
  const [filters, setFilters] = useState({
    category: [] as string[],
    collection: [] as string[],
    size: [] as string[],
    priceRange: [0, 50] as [number, number]
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    size: true,
    price: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[type] as string[];
      if (current.includes(value)) {
        return { ...prev, [type]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [type]: [...current, value] };
      }
    });
  };

  const maxPrice = useMemo(() => {
    const max = products.reduce((acc, p) => Math.max(acc, getBasePrice(p, region)), 0);
    // Round up to a nice number for the slider
    if (max <= 50) return 50;
    if (max <= 500) return Math.ceil(max / 25) * 25;
    if (max <= 2000) return Math.ceil(max / 50) * 50;
    return Math.ceil(max / 100) * 100;
  }, [region]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category.length > 0 && !filters.category.includes(product.category)) return false;
      if (filters.collection.length > 0 && !filters.collection.includes(product.collection)) return false;
      const priceForFilter = getBasePrice(product, region);
      if (priceForFilter < filters.priceRange[0] || priceForFilter > filters.priceRange[1]) return false;
      
      // Size and color filtering logic would be more complex depending on how variants are structured
      // For simplicity, we'll skip strict variant filtering here unless the product has those options
      
      return true;
    });
  }, [filters, region]);

  const categories: Array<{ label: string; value: string }> = [
    { label: 'Prints', value: 'Prints' },
    { label: 'T-Shirts', value: 'T-shirts' },
    { label: 'Totes', value: 'Totes' },
    { label: 'Original Artwork', value: 'Originals' },
  ];
  const collections = ['Cambodia', 'Korea'];
  const sizes = ['Medium', 'Large', 'X-Large', 'XX-Large', 'A6 (Post card)', 'A4', 'A3 (Poster)', 'Standard'];
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-[#93312A] mb-4">Shop</h1>
        <p className="text-[#2D1F1C]/80 text-lg mb-8">
          Prints, t-shirts, totes, and original artwork. Each product features artwork from the Geo Graphic series.
        </p>

        <div className="inline-flex bg-[#EAE6DF] rounded-full p-1">
          <button onClick={() => setRegion('Cambodia')}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${
              region === 'Cambodia' ? 'bg-[#779C91] text-white' : 'text-[#2D1F1C] hover:bg-white/50'
            }`}
          >
            Cambodia
          </button>
          <button onClick={() => setRegion('International')}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${
              region === 'International' ? 'bg-[#779C91] text-white' : 'text-[#2D1F1C] hover:bg-white/50'
            }`}
          >
            International
          </button>
        </div>
      </AnimatedSection>

      {region === 'Cambodia' && (
        <AnimatedSection className="mb-12">
          <div className="bg-[#F5F0E8] border-l-4 border-[#779C91] rounded-r-2xl p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#93312A] mb-2">Shopping in Cambodia</h3>
            <p className="text-[#2D1F1C]/80">Local delivery available in Phnom Penh and select areas via Grab.</p>
          </div>
        </AnimatedSection>
      )}

      {region === 'International' && (
        <AnimatedSection className="mb-12">
          <div className="bg-[#F5F0E8] border-l-4 border-[#93312A] rounded-r-2xl p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#93312A] mb-2">International Shipping</h3>
            <p className="text-[#2D1F1C]/80">International orders will not be delivered until July 2026. You can preorder now without payment. Rachel will reach out to you to confirm your order.</p>
          </div>
        </AnimatedSection>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          {/* Category */}
          <div className="border-b border-[#93312A]/10 pb-6">
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('category')}>
              Category {expandedSections.category ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
            </button>
            {expandedSections.category && (
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={filters.category.includes(cat.value)} onChange={() => toggleFilter('category', cat.value)}/>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      filters.category.includes(cat.value) ? 'bg-[#779C91] border-[#779C91]' : 'border-[#93312A]/30 group-hover:border-[#93312A]'
                    }`}>
                      {filters.category.includes(cat.value) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-[#2D1F1C]">{cat.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Collection */}
          <div className="border-b border-[#93312A]/10 pb-6">
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('collection')}>
              Collection {expandedSections.collection ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
            </button>
            {expandedSections.collection && (
              <div className="space-y-3">
                {collections.map(col => (
                  <label key={col} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={filters.collection.includes(col)} onChange={() => toggleFilter('collection', col)}/>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      filters.collection.includes(col) ? 'bg-[#779C91] border-[#779C91]' : 'border-[#93312A]/30 group-hover:border-[#93312A]'
                    }`}>
                      {filters.collection.includes(col) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-[#2D1F1C]">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Size */}
          <div className="border-b border-[#93312A]/10 pb-6">
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('size')}>
              Size {expandedSections.size ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
            </button>
            {expandedSections.size && (
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button key={size} onClick={() => toggleFilter('size', size)}
                    className={`px-3 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      filters.size.includes(size) ? 'bg-[#779C91] text-white' : 'bg-white text-[#2D1F1C] border border-[#93312A]/20 hover:border-[#93312A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('price')}>
              Price {expandedSections.price ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
            </button>
            {expandedSections.price && (
              <div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={Math.min(filters.priceRange[1], maxPrice)}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                  className="w-full h-2 bg-[#EAE6DF] rounded-lg appearance-none cursor-pointer accent-[#779C91]"
                />
                <div className="flex justify-between text-sm text-[#2D1F1C]/70 mt-2">
                  <span>$0</span>
                  <span>${Math.min(filters.priceRange[1], maxPrice)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.1}>
                <div className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#93312A]/10 h-full flex flex-col">
                  <Link to={`/shop/${product.slug}`} className="block aspect-square rounded-xl overflow-hidden mb-4 bg-[#E5DCCD] p-4 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain absolute inset-0 p-4 transition-opacity duration-700 group-hover:opacity-0"
                      referrerPolicy="no-referrer"
                    />
                    {product.hoverImage && (
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} alternate view`}
                        className="w-full h-full object-contain absolute inset-0 p-4 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <Link to={`/shop/${product.slug}`}>
                      <h3 className="text-lg font-medium text-[#2D1F1C] mb-1">{product.name}</h3>
                      <p className="text-[#2D1F1C]/80 mb-4">{hasSizePricing(product, region) ? `from $${getBasePrice(product, region).toFixed(2)}` : `$${getBasePrice(product, region).toFixed(2)}`}</p>
                    </Link>
                    <button onClick={() => addToCart(product, 1, undefined, undefined, getBasePrice(product, region))}
                      className="mt-auto w-full bg-[#779C91] hover:bg-[#5E857A] text-white py-3 rounded-full font-medium transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {region === 'Cambodia' && (
            <div className="mt-16 space-y-8">
              {/* KHQR Payment */}
              <AnimatedSection delay={0.4}>
                <div className="bg-[#779C91]/90 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-white">
                  <div className="bg-white p-2 rounded-xl flex-shrink-0">
                    <img src="/images/cambodia-qr-code.png" alt="KHQR" className="w-32 h-32"/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif mb-2">Pay with KHQR</h3>
                    <p className="text-sm opacity-90">
                      Scan the QR code with your banking app to complete payment.
                    </p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Cambodia Delivery */}
              <AnimatedSection delay={0.5}>
                <div className="bg-[#F5F0E8] rounded-2xl p-8">
                  <h3 className="text-2xl font-serif text-[#93312A] mb-2">Cambodia Delivery</h3>
                  <p className="text-[#2D1F1C]/80">
                    We deliver in Phnom Penh and surrounding areas using Grab. When checking out, share your location using a Google Maps link or Grab pin. No street address needed.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
