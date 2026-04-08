import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { paintings } from '../../data/paintings';
import { Lightbox } from '../../components/Lightbox';
import { Painting } from '../../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { originalArtworks } from '../../data/originalArtworks';

export function Cambodia() {
  const [activeTab, setActiveTab] = useState<'All' | 'Main Series' | 'Excess Paint'>('All');
  const [lightboxPainting, setLightboxPainting] = useState<Painting | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [location]);

  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 768) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else setColumnCount(3);
    };
    
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const cambodiaPaintings = paintings.filter(p => p.collection === 'Cambodia');

  // Dynamic sorting: Cluster Parent and EP pieces by subject matching
  const mainSeries = cambodiaPaintings.filter(p => p.subCollection === 'Main Series');
  const excessPaint = cambodiaPaintings.filter(p => p.subCollection === 'Excess Paint');
  
  const sortedPaintings: Painting[] = [];
  const usedEPIds = new Set<string>();

  // Process Main Series in their original (CSV-aligned) order
  mainSeries.forEach(parent => {
    sortedPaintings.push(parent);
    
    // Find and cluster related EP pieces
    const relatedEPs = excessPaint.filter(ep => 
      !usedEPIds.has(ep.id) && 
      ep.title.toLowerCase().includes(parent.title.toLowerCase())
    );
    
    relatedEPs.forEach(ep => {
      sortedPaintings.push(ep);
      usedEPIds.add(ep.id);
    });
  });

  // Append any orphaned EP pieces
  excessPaint.forEach(ep => {
    if (!usedEPIds.has(ep.id)) {
      sortedPaintings.push(ep);
    }
  });

  const filteredPaintings = activeTab === 'All'
    ? sortedPaintings
    : sortedPaintings.filter(p => p.subCollection === activeTab);

  // Distribute items into columns for Z-pattern masonry
  const masonryColumns: Painting[][] = Array.from({ length: columnCount }, () => []);
  filteredPaintings.forEach((p, i) => {
    masonryColumns[i % columnCount].push(p);
  });

  const handleImageClick = (painting: Painting) => {
    setLightboxPainting(painting);
  };

  // Helper to find international price
  const getProductPrice = (title: string) => {
    const product = originalArtworks.find(p => p.name === title);
    return product?.price;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab === 'Excess Paint' ? 'ep-header' : 'main-header'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'Excess Paint' ? (
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-serif text-[#2D1F1C] mb-6">Excess Paint Collection</h1>
              <p className="max-w-3xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed italic">
                Excess Paint Collection — Nothing goes to waste. Leftover paint from each piece is repurposed into smaller works that explore texture, color, and composition on their own terms.
              </p>
            </div>
          ) : (
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-serif text-[#2D1F1C] mb-4">Cambodia</h1>
              <p className="text-[#93312A] font-medium tracking-widest uppercase mb-8">2024 - Present</p>
              <p className="max-w-2xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed">
                This body of work captures the places and rhythms of life in Cambodia.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <section className="flex justify-center gap-4 mb-16">
        {['All', 'Main Series', 'Excess Paint'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-[#93312A] text-white shadow-md'
                : 'bg-[#F5F0E8] text-[#2D1F1C] hover:bg-[#93312A]/10 border border-[#93312A]/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </section>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={`${activeTab}-${columnCount}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex gap-8 items-start"
          >
            {masonryColumns.map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-8">
                {col.map((painting) => (
                  <motion.div 
                    layout
                    key={painting.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div 
                      id={painting.title.toLowerCase().replace(/\s+/g, '-')} 
                      className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#93312A]/5 hover:border-[#93312A]/20 group relative overflow-hidden" 
                      onClick={() => handleImageClick(painting)}
                    >
                      <div className="rounded-xl overflow-hidden bg-transparent">
                        <img 
                          src={painting.image} 
                          alt={painting.title} 
                          loading="lazy" 
                          className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700 drop-shadow-sm" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center pt-4">
                        <h3 className="text-xl font-serif text-[#2D1F1C] mb-2">{painting.title}</h3>
                        <p className="text-sm text-[#2D1F1C]/70 mb-2">{painting.year} · {painting.medium}</p>
                        {painting.description && (
                          <p className="text-sm text-[#2D1F1C]/60 leading-relaxed italic line-clamp-2">
                            {painting.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {lightboxPainting && (
        <Lightbox
          isOpen={!!lightboxPainting}
          image={lightboxPainting.image}
          title={lightboxPainting.title}
          description={lightboxPainting.description}
          year={lightboxPainting.year}
          medium={lightboxPainting.medium}
          dimensions={lightboxPainting.dimensions}
          status={lightboxPainting.status}
          price={getProductPrice(lightboxPainting.title)}
          onClose={() => setLightboxPainting(null)}
        />
      )}
    </div>
  );
}
