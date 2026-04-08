import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { Cambodia } from './pages/portfolio/Cambodia';
import { Korea } from './pages/portfolio/Korea';
import { Commissions } from './pages/portfolio/Commissions';
import { OtherCountries } from './pages/portfolio/OtherCountries';
import { Exhibition } from './pages/Exhibition';
import { Shop } from './pages/shop/Shop';
import { ProductDetail } from './pages/shop/ProductDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { useCart } from './components/CartProvider';
import { LocationSelector } from './components/LocationSelector';
import { AnimatePresence } from 'motion/react';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      // Wait for the page to render, then scroll to the target element
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function LocationGate() {
  const { location } = useCart();
  const { pathname } = useLocation();
  const [showSelector, setShowSelector] = React.useState(false);

  React.useEffect(() => {
    // Trigger on Shop or Product Detail pages
    const isShopPath = pathname.startsWith('/shop');
    if (isShopPath && !location) {
      setShowSelector(true);
    } else {
      setShowSelector(false);
    }
  }, [location, pathname]);

  return (
    <>
      <Outlet />
      <AnimatePresence>
        {showSelector && <LocationSelector />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio/cambodia" element={<Cambodia />} />
          <Route path="portfolio/korea" element={<Korea />} />
          <Route path="portfolio/commissions" element={<Commissions />} />
          <Route path="portfolio/other-countries" element={<OtherCountries />} />
          <Route path="exhibition" element={<Exhibition />} />
          
          <Route element={<LocationGate />}>
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:slug" element={<ProductDetail />} />
          </Route>
          
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
