import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from './CartProvider';
import { cn } from '../lib/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const { items, setIsCartOpen } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsPortfolioOpen(false);
  }, [location.pathname]);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'Portfolio', 
      path: '/portfolio/cambodia',
      dropdown: [
        { name: 'Cambodia', path: '/portfolio/cambodia' },
        { name: 'Korea', path: '/portfolio/korea' },
        { name: 'Other Countries', path: '/portfolio/other-countries' },
        { name: 'Commissions', path: '/portfolio/commissions' },
      ]
    },
    { name: 'Exhibition', path: '/exhibition' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      isScrolled ? "bg-[#E5DCCD]/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="z-50">
          <img src="/logo.png" alt="Rachel Goldberg Art" className="h-10 w-10 rounded-full" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="relative group" onMouseEnter={() => setIsPortfolioOpen(true)}
                onMouseLeave={() => setIsPortfolioOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm uppercase tracking-widest text-[#2D1F1C] hover:text-[#93312A] transition-colors py-2 cursor-pointer">
                  {link.name} <ChevronDown className="w-4 h-4" />
                </button>
                <AnimatePresence>
                  {isPortfolioOpen && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-48 bg-[#F5F0E8] shadow-lg rounded-xl overflow-hidden border border-[#93312A]/10 py-2">
                      {link.dropdown.map(dropLink => (
                        <Link key={dropLink.name} to={dropLink.path} className="block px-4 py-2 text-sm text-[#2D1F1C] hover:bg-[#93312A]/5 hover:text-[#93312A] transition-colors">
                          {dropLink.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.name} to={link.path} className={cn(
                "text-sm uppercase tracking-widest transition-colors",
                location.pathname === link.path ? "text-[#93312A] font-medium" : "text-[#2D1F1C] hover:text-[#93312A]"
              )}>
                {link.name}
              </Link>
            )
          ))}

          <button onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#2D1F1C] hover:text-[#93312A] transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#93312A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <button onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#2D1F1C] cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#93312A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#2D1F1C]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100vh' }} exit={{ opacity: 0, height: 0 }} className="fixed inset-0 bg-[#E5DCCD] z-40 pt-24 px-6 flex flex-col gap-6 overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <div className="space-y-4">
                    <div className="text-xl font-serif text-[#2D1F1C]/50 uppercase tracking-widest">{link.name}</div>
                    <div className="pl-4 space-y-4 border-l border-[#93312A]/20">
                      {link.dropdown.map(dropLink => (
                        <Link key={dropLink.name} to={dropLink.path} className="block text-2xl font-serif text-[#2D1F1C]">
                          {dropLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path} className="block text-2xl font-serif text-[#2D1F1C]">
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
