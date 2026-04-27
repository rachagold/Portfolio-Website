/**
 * collectionProducts.ts
 * Product entries built from the actual PNG files inside each
 * public/images/products/[Folder]/ directory.
 *
 * Rules applied:
 *  - images[] = non-"2" files first, then "2" alternate-view files
 *  - image (cover) = images[0] (never a "2" file)
 *  - Products with zero assets have image:'' / images:[] / inStock:false
 *  - Sizes/prices match existing store conventions
 */

import { Product } from '../lib/types';

const p = (folder: string, file: string) => `/images/products/${folder}/${file}`;

// Standard print sizes & prices
const PRINT_SIZES = ['A6 (Post card)', 'A4', 'A3 (Poster)', 'A2 (Large Poster)'];
const PRINT_PRICES: Record<string, number> = {
  'A6 (Post card)': 4,
  'A4': 18,
  'A3 (Poster)': 30,
  'A2 (Large Poster)': 45,
};
const TEE_SIZES = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];
const TOTE_SIZES = ['Standard', 'Large'];
const TOTE_PRICES: Record<string, number> = { Standard: 20, Large: 30 };

export const collectionProducts: Product[] = [

  // ══════════════════════════════════════════════════════════════════
  //  RUSSIAN MARKET
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'rm-prints',
    slug: 'russian-market-prints',
    name: 'Russian Market — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Russian Market', 'Russian Market - All.png'),
    images: [
      p('Russian Market', 'Russian Market - All.png'),
      // primary: size-specific, non-"2"
      p('Russian Market', 'Russian Market - A4.png'),
      p('Russian Market', 'Russian Market - A3.png'),
      p('Russian Market', 'Russian Market - A2.png'),
      p('Russian Market', 'Russian Market - Post Card.png'),
      // secondary / alternates
      p('Russian Market', 'Russian Market - Print 2.png'),
      p('Russian Market', 'Russian Market - Post Card 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Russian Market.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Russian Market', 'Russian Market - Post Card.png'),
      'A4': p('Russian Market', 'Russian Market - A4.png'),
      'A3 (Poster)': p('Russian Market', 'Russian Market - A3.png'),
      'A2 (Large Poster)': p('Russian Market', 'Russian Market - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'rm-tees',
    slug: 'russian-market-tees',
    name: 'Russian Market — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: p('Russian Market', 'Russian Market - Tee White.png'),
    hoverImage: p('Russian Market', 'Russian Market - Tee Black.png'),
    images: [
      p('Russian Market', 'Russian Market - Tee White.png'),
      p('Russian Market', 'Russian Market - Tee Black.png'),
      p('Russian Market', 'Russian Market - Tee Beige.png'),
      // secondary / alternates
      p('Russian Market', 'Russian Market - Tee White 2.png'),
      p('Russian Market', 'Russian Market - Tee Black 2.png'),
      p('Russian Market', 'Russian Market - Tee Beige 2.png'),
      p('Russian Market', 'Russian Market - Tee White 3.png'),
      p('Russian Market', 'Russian Market - Tee 2.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Russian Market painting. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Russian Market', 'Russian Market - Tee White.png'),
      Black: p('Russian Market', 'Russian Market - Tee Black.png'),
      Beige: p('Russian Market', 'Russian Market - Tee Beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'rm-totes',
    slug: 'russian-market-totes',
    name: 'Russian Market — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Russian Market', 'Russian Market - Tote beige.png'),
    images: [
      p('Russian Market', 'Russian Market - Tote beige.png'),
      p('Russian Market', 'Russian Market - Tote black.png'),
      p('Russian Market', 'Russian Market - Tote white.png'),
      // secondary
      p('Russian Market', 'Russian Market - Tote Beige 2.png'),
      p('Russian Market', 'Russian Market - Tote Black 2.png'),
      p('Russian Market', 'Russian Market - Tote White 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Russian Market painting.',
    colors: ['Beige', 'Black', 'White'],
    colorImages: {
      Beige: p('Russian Market', 'Russian Market - Tote beige.png'),
      Black: p('Russian Market', 'Russian Market - Tote black.png'),
      White: p('Russian Market', 'Russian Market - Tote white.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  PHNOM AORAL
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'pa-prints',
    slug: 'phnom-aoral-prints',
    name: 'Phnom Aoral — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Phnom Aoral', 'Phnom Aoral - All.png'),
    images: [
      p('Phnom Aoral', 'Phnom Aoral - All.png'),
      p('Phnom Aoral', 'Phnom Aoral - A4.png'),
      p('Phnom Aoral', 'Phnom Aoral - A3.png'),
      p('Phnom Aoral', 'Phnom Aoral - A2.png'),
      p('Phnom Aoral', 'Phnom Aoral - Postcard.png'),
      // secondary
      p('Phnom Aoral', 'Phnom Aoral - Print 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Phnom Aoral.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Phnom Aoral', 'Phnom Aoral - Postcard.png'),
      'A4': p('Phnom Aoral', 'Phnom Aoral - A4.png'),
      'A3 (Poster)': p('Phnom Aoral', 'Phnom Aoral - A3.png'),
      'A2 (Large Poster)': p('Phnom Aoral', 'Phnom Aoral - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'pa-tees',
    slug: 'phnom-aoral-tees',
    name: 'Phnom Aoral — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    // Only Black tee exists — no White
    image: p('Phnom Aoral', 'Phnom Aoral - Tee Black.png'),
    images: [
      p('Phnom Aoral', 'Phnom Aoral - Tee Black.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Phnom Aoral painting. 100% cotton, 250 GSM.',
    colors: ['Black'],
    colorImages: {
      Black: p('Phnom Aoral', 'Phnom Aoral - Tee Black.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'pa-totes',
    slug: 'phnom-aoral-totes',
    name: 'Phnom Aoral — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Phnom Aoral', 'Phnom Aoral - Tote Beige.png'),
    images: [
      p('Phnom Aoral', 'Phnom Aoral - Tote Beige.png'),
      p('Phnom Aoral', 'Phnom Aoral - Tote Black.png'),
      p('Phnom Aoral', 'Phnom Aoral - Tote White.png'),
      // secondary
      p('Phnom Aoral', 'Phnom Aoral - Tote Beige 2.png'),
      p('Phnom Aoral', 'Phnom Aoral - Tote Black 2.png'),
      p('Phnom Aoral', 'Phnom Aoral - Tote white 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Phnom Aoral landscape painting.',
    colors: ['Beige', 'Black', 'White'],
    colorImages: {
      Beige: p('Phnom Aoral', 'Phnom Aoral - Tote Beige.png'),
      Black: p('Phnom Aoral', 'Phnom Aoral - Tote Black.png'),
      White: p('Phnom Aoral', 'Phnom Aoral - Tote White.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  JEJU
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'jeju-prints',
    slug: 'jeju-prints',
    name: 'Jeju — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Korea',
    // All Prints.png is a multi-size overview; use it as the default cover
    image: p('Jeju', 'Jeju - All Prints.png'),
    images: [
      p('Jeju', 'Jeju - All Prints.png'),
      p('Jeju', 'Jeju - A4.png'),
      p('Jeju', 'Jeju - A3.png'),
      p('Jeju', 'Jeju - A2.png'),
      p('Jeju', 'Jeju - Post card.png'),
      // secondary
      p('Jeju', 'Jeju - Print 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Jeju.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Jeju', 'Jeju - Post card.png'),
      'A4': p('Jeju', 'Jeju - A4.png'),
      'A3 (Poster)': p('Jeju', 'Jeju - A3.png'),
      'A2 (Large Poster)': p('Jeju', 'Jeju - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'jeju-tees',
    slug: 'jeju-tees',
    name: 'Jeju — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Korea',
    image: p('Jeju', 'Jeju - Tee White.png'),
    hoverImage: p('Jeju', 'Jeju - Tee Black.png'),
    images: [
      p('Jeju', 'Jeju - Tee White.png'),
      p('Jeju', 'Jeju - Tee Black.png'),
      p('Jeju', 'Jeju - Tee Beige.png'),
      // secondary
      p('Jeju', 'Jeju - Tee white 2.png'),
      p('Jeju', 'Jeju - Tee white 3.png'),
      p('Jeju', 'Jeju - Tee black 2.png'),
      p('Jeju', 'Jeju - Tee Beige 2.png'),
      p('Jeju', 'Jeju - Tee 2.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Jeju painting. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Jeju', 'Jeju - Tee White.png'),
      Black: p('Jeju', 'Jeju - Tee Black.png'),
      Beige: p('Jeju', 'Jeju - Tee Beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'jeju-totes',
    slug: 'jeju-totes',
    name: 'Jeju — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Korea',
    image: p('Jeju', 'Jeju - Tote Beige.png'),
    images: [
      p('Jeju', 'Jeju - Tote Beige.png'),
      p('Jeju', 'Jeju - Tote Black.png'),
      p('Jeju', 'Jeju - tote White.png'),
      // secondary
      p('Jeju', 'Jeju - Tote Beige 2.png'),
      p('Jeju', 'Jeju - Tote black 2.png'),
      p('Jeju', 'Jeju - Tote White 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Jeju island landscape.',
    colors: ['Beige', 'Black', 'White'],
    colorImages: {
      Beige: p('Jeju', 'Jeju - Tote Beige.png'),
      Black: p('Jeju', 'Jeju - Tote Black.png'),
      White: p('Jeju', 'Jeju - tote White.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  KOH RONG EP
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'krep-prints',
    slug: 'koh-rong-ep-prints',
    name: 'Koh Rong EP — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Koh Rong EP', 'Koh Rong EP - All Prints.png'),
    images: [
      p('Koh Rong EP', 'Koh Rong EP - All Prints.png'),
      p('Koh Rong EP', 'Koh Rong EP - A4.png'),
      p('Koh Rong EP', 'Koh Rong EP - A3.png'),
      p('Koh Rong EP', 'Koh Rong EP - A2.png'),
      p('Koh Rong EP', 'Koh Rong EP - A6.png'),
      p('Koh Rong EP', 'Koh Rong EP - Postcard.png'),
      // secondary
      p('Koh Rong EP', 'Koh Rong - Print 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Koh Rong EP.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Koh Rong EP', 'Koh Rong EP - Postcard.png'),
      'A4': p('Koh Rong EP', 'Koh Rong EP - A4.png'),
      'A3 (Poster)': p('Koh Rong EP', 'Koh Rong EP - A3.png'),
      'A2 (Large Poster)': p('Koh Rong EP', 'Koh Rong EP - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'krep-tees',
    slug: 'koh-rong-ep-tees',
    name: 'Koh Rong EP — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: p('Koh Rong EP', 'Koh Rong EP - Tee white.png'),
    hoverImage: p('Koh Rong EP', 'Koh Rong EP - Tee black.png'),
    images: [
      p('Koh Rong EP', 'Koh Rong EP - Tee white.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee black.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee beige.png'),
      // secondary
      p('Koh Rong EP', 'Koh Rong EP - Tee white 2.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee white 3.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee white 4.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee beige 2.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tee 2.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Koh Rong EP piece. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Koh Rong EP', 'Koh Rong EP - Tee white.png'),
      Black: p('Koh Rong EP', 'Koh Rong EP - Tee black.png'),
      Beige: p('Koh Rong EP', 'Koh Rong EP - Tee beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'krep-totes',
    slug: 'koh-rong-ep-totes',
    name: 'Koh Rong EP — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Koh Rong EP', 'Koh Rong EP - Tote Beige.png'),
    images: [
      p('Koh Rong EP', 'Koh Rong EP - Tote Beige.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tote black.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tote white.png'),
      // secondary
      p('Koh Rong EP', 'Koh Rong EP - Tote beige 2.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tote black 2.png'),
      p('Koh Rong EP', 'Koh Rong EP - Tote white 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Koh Rong EP piece.',
    colors: ['Beige', 'Black', 'White'],
    colorImages: {
      Beige: p('Koh Rong EP', 'Koh Rong EP - Tote Beige.png'),
      Black: p('Koh Rong EP', 'Koh Rong EP - Tote black.png'),
      White: p('Koh Rong EP', 'Koh Rong EP - Tote white.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  PHNOM AORAL EP
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'paep-prints',
    slug: 'phnom-aoral-ep-prints',
    name: 'Phnom Aoral EP — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Phnom Aoral EP', 'Phnom Aoral EP - All Posters.png'),
    images: [
      p('Phnom Aoral EP', 'Phnom Aoral EP - All Posters.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - A3.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - A2.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Post Card.png'),
      // secondary
      p('Phnom Aoral EP', 'Phnom Aoral EP - Print 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Phnom Aoral EP.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Phnom Aoral EP', 'Phnom Aoral EP - Post Card.png'),
      'A3 (Poster)': p('Phnom Aoral EP', 'Phnom Aoral EP - A3.png'),
      'A2 (Large Poster)': p('Phnom Aoral EP', 'Phnom Aoral EP - A2.png'),
    },
    inStock: true,
  },
  {
    // No tee images exist for this collection
    id: 'paep-tees',
    slug: 'phnom-aoral-ep-tees',
    name: 'Phnom Aoral EP — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: p('Phnom Aoral EP', 'Phnom Aoral EP - Tee White.png'),
    hoverImage: p('Phnom Aoral EP', 'Phnom Aoral EP - Tee black.png'),
    images: [
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tee White.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tee black.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tee Beige.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Phnom Aoral EP piece. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Phnom Aoral EP', 'Phnom Aoral EP - Tee White.png'),
      Black: p('Phnom Aoral EP', 'Phnom Aoral EP - Tee black.png'),
      Beige: p('Phnom Aoral EP', 'Phnom Aoral EP - Tee Beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    // Only "2" alternates exist — still linkable
    id: 'paep-totes',
    slug: 'phnom-aoral-ep-totes',
    name: 'Phnom Aoral EP — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Phnom Aoral EP', 'Phnom Aoral EP - Tote beige.png'),
    images: [
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote beige.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote white.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote Black.png'),
      // secondary
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote Beige 2.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote White 2.png'),
      p('Phnom Aoral EP', 'Phnom Aoral EP - Tote Black 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Phnom Aoral EP piece.',
    colors: ['Beige', 'White', 'Black'],
    colorImages: {
      Beige: p('Phnom Aoral EP', 'Phnom Aoral EP - Tote beige.png'),
      White: p('Phnom Aoral EP', 'Phnom Aoral EP - Tote white.png'),
      Black: p('Phnom Aoral EP', 'Phnom Aoral EP - Tote Black.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  INDEPENDENCE
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'ind-prints',
    slug: 'independence-prints',
    name: 'Independence — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Independence', 'Independence - A4.png'),
    images: [
      p('Independence', 'Independence - A4.png'),
      p('Independence', 'Independence - A3.png'),
      p('Independence', 'Independence - A2.png'),
      p('Independence', 'Independence - Post card.png'),
      p('Independence', 'Independence - Post card 2.png'),
      p('Independence', 'Independence - Print 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Independence Monument.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Independence', 'Independence - Post card.png'),
      'A4': p('Independence', 'Independence - A4.png'),
      'A3 (Poster)': p('Independence', 'Independence - A3.png'),
      'A2 (Large Poster)': p('Independence', 'Independence - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'ind-tees',
    slug: 'independence-tees',
    name: 'Independence — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: p('Independence', 'Independence - Tee white.png'),
    hoverImage: p('Independence', 'Independence - Tee black.png'),
    images: [
      p('Independence', 'Independence - Tee white.png'),
      p('Independence', 'Independence - Tee black.png'),
      p('Independence', 'Independence - Tee beige.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Independence Monument painting. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Independence', 'Independence - Tee white.png'),
      Black: p('Independence', 'Independence - Tee black.png'),
      Beige: p('Independence', 'Independence - Tee beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'ind-totes',
    slug: 'independence-totes',
    name: 'Independence — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Independence', 'Independence - Tote beige 2.png'),
    images: [
      p('Independence', 'Independence - Tote beige 2.png'),
      p('Independence', 'Independence - Tote White 2.png'),
      p('Independence', 'Independence - Tote Black 2.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Independence Monument painting.',
    colors: ['Beige', 'White', 'Black'],
    colorImages: {
      Beige: p('Independence', 'Independence - Tote beige 2.png'),
      White: p('Independence', 'Independence - Tote White 2.png'),
      Black: p('Independence', 'Independence - Tote Black 2.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },

  // ══════════════════════════════════════════════════════════════════
  //  PHNOM PENH  (folder empty — all OOS)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'pp-prints',
    slug: 'phnom-penh-prints',
    name: 'Phnom Penh — Prints',
    price: 18,
    category: 'Prints',
    collection: 'Cambodia',
    image: p('Phnom Penh', 'Phnom Penh - A4.png'),
    images: [
      p('Phnom Penh', 'Phnom Penh - A4.png'),
      p('Phnom Penh', 'Phnom Penh - A3.png'),
      p('Phnom Penh', 'Phnom Penh - A2.png'),
      p('Phnom Penh', 'Phnom Penh - Post card.png'),
      // secondary
      p('Phnom Penh', 'Phnom Penh - Print 2.png'),
      p('Phnom Penh', 'Phnom Penh - Post card 2.png'),
    ],
    description: 'High quality glossy 300gsm prints of Phnom Penh.',
    sizes: PRINT_SIZES,
    sizePrice: PRINT_PRICES,
    sizeImages: {
      'A6 (Post card)': p('Phnom Penh', 'Phnom Penh - Post card.png'),
      'A4': p('Phnom Penh', 'Phnom Penh - A4.png'),
      'A3 (Poster)': p('Phnom Penh', 'Phnom Penh - A3.png'),
      'A2 (Large Poster)': p('Phnom Penh', 'Phnom Penh - A2.png'),
    },
    inStock: true,
  },
  {
    id: 'pp-tees',
    slug: 'phnom-penh-tees',
    name: 'Phnom Penh — Tee',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: p('Phnom Penh', 'Phnom Penh - Tee White.png'),
    hoverImage: p('Phnom Penh', 'Phnom Penh - tee black.png'),
    images: [
      p('Phnom Penh', 'Phnom Penh - Tee White.png'),
      p('Phnom Penh', 'Phnom Penh - tee black.png'),
      p('Phnom Penh', 'Phnom Penh - tee beige.png'),
    ],
    description: 'Soft cotton t-shirt featuring the Phnom Penh painting. 100% cotton, 250 GSM.',
    colors: ['White', 'Black', 'Beige'],
    colorImages: {
      White: p('Phnom Penh', 'Phnom Penh - Tee White.png'),
      Black: p('Phnom Penh', 'Phnom Penh - tee black.png'),
      Beige: p('Phnom Penh', 'Phnom Penh - tee beige.png'),
    },
    sizes: TEE_SIZES,
    inStock: true,
  },
  {
    id: 'pp-totes',
    slug: 'phnom-penh-totes',
    name: 'Phnom Penh — Tote',
    price: 20,
    category: 'Totes',
    collection: 'Cambodia',
    image: p('Phnom Penh', 'Phnom Penh - Tote beige.png'),
    images: [
      p('Phnom Penh', 'Phnom Penh - Tote beige.png'),
      p('Phnom Penh', 'Phnom Penh - Tote Black.png'),
      p('Phnom Penh', 'Phnom Penh - tote white.png'),
    ],
    description: 'Sturdy canvas tote bag featuring the Phnom Penh painting.',
    colors: ['Beige', 'Black', 'White'],
    colorImages: {
      Beige: p('Phnom Penh', 'Phnom Penh - Tote beige.png'),
      Black: p('Phnom Penh', 'Phnom Penh - Tote Black.png'),
      White: p('Phnom Penh', 'Phnom Penh - tote white.png'),
    },
    sizes: TOTE_SIZES,
    sizePrice: TOTE_PRICES,
    inStock: true,
  },
];

// ─────────────────────────────────────────────────────────────────
// Programmatically split 'Postcards' from Prints
// ─────────────────────────────────────────────────────────────────
const postcards: Product[] = [];

for (const p of collectionProducts) {
  if (p.category === 'Prints' && p.sizes?.includes('A6 (Post card)')) {
    // 1. Remove A6 from original Print definition
    p.sizes = p.sizes.filter(s => s !== 'A6 (Post card)');
    if (p.sizePrice && p.sizePrice['A6 (Post card)']) {
      delete p.sizePrice['A6 (Post card)'];
    }
    if (p.sizeImages && p.sizeImages['A6 (Post card)']) {
      delete p.sizeImages['A6 (Post card)'];
    }
    
    // 2. Build new valid images array using fuzzy logic
    const validImages = p.images.filter(img => {
      const lower = img.toLowerCase();
      return lower.includes('print 2') || 
             lower.includes('post card') || 
             lower.includes('postcard') || 
             lower.includes('print.png');
    });

    // Strategy to pick image cover:
    // User requested: "use 'Artwork - Post Card' as the primary thumbnail"
    const primaryImage = validImages.find(img => 
      img.toLowerCase().includes('post card') || 
      img.toLowerCase().includes('postcard')
    ) || validImages[0] || p.image;

    const postcard: Product = {
      ...p,
      id: p.id.replace('prints', 'postcards'),
      slug: p.slug.replace('prints', 'postcards'),
      name: p.name.replace('Prints', 'Postcard'),
      price: 4,
      category: 'Postcards',
      image: primaryImage,
      images: validImages,
      // Remove sizes altogether to reflect single product variation typical of postcards
      sizes: [],
      sizePrice: undefined,
      sizeImages: undefined
    };

    postcards.push(postcard);
  }
}

// Append newly generated postcards to main collection export
collectionProducts.push(...postcards);
