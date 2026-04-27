import { Painting } from '../lib/types';

const PAINT_BASE = '/images/paintings';

/**
 * Helper to generate dual-quality image paths.
 * Default: .jpg for No Watermarks (thumb), .png for Watermarks (full).
 */
function p(subfolder: string, filename: string, options: { t?: string; f?: string } = {}) {
  const tExt = options.t || 'jpg';
  const fExt = options.f || 'png';
  return {
    image: `${PAINT_BASE}/No Watermarks/${subfolder}/${filename}.${tExt}`,
    highResImage: `${PAINT_BASE}/Watermarks/${subfolder}/${filename}.${fExt}`
  };
}

export const paintings: Painting[] = [
  // ─── Cambodia Main Series (8) ─────────────────────────────────────
  {
    id: 'c1',
    title: 'Russian Market 26',
    year: '2026',
    medium: 'Acrylic on canvas',
    dimensions: '40x40cm',
    description: 'This rendition of the Russian Market scene captures the energy and rhythm that takes place below the vibrant roof tops. This piece emphasizes movement, liveliness and the flow of daily life in Cambodia. The translucent frame and the textured, stylized imagery allows the scene to pulse with activity and vibrancy.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'russian_market_ii'), 
    status: 'Available'
  },
  {
    id: 'c2',
    title: 'Koh Rong',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '50x60cm',
    description: 'Koh Rong is a quiet, calming place. It has the rustic charm of a beach town, removed from the busyness of modern city life. Yet parts of the beach town have evolved in other ways. This piece evokes the spirit of the community that flows through Koh Rong, while the shapes suggest spontaneity, memories, and the liberating energy of travelers and their celebrations. This painting explores the balance between the calm of the coastal beach and the liberating energy of travelers, carefully navigating the edge before it tips into the overwhelm of holiday exuberance.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'koh_rong'),
    status: 'Available'
  },
  {
    id: 'c3',
    title: 'Daun Penh',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '50x60cm',
    description: 'Taking place in the old neighborhood of Daun Penh, this piece reflects the charm and character of the worn streets. Rustic textures and weathered surfaces are juxtaposed with delicate, light shapes creating a contrast between polished order and textured imperfection. This is meant to invite a reflection of how old and new, fragile and enduring, can coexist and enrich one another.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'daun_penh'),
    status: 'Available'
  },
  {
    id: 'c4',
    title: 'Russian Market 25',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '40x40cm',
    description: 'Russian market is a vibrant, traditional marketplace where local daily life and tourism intersect. The opaque circle isolates a moment of calmness above the chaotic energy of the busy streets, while the surrounding geometric forms create order and structure. This piece was designed to invite reflection on whether these spaces should be reorganized to reduce the clutter and chaos, or preserved in their layered complexity and lively beauty.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'russian_market'),
    status: 'Available'
  },
  {
    id: 'c5',
    title: 'Phnom Aoral',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '91 x122',
    description: 'This piece uses geometric shapes to frame and enhance the natural scene. The shapes are carefully balanced to coexist with the landscape, to create structure and modernization without overpowering the organic qualities of the environment.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'phnom_aoral'),
    status: 'Available'
  },
  {
    id: 'c6',
    title: 'Independence Monument',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '60x50',
    description: 'This piece reflects Cambodian identity through familiar symbols. While the recognizable elements take center stage, the modern, non-Khmer skyline sits behind, big and bulky, impossible to ignore, setting a contemporary backdrop to the enduring staples of Khmer culture.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'independence'),
    status: 'Available'
  },
  {
    id: 'c7',
    title: 'Battambang',
    year: '2026',
    medium: 'Acrylic on Canvas',
    description: 'This piece reflects a space that exists just beyond crowded streets and a nightly spectacle. People gather nearby, but remains outside the frame. Human presence exists is only suggested as the energy comes from the familiar market symbols, layered textures, and the rhythm of the city itself.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'battambang', { t: 'png' }), 
    status: 'Hidden'
  },
  {
    id: 'c8',
    title: 'Phnom Penh 2026',
    year: '2026',
    medium: 'Mixed Media on Canvas',
    description: 'This piece explores the coexistence of tradition and modern life through moments of visual and symbolic tension. The honor of a monk, yet absorbed by a phone; a traditional building against a modern skyscraper. The use of saffron orange, the color of a monk’s robe, symbolizing detachment from material desire, highlights how these values can feel at odds within a modern world.',
    collection: 'Cambodia',
    subCollection: 'Main Series',
    ...p('cambodia', 'Phnom Penh', { t: 'png' }), 
    status: 'Available'
  },

  // ─── Cambodia Excess Paint (7) ────────────────────────────────────
  {
    id: 'ep1',
    title: 'Russian Market 26 EP',
    year: '2026',
    medium: 'Acrylic on canvas',
    dimensions: '20x20cm',
    description: 'The excess paint from the palette found a new purpose in this piece, maintaining the layers of textures to reflect a familiar look of weathered liveliness and rich vibrancy.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'russian_market_ii_ep'),
    status: 'Available'
  },
  {
    id: 'ep2',
    title: 'Koh Rong EP i',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '30.5x40.6',
    description: 'The left over paint from Koh Rong went into this continuation of flow, free spirit and spontaneity.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'koh_rong_ep'),
    status: 'Available'
  },
  {
    id: 'ep8',
    title: 'Koh Rong EP ii',
    year: '2025',
    medium: 'Acrylic on panel',
    dimensions: '30 diameter',
    description: 'The left over paint from Koh Rong went into this continuation of flow, free spirit and spontaneity.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'koh_rong_ep_2'),
    status: 'Available'
  },
  {
    id: 'ep3',
    title: 'Daun Penh EP',
    year: '2025',
    medium: 'Acrylic on panel',
    dimensions: '33x41',
    description: 'The excess paint on the palette allowed for a light and textured artwork that explores a layering of imperfect and polished patterns. This piece creates a coexistence between organic, weathered patterns and crisp geometric shapes.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'daun_penh_ep'),
    status: 'Available'
  },
  {
    id: 'ep4',
    title: 'Russian Market 25 EP',
    year: '2025',
    medium: 'Acrylic on panel',
    dimensions: '15.2x20.3',
    description: 'This excess paint artwork revisits a captured calmness among what is known to be dynamic and energizing.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'russian_market_ep'),
    status: 'Sold'
  },
  {
    id: 'ep5',
    title: 'Independence Monument EP',
    year: '2025',
    medium: 'Acrylic on panel',
    dimensions: '30 diameter',
    description: 'The excess paint in this piece was left mostly as is to enhance its connection to the otherwise unique piece.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'independence_ep'),
    status: 'Sold'
  },
  {
    id: 'ep6',
    title: 'Battambang EP',
    year: '2026',
    medium: 'Acrylic on canvas',
    description: 'Light and dark can be seen in this piece where paint has been repurposed with the similar goal of blurring dusk into dawn maintaining high energy and vibrancy.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'battambang_ep'),
    status: 'Available'
  },
  {
    id: 'ep7',
    title: 'Phnom Aoral EP',
    year: '2025',
    medium: 'Acrylic on panel',
    dimensions: '41x33',
    description: 'The renewed paint in this piece is used to explore a similar balance and coexistence of organic and carefully placed strokes.',
    collection: 'Cambodia',
    subCollection: 'Excess Paint',
    ...p('cambodia', 'phnom_aoral_ep'),
    status: 'Available'
  },

  // ─── Korea (6) ────────────────────────────────────────────────────
  {
    id: 'k1',
    title: 'Jeju ii',
    year: '2025',
    medium: 'Acrylic on canvas',
    dimensions: '45.5x53',
    description: 'Temples once so grounded and balanced within natural landscapes of South Korea now recomposed by rigid, rectangular shapes. This piece explores the point when interaction and fusion shift into obstruction and constraint.',
    collection: 'Korea',
    ...p('korea', 'jeju_ii'),
    status: 'Available'
  },
  {
    id: 'k2',
    title: 'Namhansanseong',
    year: '2024',
    medium: 'Acrylic on Canvas',
    dimensions: '45.5x53',
    collection: 'Korea',
    ...p('korea', 'namhansanseong'),
    status: 'Sold'
  },
  {
    id: 'k3',
    title: 'Jeju',
    year: '2024',
    medium: 'Acrylic on canvas',
    dimensions: '53x45.5',
    description: 'Inspired by the vibrant and delicate Joseon Dynasty temples — designed to be integrated into the natural surroundings and now framed by the perfectly constructed skyscrapers of modern times — this piece represents Korea\'s ongoing fusion of tradition and contemporary.',
    collection: 'Korea',
    ...p('korea', 'jeju'),
    status: 'Available'
  },
  {
    id: 'k4',
    title: 'Nami Island',
    year: '2023',
    medium: 'Acrylic on canvas',
    dimensions: '72.5 x 60.5',
    description: 'Namisan is romantic, energetic, and youthful. While its cultural and historical roots paint a backdrop to the scene, Nami island has been transformed into a tourist destination celebrated for its art, media and romantic appeal. This piece captures the fluidity, energy, and artistic spirit of the island, reflecting the reality of lived moments and curated beauty.',
    collection: 'Korea',
    ...p('korea', 'nami_island', { t: 'jpg', f: 'png' }),
    status: 'Available'
  },
  {
    id: 'k5',
    title: 'Nowon-Gu',
    year: '2023',
    medium: 'Acrylic on canvas',
    dimensions: '45.5x53',
    collection: 'Korea',
    ...p('korea', 'nowon_gu'),
    status: 'Available'
  },
  {
    id: 'k6',
    title: 'Dobongsan',
    year: '2023',
    medium: 'Acrylic on canvas',
    dimensions: '45.5x53',
    collection: 'Korea',
    ...p('korea', 'dobongsan'),
    status: 'Available'
  },
  {
    id: 'k7',
    title: 'Myeongdong',
    year: '2024',
    medium: 'Acrylic on canvas',
    collection: 'Korea',
    ...p('korea', 'Myeongdong', { t: 'png' }), // Special case: PNG in both
    status: 'Available'
  },

  // ─── Commissions (2) ──────────────────────────────────────────────
  {
    id: 'com1',
    title: 'Odaesan',
    year: '2024',
    medium: 'Acrylic on Panel',
    dimensions: '30x45cm',
    collection: 'Commissions',
    ...p('commissions', 'odaesan'), 
    status: 'Commissioned'
  },
  {
    id: 'com2',
    title: 'Banchan',
    year: '2025',
    medium: 'Acrylic on Canvas',
    dimensions: '90x60cm',
    collection: 'Commissions',
    ...p('commissions', 'banchan'), 
    status: 'Commissioned'
  },

  // ─── Other Countries (3) ────────────────────────────────────────
  {
    id: 'oc1',
    title: 'Golden Ganesha',
    year: '2025',
    medium: 'Acrylic on Canvas',
    dimensions: '90x60cm',
    collection: 'Other Countries',
    ...p('other-countries', 'golden_ganesha'),
    status: 'Available'
  },
  {
    id: 'oc2',
    title: 'Bangkok',
    year: '2024',
    medium: 'Acrylic on Paper',
    dimensions: '52x38cm',
    collection: 'Other Countries',
    ...p('other-countries', 'bangkok', { f: 'jpg' }), // Special case: JPG in both
    status: 'Available'
  },
  {
    id: 'oc3',
    title: 'Rocky Mountains',
    year: '2024',
    medium: 'Acrylic on Panel',
    dimensions: '24x33cm',
    collection: 'Other Countries',
    ...p('other-countries', 'rocky_mountain'),
    status: 'Available'
  }
];
