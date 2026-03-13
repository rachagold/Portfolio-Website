import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LightboxProps {
  image: string;
  title: string;
  description?: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  status?: 'Available' | 'Sold' | 'Commissioned';
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({
  image,
  title,
  description,
  year,
  medium,
  dimensions,
  status,
  isOpen,
  onClose,
}: LightboxProps) {
  if (!isOpen) return null;

  const hasDetails = description || year || medium || dimensions || status;
  const detailLine = [year, medium, dimensions].filter(Boolean).join(' | ');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-12"
        onClick={onClose}
      >
        <button
          className="absolute top-6 right-6 z-10 text-white/70 hover:text-white transition-colors"
          onClick={onClose}
        >
          <X className="w-8 h-8" />
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={
            hasDetails
              ? 'relative max-w-full max-h-full flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10'
              : 'relative max-w-full max-h-full flex flex-col items-center'
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <img
            src={image}
            alt={title}
            className={
              hasDetails
                ? 'max-w-full md:max-w-[calc(100%-390px)] max-h-[70vh] md:max-h-[85vh] object-contain rounded-sm shadow-2xl'
                : 'max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl'
            }
            referrerPolicy="no-referrer"
          />

          {/* Info panel -- desktop: right column, mobile: below image */}
          {hasDetails ? (
            <div className="w-full md:w-[350px] md:max-h-[85vh] md:overflow-y-auto flex-shrink-0 bg-white/5 rounded-lg p-6 md:p-8">
              <h2 className="text-[#E5DCCD] text-2xl md:text-3xl font-serif tracking-wide leading-tight">
                {title}
              </h2>

              {detailLine && (
                <p className="text-white/50 text-sm mt-3 tracking-wide">
                  {detailLine}
                </p>
              )}

              {status && status !== 'Available' && (
                <span
                  className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase ${
                    status === 'Sold'
                      ? 'bg-[#93312A]/20 text-[#E5DCCD] border border-[#93312A]/40'
                      : 'bg-white/10 text-white/70 border border-white/20'
                  }`}
                >
                  {status}
                </span>
              )}

              {description && (
                <p className="text-white/70 text-sm leading-relaxed mt-5">
                  {description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-white/80 mt-6 text-lg font-serif tracking-wide">
              {title}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
