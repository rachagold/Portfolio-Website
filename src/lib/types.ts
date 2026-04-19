export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: 'Prints' | 'T-shirts' | 'Totes' | 'Originals' | 'Accessories';
  collection: 'Cambodia' | 'Korea' | 'Other';
  image: string;
  hoverImage?: string;
  images: string[];
  colorImages?: Record<string, string>;
  description: string;
  colors?: string[];
  sizes?: string[];
  sizePrice?: Record<string, number>;
  sizeImages?: Record<string, string>;
  inStock: boolean;
  /** Optional Cambodia-local price override (USD). */
  cambodiaPrice?: number;
}

export interface Painting {
  id: string;
  title: string;
  year: string;
  medium: string;
  dimensions?: string;
  description?: string;
  collection: 'Cambodia' | 'Korea' | 'Commissions' | 'Other Countries' | 'Other';
  subCollection?: 'Main Series' | 'Excess Paint';
  image: string; // Used as thumbnail
  highResImage: string; // Used for lightbox/shop
  price?: number;
  status: 'Available' | 'Sold' | 'Commissioned';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice: number;
}
