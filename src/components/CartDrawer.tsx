import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, QrCode } from 'lucide-react';
import { stripePromise } from '../utils/stripe';
import { useCart } from './CartProvider';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, region } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [preorderData, setPreorderData] = useState({ name: '', email: '', phone: '', contactMethod: 'whatsapp' as 'whatsapp' | 'phone' });
  const [preorderStatus, setPreorderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [hasAcknowledgedDelivery, setHasAcknowledgedDelivery] = useState(false);
  
  // --- CAMBODIA STATE ---
  const [cambodiaStep, setCambodiaStep] = useState<'contact' | 'payment' | 'aba_scan' | 'success'>('contact');
  const [cambodiaDetails, setCambodiaDetails] = useState({ name: '', phone: '', deliveryLocation: '', contactMethod: 'whatsapp' });
  const [isSubmittingCambodia, setIsSubmittingCambodia] = useState(false);
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
            category: item.product.category,
            image: item.product.image || (item.product.images && item.product.images.length > 0 ? item.product.images[0] : '')
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
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(`Checkout failed: ${err.message || 'Unknown error'}`);
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
                  <img src={item.product.image || item.product.images?.[0] || ''} alt={item.product.name} className="w-20 h-20 object-contain bg-transparent rounded-md shadow-sm" referrerPolicy="no-referrer" />
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
                onClick={() => {
                  setShowCheckout(true);
                  setHasAcknowledgedDelivery(false);
                }}
                className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors text-lg"
              >
                Checkout
              </button>
            ) : (region === 'International' || region === 'Canada') ? (
              /* STRIPE BRANCH */
              <div className="space-y-4">
                {!hasAcknowledgedDelivery && (
                  <div className="bg-[#93312A]/10 p-4 rounded-lg border border-[#93312A]/20">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        required
                        className="mt-1 accent-[#93312A] w-5 h-5 shrink-0"
                        checked={hasAcknowledgedDelivery}
                        onChange={(e) => setHasAcknowledgedDelivery(e.target.checked)}
                      />
                      <span className="text-sm text-[#2D1F1C]">
                        I acknowledge that I will not receive my order until July of 2026.
                      </span>
                    </label>
                  </div>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={!hasAcknowledgedDelivery}
                  className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors text-lg"
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
            ) : region === 'Cambodia' ? (
              /* CAMBODIA MULTI-STEP CHECKOUT BRANCH */
              <div className="space-y-4">
                {cambodiaStep === 'contact' && (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmittingCambodia(true);
                    try {
                      const res = await fetch('/api/cambodia-checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ...cambodiaDetails,
                          items: items.map(item => ({ name: item.product.name, quantity: item.quantity, price: item.unitPrice || item.product.price, size: item.selectedSize, color: item.selectedColor, category: item.product.category })),
                          cartTotal
                        }),
                      });
                      if (res.ok) setCambodiaStep('payment');
                      else alert('Failed to save details. Please try again.');
                    } catch {
                      alert('An error occurred. Please try again.');
                    } finally {
                      setIsSubmittingCambodia(false);
                    }
                  }} className="space-y-4">
                    <h3 className="text-xl font-serif text-[#93312A]">Delivery Details</h3>
                    <input type="text" required placeholder="Full Name" value={cambodiaDetails.name} onChange={(e) => setCambodiaDetails(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3" />
                    <div>
                      <p className="text-sm text-[#2D1F1C]/70 mb-2 px-1">Preferred Contact Method:</p>
                      <div className="flex gap-4 px-1 mb-3">
                        {['whatsapp', 'telegram', 'imessage'].map(method => (
                          <label key={method} className="flex items-center gap-2 cursor-pointer text-sm text-[#2D1F1C]">
                            <input type="radio" value={method} checked={cambodiaDetails.contactMethod === method} onChange={(e) => setCambodiaDetails(prev => ({ ...prev, contactMethod: e.target.value }))} className="accent-[#93312A]" />
                            <span className="capitalize">{method === 'imessage' ? 'iMessage' : method}</span>
                          </label>
                        ))}
                      </div>
                      <input type="tel" required placeholder="Phone Number" value={cambodiaDetails.phone} onChange={(e) => setCambodiaDetails(prev => ({ ...prev, phone: e.target.value }))} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3" />
                    </div>
                    <div>
                      <input type="text" required placeholder="Delivery Location" value={cambodiaDetails.deliveryLocation} onChange={(e) => setCambodiaDetails(prev => ({ ...prev, deliveryLocation: e.target.value }))} className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3" />
                      <p className="text-xs text-[#2D1F1C]/60 mt-1 px-1">Physical address, Google Maps link, or Grab link.</p>
                    </div>
                    <button type="submit" disabled={isSubmittingCambodia} className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] disabled:opacity-50 text-white rounded-full font-medium transition-colors text-lg">
                      {isSubmittingCambodia ? 'Processing...' : 'Continue to Payment'}
                    </button>
                    <button type="button" onClick={() => setShowCheckout(false)} className="w-full text-sm text-[#2D1F1C]/60 transition-colors">Back to Cart</button>
                  </form>
                )}
                {cambodiaStep === 'payment' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif text-[#93312A]">Select Payment</h3>
                    <button id="stripe_test_id" onClick={handleCheckout} className="w-full py-4 bg-[#2D1F1C] hover:bg-black text-white rounded-full font-medium transition-colors text-lg">
                      Credit Card
                    </button>
                    <button onClick={() => {
                        setCambodiaStep('aba_scan');
                      }} className="w-full py-4 bg-[#005a92] hover:bg-[#004875] text-white rounded-full font-medium transition-colors text-lg flex items-center justify-center gap-3">
                      <QrCode className="w-5 h-5" />
                      <span>ABA Pay</span>
                      <img src="/images/cambodia-qr-code.png" alt="KHQR" className="w-6 h-6 rounded-sm bg-white p-0.5" />
                    </button>
                    <button onClick={() => setShowCheckout(false)} className="w-full text-sm text-[#2D1F1C]/60 transition-colors mt-2">Cancel</button>
                  </div>
                )}
                {cambodiaStep === 'aba_scan' && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl font-serif text-[#93312A]">Scan to Pay</h3>
                    <div className="flex justify-center bg-white p-4 rounded-xl border border-gray-200">
                      <img src="/images/cambodia-qr-code.png" alt="KHQR" className="w-48 h-48 sm:w-64 sm:h-64 rounded-md object-contain" />
                    </div>
                    <p className="text-sm text-[#2D1F1C]">Open your ABA app and scan the QR code above to complete your payment.</p>
                    <button onClick={() => { setIsCartOpen(false); window.location.href = '/success'; }} className="w-full py-4 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors text-lg mt-4">
                      I have completed payment
                    </button>
                    <button onClick={() => setCambodiaStep('payment')} className="w-full text-sm text-[#2D1F1C]/60 transition-colors mt-2">Back to Payment Options</button>
                    <button onClick={() => setShowCheckout(false)} className="w-full text-sm text-[#2D1F1C]/60 transition-colors mt-2">Return to Cart</button>
                  </div>
                )}
                {cambodiaStep === 'success' && (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-16 h-16 bg-[#779C91]/20 text-[#779C91] rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#93312A]">Order Placed!</h3>
                    <p className="text-[#2D1F1C]">We will reach out shortly to confirm payment and coordinate delivery.</p>
                    <button onClick={() => setIsCartOpen(false)} className="w-full py-3 bg-[#779C91] text-white rounded-full mt-4">Close Cart</button>
                  </div>
                )}
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