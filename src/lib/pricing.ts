import { Product } from './types';

export type CurrencyLocation = string | null;

/**
 * USD → CAD conversion rate.
 * Example: $30 USD × 1.37 = $41.10 → rounds to CA$41.
 */
const USD_TO_CAD = 1.37;

/** Convert a USD amount to CAD, rounded to the nearest whole number. */
export function toCAD(usd: number): number {
  return Math.round(usd * USD_TO_CAD);
}

/** Conditionally convert a price to CAD if location is Canada. */
function maybeConvert(price: number, location: CurrencyLocation): number {
  return location === 'CA' ? toCAD(price) : price;
}

/** Returns the currency prefix for a given location */
export function getCurrencyPrefix(location: CurrencyLocation): string {
  return location === 'CA' ? 'CA$' : '$';
}

/** Formats a number as a currency string for the given location */
export function formatPrice(amount: number, location: CurrencyLocation): string {
  const prefix = getCurrencyPrefix(location);
  return `${prefix}${amount.toLocaleString()}`;
}

/** Formats a number with two decimal places and the correct currency prefix */
export function formatPriceFixed(amount: number, location: CurrencyLocation): string {
  const prefix = getCurrencyPrefix(location);
  return `${prefix}${amount.toFixed(2)}`;
}

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
  'Prints': { 'A6 (Post card)': 3, 'A4': 12, 'A3 (Poster)': 20, 'A2 (Large Poster)': 30 },
};

/** Resolve the display price for a product + region + optional size + location. */
export function getPrice(
  product: Product,
  region: 'Cambodia' | 'International',
  size?: string,
  location?: CurrencyLocation,
): number {
  let price: number;
  if (region === 'International') {
    if (size && product.sizePrice?.[size]) {
      price = product.sizePrice[size];
    } else {
      price = product.price;
    }
    return maybeConvert(price, location ?? null);
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
  location?: CurrencyLocation,
): number {
  if (region === 'International') return maybeConvert(product.price, location ?? null);
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

/** Get the formatted price string (either single price or range) for thumbnails. */
export function getPriceRange(
  product: Product,
  region: 'Cambodia' | 'International' | 'Other',
  location?: CurrencyLocation,
): string {
  const prefix = getCurrencyPrefix(location ?? null);
  const effectiveRegion = region === 'Other' ? 'International' : region;
  let min = getBasePrice(product, effectiveRegion, location);
  let max = min;

  if (region === 'International' || region === 'Other') {
    if (product.sizePrice) {
      const prices = Object.values(product.sizePrice).map(p => maybeConvert(p, location ?? null));
      min = Math.min(min, ...prices);
      max = Math.max(max, ...prices);
    }
  } else if (region === 'Cambodia') {
    const sizesMap = CAMBODIA_SIZE[product.category];
    if (sizesMap && product.sizes && product.sizes.length > 0) {
      const validSizes = product.sizes.filter(s => sizesMap[s] !== undefined);
      if (validSizes.length > 0) {
        const prices = validSizes.map(s => sizesMap[s]);
        min = Math.min(min, ...prices);
        max = Math.max(max, ...prices);
      }
    }
  }

  if (min === max) {
    return `${prefix}${min.toLocaleString()}`;
  }
  return `${prefix}${min.toLocaleString()} - ${prefix}${max.toLocaleString()}`;
}
