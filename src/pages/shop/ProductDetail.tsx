import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { Lens } from '../../components/Lens';
import { products } from '../../data/products';
import { useCart } from '../../components/CartProvider';
import { getPrice, getBasePrice } from '../../lib/pricing';
import { ChevronRight, ChevronDown, Minus, Plus } from 'lucide-react';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const { addToCart, region } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.includes('A4') ? 'A4' : (product?.sizes?.[0] || '')
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'Description' | 'Sizing' | 'Shipping'>('Description');
  const [displayPrice, setDisplayPrice] = useState(product?.price || 0);

  useEffect(() => {
    if (product) {
      setDisplayPrice(getPrice(product, region, selectedSize || undefined));
    }
    if (product?.sizeImages && selectedSize && product.sizeImages[selectedSize]) {
      const sizeImg = product.sizeImages[selectedSize];
      const idx = product.images.indexOf(sizeImg);
      if (idx >= 0) {
        setActiveImage(idx);
      }
    }
  }, [selectedSize, product, region]);

  useEffect(() => {
    if (product?.colorImages && selectedColor && product.colorImages[selectedColor]) {
      const colorImg = product.colorImages[selectedColor];
      const idx = product.images.indexOf(colorImg);
      if (idx >= 0) {
        setActiveImage(idx);
      }
    }
  }, [selectedColor, product]);

  React.useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] || '');
      setSelectedSize(product.sizes?.includes('A4') ? 'A4' : (product.sizes?.[0] || ''));
      setQuantity(1);
      setActiveImage(0);
    }
  }, [product?.slug]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize, displayPrice);
  };

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#2D1F1C]/60 mb-12">
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4"/>
        <Link to="/shop" className="hover:text-[#93312A] transition-colors">{product.category}</Link>
        <ChevronRight className="w-4 h-4"/>
        <span className="text-[#2D1F1C] font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Images */}
        <AnimatedSection direction="right">
          <Lens zoomFactor={2.5} lensSize={200}>
            <div className="aspect-square bg-[#EAE6DF] rounded-2xl p-8 mb-6 flex items-center justify-center">
              <img src={product.images[activeImage]} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-xl" referrerPolicy="no-referrer"/>
            </div>
          </Lens>
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => {
                    setActiveImage(i);
                    if (product.sizeImages) {
                      const matchedSize = Object.entries(product.sizeImages).find(([, img]) => img === product.images[i]);
                      if (matchedSize) setSelectedSize(matchedSize[0]);
                    }
                    if (product.colorImages) {
                      const matchedColor = Object.entries(product.colorImages).find(([, img]) => img === product.images[i]);
                      if (matchedColor) setSelectedColor(matchedColor[0]);
                    }
                  }}
                  className={`w-24 h-24 flex-shrink-0 bg-[#EAE6DF] rounded-xl p-2 border-2 transition-colors ${
                    activeImage === i ? 'border-[#93312A]' : 'border-transparent hover:border-[#93312A]/30'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-contain" referrerPolicy="no-referrer"/>
                </button>
              ))}
            </div>
          )}
        </AnimatedSection>

        {/* Details */}
        <AnimatedSection direction="left" delay={0.2}>
          <h1 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-4">{product.name}</h1>
          <p className="text-2xl text-[#2D1F1C] mb-8">
            ${displayPrice.toFixed(2)}
          </p>

          <div className="text-[#2D1F1C]/80 text-sm mb-10 leading-relaxed space-y-4">
            {product.category === 'T-shirts' && (
              <>
                <p>Designed with a relaxed, oversized silhouette.</p>
                <ul className="list-disc pl-5 space-y-1 text-[#93312A]">
                  <li><span className="font-medium">Medium:</span> Length 71 x Width 53 cm</li>
                  <li><span className="font-medium">Large:</span> Length 73 x Width 55 cm</li>
                  <li><span className="font-medium">X-Large:</span> Length 74 x Width 57 cm</li>
                  <li><span className="font-medium">XX-Large:</span> Length 77 x Width 64 cm</li>
                </ul>
                <p>100% cotton. 250 GSM heavyweight fabric.</p>
              </>
            )}
            {product.category === 'Prints' && (
              <>
                <p className="text-[#93312A]">High quality glossy 300gsm prints.</p>
                <ul className="space-y-1 text-[#93312A]">
                  <li>A6 post card - 10.5 x 14.8 cm or 4.1 x 5.8 in</li>
                  <li>A4 poster - 21.0 x 29.7 cm or 8.3 x 11.7 in</li>
                  <li>A3 poster - 29.7 x 42.0 cm or 11.7 x 16.5 in</li>
                </ul>
              </>
            )}
            {product.category !== 'T-shirts' && product.category !== 'Prints' && (
              <p>{product.description}</p>
            )}
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[#2D1F1C] text-sm mb-2">Size:</h3>
              <div className="relative">
                <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full appearance-none bg-transparent border border-[#93312A] rounded-full px-6 py-3 text-[#2D1F1C] focus:outline-none focus:ring-2 focus:ring-[#93312A]/50"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93312A] pointer-events-none"/>
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[#2D1F1C] text-sm mb-2">Color:</h3>
              <div className="relative">
                <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full appearance-none bg-transparent border border-[#93312A] rounded-full px-6 py-3 text-[#2D1F1C] focus:outline-none focus:ring-2 focus:ring-[#93312A]/50"
                >
                  {product.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#93312A] pointer-events-none"/>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center border border-[#93312A] rounded-full px-4 py-2">
              <button onClick={decreaseQuantity} className="text-[#93312A] hover:text-[#2D1F1C] p-1 transition-colors" aria-label="Decrease quantity">
                <Minus className="w-4 h-4"/>
              </button>
              <span className="w-12 text-center text-[#2D1F1C] font-medium">{quantity}</span>
              <button onClick={increaseQuantity} className="text-[#93312A] hover:text-[#2D1F1C] p-1 transition-colors" aria-label="Increase quantity">
                <Plus className="w-4 h-4"/>
              </button>
            </div>

            <button onClick={handleAddToCart} className="flex-1 bg-[#779C91] hover:bg-[#5E857A] text-white py-4 rounded-full text-lg font-medium transition-colors">
              Add to Cart
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-[#93312A]/10">
            <div className="flex gap-8 border-b border-[#93312A]/10">
              {['Description', 'Sizing', 'Shipping'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)}
                  className={`py-4 font-medium transition-colors relative ${
                    activeTab === tab ? 'text-[#93312A]' : 'text-[#2D1F1C]/60 hover:text-[#2D1F1C]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#93312A]"/>
                  )}
                </button>
              ))}
            </div>
            <div className="py-6 text-[#2D1F1C]/80 leading-relaxed text-sm">
              {activeTab === 'Description' && <p>{product.description}</p>}
              {activeTab === 'Sizing' && <p>Please refer to the size details listed above for measurements specific to this product.</p>}
              {activeTab === 'Shipping' && (
                <div className="space-y-3">
                  <p>Local delivery available in Phnom Penh and surrounding areas via Grab. Share your location using a Google Maps link or Grab pin when checking out.</p>
                  <p>International orders will not be delivered until July 2026. You can preorder now without payment — Rachel will reach out to confirm your order.</p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Related Products */}
      <AnimatedSection>
        <h2 className="text-3xl font-serif text-[#93312A] text-center mb-12">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p, i) => (
            <Link key={p.id} to={`/shop/${p.slug}`} className="group text-center">
              <div className="aspect-square rounded-full overflow-hidden mb-6 bg-white shadow-md p-6 group-hover:shadow-xl transition-all duration-300">
                <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer"/>
              </div>
              <h3 className="font-medium text-[#2D1F1C] mb-1">{p.name}</h3>
              <p className="text-[#2D1F1C]/70">${getBasePrice(p, region).toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
