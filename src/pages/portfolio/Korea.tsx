import React, { useState } from 'react';
import { AnimatedSection } from '../../components/AnimatedSection';
import { paintings } from '../../data/paintings';
import { Lightbox } from '../../components/Lightbox';
import { Painting } from '../../lib/types';
import { originalArtworks } from '../../data/originalArtworks';

export function Korea() {
  const [lightboxPainting, setLightboxPainting] = useState<Painting | null>(null);

  const koreaPaintings = paintings.filter(p => p.collection === 'Korea');

  const handleImageClick = (painting: Painting) => {
    setLightboxPainting(painting);
  };

  const getProductPrice = (title: string) => {
    const product = originalArtworks.find(p => p.name === title);
    return product?.price;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-[#93312A] mb-4 uppercase tracking-wider">South Korea</h1>
        <p className="text-[#2D1F1C] font-medium tracking-widest mb-8">2022 - 2024</p>
        <p className="max-w-3xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed">
          Six paintings from two years living in South Korea. Joseon-era temples, volcanic islands, and mountain trails filtered through geometric abstraction.
        </p>
      </AnimatedSection>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
        {koreaPaintings.map((painting) => (
          <AnimatedSection key={painting.id} className="break-inside-avoid mb-10">
            <div className="group cursor-pointer" onClick={() => handleImageClick(painting)}>
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-[#F5F0E8] shadow-md group-hover:shadow-xl transition-all duration-500">
                <img src={painting.image} alt={painting.title} loading="lazy" className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
              </div>
              <div>
                <h3 className="text-2xl font-serif text-[#93312A] mb-2">{painting.title}</h3>
                <p className="text-[#2D1F1C]/80">{painting.medium}</p>
                <p className="text-[#2D1F1C]/60 text-sm mb-2">{painting.year}</p>
                {painting.description && (
                  <p className="text-sm text-[#2D1F1C]/60 leading-relaxed mt-2 line-clamp-2">{painting.description}</p>
                )}
              </div>
            </div>
          </AnimatedSection>
        ))}
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
