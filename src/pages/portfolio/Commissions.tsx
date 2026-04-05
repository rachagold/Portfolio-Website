import React, { useState } from 'react';
import { AnimatedSection } from '../../components/AnimatedSection';
import { paintings } from '../../data/paintings';
import { Lightbox } from '../../components/Lightbox';
import { Link } from 'react-router-dom';

export function Commissions() {
  const [lightboxPainting, setLightboxPainting] = useState<any | null>(null);

  const commissions = paintings.filter(p => p.collection === 'Commissions');

  const handleImageClick = (painting: typeof paintings[0]) => {
    setLightboxPainting(painting);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <AnimatedSection className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#2D1F1C] mb-8 uppercase tracking-wider text-balance">Commissioned Work</h1>
        <p className="max-w-3xl mx-auto text-[#2D1F1C]/80 text-lg leading-relaxed">
          Custom pieces created for private collectors. Each commission begins with a conversation about the place, memory, or landscape you want captured.
        </p>
      </AnimatedSection>

      <div className="columns-1 md:columns-2 gap-12 mb-24">
        {commissions.map((painting) => (
          <AnimatedSection key={painting.id} className="break-inside-avoid mb-10">
            <div className="group cursor-pointer" onClick={() => handleImageClick(painting)}>
              <div className="rounded-2xl overflow-hidden mb-4 bg-white shadow-md group-hover:shadow-xl transition-all duration-500 p-4">
                <img src={painting.image} alt={painting.title} loading="lazy" className="w-full h-auto block rounded-xl group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
              </div>
              <div>
                <p className="text-[#2D1F1C]/60 text-sm uppercase tracking-widest mb-1">{painting.year}</p>
                <h3 className="text-3xl font-serif text-[#93312A] mb-2">{painting.title}</h3>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.4}>
        <div className="bg-[#EAE6DF] rounded-3xl p-12 md:p-20 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-[#93312A] mb-6">Interested in a commission?</h2>
          <p className="text-[#2D1F1C]/80 text-lg mb-10 max-w-xl mx-auto">
            Get in touch.
          </p>
          <Link to="/contact" className="inline-block bg-[#779C91] hover:bg-[#5E857A] text-white px-10 py-4 rounded-full font-medium transition-colors text-lg">
            Get in Touch
          </Link>
        </div>
      </AnimatedSection>

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
          price={lightboxPainting.price}
          onClose={() => setLightboxPainting(null)}
        />
      )}
    </div>
  );
}
