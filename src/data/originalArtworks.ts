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
  'Russian Market 25': 1800,
  'Russian Market 25 EP': 90,
  'Daun Penh': 1400,
  'Daun Penh EP': 1200,
  'Independence Monument': 1400,
  'Independence Monument EP': 190,
  'Koh Rong': 1400,
  'Koh Rong EP i': 210,
  'Koh Rong EP ii': 190,
  'Russian Market 26': 1500,
  'Russian Market 26 EP': 190,
  'Battambang': 1500,
  'Battambang EP': 120,
  'Phnom Penh 2026': 2800,
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


