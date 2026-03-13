import React from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe, Palette, ArrowRight } from 'lucide-react';

export function About() {
  return (
    <div className="w-full">
      {/* Hero Section — 2-col portrait layout */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text — left on desktop, bottom on mobile */}
            <div className="order-2 lg:order-1">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#93312A] leading-[0.95] mb-8">
                Artist Statement
              </h1>
              <div className="space-y-6 text-[#2D1F1C] leading-relaxed text-base md:text-lg">
                <p>
                  My work fuses graphic geometries with landscapes. Each painting starts with an observed place and becomes a conversation between organic shapes and constructed ones. Natural and industrial. Traditional and modern. I want viewers to see familiar scenes through a different lens.
                </p>
                <p>
                  Nothing goes to waste in my studio. Leftover paint from each piece gets repurposed into smaller works that explore texture and composition on their own. I call these my Excess Paint series.
                </p>
              </div>
            </div>
            {/* Portrait — right on desktop, top on mobile */}
            <div className="order-1 lg:order-2">
              <div className="aspect-[3/4] rounded-[28px] overflow-hidden bg-[#E5DCCD]">
                <img
                  src="/images/about/rachel_photo.png"
                  alt="Rachel Goldberg in her studio"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Bio Section */}
      <section className="bg-[#FDFBF7] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl font-serif text-[#93312A] text-center mb-8">Bio</h2>
            <div className="space-y-6 text-lg text-[#2D1F1C] leading-relaxed">
              <p>
                Rachel Goldberg is an artist, designer, and educator based in Phnom Penh, Cambodia. She holds a Master of Science in Visual Art Education and a Bachelor of Fine Arts in Industrial Design. Her practice spans painting, graphic design, and teaching at international schools.
              </p>
              <p>
                Rachel has lived and worked across Cambodia, South Korea, Taiwan, and the United States. Each place has shaped how she sees the relationship between designed spaces and the natural world.
              </p>
              <p>
                Her current series, Geo Graphic, explores the intersection of geometric abstraction and real landscapes. The work has been exhibited in Phnom Penh and is available as original paintings, prints, and merchandise.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Credentials — 3-col sand card grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F5F0E8] rounded-2xl p-8 text-center">
              <GraduationCap className="w-10 h-10 mx-auto mb-4 text-[#93312A]" />
              <h3 className="font-serif text-xl mb-2 text-[#2D1F1C]">Education</h3>
              <p className="text-sm text-[#2D1F1C]/70">
                MS Visual Art Education<br />
                BFA Industrial Design
              </p>
            </div>
            <div className="bg-[#F5F0E8] rounded-2xl p-8 text-center">
              <Globe className="w-10 h-10 mx-auto mb-4 text-[#93312A]" />
              <h3 className="font-serif text-xl mb-2 text-[#2D1F1C]">Locations</h3>
              <p className="text-sm text-[#2D1F1C]/70">
                Cambodia • Korea<br />
                Taiwan • USA
              </p>
            </div>
            <div className="bg-[#F5F0E8] rounded-2xl p-8 text-center">
              <Palette className="w-10 h-10 mx-auto mb-4 text-[#93312A]" />
              <h3 className="font-serif text-xl mb-2 text-[#2D1F1C]">Disciplines</h3>
              <p className="text-sm text-[#2D1F1C]/70">
                Painting • Design<br />
                Education
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA — sand banner */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="bg-[#E5DCCD] rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl md:text-4xl text-[#2D1F1C] leading-[0.95] mb-4">
                Commissions and Collaborations
              </h2>
              <p className="text-[#2D1F1C]/80 leading-relaxed mb-8">
                Interested in a custom piece? I create commissioned paintings based on places, memories, or landscapes that are meaningful to you. I also collaborate on design projects, murals, and educational workshops.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#93312A] hover:bg-[#7A2922] text-white px-8 py-3 rounded-full font-medium transition-colors"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
