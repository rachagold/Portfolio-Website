
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = '/Users/rachelgoldberg/Desktop/NEWwebsite/rachel-goldberg-art/public';
const DATA_DIR = '/Users/rachelgoldberg/Desktop/NEWwebsite/rachel-goldberg-art/src/data';

const missingFiles = [];
const checked = new Set();

function check(img) {
    if (!img || checked.has(img)) return;
    checked.add(img);
    if (!fs.existsSync(path.join(PUBLIC_DIR, img))) {
        missingFiles.push(img);
    }
}

// 1. Check paths from refined list (hardcoded ones)
const refinedPaths = fs.readFileSync('/Users/rachelgoldberg/Desktop/NEWwebsite/rachel-goldberg-art/scratch/paths_refined.txt', 'utf8').split('\n');
refinedPaths.forEach(p => p.trim() && check(p.trim()));

// 2. Parse collectionProducts.ts for p() calls
const collectionProducts = fs.readFileSync(path.join(DATA_DIR, 'collectionProducts.ts'), 'utf8');
const pMatches = collectionProducts.matchAll(/p\(\s*'([^']+)'\s*,\s*'([^']+)'\s*\)/g);
for (const match of pMatches) {
    check(`/images/products/${match[1]}/${match[2]}`);
}

// 3. Parse paintings.ts
const paintings = fs.readFileSync(path.join(DATA_DIR, 'paintings.ts'), 'utf8');
// Mock the p() helper in paintings
// p(subfolder, filename, options)
const paintMatches = paintings.matchAll(/p\(\s*'([^']+)'\s*,\s*'([^']+)'\s*(?:,\s*\{([^}]+)\})?\s*\)/g);
for (const match of paintMatches) {
    const sub = match[1];
    const file = match[2];
    const optionsRaw = match[3] || '';
    let tExt = 'jpg';
    let fExt = 'png';
    if (optionsRaw.includes('t:')) {
        const m = optionsRaw.match(/t:\s*'([^']+)'/);
        if (m) tExt = m[1];
    }
    if (optionsRaw.includes('f:')) {
        const m = optionsRaw.match(/f:\s*'([^']+)'/);
        if (m) fExt = m[1];
    }
    check(`/images/paintings/No Watermarks/${sub}/${file}.${tExt}`);
    check(`/images/paintings/Watermarks/${sub}/${file}.${fExt}`);
}

// 4. Parse originalArtworks.ts for mockups (which I just added)
const originalArtworks = fs.readFileSync(path.join(DATA_DIR, 'originalArtworks.ts'), 'utf8');
// In my code I hardcoded the prefixes. I'll just check if the files exist for all prefixes I added.
const MOCKUP_BASE = '/images/paintings/Mock Ups';
const MOCKUP_CONFIG = {
  'Russian Market 26': 'Russian Market ii -',
  'Russian Market 26 EP': 'Russian Market ii EP -',
  'Koh Rong': 'Koh Rong -',
  'Koh Rong EP i': 'Koh Rong EP i-',
  'Koh Rong EP ii': 'Koh Rong EP-',
  'Daun Penh': 'Daun Penh-',
  'Daun Penh EP': 'Daun Penh EP -',
  'Russian Market 25': 'Russian Market -',
  'Russian Market 25 EP': 'Russian Marker OG -',
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

Object.values(MOCKUP_CONFIG).forEach(prefix => {
  const isAltPattern = prefix.includes('OG -');
  const og1 = isAltPattern ? `${MOCKUP_BASE}/${prefix} 1.png` : `${MOCKUP_BASE}/${prefix} OG 1.png`;
  const og2 = isAltPattern ? `${MOCKUP_BASE}/${prefix} 2.png` : `${MOCKUP_BASE}/${prefix} OG 2.png`;
  check(og1);
  check(og2);
});

// Output missing files
console.log(JSON.stringify(missingFiles, null, 2));
