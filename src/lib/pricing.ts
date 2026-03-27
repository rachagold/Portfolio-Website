import { Product } from './types';

/**
 * Cambodia base prices by category (international prices live in products.ts).
 */
const CAMBODIA_BASE: Record<string, number> = {
  'Totes': 15,
  'T-shirts': 25,
  'Prints': 3,
};

const CAMBODIA_SIZE: Record<string, Record<string, number>> = {
  'Totes': { 'Standard': 15, 'Large': 20 },
  'Prints': { 'A6 (Post card)': 3, 'A4': 12, 'A3 (Poster)': 20 },
};

/** Resolve the display price for a product + region + optional size. */
export function getPrice(
  product: Product,
  region: 'Cambodia' | 'International',
  size?: string,
): number {
  if (region === 'International') {
    if (size && product.sizePrice?.[size]) return product.sizePrice[size];
    return product.price;
  }
  // Cambodia
  if (typeof product.cambodiaPrice === 'number') return product.cambodiaPrice;
  const sizes = CAMBODIA_SIZE[product.category];
  if (size && sizes?.[size]) return sizes[size];
  return CAMBODIA_BASE[product.category] ?? product.price;
}

/** The lowest (starting) price shown on product cards. */
export function getBasePrice(
  product: Product,
  region: 'Cambodia' | 'International',
): number {
  if (region === 'International') return product.price;
  if (typeof product.cambodiaPrice === 'number') return product.cambodiaPrice;
  return CAMBODIA_BASE[product.category] ?? product.price;
}

/** Whether a product has size-based pricing in the given region. */
export function hasSizePricing(
  product: Product,
  region: 'Cambodia' | 'International',
): boolean {
  if (region === 'International') return !!product.sizePrice;
  return !!CAMBODIA_SIZE[product.category];
}
