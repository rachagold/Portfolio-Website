import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../lib/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string, unitPrice?: number) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  region: 'Cambodia' | 'International';
  setRegion: (region: 'Cambodia' | 'International') => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [region, setRegionState] = useState<'Cambodia' | 'International'>('Cambodia');

  useEffect(() => {
    const savedRegion = localStorage.getItem('rachagold_region');
    if (savedRegion === 'Cambodia' || savedRegion === 'International') {
      setRegionState(savedRegion);
    }
    
    const savedCart = localStorage.getItem('rachagold_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  const setRegion = (newRegion: 'Cambodia' | 'International') => {
    setRegionState(newRegion);
    localStorage.setItem('rachagold_region', newRegion);
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
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          unitPrice: resolvedUnitPrice
        };
        return newItems;
      }

      return [...prev, { product, quantity, selectedColor: color, selectedSize: size, unitPrice: resolvedUnitPrice }];
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
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, region, setRegion, cartTotal }}>
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
