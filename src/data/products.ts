import { Product } from '../lib/types';
import { originalArtworks } from './originalArtworks';

export const products: Product[] = [
  // ─── Lead with variety: Tote → Print → T-Shirt → Tote → Print → ... ──
  {
    id: 'tote-2',
    slug: 'koh-rong-ep-tote-bag',
    name: 'Koh Rong EP Tote Bag',
    price: 30,
    category: 'Totes',
    collection: 'Cambodia',
    image: '/images/products/totes/koh_rong_ep_tote.png',
    images: [
      '/images/products/totes/koh_rong_ep_tote.png'
    ],
    description: 'Sturdy canvas tote bag featuring the Koh Rong Excess Paint piece.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Standard', 'Large'],
    sizePrice: { 'Standard': 30, 'Large': 35 },
    inStock: true
  },
  {
    id: 'print-1',
    slug: 'russian-market-ii-print',
    name: 'Russian Market ii Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/russian_market_ii/flat.jpg',
    hoverImage: '/images/products/prints/russian_market_ii/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/russian_market_ii/flat.jpg',
      '/images/products/prints/russian_market_ii/a3_mockup.jpg',
      '/images/products/prints/russian_market_ii/back.jpg',
      '/images/products/prints/russian_market_ii/lifestyle_mockup.jpg'
    ],
    description: 'High-quality print of Russian Market ii, capturing the energy and rhythm of daily life beneath the vibrant rooftops.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/russian_market_ii/lifestyle_mockup.jpg', 'A4': '/images/products/prints/russian_market_ii/flat.jpg', 'A3 (Poster)': '/images/products/prints/russian_market_ii/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'tshirt-2',
    slug: 'koh-rong-ep-t-shirt',
    name: 'Koh Rong EP T-Shirt',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: '/images/products/tshirts/koh_rong_ep/back_white.jpg',
    hoverImage: '/images/products/tshirts/koh_rong_ep/front.jpg',
    images: [
      '/images/products/tshirts/koh_rong_ep/back_white.jpg',
      '/images/products/tshirts/koh_rong_ep/back_beige.jpg',
      '/images/products/tshirts/koh_rong_ep/front.jpg'
    ],
    colorImages: {
      'White': '/images/products/tshirts/koh_rong_ep/back_white.jpg',
      'Beige': '/images/products/tshirts/koh_rong_ep/back_beige.jpg'
    },
    description: 'Soft cotton t-shirt featuring the Koh Rong Excess Paint piece. Available in multiple colors.',
    colors: ['White', 'Beige'],
    sizes: ['Medium', 'Large', 'X-Large', 'XX-Large'],
    inStock: true
  },
  {
    id: 'tote-1',
    slug: 'russian-market-tote-bag',
    name: 'Russian Market Tote Bag',
    price: 30,
    category: 'Totes',
    collection: 'Cambodia',
    image: '/images/products/totes/russian_market_tote.png',
    images: [
      '/images/products/totes/russian_market_tote.png'
    ],
    description: 'Sturdy canvas tote bag featuring the Russian Market painting.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Standard', 'Large'],
    sizePrice: { 'Standard': 30, 'Large': 35 },
    inStock: true
  },
  {
    id: 'tshirt-1',
    slug: 'russian-market-t-shirt',
    name: 'Russian Market T-Shirt',
    price: 30,
    category: 'T-shirts',
    collection: 'Cambodia',
    image: '/images/products/tshirts/russian_market/back_white.jpg',
    hoverImage: '/images/products/tshirts/russian_market/front.jpg',
    images: [
      '/images/products/tshirts/russian_market/back_white.jpg',
      '/images/products/tshirts/russian_market/back_black.jpg',
      '/images/products/tshirts/russian_market/back_beige.jpg',
      '/images/products/tshirts/russian_market/front.jpg'
    ],
    colorImages: {
      'White': '/images/products/tshirts/russian_market/back_white.jpg',
      'Black': '/images/products/tshirts/russian_market/back_black.jpg',
      'Beige': '/images/products/tshirts/russian_market/back_beige.jpg'
    },
    description: 'Soft cotton t-shirt featuring the Russian Market painting. Available in multiple colors.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Medium', 'Large', 'X-Large', 'XX-Large'],
    inStock: true
  },
  {
    id: 'print-2',
    slug: 'phnom-aoral-ep-print',
    name: 'Phnom Aoral EP Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/phnom_aoral_ep/flat.jpg',
    hoverImage: '/images/products/prints/phnom_aoral_ep/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/phnom_aoral_ep/flat.jpg',
      '/images/products/prints/phnom_aoral_ep/a3_mockup.jpg',
      '/images/products/prints/phnom_aoral_ep/a4_mockup.jpg',
      '/images/products/prints/phnom_aoral_ep/back.jpg',
      '/images/products/prints/phnom_aoral_ep/lifestyle_mockup.jpg'
    ],
    description: 'Print of the Phnom Aoral Excess Paint piece, showcasing repurposed materials in a vibrant composition.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/phnom_aoral_ep/lifestyle_mockup.jpg', 'A4': '/images/products/prints/phnom_aoral_ep/a4_mockup.jpg', 'A3 (Poster)': '/images/products/prints/phnom_aoral_ep/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'tote-3',
    slug: 'phnom-aoral-ep-tote-bag',
    name: 'Phnom Aoral EP Tote Bag',
    price: 30,
    category: 'Totes',
    collection: 'Cambodia',
    image: '/images/products/totes/phnom_aoral_ep_tote.png',
    images: [
      '/images/products/totes/phnom_aoral_ep_tote.png'
    ],
    description: 'Sturdy canvas tote bag featuring the Phnom Aoral Excess Paint piece.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Standard', 'Large'],
    sizePrice: { 'Standard': 30, 'Large': 35 },
    inStock: true
  },
  {
    id: 'print-3',
    slug: 'daun-penh-print',
    name: 'Daun Penh Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/daun_penh/flat.jpg',
    hoverImage: '/images/products/prints/daun_penh/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/daun_penh/flat.jpg',
      '/images/products/prints/daun_penh/a3_mockup.jpg',
      '/images/products/prints/daun_penh/back.jpg',
      '/images/products/prints/daun_penh/lifestyle_mockup.jpg'
    ],
    description: 'Print of Daun Penh, reflecting the charm and character of the old neighborhood streets.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/daun_penh/lifestyle_mockup.jpg', 'A4': '/images/products/prints/daun_penh/flat.jpg', 'A3 (Poster)': '/images/products/prints/daun_penh/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'tshirt-3',
    slug: 'jeju-t-shirt',
    name: 'Jeju T-Shirt',
    price: 30,
    category: 'T-shirts',
    collection: 'Korea',
    image: '/images/products/tshirts/jeju/back_white.jpg',
    hoverImage: '/images/products/tshirts/jeju/front.jpg',
    images: [
      '/images/products/tshirts/jeju/back_white.jpg',
      '/images/products/tshirts/jeju/back_black.jpg',
      '/images/products/tshirts/jeju/back_beige.jpg',
      '/images/products/tshirts/jeju/front.jpg'
    ],
    colorImages: {
      'White': '/images/products/tshirts/jeju/back_white.jpg',
      'Black': '/images/products/tshirts/jeju/back_black.jpg',
      'Beige': '/images/products/tshirts/jeju/back_beige.jpg'
    },
    description: 'Soft cotton t-shirt featuring the Jeju painting. Available in multiple colors.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Medium', 'Large', 'X-Large', 'XX-Large'],
    inStock: true
  },
  {
    id: 'print-4',
    slug: 'independence-print',
    name: 'Independence Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/independence/flat.jpg',
    hoverImage: '/images/products/prints/independence/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/independence/flat.jpg',
      '/images/products/prints/independence/a3_mockup.jpg',
      '/images/products/prints/independence/a4_mockup.jpg',
      '/images/products/prints/independence/back.jpg',
      '/images/products/prints/independence/lifestyle_mockup.jpg'
    ],
    description: 'Print of the Independence painting from the Cambodia collection.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/independence/lifestyle_mockup.jpg', 'A4': '/images/products/prints/independence/a4_mockup.jpg', 'A3 (Poster)': '/images/products/prints/independence/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'tote-4',
    slug: 'phnom-aoral-tote-bag',
    name: 'Phnom Aoral Tote Bag',
    price: 30,
    category: 'Totes',
    collection: 'Cambodia',
    image: '/images/products/totes/phnom_aoral_tote.png',
    images: [
      '/images/products/totes/phnom_aoral_tote.png'
    ],
    description: 'Sturdy canvas tote bag featuring the Phnom Aoral landscape painting.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Standard', 'Large'],
    sizePrice: { 'Standard': 30, 'Large': 35 },
    inStock: true
  },
  {
    id: 'print-5',
    slug: 'phnom-aoral-print',
    name: 'Phnom Aoral Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/phnom_aoral/flat.jpg',
    hoverImage: '/images/products/prints/phnom_aoral/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/phnom_aoral/flat.jpg',
      '/images/products/prints/phnom_aoral/a3_mockup.jpg',
      '/images/products/prints/phnom_aoral/back.jpg',
      '/images/products/prints/phnom_aoral/lifestyle_mockup.jpg'
    ],
    description: 'Print of Phnom Aoral, where geometric shapes frame and enhance the natural landscape.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/phnom_aoral/lifestyle_mockup.jpg', 'A4': '/images/products/prints/phnom_aoral/flat.jpg', 'A3 (Poster)': '/images/products/prints/phnom_aoral/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'tote-5',
    slug: 'jeju-tote-bag',
    name: 'Jeju Tote Bag',
    price: 30,
    category: 'Totes',
    collection: 'Korea',
    image: '/images/products/totes/jeju_tote.png',
    images: [
      '/images/products/totes/jeju_tote.png'
    ],
    description: 'Sturdy canvas tote bag featuring the Jeju island landscape painting.',
    colors: ['White', 'Black', 'Beige'],
    sizes: ['Standard', 'Large'],
    sizePrice: { 'Standard': 30, 'Large': 35 },
    inStock: true
  },
  {
    id: 'print-6',
    slug: 'russian-market-print',
    name: 'Russian Market Print',
    price: 5,
    category: 'Prints',
    collection: 'Cambodia',
    image: '/images/products/prints/russian_market/flat.jpg',
    hoverImage: '/images/products/prints/russian_market/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/russian_market/flat.jpg',
      '/images/products/prints/russian_market/a3_mockup.jpg',
      '/images/products/prints/russian_market/a4_mockup.jpg',
      '/images/products/prints/russian_market/back.jpg',
      '/images/products/prints/russian_market/lifestyle_mockup.jpg'
    ],
    description: 'Print of Russian Market, depicting the vibrant traditional marketplace where daily life and tourism intersect.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/russian_market/lifestyle_mockup.jpg', 'A4': '/images/products/prints/russian_market/a4_mockup.jpg', 'A3 (Poster)': '/images/products/prints/russian_market/a3_mockup.jpg' },
    inStock: true
  },
  {
    id: 'print-7',
    slug: 'jeju-print',
    name: 'Jeju Print',
    price: 5,
    category: 'Prints',
    collection: 'Korea',
    image: '/images/products/prints/jeju/flat.jpg',
    hoverImage: '/images/products/prints/jeju/lifestyle_mockup.jpg',
    images: [
      '/images/products/prints/jeju/flat.jpg',
      '/images/products/prints/jeju/a3_mockup.jpg',
      '/images/products/prints/jeju/a4_mockup.jpg',
      '/images/products/prints/jeju/back.jpg',
      '/images/products/prints/jeju/lifestyle_mockup.jpg'
    ],
    description: 'Print of Jeju, capturing the serene island landscape of Korea.',
    sizes: ['A6 (Post card)', 'A4', 'A3 (Poster)'],
    sizePrice: { 'A6 (Post card)': 5, 'A4': 20, 'A3 (Poster)': 30 },
    sizeImages: { 'A6 (Post card)': '/images/products/prints/jeju/lifestyle_mockup.jpg', 'A4': '/images/products/prints/jeju/a4_mockup.jpg', 'A3 (Poster)': '/images/products/prints/jeju/a3_mockup.jpg' },
    inStock: true
  },
  ...originalArtworks,
];
