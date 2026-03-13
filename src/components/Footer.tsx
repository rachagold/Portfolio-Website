import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Globe } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-[#E5DCCD] pt-20 pb-10 border-t border-[#93312A]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="text-3xl font-serif tracking-widest text-[#93312A] block mb-6">
              RACHAGOLD
            </Link>
            <p className="text-[#2D1F1C]/70 max-w-sm text-sm mb-4">
              Sign up for updates on new artwork and exhibitions.
            </p>
            <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 text-sm bg-white/80 text-[#2D1F1C] rounded placeholder:text-[#2D1F1C]/50 focus:outline-none focus:ring-2 focus:ring-[#93312A]/30"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-[#93312A] rounded hover:opacity-85 transition-opacity whitespace-nowrap"
              >
                Sign Up
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-serif text-[#93312A] mb-6">Location</h3>
            <p className="text-[#2D1F1C]/70">
              Phnom Penh,<br/>
              Cambodia
            </p>
          </div>

          <div>
            <h3 className="text-lg font-serif text-[#93312A] mb-6">Contact</h3>
            <div className="space-y-4">
              <a href="https://instagram.com/rachagold.art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#2D1F1C]/70 hover:text-[#93312A] transition-colors">
                <Instagram className="w-5 h-5" />
                <span>@rachagold.art</span>
              </a>
              <a href="mailto:rachagold.art@gmail.com" className="flex items-center gap-3 text-[#2D1F1C]/70 hover:text-[#93312A] transition-colors">
                <Mail className="w-5 h-5" />
                <span>rachagold.art@gmail.com</span>
              </a>
              <a href="https://rachagold.art" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#2D1F1C]/70 hover:text-[#93312A] transition-colors">
                <Globe className="w-5 h-5" />
                <span>rachagold.art</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#93312A]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#2D1F1C]/50">
          <p>&copy; 2026 Rachel Goldberg Art</p>
          <div className="flex gap-6">
            <Link to="/portfolio/cambodia" className="hover:text-[#93312A] transition-colors">Portfolio</Link>
            <Link to="/shop" className="hover:text-[#93312A] transition-colors">Shop</Link>
            <Link to="/about" className="hover:text-[#93312A] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#93312A] transition-colors">Contact</Link>
            <Link to="/exhibition" className="hover:text-[#93312A] transition-colors">Exhibition</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
