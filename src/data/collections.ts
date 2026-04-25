/**
 * collections.ts
 * Source of truth for the 8-box collection grid and per-collection tile data.
 * coverImage: null  → OOS badge on the main shop grid box
 * tile.thumbnail: null → OOS badge on that tile inside the collection page
 */

const PROD_BASE = '/images/products';
const PAINT_BASE = '/images/paintings';

const asset = (folder: string, file: string) => `${PROD_BASE}/${folder}/${file}`;
const painting = (sub: string, file: string) => `${PAINT_BASE}/No Watermarks/${sub}/${file.replace('.png', '.jpg')}`;

export interface CollectionTileDef {
  /** Primary thumbnail. null = OOS – tile is shown but badge is displayed */
  thumbnail: string | null;
  /** The /shop/:slug this tile links to */
  slug: string;
}

export interface CollectionDef {
  name: string;
  displayName: string;
  slug: string;
  /** The [name] - All.png cover. null = OOS on the shop grid box */
  coverImage: string | null;
  tiles: {
    prints: CollectionTileDef;
    postcards: CollectionTileDef;
    tees: CollectionTileDef;
    totes: CollectionTileDef;
    original: CollectionTileDef;
  };
}

export const COLLECTIONS: CollectionDef[] = [
  // ── 1. Russian Market ─────────────────────────────────────────────────────
  {
    name: 'Russian Market',
    displayName: 'Russian Market Collection',
    slug: 'russian-market',
    coverImage: asset('Russian Market', 'Russian Market - All.png'),
    tiles: {
      prints: {
        thumbnail: asset('Russian Market', 'Russian Market - All.png'),
        slug: 'russian-market-prints',
      },
      postcards: {
        thumbnail: asset('Russian Market', 'Russian Market - Post Card.png'),
        slug: 'russian-market-postcards',
      },
      tees: {
        thumbnail: asset('Russian Market', 'Russian Market - Tee White.png'),
        slug: 'russian-market-tees',
      },
      totes: {
        thumbnail: asset('Russian Market', 'Russian Market - Tote beige.png'),
        slug: 'russian-market-totes',
      },
      original: {
        thumbnail: painting('cambodia', 'russian_market.png'),
        slug: 'original-russian-market-25',
      },
    },
  },

  // ── 2. Phnom Aoral ────────────────────────────────────────────────────────
  {
    name: 'Phnom Aoral',
    displayName: 'Phnom Aoral Collection',
    slug: 'phnom-aoral',
    coverImage: asset('Phnom Aoral', 'Phnom Aoral - All.png'),
    tiles: {
      prints: {
        thumbnail: asset('Phnom Aoral', 'Phnom Aoral - All.png'),
        slug: 'phnom-aoral-prints',
      },
      postcards: {
        thumbnail: asset('Phnom Aoral', 'Phnom Aoral - Postcard.png'),
        slug: 'phnom-aoral-postcards',
      },
      tees: {
        thumbnail: asset('Phnom Aoral', 'Phnom Aoral - Tee Black.png'),
        slug: 'phnom-aoral-tees',
      },
      totes: {
        thumbnail: asset('Phnom Aoral', 'Phnom Aoral - Tote Beige.png'),
        slug: 'phnom-aoral-totes',
      },
      original: {
        thumbnail: painting('cambodia', 'phnom_aoral.png'),
        slug: 'original-phnom-aoral',
      },
    },
  },

  // ── 3. Jeju ───────────────────────────────────────────────────────────────
  {
    name: 'Jeju',
    displayName: 'Jeju Collection',
    slug: 'jeju',
    coverImage: asset('Jeju', 'Jeju - All.png'),
    tiles: {
      prints: {
        thumbnail: asset('Jeju', 'Jeju - All Prints.png'),
        slug: 'jeju-prints',
      },
      postcards: {
        thumbnail: asset('Jeju', 'Jeju - Post card.png'),
        slug: 'jeju-postcards',
      },
      tees: {
        thumbnail: asset('Jeju', 'Jeju - Tee White.png'),
        slug: 'jeju-tees',
      },
      totes: {
        thumbnail: asset('Jeju', 'Jeju - Tote Beige.png'),
        slug: 'jeju-totes',
      },
      original: {
        thumbnail: painting('korea', 'jeju.png'),
        slug: 'original-jeju-ii',
      },
    },
  },

  // ── 4. Koh Rong EP ────────────────────────────────────────────────────────
  {
    name: 'Koh Rong EP',
    displayName: 'Koh Rong EP Collection',
    slug: 'koh-rong-ep',
    coverImage: asset('Koh Rong EP', 'Koh Rong EP - All.png'),
    tiles: {
      prints: {
        thumbnail: asset('Koh Rong EP', 'Koh Rong EP - All Prints.png'),
        slug: 'koh-rong-ep-prints',
      },
      postcards: {
        thumbnail: asset('Koh Rong EP', 'Koh Rong EP - Postcard.png'),
        slug: 'koh-rong-ep-postcards',
      },
      tees: {
        // note: exact filename uses lowercase 'w'
        thumbnail: asset('Koh Rong EP', 'Koh Rong EP - Tee white.png'),
        slug: 'koh-rong-ep-tees',
      },
      totes: {
        thumbnail: asset('Koh Rong EP', 'Koh Rong EP - Tote Beige.png'),
        slug: 'koh-rong-ep-totes',
      },
      original: {
        thumbnail: painting('cambodia', 'koh_rong_ep.png'),
        slug: 'original-koh-rong-ep-i',
      },
    },
  },

  // ── 5. Phnom Aoral EP ─────────────────────────────────────────────────────
  {
    name: 'Phnom Aoral EP',
    displayName: 'Phnom Aoral EP Collection',
    slug: 'phnom-aoral-ep',
    coverImage: asset('Phnom Aoral EP', 'Phnom Aoral EP - All.png'),
    tiles: {
      prints: {
        thumbnail: asset('Phnom Aoral EP', 'Phnom Aoral EP - All prints.png'),
        slug: 'phnom-aoral-ep-prints',
      },
      postcards: {
        thumbnail: asset('Phnom Aoral EP', 'Phnom Aoral EP - Post Card.png'),
        slug: 'phnom-aoral-ep-postcards',
      },
      tees: {
        thumbnail: asset('Phnom Aoral EP', 'Phnom Aoral EP - Tee White.png'),
        slug: 'phnom-aoral-ep-tees',
      },
      totes: {
        thumbnail: asset('Phnom Aoral EP', 'Phnom Aoral EP - Tote beige.png'),
        slug: 'phnom-aoral-ep-totes',
      },
      original: {
        thumbnail: painting('cambodia', 'phnom_aoral_ep.png'),
        slug: 'original-phnom-aoral-ep',
      },
    },
  },

  // ── 6. Independence ───────────────────────────────────────────────────────
  {
    name: 'Independence',
    displayName: 'Independence Collection',
    slug: 'independence',
    coverImage: asset('Independence', 'Independence - Post card.png'),
    tiles: {
      prints: {
        thumbnail: asset('Independence', 'Independence - A4.png'),
        slug: 'independence-prints',
      },
      postcards: {
        thumbnail: asset('Independence', 'Independence - Post card.png'),
        slug: 'independence-postcards',
      },
      tees: {
        thumbnail: asset('Independence', 'Independence - Tee white.png'),
        slug: 'independence-tees',
      },
      totes: {
        thumbnail: asset('Independence', 'Independence - Tote beige 2.png'),
        slug: 'independence-totes',
      },
      original: {
        thumbnail: painting('cambodia', 'independence.png'),
        slug: 'original-independence-monument',
      },
    },
  },

  // ── 7. Phnom Penh ─────────────────────────────────────────────────────────
  {
    name: 'Phnom Penh',
    displayName: 'Phnom Penh Collection',
    slug: 'phnom-penh',
    coverImage: asset('Phnom Penh', 'Phnom Penh - A4.png'),
    tiles: {
      prints: { 
        thumbnail: asset('Phnom Penh', 'Phnom Penh - A4.png'),
        slug: 'phnom-penh-prints' 
      },
      postcards: { 
        thumbnail: asset('Phnom Penh', 'Phnom Penh - Post card.png'), 
        slug: 'phnom-penh-postcards' 
      },
      tees: { 
        thumbnail: asset('Phnom Penh', 'Phnom Penh - Tee White.png'), 
        slug: 'phnom-penh-tees' 
      },
      totes: { 
        thumbnail: asset('Phnom Penh', 'Phnom Penh - Tote beige.png'), 
        slug: 'phnom-penh-totes' 
      },
      original: {
        thumbnail: painting('cambodia', 'Phnom Penh.png').replace('.jpg', '.png'),
        slug: 'original-phnom-penh-2026',
      },
    },
  },
];

/** The 8th box: Daun Penh originals gateway */
export const ORIGINALS_BOX = {
  thumbnail: '/images/paintings/No Watermarks/cambodia/daun_penh.jpg',
  href: '/shop/originals',
};
