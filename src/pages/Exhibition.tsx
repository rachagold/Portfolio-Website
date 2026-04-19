import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { paintings } from '../data/paintings';
import { Lightbox } from '../components/Lightbox';

export function Exhibition() {
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    image: string;
    title: string;
    year?: string;
    medium?: string;
    dimensions?: string;
    status?: string;
    description?: string;
  }>({
    isOpen: false,
    image: '',
    title: ''
  });

  const featuredWorks = paintings.slice(0, 6);

  const handleImageClick = (painting: typeof paintings[0]) => {
    setLightboxData({
      isOpen: true,
      image: painting.highResImage,
      title: painting.title,
      year: painting.year,
      medium: painting.medium,
      dimensions: painting.dimensions,
      status: painting.status,
      description: painting.description,
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-[#EAE6DF] via-[#D5C5B3] to-[#A65D47]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <AnimatedSection direction="right" className="order-2 lg:order-1">
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-[4/5] shadow-2xl">
                <img src="/images/about/exhibition_poster.png" alt="Geo Graphic Exhibition Poster" className="w-full h-full object-cover rounded" referrerPolicy="no-referrer"/>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.2} className="order-1 lg:order-2">
            <span className="inline-block bg-[#779C91] text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              Closing Ceremony
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-[#2D1F1C] mb-6 leading-tight">
              Sra'Art: Geo Graphic
            </h1>
            <div className="text-xl md:text-2xl text-[#2D1F1C]/80 mb-8 font-light">
              <p className="mb-2 text-[#93312A] font-bold">Closing Ceremony: May 1, 2026</p>
              <p className="mb-2">Final Day to view the collection: May 1, 2026</p>
              <p>Phnom Penh, Cambodia</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <AnimatedSection>
            <div className="prose prose-lg text-[#2D1F1C]">
              <p className="text-2xl leading-relaxed mb-6 font-serif">
                "Geo Graphic" brings together Rachel Goldberg's latest body of work exploring the contrasts between organic and constructed worlds. The collection fuses graphic geometries with observed landscapes, asking what happens when modern design meets the natural environment.
              </p>
              <p className="text-xl leading-relaxed text-[#2D1F1C]/80">
                The exhibition includes original paintings from the Cambodia series alongside the Excess Paint collection, where leftover materials find new life as standalone works.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="bg-[#EAE6DF] rounded-3xl p-8 md:p-10 border border-[#93312A]/10">
              <div className="space-y-6 mb-10">
                <div>
                   <h3 className="font-bold text-[#2D1F1C] mb-1">Closing Ceremony:</h3>
                   <p className="text-[#2D1F1C]/80">May 1, 2026</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2D1F1C] mb-1">Absolute Last Day:</h3>
                  <p className="text-[#2D1F1C]/80">May 1, 2026</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2D1F1C] mb-1">Location:</h3>
                  <p className="text-[#2D1F1C]/80">Phnom Penh, Cambodia</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[#2D1F1C]/60 text-center py-4 italic border-t border-[#93312A]/10">
                  Facebook event coming soon.
                </p>
                <Link to="/portfolio/cambodia" className="block w-full text-center bg-transparent border-2 border-[#93312A] text-[#93312A] hover:bg-[#93312A] hover:text-white px-8 py-4 rounded-full font-medium transition-colors">
                  See the Collection
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Works */}
      <section id="featured" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#93312A]/10">
        <AnimatedSection>
          <h2 className="text-4xl font-serif text-[#2D1F1C] mb-12">Featured Works</h2>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {featuredWorks.map((painting) => (
              <AnimatedSection key={painting.id} className="break-inside-avoid mb-8">
                <div
                  className="group cursor-pointer"
                  onClick={() => handleImageClick(painting)}
                >
                  <div className="rounded-2xl overflow-hidden mb-4 bg-white shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img src={painting.image} alt={painting.title} className="w-full h-auto block group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-[#2D1F1C]">{painting.title}</h3>
                    <p className="text-[#2D1F1C]/70">{painting.year} · {painting.medium}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {lightboxData.isOpen && (
        <Lightbox
          isOpen={lightboxData.isOpen}
          image={lightboxData.image}
          title={lightboxData.title}
          year={lightboxData.year}
          medium={lightboxData.medium}
          dimensions={lightboxData.dimensions}
          status={lightboxData.status}
          description={lightboxData.description}
          onClose={() => setLightboxData({ ...lightboxData, isOpen: false })}
        />
      )}
    </div>
  );
}
