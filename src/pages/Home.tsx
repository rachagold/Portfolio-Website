import React, { useState } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { BackgroundBoxes } from '../components/BackgroundBoxes';
import { Lightbox } from '../components/Lightbox';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { paintings } from '../data/paintings';

export function Home() {
  const [lightboxData, setLightboxData] = useState({
    isOpen: false,
    image: '',
    title: '',
    year: '',
    medium: '',
    dimensions: '',
    description: '',
  });

  const openLightbox = (painting: { image: string; highResImage: string; title: string; year?: string; medium?: string; dimensions?: string; description?: string }) => {
    setLightboxData({
      isOpen: true,
      image: painting.highResImage,
      title: painting.title,
      year: painting.year ?? '',
      medium: painting.medium ?? '',
      dimensions: painting.dimensions ?? '',
      description: painting.description ?? '',
    });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-16 md:py-0 md:min-h-[90vh] flex items-center bg-gradient-to-b from-[#A65D47] to-[#779C91] overflow-hidden">
        {/* Interactive grid — cells light up on cursor hover (hidden on touch/mobile) */}
        <BackgroundBoxes />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pointer-events-none">
          <AnimatedSection direction="right" className="order-2 lg:order-1 w-full h-full">
            <Link to="/portfolio/cambodia#russian-market-ii" className="block relative w-full h-[60vh] lg:h-[85vh] py-8 lg:py-12 pointer-events-auto">
              <img src="/images/paintings/No Watermarks/cambodia/russian_market_ii.jpg" alt="Russian Market ii" className="w-full h-full object-cover rounded-lg shadow-2xl" referrerPolicy="no-referrer"/>
            </Link>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.2} className="order-1 lg:order-2 text-white">
            <div className="w-[min-content]">
              <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
                Geo Graphic
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 font-light">
                The interaction of observed landscapes, modern design and organic subjects
              </p>
              <Link to="/portfolio/cambodia" className="pointer-events-auto inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full transition-all font-medium tracking-wide whitespace-nowrap">
                View the Collection
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Exhibition Banner */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="bg-[#93312A] rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <svg width="300" height="300" viewBox="0 0 100 100">
                <path d="M0,100 L100,0 L100,100 Z" fill="currentColor"/>
                <circle cx="20" cy="20" r="15" fill="currentColor"/>
              </svg>
            </div>

            <div className="relative z-10">
              <span className="inline-block bg-white text-[#93312A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Closing Ceremony
              </span>
              <h2 className="text-3xl md:text-4xl font-serif mb-2">Sra'Art: Geo Graphic</h2>
              <p className="text-white/80 text-sm mb-1">Final Day: May 1, 2026 | Phnom Penh, Cambodia</p>
              <p className="text-white/70 text-sm max-w-md">Last chance to view the Geo Graphic collection before it closes forever on May 1.</p>
            </div>

            <Link to="/exhibition" className="relative z-10 whitespace-nowrap bg-[#779C91] hover:bg-[#5E857A] text-white px-8 py-3 rounded-full transition-colors font-medium">
              Learn More
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Cambodia Collection Preview — Asymmetric Editorial Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif text-[#2D1F1C]">Cambodia Collection</h2>
              <p className="text-sm uppercase tracking-widest text-[#2D1F1C]/50 mt-2">2024 - Present</p>
              <p className="text-[#2D1F1C]/70 mt-3 max-w-xl">
                Landscapes and streetscapes of Phnom Penh, Koh Rong, and beyond. Geometric shapes frame and enhance the natural world.
              </p>
            </div>
            <Link to="/portfolio/cambodia" className="hidden md:flex items-center gap-2 text-[#93312A] hover:text-[#2D1F1C] transition-colors font-medium">
              Explore Cambodia <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {(() => {
            const cambodiaPaintings = paintings
              .filter(p => p.collection === 'Cambodia' && p.id !== 'c1')
              .sort((a, b) => (a.id === 'c5' ? -1 : b.id === 'c5' ? 1 : 0))
              .slice(0, 3);
            return (
              <div className="flex flex-col md:flex-row gap-6 justify-start">
                {cambodiaPaintings.map(painting => (
                  <div key={painting.id} className="group block cursor-pointer flex-1" onClick={() => openLightbox(painting)}>
                    <div className="overflow-hidden bg-transparent mb-3 relative rounded-xl flex items-center justify-center">
                      <img
                        src={painting.image}
                        alt={painting.title}
                        className="w-full h-auto md:w-full md:h-[400px] object-contain bg-transparent block transition-transform duration-700 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                      {painting.status === 'Sold' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-[#93312A] text-white text-xs font-mono uppercase tracking-wider rounded-full z-10">Sold</div>
                      )}
                      {painting.subCollection === 'Excess Paint' && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-[#779C91] text-white text-xs font-mono uppercase tracking-wider rounded-full z-10">EP</div>
                      )}
                    </div>
                    <h3 className="font-serif text-xl text-[#2D1F1C] group-hover:text-[#93312A] transition-colors">{painting.title} ({painting.year})</h3>
                  </div>
                ))}
              </div>
            );
          })()}

          <div className="mt-8 md:hidden flex justify-center">
            <Link to="/portfolio/cambodia" className="flex items-center gap-2 text-[#93312A] font-medium">
              Explore Cambodia <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* South Korea Collection Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif text-[#2D1F1C]">South Korea Collection</h2>
              <p className="text-sm uppercase tracking-widest text-[#2D1F1C]/50 mt-2">2022 - 2024</p>
              <p className="text-[#2D1F1C]/70 mt-3 max-w-xl">Temples, mountains, and islands. Traditional Korea recomposed through modern abstraction.</p>
            </div>
            <Link to="/portfolio/korea" className="hidden md:flex items-center gap-2 text-[#93312A] hover:text-[#2D1F1C] transition-colors font-medium">
              Explore Korea <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-start">
            {paintings.filter(p => p.collection === 'Korea').slice(0, 3).map((painting) => (
              <div key={painting.id} className="group block cursor-pointer flex-1" onClick={() => openLightbox(painting)}>
                <div className="overflow-hidden mb-4 bg-transparent shadow-sm relative rounded-xl flex items-center justify-center">
                  <img src={painting.image} alt={painting.title} className="w-full h-auto md:w-full md:h-[400px] object-contain bg-transparent block group-hover:scale-[1.03] transition-transform duration-700" referrerPolicy="no-referrer"/>
                  {painting.status === 'Sold' && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-[#93312A] text-white text-xs font-mono uppercase tracking-wider rounded-full z-10">Sold</div>
                  )}
                  {painting.subCollection === 'Excess Paint' && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#779C91] text-white text-xs font-mono uppercase tracking-wider rounded-full z-10">EP</div>
                  )}
                </div>
                <h3 className="font-serif text-lg text-[#2D1F1C] group-hover:text-[#93312A] transition-colors">{painting.title} ({painting.year})</h3>
              </div>
            ))}
          </div>
          <div className="mt-8 md:hidden flex justify-center">
            <Link to="/portfolio/korea" className="flex items-center gap-2 text-[#93312A] font-medium">
              Explore Korea <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Merchandise Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">

        <AnimatedSection>
          <h2 className="text-4xl font-serif text-[#2D1F1C] mb-4">Prints &amp; Wearables</h2>
          <p className="text-[#2D1F1C]/70 mb-12 max-w-xl">Prints, tees, and tote bags featuring original artwork. Each piece carries the same geometric spirit as the paintings.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Phnom Aoral — Prints', price: 'From $5.00', img: '/images/products/Phnom Aoral/Phnom Aoral - A3.png', slug: 'phnom-aoral-prints' },
              { title: 'Koh Rong EP — Tee', price: '$30.00', img: '/images/products/Koh Rong EP/Koh Rong EP - Tee white.png', slug: 'koh-rong-ep-tees' },
              { title: 'Jeju — Tote', price: '$30.00', img: '/images/products/Jeju/Jeju - Tote Beige.png', slug: 'jeju-totes' }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Link to={`/shop/${item.slug}`} className="group block">
                  <div className="aspect-[4/5] mb-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="h-full w-full object-cover transition-transform duration-500 drop-shadow-2xl group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-medium text-[#2D1F1C]">{item.title}</h3>
                  <p className="text-[#2D1F1C]/70">{item.price}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/shop" className="inline-flex items-center gap-2 bg-[#779C91] hover:bg-[#5E857A] text-white px-8 py-3 rounded-full transition-colors font-medium">
              Browse the Shop <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* About Preview */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl font-serif text-[#2D1F1C] mb-12">About the Artist</h2>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 md:w-64 aspect-[3/4] rounded-[28px] overflow-hidden flex-shrink-0 shadow-xl">
              <img src="/images/about/rachel_photo.png" alt="Rachel Goldberg" className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
            </div>
            <div>
              <p className="text-lg text-[#2D1F1C]/80 mb-6 max-w-2xl leading-relaxed">
                Rachel Goldberg is an artist, designer, and educator. Trained in both fine art and industrial design, she paints the places where geometry and nature overlap.
              </p>
              <Link to="/about" className="text-[#93312A] font-medium hover:text-[#2D1F1C] transition-colors inline-flex items-center gap-2">
                Read More <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData(prev => ({ ...prev, isOpen: false }))}
        image={lightboxData.image}
        title={lightboxData.title}
        year={lightboxData.year || undefined}
        medium={lightboxData.medium || undefined}
        dimensions={lightboxData.dimensions || undefined}
        description={lightboxData.description || undefined}
      />

      {/* Newsletter */}
      <section className="bg-[#93312A] py-20 px-6 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Stay in Touch</h2>
            <p className="text-white/80 mb-8">Sign up for updates on new artwork and exhibitions.</p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-full text-white placeholder-white/60 bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#779C91]" required/>
              <button type="submit" className="bg-[#779C91] hover:bg-[#5E857A] px-8 py-4 rounded-full font-medium transition-colors">
                Sign up
              </button>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
