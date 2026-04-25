import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, animate } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections';

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
  price?: number;
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
  price,
}: LightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(0); // 0, 1, 2, 3
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Motion values for smooth interaction
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for the values
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothScale = useSpring(scale, springConfig);
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const updateConstraints = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const currentScale = scale.get();
    
    // Calculate how much the image exceeds the container at current scale
    // Note: This assumes object-contain behavior and initial fit
    const imgWidth = imageRef.current.offsetWidth * currentScale;
    const imgHeight = imageRef.current.offsetHeight * currentScale;
    
    const overflowX = Math.max(0, (imgWidth - container.width) / 2);
    const overflowY = Math.max(0, (imgHeight - container.height) / 2);

    setConstraints({
      left: -overflowX,
      right: overflowX,
      top: -overflowY,
      bottom: overflowY
    });
  }, [scale]);

  useEffect(() => {
    if (isOpen) {
      updateConstraints();
      window.addEventListener('resize', updateConstraints);
      return () => window.removeEventListener('resize', updateConstraints);
    }
  }, [isOpen, updateConstraints]);

  if (!isOpen) return null;

  const hasDetails = description || year || medium || dimensions || status;
  const detailLine = [year, medium, dimensions].filter(Boolean).join(' | ');

  const matchingCollection = COLLECTIONS.find(c => 
    title.toLowerCase().includes(c.name.toLowerCase()) ||
    c.name.toLowerCase().includes(title.toLowerCase())
  );
  const showShopLink = status !== 'Sold' && matchingCollection;

  const getTargetScale = (level: number) => {
    switch (level) {
      case 1: return 2;
      case 2: return 3.5;
      case 3: return 5;
      default: return 1;
    }
  };

  const syncZoomToScale = (newScale: number) => {
    if (newScale <= 1.1) setZoomLevel(0);
    else if (newScale <= 2.5) setZoomLevel(1);
    else if (newScale <= 4) setZoomLevel(2);
    else setZoomLevel(3);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    e.stopPropagation();
    
    const nextLevel = (zoomLevel + 1) % 4;
    const targetScale = getTargetScale(nextLevel);
    
    if (nextLevel === 0) {
      // Reset
      animate(scale, 1, springConfig);
      animate(x, 0, springConfig);
      animate(y, 0, springConfig);
    } else {
      // Zoom into point
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Relative point 0..1 in current image view
      const relX = clickX / rect.width;
      const relY = clickY / rect.height;
      
      // Calculate translation to center this point
      // (0.5 - relX) * width * (targetScale - 1)
      const targetX = (0.5 - relX) * imageRef.current.offsetWidth * (targetScale - 1);
      const targetY = (0.5 - relY) * imageRef.current.offsetHeight * (targetScale - 1);

      animate(scale, targetScale, springConfig);
      animate(x, targetX, springConfig);
      animate(y, targetY, springConfig);
    }
    setZoomLevel(nextLevel);
    setTimeout(updateConstraints, 50);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = -e.deltaY * 0.005;
    const newScale = Math.min(Math.max(scale.get() + delta, 1), 6);
    scale.set(newScale);
    syncZoomToScale(newScale);
    updateConstraints();
    
    // If zooming out to 1, reset position
    if (newScale === 1) {
      x.set(0);
      y.set(0);
    }
  };

  // Pinch-to-zoom logic
  let initialDist = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      initialDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDist > 0) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = dist / initialDist;
      const newScale = Math.min(Math.max(scale.get() * delta, 1), 6);
      scale.set(newScale);
      syncZoomToScale(newScale);
      updateConstraints();
      initialDist = dist;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12 overflow-hidden touch-none"
        onClick={onClose}
        onWheel={handleWheel}
      >
        <button
          className="absolute top-6 right-6 z-50 text-white/40 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-full"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={
            hasDetails
               ? 'relative w-full h-full flex flex-col md:flex-row items-center md:items-stretch gap-6 md:gap-10 pointer-events-none'
              : 'relative w-full h-full flex flex-col items-center pointer-events-none'
          }
        >
          {/* Image Container */}
          <div 
            ref={containerRef}
            className="relative flex-1 w-full h-full overflow-hidden rounded-sm flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing shadow-2xl bg-black/20"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <motion.img
              ref={imageRef}
              src={image}
              alt={title}
              style={{
                scale: smoothScale,
                x: smoothX,
                y: smoothY,
              }}
              drag={zoomLevel > 0 || scale.get() > 1.05}
              dragConstraints={constraints}
              dragElastic={0.1}
              dragMomentum={true}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                setTimeout(() => setIsDragging(false), 50);
                updateConstraints();
              }}
              className={
                hasDetails
                  ? 'max-w-[90%] max-h-[90%] object-contain select-none'
                  : 'max-w-[95%] max-h-[95%] object-contain select-none'
              }
              onClick={handleImageClick}
              referrerPolicy="no-referrer"
            />
            
            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300">
               <span className="text-white/50 text-[10px] uppercase tracking-widest font-medium">
                 {Math.round(scale.get() * 100)}%
               </span>
            </div>

            {zoomLevel > 0 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white/70 text-[10px] uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
                Zoom {zoomLevel}x — Click or Scroll
              </div>
            )}
          </div>

          {/* Info panel */}
          {hasDetails ? (
            <div className="w-full md:w-[350px] md:max-h-full flex flex-col flex-shrink-0 pointer-events-auto">
              <div className="flex-1 overflow-y-auto bg-white/5 rounded-t-lg p-6 md:p-8 border-b border-white/10">
                <h2 className="text-[#E5DCCD] text-2xl md:text-3xl font-serif tracking-wide leading-tight">
                  {title}
                </h2>

                {detailLine && (
                  <p className="text-white/40 text-sm mt-3 tracking-wide uppercase">
                    {detailLine}
                  </p>
                )}

                {description && (
                  <p className="text-white/70 text-sm leading-relaxed mt-6 font-light">
                    {description}
                  </p>
                )}

                <div className="mt-8 pt-4 border-t border-white/10">
                  <p className="text-[#E5DCCD] font-serif text-xl tracking-wide">
                    {status === 'Sold' ? (
                      <span className="text-white/30 italic">Sold</span>
                    ) : price ? (
                      `$${price.toLocaleString()}`
                    ) : (
                      <span className="text-white/30 italic text-sm">Inquiry for Price</span>
                    )}
                  </p>
                </div>
              </div>

              {showShopLink && (
                <div className="bg-white/5 rounded-b-lg p-6 md:px-8 md:py-6 border-t border-white/5">
                  <Link 
                    to={`/shop/collection/${matchingCollection.slug}`}
                    className="group inline-flex items-center gap-2 text-white/50 hover:text-[#93312A] transition-all duration-300 text-sm uppercase tracking-[0.2em] font-medium"
                  >
                    <span>View in Shop</span>
                    <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 pointer-events-auto">
               <p className="text-white/80 text-lg font-serif tracking-wide">
                {title}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
