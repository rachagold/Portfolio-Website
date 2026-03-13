import React, { useState } from 'react';
import { AnimatedSection } from '../../components/AnimatedSection';
import { paintings } from '../../data/paintings';
import { Lightbox } from '../../components/Lightbox';

export function OtherCountries() {
  const [lightboxData, setLightboxData] = useState<{ isOpen: boolean; image: string; title: string }>({
    isOpen: false,
    image: '',
    title: ''
  });

  const otherPaintings = paintings.filter(p => p.collection === 'Other Countries');

  const handleImageClick = (image: string, title: string) => {
    setLightboxData({ isOpen: true, image, title });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-[#93312A] mb-4 uppercase tracking-wider">Other Countries</h1>
        <p className="text-[#2D1F1C] font-medium tracking-widest mb-8">2024 - 2025</p>
        <p className="max-w-3xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed">
          Works inspired by travels beyond Cambodia and Korea. From the golden temples of India to the streets of Bangkok and the peaks of the Rocky Mountains — each painting translates a new landscape into geometric abstraction.
        </p>
      </AnimatedSection>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {otherPaintings.map((painting) => (
          <AnimatedSection key={painting.id} className="break-inside-avoid mb-10">
            <div className="group cursor-pointer" onClick={() => handleImageClick(painting.image, painting.title)}>
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-[#F5F0E8] shadow-md group-hover:shadow-xl transition-all duration-500">
                <img src={painting.image} alt={painting.title} loading="lazy" className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
                {painting.status === 'Sold' && (
                  <div className="absolute top-4 right-4 bg-[#93312A] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transform rotate-12">
                    SOLD
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#93312A] mb-2">{painting.title}</h3>
                <p className="text-[#2D1F1C]/80">{painting.medium}</p>
                <p className="text-[#2D1F1C]/60 text-sm">{painting.year}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {lightboxData.isOpen && (
        <Lightbox
          isOpen={lightboxData.isOpen}
          image={lightboxData.image}
          title={lightboxData.title}
          onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        />
      )}
    </div>
  );
}
