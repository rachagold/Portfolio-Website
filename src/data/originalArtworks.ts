import { paintings } from './paintings';
import { Product } from '../lib/types';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Cambodia price source-of-truth: Docs spreadsheet (USD).
 * International price: +30%.
 */
const CAMBODIA_PRICE_USD_BY_TITLE: Record<string, number> = {
  // Korea
  'Nowon-Gu': 1200,
  'Nami Island': 1200,
  'Dobongsan': 1800,
  'Jeju ii': 1200,

  // Cambodia
  'Phnom Aoral': 4400,
  'Phnom Aoral EP': 190,
  'Russian Market': 1800,
  'Russian Market EP': 90,
  'Daun Penh': 1400,
  'Daun Penh EP': 1200,
  'Independence Monument': 1400,
  'Independence Monument EP': 190,
  'Koh Rong': 1400,
  'Koh Rong EP i': 210,
  'Battambang': 1500,
  'Battambang EP': 120,
  'Russian Market ii': 1500,
  'Russian Market EP ii': 190,
  'Phnom Penh': 2800,

  // Other Countries (not present in sheet currently)
};

function toProductCollection(
  paintingCollection: (typeof paintings)[number]['collection'],
): Product['collection'] {
  if (paintingCollection === 'Cambodia') return 'Cambodia';
  if (paintingCollection === 'Korea') return 'Korea';
  return 'Other';
}

function getCambodiaPriceUSD(title: string): number | null {
  const price = CAMBODIA_PRICE_USD_BY_TITLE[title];
  return typeof price === 'number' ? price : null;
}

export const originalArtworks: Product[] = paintings
  .filter((p) => p.status === 'Available')
  .map((p): Product | null => {
    const cambodiaPrice = getCambodiaPriceUSD(p.title);
    if (cambodiaPrice == null) return null;

    const internationalPrice = Number((cambodiaPrice * 1.3).toFixed(2));
    const dimensions = p.dimensions ? ` • ${p.dimensions}` : '';
    const description =
      p.description ??
      `${p.medium}${dimensions}${p.year ? ` • ${p.year}` : ''}`;

    return {
      id: `original-${p.id}`,
      slug: `original-${slugify(p.title)}`,
      name: p.title,
      category: 'Originals',
      collection: toProductCollection(p.collection),
      image: p.image,
      images: [p.image],
      description,
      inStock: true,
      // Store International in `price` (existing convention),
      // and Cambodia in `cambodiaPrice` for per-product overrides.
      price: internationalPrice,
      cambodiaPrice,
    };
  })
  .filter((p): p is Product => p !== null);

