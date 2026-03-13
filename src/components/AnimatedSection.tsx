import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'motion/react';
import { cn } from '../lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  key?: React.Key;
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  direction = 'up' 
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { 
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay: delay 
      } 
    }
  };

  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={controls} className={cn(className)}>
      {children}
    </motion.div>
  );
}
