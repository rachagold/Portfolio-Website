import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { stripePromise } from '../utils/stripe';
import { useCart } from './CartProvider';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, region } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [preorderData, setPreorderData] = useState({ name: '', email: '', phone: '', contactMethod: 'whatsapp' as 'whatsapp' | 'phone' });
  const [preorderStatus, setPreorderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const hasOriginals = items.some((i) => i.product.category === 'Originals');

  // --- STRIPE LOGIC START ---
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.product.name,
            price: item.unitPrice || item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          region: region
        }),
      });

      const session = await response.json();
      if (session.error) throw new Error(session.error);

      if (session.url) {
        window.location.href = session.url;
      } else {
        // Fallback: use stripePromise redirectToCheckout (legacy)
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load.');
        const result = await (stripe as any).redirectToCheckout({ sessionId: session.id });
        if (result?.error) console.error(result.error);
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed. Please try again.');
    }
  };
  // --- STRIPE LOGIC END ---

  if (!isCartOpen) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}
      />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-[#E5DCCD] shadow-2xl z-50 flex flex-col">
        <div className="p-6 border-b border-[#93312A]/20 flex justify-between items-center bg-[#E5DCCD]">
          <h2 className="text-3xl font-serif text-[#2D1F1C]">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#2D1F1C]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#2D1F1C]/60 space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-50" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="flex gap-4 items-start">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain bg-transparent rounded-md shadow-sm" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#2D1F1C]">{item.product.name}</h3>
                    <p className="text-sm text-[#2D1F1C]/70">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && ', '}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                    <p className="text-[#2D1F1C] mt-1">${(item.unitPrice || item.product.price).toFixed(2)} x {item.quantity}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="p-1 hover:bg-black/5 rounded-full text-[#2D1F1C]/50 hover:text-[#2D1F1C] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#93312A]/20 bg-[#E5DCCD]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl text-[#2D1F1C]">Subtotal:</span>
              <span className="text-2xl font-medium text-[#2D1F1C]">${cartTotal.toFixed(2)}</span>
            </div>

            {!showCheckout ? (
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors text-lg"
              >
                Checkout
              </button>
            ) : (region === 'International' || region === 'Canada') ? (
              /* STRIPE BRANCH */
              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors text-lg"
                >
                  Pay with Card ({region === 'Canada' ? 'CAD' : 'USD'})
                </button>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full text-sm text-[#2D1F1C]/60 hover:text-[#2D1F1C] transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            ) : region === 'Cambodia' && !hasOriginals ? (
              /* KHQR BRANCH */
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#93312A]">Complete Your Order</h3>
                <div className="flex justify-center">
                  <img src="/images/cambodia-qr-code.png" alt="KHQR" className="w-24 h-24 rounded-md mix-blend-multiply" />
                </div>
                <p className="text-sm text-[#2D1F1C]">Scan the KHQR code then email a screenshot to confirm.</p>
                <a href="mailto:rachagold.art@gmail.com?subject=Order+Confirmation" className="block w-full py-3 bg-[#779C91] text-white rounded-full font-medium text-center">Message Rachel</a>
                <button onClick={() => setShowCheckout(false)} className="w-full text-sm text-[#2D1F1C]/60 transition-colors">Back to Cart</button>
              </div>
            ) : (
              /* PREORDER BRANCH */
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#93312A]">Preorder</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setPreorderStatus('submitting');
                  try {
                    const res = await fetch('/api/waitlist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: preorderData.name,
                        email: preorderData.email,
                        phone: preorderData.phone,
                        contactMethod: preorderData.contactMethod,
                        items: items.map(item => ({ name: item.product.name, quantity: item.quantity })),
                        cartTotal,
                      }),
                    });
                    if (res.ok) { setPreorderStatus('success'); setPreorderData({ name: '', email: '', phone: '', contactMethod: 'whatsapp' }); }
                    else { setPreorderStatus('error'); }
                  } catch { setPreorderStatus('error'); }
                }} className="space-y-3">
                  <input type="text" required placeholder="Name" value={preorderData.name} onChange={(e) => setPreorderData(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3" />
                  <input type="email" required placeholder="Email" value={preorderData.email} onChange={(e) => setPreorderData(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3" />
                  <button type="submit" className="w-full py-3 bg-[#779C91] text-white rounded-full">Place Preorder</button>
                </form>
                <button onClick={() => setShowCheckout(false)} className="w-full text-sm text-[#2D1F1C]/60 transition-colors">Back to Cart</button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}