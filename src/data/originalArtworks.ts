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
 * Price source-of-truth: Docs spreadsheet (USD).
 * 'int' = International (US and Canada)
 * 'local' = Cambodia
 */
const PRICE_MAP: Record<string, { int: number; local: number }> = {
  // Korea
  'Nowon-Gu': { int: 1200, local: 1200 },
  'Nami Island': { int: 1200, local: 1200 },
  'Dobongsan': { int: 1800, local: 1800 },
  'Jeju ii': { int: 1200, local: 1200 }, // Matches 'Jeju 25' in CSV
  'Jeju': { int: 8000, local: 8000 },    // Matches 'Jeju 24' in CSV

  // Cambodia
  'Phnom Aoral': { int: 4400, local: 4400 },
  'Phnom Aoral EP': { int: 190, local: 190 },
  'Russian Market 25': { int: 1800, local: 1800 },
  'Russian Market 25 EP': { int: 90, local: 90 },
  'Daun Penh': { int: 1400, local: 1400 },
  'Daun Penh EP': { int: 1200, local: 1200 },
  'Independence Monument': { int: 1400, local: 1400 },
  'Independence Monument EP': { int: 190, local: 190 },
  'Koh Rong': { int: 1400, local: 1400 },
  'Koh Rong EP i': { int: 210, local: 210 },
  'Koh Rong EP ii': { int: 190, local: 190 },
  'Russian Market 26': { int: 1500, local: 1500 },
  'Russian Market 26 EP': { int: 190, local: 190 },
  'Battambang': { int: 1500, local: 1500 },
  'Battambang EP': { int: 120, local: 120 },
  'Phnom Penh 2026': { int: 2800, local: 2800 },

  // Other
  'Rocky Mountains': { int: 190, local: 190 },
  'Bangkok': { int: 420, local: 420 },
  'Golden Ganesha': { int: 1200, local: 1200 },
  'Myeongdong': { int: 420, local: 420 },
};

const MOCKUP_BASE = '/images/paintings/Mock Ups';

/**
 * Mapping of painting titles to their mockup file prefixes in the "Mock Ups" folder.
 */
const MOCKUP_CONFIG: Record<string, string> = {
  'Russian Market 26': 'Russian Market ii -',
  'Russian Market 26 EP': 'Russian Market ii EP -',
  'Koh Rong': 'Koh Rong -',
  'Koh Rong EP i': 'Koh Rong EP i-',
  'Koh Rong EP ii': 'Koh Rong EP-',
  'Daun Penh': 'Daun Penh-',
  'Daun Penh EP': 'Daun Penh EP -',
  'Russian Market 25': 'Russian Market -',
  'Russian Market 25 EP': 'Russian Marker OG -', // Matches misspelled 'Marker'
  'Phnom Aoral': 'Phnom Aoral -',
  'Phnom Aoral EP': 'Phnom Aoral EP -',
  'Independence Monument': 'Independence-',
  'Phnom Penh 2026': 'Phnom Penh -',
  'Jeju ii': 'Jeju ii -',
  'Jeju': 'Jeju -',
  'Nowon-Gu': 'Nowon Gu -',
  'Nami Island': 'Nami Island -',
  'Dobongsan': 'Dobangsan-',
  'Battambang EP': 'Battambang EP -',
  'Myeongdong': 'Myeongdong -',
  'Golden Ganesha': 'Golden Ganesha -',
  'Rocky Mountains': 'Rocky Mountain -',
};

function toProductCollection(
  paintingCollection: (typeof paintings)[number]['collection'],
): Product['collection'] {
  if (paintingCollection === 'Cambodia') return 'Cambodia';
  if (paintingCollection === 'Korea') return 'Korea';
  return 'Other';
}

function getPrices(title: string): { int: number; local: number } | null {
  return PRICE_MAP[title] || null;
}

export const originalArtworks: Product[] = paintings
  .filter((p) => p.status === 'Available')
  .map((p): Product | null => {
    const priceData = getPrices(p.title);
    if (priceData == null) return null;

    const { int: internationalPrice, local: cambodiaPrice } = priceData;
    const dimensions = p.dimensions ? ` • ${p.dimensions}` : '';
    const description =
      p.description ??
      `${p.medium}${dimensions}${p.year ? ` • ${p.year}` : ''}`;

    // Mockup mapping
    const mockupPrefix = MOCKUP_CONFIG[p.title];
    let primaryImage = p.highResImage;
    let galleryImages = [p.highResImage];

    if (mockupPrefix) {
      const isAltPattern = mockupPrefix.includes('OG -');
      const og1 = isAltPattern 
        ? `${MOCKUP_BASE}/${mockupPrefix} 1.png`
        : `${MOCKUP_BASE}/${mockupPrefix} OG 1.png`;
      let og2 = isAltPattern
        ? `${MOCKUP_BASE}/${mockupPrefix} 2.png`
        : `${MOCKUP_BASE}/${mockupPrefix} OG 2.png`;

      // Special case: Phnom Aoral EP has naming inconsistency (OG 1 has space, OG 2 doesn't)
      if (p.title === 'Phnom Aoral EP') {
        og2 = `${MOCKUP_BASE}/Phnom Aoral EP- OG 2.png`;
      }

      // Randomize primary: Stable selection between OG 1 and OG 2 based on ID
      const seed = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const useOG2 = seed % 2 === 1;

      primaryImage = useOG2 ? og2 : og1;
      galleryImages = [primaryImage, p.highResImage, useOG2 ? og1 : og2];
    }

    return {
      id: `original-${p.id}`,
      slug: `original-${slugify(p.title)}`,
      name: p.title,
      category: 'Originals',
      collection: toProductCollection(p.collection),
      image: primaryImage,
      images: galleryImages,
      description,
      inStock: true,
      price: internationalPrice,
      cambodiaPrice,
    };
  })
  .filter((p): p is Product => p !== null);


