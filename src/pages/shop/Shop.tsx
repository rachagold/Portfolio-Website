import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { products } from '../../data/products';
import { useCart } from '../../components/CartProvider';
import { getBasePrice, hasSizePricing } from '../../lib/pricing';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function Shop() {
  const { region, setRegion, addToCart, items, clearCart } = useCart();
  const [pendingRegion, setPendingRegion] = useState<'Cambodia' | 'International' | null>(null);

  const handleRegionChange = (newRegion: 'Cambodia' | 'International') => {
    if (items.length > 0 && newRegion !== region) {
      setPendingRegion(newRegion);
    } else {
      setRegion(newRegion);
    }
  };
  
  const [filters, setFilters] = useState({
    category: [] as string[],
    collection: [] as string[],
    artwork: [] as string[],
    priceRange: [5, 9000] as [number, number]
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    collection: true,
    artwork: true,
    price: true
  });

  const [showAllArtworks, setShowAllArtworks] = useState(false);

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

  const maxPrice = 9000;

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.category.length > 0 && !filters.category.includes(product.category)) return false;
      if (filters.collection.length > 0 && !filters.collection.includes(product.collection)) return false;
      
      if (filters.artwork.length > 0) {
        const matchesArtwork = filters.artwork.some(art => 
          product.name.toLowerCase().includes(art.toLowerCase())
        );
        if (!matchesArtwork) return false;
      }

      const priceForFilter = getBasePrice(product, region);
      if (priceForFilter < filters.priceRange[0] || priceForFilter > filters.priceRange[1]) return false;
      
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
  const artworks = [
    'Russian Market', 'Koh Rong', 'Phnom Aoral', 'Daun Penh', 
    'Independence Monument', 'Battambang', 'Jeju', 'Nowon-Gu', 
    'Nami Island', 'Dobongsan', 'Phnom Penh', 'Golden Ganesha', 
    'Bangkok', 'Rocky Mountains'
  ];
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {pendingRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1F1C]/40 backdrop-blur-sm">
          <div className="bg-[#F5F0E8] rounded-2xl p-8 max-w-md w-full shadow-2xl relative text-left">
            <h3 className="text-2xl font-serif text-[#93312A] mb-2 text-center">Clear Existing Cart</h3>
            <p className="text-[#2D1F1C]/80 text-center mb-8">Switching your location will reset your cart.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setPendingRegion(null)}
                className="w-full py-3 rounded-full font-medium transition-colors border border-[#93312A] text-[#93312A] hover:bg-[#93312A]/5"
              >
                Remain in Shop
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setRegion(pendingRegion);
                  setPendingRegion(null);
                }}
                className="w-full py-3 rounded-full font-medium transition-colors bg-[#93312A] text-white hover:bg-[#7a2822]"
              >
                Go to {pendingRegion} Shop
              </button>
            </div>
          </div>
        </div>
      )}
      <AnimatedSection className="text-center mb-16">
        <h2 className="text-3xl font-serif text-[#93312A] mb-2">Select Location</h2>
        <p className="text-[#2D1F1C]/80 text-lg mb-8">
          Availability, payment and delivery methods will vary per location.
        </p>

        <div className="inline-flex bg-[#EAE6DF] rounded-full p-1">
          <button onClick={() => handleRegionChange('Cambodia')}
            className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${
              region === 'Cambodia' ? 'bg-[#779C91] text-white' : 'text-[#2D1F1C] hover:bg-white/50'
            }`}
          >
            Cambodia
          </button>
          <button onClick={() => handleRegionChange('International')}
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
            <h3 className="text-2xl font-serif text-[#93312A] mb-2">Cambodia Shop</h3>
            <p className="text-[#2D1F1C]/80">Payment via ABA | Delivery via Grab Phnom Penh.</p>
          </div>
        </AnimatedSection>
      )}

      {region === 'International' && (
        <AnimatedSection className="mb-12">
          <div className="bg-[#F5F0E8] border-l-4 border-[#93312A] rounded-r-2xl p-6 md:p-8">
            <h3 className="text-2xl font-serif text-[#93312A] mb-2">Pre-Orders Only</h3>
            <p className="text-[#2D1F1C]/80">International Preorders Only: Preorder before June 5th | Delivering July 2026.</p>
          </div>
        </AnimatedSection>
      )}

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
          {/* Product (formerly Category) */}
          <div className="border-b border-[#93312A]/10 pb-6">
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('category')}>
              Product {expandedSections.category ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
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

          {/* Artwork (formerly Size) */}
          <div className="border-b border-[#93312A]/10 pb-6">
            <button className="flex justify-between items-center w-full text-lg font-serif text-[#93312A] mb-4" onClick={() => toggleSection('artwork')}>
              Artwork {expandedSections.artwork ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
            </button>
            {expandedSections.artwork && (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(showAllArtworks ? artworks : artworks.slice(0, 5)).map(art => (
                    <button key={art} onClick={() => toggleFilter('artwork', art)}
                      className={`px-3 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        filters.artwork.includes(art) ? 'bg-[#779C91] text-white' : 'bg-white text-[#2D1F1C] border border-[#93312A]/20 hover:border-[#93312A]'
                      }`}
                    >
                      {art}
                    </button>
                  ))}
                </div>
                {artworks.length > 5 && (
                  <button 
                    onClick={() => setShowAllArtworks(!showAllArtworks)}
                    className="text-sm font-medium text-[#93312A] hover:underline"
                  >
                    {showAllArtworks ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </>
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
                  min="5"
                  max="9000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [5, parseInt(e.target.value)] }))}
                  className="w-full h-2 bg-[#EAE6DF] rounded-lg appearance-none cursor-pointer accent-[#779C91]"
                />
                <div className="flex justify-between text-sm text-[#2D1F1C]/70 mt-2">
                  <span>$5</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
            {filteredProducts.map((product, i) => (
              <AnimatedSection key={product.id} delay={i * 0.1} className="break-inside-avoid mb-8">
                <div className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#93312A]/10 flex flex-col">
                  <Link to={`/shop/${product.slug}`} className="block rounded-xl overflow-hidden mb-4 bg-transparent relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-auto object-contain bg-transparent transition-opacity duration-700 group-hover:opacity-0"
                      referrerPolicy="no-referrer"
                    />
                    {product.hoverImage && (
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} alternate view`}
                        className="w-full h-full object-contain absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <Link to={`/shop/${product.slug}`}>
                      <h3 className="text-lg font-medium text-[#2D1F1C] mb-1">{product.name}</h3>
                      <p className="text-[#2D1F1C]/80 mb-4">{hasSizePricing(product, region) ? `from $${getBasePrice(product, region).toFixed(2)}` : `$${getBasePrice(product, region).toFixed(2)}`}</p>
                    </Link>
                    {product.category !== 'Originals' && ((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) ? (
                      <Link to={`/shop/${product.slug}`}
                        className="mt-auto flex items-center justify-center w-full bg-[#779C91] hover:bg-[#5E857A] text-white py-3 rounded-full font-medium transition-colors"
                      >
                        See Options
                      </Link>
                    ) : (
                      <button onClick={() => addToCart(product, 1, undefined, undefined, getBasePrice(product, region))}
                        className="mt-auto w-full bg-[#779C91] hover:bg-[#5E857A] text-white py-3 rounded-full font-medium transition-colors"
                      >
                        Add to Cart
                      </button>
                    )}
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
