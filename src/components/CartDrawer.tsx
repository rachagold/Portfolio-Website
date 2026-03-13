import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useCart } from './CartProvider';
import { X, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeFromCart, cartTotal, region } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [preorderData, setPreorderData] = useState({ name: '', email: '', phone: '', contactMethod: 'whatsapp' as 'whatsapp' | 'phone' });
  const [preorderStatus, setPreorderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-md shadow-sm" referrerPolicy="no-referrer" />
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
            ) : region === 'Cambodia' ? (
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#93312A]">Complete Your Order</h3>
                <div className="flex justify-center">
                  <img
                    src="/images/cambodia-qr-code.png"
                    alt="KHQR"
                    className="w-24 h-24 rounded-md mix-blend-multiply"
                  />
                </div>
                <p className="text-sm text-[#2D1F1C]">
                  Scan the KHQR code with your banking app, then send a screenshot to rachagold.art@gmail.com with your order details.
                </p>
                <a
                  href="mailto:rachagold.art@gmail.com?subject=Order+Confirmation"
                  className="block w-full py-3 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors text-center"
                >
                  Message Rachel
                </a>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full text-sm text-[#2D1F1C]/60 hover:text-[#2D1F1C] transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-[#93312A]">Preorder — International</h3>
                <p className="text-sm text-[#2D1F1C]">
                  International orders will not be delivered until July 2026. You can preorder now without payment. Rachel will reach out to you to confirm your order.
                </p>
                {preorderStatus === 'success' ? (
                  <div className="bg-[#779C91]/20 text-[#2D1F1C] p-4 rounded-xl text-center">
                    <p className="font-medium">Preorder received!</p>
                    <p className="text-sm mt-1">Rachel will be in touch to confirm your order.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
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
                            items: items.map(item => ({
                              name: item.product.name,
                              quantity: item.quantity,
                              size: item.selectedSize || null,
                              color: item.selectedColor || null,
                              price: item.unitPrice || item.product.price,
                            })),
                            cartTotal,
                          }),
                        });
                        if (res.ok) {
                          setPreorderStatus('success');
                          setPreorderData({ name: '', email: '', phone: '', contactMethod: 'whatsapp' });
                        } else {
                          setPreorderStatus('error');
                        }
                      } catch {
                        setPreorderStatus('error');
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={preorderData.name}
                      onChange={(e) => setPreorderData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 text-[#2D1F1C] placeholder-[#2D1F1C]/40 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={preorderData.email}
                      onChange={(e) => setPreorderData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 text-[#2D1F1C] placeholder-[#2D1F1C]/40 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"
                    />
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          checked={preorderData.contactMethod === 'whatsapp'}
                          onChange={() => setPreorderData(prev => ({ ...prev, contactMethod: 'whatsapp' }))}
                          className="w-4 h-4 accent-[#779C91]"
                        />
                        <span className="text-sm text-[#2D1F1C]">WhatsApp</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          checked={preorderData.contactMethod === 'phone'}
                          onChange={() => setPreorderData(prev => ({ ...prev, contactMethod: 'phone' }))}
                          className="w-4 h-4 accent-[#779C91]"
                        />
                        <span className="text-sm text-[#2D1F1C]">Phone</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder={preorderData.contactMethod === 'whatsapp' ? 'WhatsApp number' : 'Phone number'}
                      value={preorderData.phone}
                      onChange={(e) => setPreorderData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-transparent border border-[#93312A]/30 rounded-lg px-4 py-3 text-[#2D1F1C] placeholder-[#2D1F1C]/40 focus:outline-none focus:border-[#93312A] focus:ring-1 focus:ring-[#93312A] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={preorderStatus === 'submitting'}
                      className="w-full py-3 bg-[#779C91] hover:bg-[#5E857A] text-white rounded-full font-medium transition-colors disabled:opacity-70"
                    >
                      {preorderStatus === 'submitting' ? 'Submitting...' : 'Place Preorder'}
                    </button>
                    {preorderStatus === 'error' && (
                      <p className="text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                  </form>
                )}
                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full text-sm text-[#2D1F1C]/60 hover:text-[#2D1F1C] transition-colors"
                >
                  Back to Cart
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
}
