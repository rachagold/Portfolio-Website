
import { originalArtworks } from './src/data/originalArtworks';

originalArtworks.forEach(p => {
  if (p.image.includes('Mock Ups')) {
    console.log(`Product: ${p.name}`);
    console.log(`Primary: ${p.image}`);
    console.log(`Gallery: ${p.images.join(', ')}`);
    console.log('---');
  }
});
