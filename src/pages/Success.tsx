import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartProvider';
import { AnimatedSection } from '../components/AnimatedSection';
import { ArrowRight, Instagram, Mail } from 'lucide-react';
import { CartItem } from '../lib/types';

export function Success() {
  const { items, region, clearCart } = useCart();
  const [orderSummary, setOrderSummary] = useState<CartItem[]>([]);
  const [orderRegion, setOrderRegion] = useState<string>('');

  useEffect(() => {
    // On mount, if cart has items, copy them to state and session storage, then clear the cart
    if (items.length > 0) {
      setOrderSummary(items);
      setOrderRegion(region);
      sessionStorage.setItem('rg_last_order', JSON.stringify({ items, region }));
      clearCart();
    } else {
      // If refreshed, try to load from session storage
      const saved = sessionStorage.getItem('rg_last_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrderSummary(parsed.items);
          setOrderRegion(parsed.region);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [items, region, clearCart]);

  return (
    <div className="min-h-[80vh] bg-[#E5DCCD] flex flex-col items-center justify-center py-20 px-6">
      <AnimatedSection className="w-full max-w-2xl bg-white/50 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/40 text-center">
        <h1 className="text-4xl md:text-5xl font-serif text-[#2D1F1C] mb-6">
          Thank you for supporting my art
        </h1>

        {/* Dynamic Delivery Messaging */}
        <div className="bg-[#779C91]/10 rounded-2xl p-6 mb-10 border border-[#779C91]/20">
          <h3 className="font-serif text-xl text-[#93312A] mb-2">Delivery Information</h3>
          {orderRegion === 'Cambodia' ? (
            <p className="text-[#2D1F1C]/80">
              You will receive a personal message shortly to coordinate Grab delivery.
            </p>
          ) : (
            <p className="text-[#2D1F1C]/80">
              Delivery begins in July. Thank you so much for your patience!
            </p>
          )}
        </div>

        {/* Order Summary */}
        {orderSummary.length > 0 && (
          <div className="text-left mb-10 bg-white/60 rounded-2xl p-6 shadow-sm border border-white/60">
            <h3 className="font-serif text-2xl text-[#2D1F1C] mb-6 border-b border-[#2D1F1C]/10 pb-4">Order Summary</h3>
            <div className="space-y-4">
              {orderSummary.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.image || item.product.images?.[0] || ''} 
                      alt={item.product.name} 
                      className="max-w-full max-h-full object-contain p-1"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[#2D1F1C]">{item.product.name}</h4>
                    <p className="text-sm text-[#2D1F1C]/60">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ' | '}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#2D1F1C]">${(item.unitPrice || item.product.price).toFixed(2)}</p>
                    <p className="text-sm text-[#2D1F1C]/60">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Link to="/shop" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#779C91] hover:bg-[#5E857A] text-white px-8 py-3 rounded-full transition-colors font-medium">
            Return to Gallery <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#93312A] text-[#93312A] hover:bg-[#93312A] hover:text-white px-8 py-3 rounded-full transition-colors font-medium">
            Get in Touch <Mail className="w-4 h-4" />
          </Link>
        </div>

        {/* Instagram Plug */}
        <div className="pt-8 border-t border-[#2D1F1C]/10 flex flex-col items-center">
          <p className="text-sm text-[#2D1F1C]/60 mb-3">Follow the journey behind the art</p>
          <a 
            href="https://instagram.com/rachagold.art" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#2D1F1C] hover:text-[#93312A] transition-colors font-medium"
          >
            <Instagram className="w-5 h-5" />
            @rachagold.art
          </a>
        </div>

      </AnimatedSection>
    </div>
  );
}