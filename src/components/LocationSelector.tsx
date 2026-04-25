import React from 'react';
import { motion } from 'motion/react';
import { MapPin, X } from 'lucide-react';
import { useCart, Location, Region } from './CartProvider';

interface LocationSelectorProps {
  onClose?: () => void;
  forceOpen?: boolean;
}

export function LocationSelector({ onClose, forceOpen }: LocationSelectorProps) {
  const { location, setRegion, clearCart, items } = useCart();

  const handleSelect = (newRegion: Region, newLocation: Location) => {
    // If they have items and are changing location, we need to clear the cart
    // because products/shipping logic changes per region.
    if (items.length > 0 && location && location !== newLocation) {
      if (window.confirm('Switching your location will reset your cart to match the new region. Continue?')) {
        clearCart();
      } else {
        return;
      }
    }
    
    setRegion(newRegion, newLocation);
    onClose?.();
  };

  // Only show if forced or if no location is set
  if (!forceOpen && location) return null;

  const locations = [
    { name: 'United States', loc: 'US', reg: 'International' },
    { name: 'Canada', loc: 'CA', reg: 'International' },
    { name: 'Cambodia', loc: 'KH', reg: 'Cambodia' },
    { name: 'Other', loc: 'Other', reg: 'Other' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#2D1F1C]/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#F5F0E8] w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
      >
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 p-3 text-[#2D1F1C]/40 hover:text-[#93312A] hover:bg-[#93312A]/5 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <div className="p-12 md:p-16">
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#93312A] mb-4">Select your Location</h2>
            <p className="text-[#2D1F1C]/70 text-lg max-w-lg mx-auto leading-relaxed">
              Hey! To give you the best experience, please let us know where we're sending your new pieces.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {locations.map((item, index) => (
              <motion.button
                key={item.loc}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(item.reg as Region, item.loc as Location)}
                className="group flex items-center gap-6 p-8 rounded-2xl bg-white border border-[#93312A]/5 hover:border-[#93312A]/20 hover:shadow-xl hover:-translate-y-1 transition-all text-left"
              >
                <div className="w-14 h-14 rounded-full bg-[#EAE6DF] flex items-center justify-center text-[#93312A] group-hover:bg-[#93312A] group-hover:text-white transition-all duration-300">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-serif text-[#2D1F1C] group-hover:text-[#93312A] transition-colors">{item.name}</div>
                </div>
              </motion.button>
            ))}
          </div>

          <footer className="mt-16 text-center text-[#2D1F1C]/40 text-sm">
            Can't find your location? Select "Other" to browse, or contact Rachel directly.
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
