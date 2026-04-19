import { Product } from '../lib/types';
import { originalArtworks } from './originalArtworks';
import { collectionProducts } from './collectionProducts';

export const products: Product[] = [
  ...collectionProducts,
  ...originalArtworks,
];
