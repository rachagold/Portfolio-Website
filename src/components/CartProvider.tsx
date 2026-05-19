import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../lib/types';
import { getCookie, setCookie, deleteCookie } from '../lib/cookies';

export type Region = 'Cambodia' | 'International' | 'Other';
export type Location = 'US' | 'CA' | 'KH' | 'Other';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string, unitPrice?: number) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  region: Region;
  setRegion: (region: Region, location?: Location) => void;
  location: Location | null;
  clearLocation: () => void;
  cartTotal: number;
  soldOriginalNames: string[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [region, setRegionState] = useState<Region>('Cambodia');
  const [location, setLocationState] = useState<Location | null>(null);
  const [soldOriginalNames, setSoldOriginalNames] = useState<string[]>([]);

  useEffect(() => {
    // Check cookie first (72h memory)
    const cookieLoc = getCookie('rg_location') as Location;
    if (cookieLoc) {
      setLocationState(cookieLoc);
      if (cookieLoc === 'KH') setRegionState('Cambodia');
      else if (cookieLoc === 'Other') setRegionState('Other');
      else setRegionState('International');
    } else {
      // Fallback to legacy localStorage if no cookie exists
      const savedRegion = localStorage.getItem('rachagold_region');
      if (savedRegion === 'Cambodia' || savedRegion === 'International') {
        setRegionState(savedRegion);
      }
    }
    
    const savedCart = localStorage.getItem('rachagold_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }

    // Fetch sold originals once on app load
    fetch('/api/sold-originals')
      .then(r => r.ok ? r.json() : { sold: [] })
      .then(data => setSoldOriginalNames(data.sold || []))
      .catch(() => {}); // Fail silently — shop stays fully open if fetch fails
  }, []);

  const setRegion = (newRegion: Region, newLocation?: Location) => {
    setRegionState(newRegion);
    localStorage.setItem('rachagold_region', newRegion);
    
    if (newLocation) {
      setLocationState(newLocation);
      setCookie('rg_location', newLocation, 72);
    }
  };

  const clearLocation = () => {
    deleteCookie('rg_location');
    setLocationState(null);
  };

  useEffect(() => {
    localStorage.setItem('rachagold_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, color?: string, size?: string, unitPrice?: number) => {
    const resolvedUnitPrice = unitPrice ?? product.price;
    setItems(prev => {
      const existingItemIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingItemIndex >= 0) {
        if (product.category === 'Originals') {
          // Originals cannot have more than 1 quantity in cart
          return prev;
        }
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          unitPrice: resolvedUnitPrice
        };
        return newItems;
      }

      const resolvedQuantity = product.category === 'Originals' ? 1 : quantity;
      return [...prev, { product, quantity: resolvedQuantity, selectedColor: color, selectedSize: size, unitPrice: resolvedUnitPrice }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + ((item.unitPrice || item.product.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, region, setRegion, location, clearLocation, cartTotal, soldOriginalNames }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
