import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatedSection } from '../../components/AnimatedSection';
import { paintings } from '../../data/paintings';
import { Lightbox } from '../../components/Lightbox';
import { Painting } from '../../lib/types';

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

  const cambodiaPaintings = paintings.filter(p => p.collection === 'Cambodia');

  const filteredPaintings = activeTab === 'All'
    ? cambodiaPaintings
    : cambodiaPaintings.filter(p => p.subCollection === activeTab);

  const mainSeries = filteredPaintings.filter(p => p.subCollection === 'Main Series');
  const excessPaint = filteredPaintings.filter(p => p.subCollection === 'Excess Paint');

  const handleImageClick = (painting: Painting) => {
    setLightboxPainting(painting);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-[#2D1F1C] mb-4">Cambodia</h1>
        <p className="text-[#93312A] font-medium tracking-widest uppercase mb-8">2024 - Present</p>
        <p className="max-w-2xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed">
          This body of work captures the places and rhythms of life in Cambodia. Markets, beaches, mountains, and neighborhoods become the starting point for geometric exploration.
        </p>
      </AnimatedSection>

      <AnimatedSection delay={0.2} className="flex justify-center gap-4 mb-16">
        {['All', 'Main Series', 'Excess Paint'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#93312A] text-white'
                : 'bg-[#F5F0E8] text-[#2D1F1C] hover:bg-[#93312A]/10 border border-[#93312A]/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </AnimatedSection>

      {(activeTab === 'All' || activeTab === 'Main Series') && mainSeries.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px bg-[#93312A]/20 flex-1"></div>
            <h2 className="text-2xl font-serif text-[#2D1F1C]">Main Series</h2>
            <div className="h-px bg-[#93312A]/20 flex-1"></div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {mainSeries.map((painting) => (
              <AnimatedSection key={painting.id} className="break-inside-avoid mb-8">
                <div id={painting.title.toLowerCase().replace(/\s+/g, '-')} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#93312A]/5 hover:border-[#93312A]/20 group" onClick={() => handleImageClick(painting)}>
                  <div className="rounded-xl overflow-hidden bg-[#E5DCCD]">
                    <img src={painting.image} alt={painting.title} loading="lazy" className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
                  </div>
                  <div className="text-center pt-4">
                    <h3 className="text-xl font-serif text-[#2D1F1C] mb-2">{painting.title}</h3>
                    <p className="text-sm text-[#2D1F1C]/70 mb-2">{painting.year} · {painting.medium}</p>
                    {painting.description && (
                      <p className="text-sm text-[#2D1F1C]/60 leading-relaxed line-clamp-2">{painting.description}</p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'All' || activeTab === 'Excess Paint') && excessPaint.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-[#93312A]/20 flex-1"></div>
            <h2 className="text-2xl font-serif text-[#2D1F1C]">Excess Paint Collection</h2>
            <div className="h-px bg-[#93312A]/20 flex-1"></div>
          </div>

          <p className="text-center text-[#2D1F1C]/80 max-w-2xl mx-auto mb-12">
            Excess Paint Collection — Nothing goes to waste. Leftover paint from each piece is repurposed into smaller works that explore texture, color, and composition on their own terms.
          </p>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {excessPaint.map((painting) => (
              <AnimatedSection key={painting.id} className="break-inside-avoid mb-8">
                <div id={painting.title.toLowerCase().replace(/\s+/g, '-')} className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-[#93312A]/5 hover:border-[#93312A]/20 group relative" onClick={() => handleImageClick(painting)}>
                  <div className="absolute top-6 left-6 z-10 bg-[#779C91] text-white text-xs font-bold px-2 py-1 rounded-md">
                    EP
                  </div>
                  <div className="rounded-xl overflow-hidden bg-[#E5DCCD]">
                    <img src={painting.image} alt={painting.title} loading="lazy" className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700 drop-shadow-md" referrerPolicy="no-referrer"/>
                  </div>
                  <div className="text-center pt-4">
                    <h3 className="text-xl font-serif text-[#2D1F1C] mb-2">{painting.title}</h3>
                    <p className="text-sm text-[#2D1F1C]/70 mb-2">{painting.year} · {painting.medium}</p>
                    {painting.description && (
                      <p className="text-sm text-[#2D1F1C]/60 leading-relaxed line-clamp-2">{painting.description}</p>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      )}

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
          onClose={() => setLightboxPainting(null)}
        />
      )}
    </div>
  );
}
