import { useState, useRef, useEffect, useCallback, type ReactNode, type PointerEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LensProps {
  children: ReactNode;
  zoomFactor?: number;
  lensSize?: number;
}

const MOUSE_QUERY = '(hover: hover) and (pointer: fine)';

function hasMouse(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOUSE_QUERY).matches;
}

export function Lens({ children, zoomFactor = 2, lensSize = 170 }: LensProps) {
  const [isMouseDevice, setIsMouseDevice] = useState<boolean>(hasMouse);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(MOUSE_QUERY);
    const handleChange = (e: MediaQueryListEvent) => setIsMouseDevice(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handlePointerEnter = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovering(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setHovering(false), 80);
  }, []);

  // Pure passthrough on touch/mobile — zero extra DOM, zero listeners, zero overlay.
  if (!isMouseDevice) {
    return <>{children}</>;
  }

  const radius = lensSize / 2;

  return (
    <div
      ref={containerRef}
      className="relative"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      {children}
      <AnimatePresence>
        {hovering && containerRef.current && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute pointer-events-none z-50 rounded-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)] ring-2 ring-white/50"
            style={{
              width: lensSize,
              height: lensSize,
              left: mousePos.x - radius,
              top: mousePos.y - radius,
            }}
          >
            <div
              className="absolute [&_*]:!transition-none [&_*]:!transform-none"
              style={{
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight,
                left: -(mousePos.x - radius),
                top: -(mousePos.y - radius),
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${mousePos.x}px ${mousePos.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
