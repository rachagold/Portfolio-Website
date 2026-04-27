import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { Lens } from '../../components/Lens';
import { products } from '../../data/products';
import { COLLECTIONS } from '../../data/collections';
import { useCart } from '../../components/CartProvider';
import { getPrice, getBasePrice, getPriceRange } from '../../lib/pricing';
import { ChevronRight, ChevronDown, Minus, Plus } from 'lucide-react';

/** Resolve which collection (if any) a product belongs to, for breadcrumb */
function resolveCollectionBreadcrumb(slug: string): { name: string; href: string } | null {
  for (const col of COLLECTIONS) {
    const typeMap = col.tiles;
    if (
      typeMap.prints.slug === slug ||
      typeMap.tees.slug === slug ||
      typeMap.totes.slug === slug ||
      typeMap.original.slug === slug
    ) {
      return { name: col.displayName, href: `/shop/collection/${col.slug}` };
    }
  }
  return null;
}

/** Label suffix for a product within a collection */
function resolveTypeLabel(slug: string): string {
  for (const col of COLLECTIONS) {
    if (col.tiles.prints.slug === slug) return 'Prints';
    if (col.tiles.tees.slug === slug) return 'Tees';
    if (col.tiles.totes.slug === slug) return 'Totes';
    if (col.tiles.original.slug === slug) return 'Original';
  }
  return '';
}

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const { addToCart, region } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'Sizing' | 'Shipping'>('Sizing');
  const [displayPrice, setDisplayPrice] = useState(product?.price || 0);


  const findVersion2 = (baseImg: string) => {
    if (!product) return baseImg;
    const dotIdx = baseImg.lastIndexOf('.');
    if (dotIdx === -1) return baseImg;
    const pathWithoutExt = baseImg.substring(0, dotIdx);
    const ext = baseImg.substring(dotIdx);
    const altPath = `${pathWithoutExt} 2${ext}`;
    
    const foundAlt = product.images.find(img => img.toLowerCase() === altPath.toLowerCase());
    return foundAlt || baseImg;
  };

  // Price update on selection
  useEffect(() => {
    if (product) {
      setDisplayPrice(getPrice(product, region, selectedSize || undefined));
    }
  }, [selectedSize, product, region]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (product?.sizeImages && product.sizeImages[size]) {
      const standardImg = product.sizeImages[size];
      const targetImg = findVersion2(standardImg);
      const idx = product.images.indexOf(targetImg);
      if (idx >= 0) setActiveImage(idx);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (product?.colorImages && product.colorImages[color]) {
      const standardImg = product.colorImages[color];
      const targetImg = findVersion2(standardImg);
      const idx = product.images.indexOf(targetImg);
      if (idx >= 0) setActiveImage(idx);
    }
  };

  // Reset on product change
  useEffect(() => {
    if (product) {
      setSelectedColor('');
      setSelectedSize('');
      setQuantity(1);
      
      // Default to " 2" alternate view if it exists
      // EXCEPT for Prints if they have an "All" overview at index 0
      const isPrintOverview = product.category === 'Prints' && 
        (product.images[0]?.toLowerCase().includes('all prints') || 
         product.images[0]?.toLowerCase().includes('all posters') ||
         product.images[0]?.toLowerCase().includes(' - all.png') ||
         product.images[0]?.toLowerCase().includes(' - all.jpg'));

      if (isPrintOverview) {
        setActiveImage(0);
      } else {
        const altIdx = product.images.findIndex(img => 
          img.toLowerCase().includes(' 2.png') || 
          img.toLowerCase().includes(' 2.jpg') ||
          img.toLowerCase().includes(' 2.webp')
        );
        setActiveImage(altIdx !== -1 ? altIdx : 0);
      }
    }
  }, [product?.slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-[#2D1F1C]/60 mb-6">Product not found.</p>
        <Link to="/shop" className="text-[#93312A] hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const collectionCrumb = resolveCollectionBreadcrumb(product.slug);
  const typeLabel = resolveTypeLabel(product.slug);
  const hasImages = product.images.length > 0 && product.image !== '';
  const safeActiveImage = Math.min(activeImage, Math.max(0, product.images.length - 1));

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, displayPrice);
  };

  const sameCategoryProducts = products.filter(p => p.id !== product.id && p.category === product.category);
  
  let sameArtworkProducts: typeof products = [];
  if (collectionCrumb) {
    const currentCollection = COLLECTIONS.find(c => c.slug === collectionCrumb.href.split('/').pop());
    if (currentCollection) {
      const artworkSlugs = [
        currentCollection.tiles.prints.slug,
        currentCollection.tiles.tees.slug,
        currentCollection.tiles.totes.slug,
        currentCollection.tiles.original.slug
      ];
      sameArtworkProducts = products.filter(p => p.id !== product.id && artworkSlugs.includes(p.slug));
    }
  }

  const leftItems = sameCategoryProducts.slice(0, 2);
  const rightItems = sameArtworkProducts.filter(p => !leftItems.find(l => l.id === p.id)).slice(0, 2);

  const bestSellersFallback = products.filter(p => 
    p.id !== product.id && 
    !leftItems.find(l => l.id === p.id) && 
    !rightItems.find(r => r.id === p.id)
  );

  const finalLeft = [...leftItems];
  const finalRight = [...rightItems];

  while (finalLeft.length < 2 && bestSellersFallback.length > 0) {
    finalLeft.push(bestSellersFallback.shift()!);
  }
  while (finalRight.length < 2 && bestSellersFallback.length > 0) {
    finalRight.push(bestSellersFallback.shift()!);
  }

  const relatedProducts = [...finalLeft, ...finalRight];

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#2D1F1C]/60 mb-12 flex-wrap">
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
        {collectionCrumb && (
          <>
            <ChevronRight className="w-4 h-4" />
            <Link to={collectionCrumb.href} className="hover:text-[#93312A] transition-colors">
              {collectionCrumb.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#2D1F1C] font-medium">
          {typeLabel || product.category}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">

        {/* ── Images ─────────────────────────────────────────────────────── */}
        <AnimatedSection direction="right">
          {hasImages ? (
            <>
              <Lens zoomFactor={2.5} lensSize={200}>
                <div className="aspect-square bg-transparent rounded-2xl p-6 mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images[safeActiveImage]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Lens>

              {/* thumbnail strip — all folder mockups including "2" files */}
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar scroll-smooth">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-20 h-20 flex-shrink-0 bg-transparent rounded-xl p-1.5 border-2 transition-all duration-300 snap-start ${
                        safeActiveImage === i
                          ? 'border-[#93312A] scale-105'
                          : 'border-transparent hover:border-[#93312A]/30 hover:scale-105'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
              <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
            </>
          ) : (
            /* No images — OOS placeholder */
            <div className="aspect-square bg-[#EAE6DF] rounded-2xl flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#2D1F1C]/10 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <p className="text-[#2D1F1C]/50 text-sm uppercase tracking-widest">Preview coming soon</p>
            </div>
          )}
        </AnimatedSection>

        {/* ── Details ────────────────────────────────────────────────────── */}
        <AnimatedSection direction="left" delay={0.2}>
          <h1 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-4">{product.name}</h1>
          <p className="text-2xl text-[#2D1F1C] mb-8">${displayPrice.toFixed(2)}</p>

          {/* Category-specific copy */}
          <div className="text-[#2D1F1C]/80 text-sm mb-10 leading-relaxed space-y-2">
            {product.category === 'T-shirts' && (
              <>
                <p>Designed with a relaxed, oversized silhouette.</p>
                <p>100% cotton. 250 GSM heavyweight fabric.</p>
              </>
            )}
            {product.category === 'Prints' && (
              <p className="text-[#93312A]">High quality glossy 300gsm prints.</p>
            )}
            {product.category !== 'T-shirts' && product.category !== 'Prints' && (
              <p>{product.description}</p>
            )}
          </div>

          {/* OOS notice */}
          {!product.inStock && (
            <div className="mb-6 px-4 py-3 bg-[#93312A]/10 rounded-xl text-[#93312A] text-sm font-medium">
              This product is coming soon — assets are being prepared.
            </div>
          )}

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#2D1F1C] text-sm mb-2">Size:</h3>
              <div className="relative">
                <select
                  value={selectedSize}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className={`w-full appearance-none bg-transparent border border-[#93312A] rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#93312A]/50 ${
                    !selectedSize ? 'text-[#2D1F1C]/50' : 'text-[#2D1F1C]'
                  }`}
                >
                  <option value="" disabled>Select a size...</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93312A] pointer-events-none" />
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[#2D1F1C] text-sm mb-2">Color:</h3>
              <div className="relative">
                <select
                  value={selectedColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className={`w-full appearance-none bg-transparent border border-[#93312A] rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#93312A]/50 ${
                    !selectedColor ? 'text-[#2D1F1C]/50' : 'text-[#2D1F1C]'
                  }`}
                >
                  <option value="" disabled>Select a color...</option>
                  {product.colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93312A] pointer-events-none" />
              </div>
            </div>
          )}

          {/* Add to cart / contact */}
          {region === 'Other' ? (
            <div className="flex flex-col gap-4 mb-12">
              <Link
                to="/contact"
                className="w-full bg-[#EAE6DF] hover:bg-[#DED9D0] text-[#2D1F1C] py-4 rounded-full text-lg font-medium transition-colors text-center border border-[#93312A]/10"
              >
                Contact me
              </Link>
              <p className="text-[#2D1F1C]/50 text-sm text-center italic">
                To arrange a special order for your location.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4 mb-12">
              {/* Quantity — hidden for Originals */}
              {product.category !== 'Originals' && (
                <div className="flex items-center border border-[#93312A] rounded-full px-4 py-2">
                  <button
                    onClick={decreaseQuantity}
                    className="text-[#93312A] hover:text-[#2D1F1C] p-1 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-[#2D1F1C] font-medium">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="text-[#93312A] hover:text-[#2D1F1C] p-1 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {(() => {
                const noOptionsSelected =
                  (product.sizes?.length && !selectedSize) ||
                  (product.colors?.length && !selectedColor);
                const disabled = Boolean(noOptionsSelected) || !product.inStock;
                return (
                  <button
                    onClick={handleAddToCart}
                    disabled={disabled}
                    className={`flex-1 py-4 rounded-full text-lg font-medium transition-colors ${
                      disabled
                        ? 'bg-[#779C91]/50 cursor-not-allowed text-white/70'
                        : 'bg-[#779C91] hover:bg-[#5E857A] text-white'
                    }`}
                  >
                    {!product.inStock
                      ? 'Out of Stock'
                      : noOptionsSelected
                      ? 'Select Options'
                      : 'Add to Cart'}
                  </button>
                );
              })()}
            </div>
          )}

          {/* Tabs */}
          <div className="border-t border-[#93312A]/10">
            <div className="flex gap-8 border-b border-[#93312A]/10">
              {(['Sizing', 'Shipping'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-medium transition-colors relative ${
                    activeTab === tab ? 'text-[#93312A]' : 'text-[#2D1F1C]/60 hover:text-[#2D1F1C]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#93312A]" />
                  )}
                </button>
              ))}
            </div>

            <div className="py-6 text-[#2D1F1C]/80 leading-relaxed text-sm">
              {activeTab === 'Sizing' && (
                <div className="space-y-4">
                  {product.category === 'T-shirts' && (
                    <ul className="space-y-1">
                      <li><span className="font-medium">Small:</span> Length 66 × Width 50 cm</li>
                      <li><span className="font-medium">Medium:</span> Length 71 × Width 53 cm</li>
                      <li><span className="font-medium">Large:</span> Length 73 × Width 55 cm</li>
                      <li><span className="font-medium">X-Large:</span> Length 74 × Width 57 cm</li>
                      <li><span className="font-medium">XX-Large:</span> Length 77 × Width 64 cm</li>
                    </ul>
                  )}
                  {product.category === 'Totes' && (
                    <ul className="space-y-1">
                      <li><span className="font-medium">Standard:</span> 38 × 42 cm</li>
                      <li><span className="font-medium">Large:</span> 44 × 34 cm</li>
                    </ul>
                  )}
                  {product.category === 'Prints' && (
                    <ul className="space-y-1">
                      <li><span className="font-medium">A2 (Large Poster):</span> 42 × 59.4 cm</li>
                      <li><span className="font-medium">A3 (Poster):</span> 29.7 × 42 cm</li>
                      <li><span className="font-medium">A4:</span> 21 × 29.7 cm</li>
                    </ul>
                  )}
                  {product.category === 'Postcards' && (
                    <ul className="space-y-1">
                      <li><span className="font-medium">A6 (Post card):</span> 10.5 × 14.8 cm</li>
                    </ul>
                  )}
                  {product.category !== 'T-shirts' &&
                    product.category !== 'Totes' &&
                    product.category !== 'Prints' &&
                    product.category !== 'Postcards' && (
                      <p>Please refer to the size details listed for measurements specific to this product.</p>
                    )}
                </div>
              )}
              {activeTab === 'Shipping' && (
                <div className="space-y-3">
                  <p>
                    Local delivery available in Phnom Penh and surrounding areas via Grab. Share your
                    location using a Google Maps link or Grab pin when checking out.
                  </p>
                  <p>
                    International orders will not be delivered until July 2026. Rachel will reach out
                    to confirm your order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <AnimatedSection>
          <div className="mb-8">
            <h2 className="text-3xl font-serif text-[#93312A] text-center mb-10">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 gap-8 text-xs sm:text-sm font-medium uppercase tracking-widest text-[#2D1F1C]/70 border-b border-[#93312A]/10 pb-4">
              <div className="text-center">
                <Link to={`/shop/category/${product.category.toLowerCase()}`} className="hover:text-[#93312A] transition-colors">
                  See All {product.category}
                </Link>
              </div>
              <div className="text-center">
                {collectionCrumb && (
                  <Link to={collectionCrumb.href} className="hover:text-[#93312A] transition-colors">
                    More from {collectionCrumb.name.replace(' Collection', '')}
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} to={`/shop/${rp.slug}`} className="group text-center">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-transparent transition-all duration-300">
                  {rp.image ? (
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#2D1F1C]/25 text-xs uppercase tracking-widest">Coming soon</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-[#2D1F1C] mb-1 text-sm">{rp.name}</h3>
                <p className="text-[#2D1F1C]/60 text-sm">{getPriceRange(rp, region)}</p>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      )}
    </div>
  );
}
