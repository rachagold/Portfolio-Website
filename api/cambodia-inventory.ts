import fs from 'fs';
import path from 'path';

// Product Metadata definitions mapping back to client IDs
const CAMBODIA_MERCH_PRODUCTS = [
  { id: 'rm-prints', name: 'Russian Market — Prints', category: 'Prints' },
  { id: 'rm-tees', name: 'Russian Market — Tee', category: 'T-shirts' },
  { id: 'rm-totes', name: 'Russian Market — Tote', category: 'Totes' },
  { id: 'rm-postcards', name: 'Russian Market — Postcard', category: 'Postcards' },

  { id: 'rm26-prints', name: 'Russian Market 26 — Prints', category: 'Prints' },
  { id: 'rm26-tees', name: 'Russian Market 26 — Tee', category: 'T-shirts' },
  { id: 'rm26-totes', name: 'Russian Market 26 — Tote', category: 'Totes' },
  { id: 'rm26-postcards', name: 'Russian Market 26 — Postcard', category: 'Postcards' },

  { id: 'pa-prints', name: 'Phnom Aoral — Prints', category: 'Prints' },
  { id: 'pa-tees', name: 'Phnom Aoral — Tee', category: 'T-shirts' },
  { id: 'pa-totes', name: 'Phnom Aoral — Tote', category: 'Totes' },
  { id: 'pa-postcards', name: 'Phnom Aoral — Postcard', category: 'Postcards' },

  { id: 'jeju-prints', name: 'Jeju — Prints', category: 'Prints' },
  { id: 'jeju-tees', name: 'Jeju — Tee', category: 'T-shirts' },
  { id: 'jeju-totes', name: 'Jeju — Tote', category: 'Totes' },
  { id: 'jeju-postcards', name: 'Jeju — Postcard', category: 'Postcards' },

  { id: 'krep-prints', name: 'Koh Rong EP — Prints', category: 'Prints' },
  { id: 'krep-tees', name: 'Koh Rong EP — Tee', category: 'T-shirts' },
  { id: 'krep-totes', name: 'Koh Rong EP — Tote', category: 'Totes' },
  { id: 'krep-postcards', name: 'Koh Rong EP — Postcard', category: 'Postcards' },

  { id: 'paep-prints', name: 'Phnom Aoral EP — Prints', category: 'Prints' },
  { id: 'paep-tees', name: 'Phnom Aoral EP — Tee', category: 'T-shirts' },
  { id: 'paep-totes', name: 'Phnom Aoral EP — Tote', category: 'Totes' },
  { id: 'paep-postcards', name: 'Phnom Aoral EP — Postcard', category: 'Postcards' },

  { id: 'ind-prints', name: 'Independence — Prints', category: 'Prints' },
  { id: 'ind-tees', name: 'Independence — Tee', category: 'T-shirts' },
  { id: 'ind-totes', name: 'Independence — Tote', category: 'Totes' },
  { id: 'ind-postcards', name: 'Independence — Postcard', category: 'Postcards' },

  { id: 'pp-prints', name: 'Phnom Penh — Prints', category: 'Prints' },
  { id: 'pp-tees', name: 'Phnom Penh — Tee', category: 'T-shirts' },
  { id: 'pp-totes', name: 'Phnom Penh — Tote', category: 'Totes' },
  { id: 'pp-postcards', name: 'Phnom Penh — Postcard', category: 'Postcards' }
];

export function cleanName(name: string): string {
  return name
    .toLowerCase()
    .replace(/(—|-)\s*(prints|print|tee|tees|t-shirt|t-shirts|tote|totes|postcard|postcards|all|all prints)/g, '')
    .replace(/(prints|print|tee|tees|t-shirt|t-shirts|tote|totes|postcard|postcards|all|all prints)/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function normalizeSize(size: string): string {
  const s = size.toLowerCase().trim();
  if (s === 'small' || s === 's') return 's';
  if (s === 'medium' || s === 'm') return 'm';
  if (s === 'large' || s === 'l') return 'l';
  if (s === 'x-large' || s === 'xl') return 'xl';
  if (s === 'xx-large' || s === 'xxl') return 'xxl';
  if (s.includes('standard')) return 'standard';
  if (s.includes('large')) return 'large';
  if (s.includes('a3')) return 'a3';
  if (s.includes('a4')) return 'a4';
  if (s.includes('a2')) return 'a2';
  if (s.includes('postcard') || s.includes('post card') || s === 'a6') return 'postcard';
  return s;
}

export function normalizeColor(color: string): string {
  return color.toLowerCase().trim();
}

function fuzzyMatch(codeCleaned: string, csvCleanedNames: string[]): string | null {
  if (csvCleanedNames.includes(codeCleaned)) {
    return codeCleaned;
  }
  const prefixMatch = csvCleanedNames.find(name => name.startsWith(codeCleaned) || codeCleaned.startsWith(name));
  if (prefixMatch) {
    return prefixMatch;
  }
  const includesMatch = csvCleanedNames.find(name => name.includes(codeCleaned) || codeCleaned.includes(name));
  if (includesMatch) {
    return includesMatch;
  }
  return null;
}

export function parseCSVInventory() {
  const csvPath = path.join(process.cwd(), 'Docs/Inventory.csv');
  if (!fs.existsSync(csvPath)) {
    throw new Error('Inventory.csv not found');
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const tshirts: { artwork: string; color: string; size: string; qty: number }[] = [];
  const totes: { artwork: string; color: string; size: string; qty: number }[] = [];
  const prints: { artwork: string; size: string; qty: number }[] = [];

  // Line 0 and 1 are headers.
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parts = line.split(',');

    // T-shirts (cols 0-4)
    if (parts[0] && parts[0].trim()) {
      tshirts.push({
        artwork: parts[0].trim(),
        color: parts[2] ? parts[2].trim() : '',
        size: parts[3] ? parts[3].trim() : '',
        qty: parseInt(parts[4]) || 0
      });
    }

    // Totes (cols 7-10)
    if (parts[7] && parts[7].trim()) {
      totes.push({
        artwork: parts[7].trim(),
        color: parts[8] ? parts[8].trim() : '',
        size: parts[9] ? parts[9].trim() : '',
        qty: parseInt(parts[10]) || 0
      });
    }

    // Prints (cols 13-15)
    if (parts[13] && parts[13].trim()) {
      prints.push({
        artwork: parts[13].trim(),
        size: parts[14] ? parts[14].trim() : '',
        qty: parseInt(parts[15]) || 0
      });
    }
  }

  // Get distinct cleaned names in CSV for each category
  const tshirtNamesCsv = Array.from(new Set(tshirts.map(t => cleanName(t.artwork))));
  const toteNamesCsv = Array.from(new Set(totes.map(t => cleanName(t.artwork))));
  const printNamesCsv = Array.from(new Set(prints.map(p => cleanName(p.artwork))));

  const inventoryMap: Record<string, {
    id: string;
    inStock: boolean;
    totalQty: number;
    quantities: Record<string, number>;
  }> = {};

  for (const prod of CAMBODIA_MERCH_PRODUCTS) {
    const cleanedCodeName = cleanName(prod.name);
    let matchedCsvName: string | null = null;
    let totalQty = 0;
    const quantities: Record<string, number> = {};

    if (prod.category === 'T-shirts') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, tshirtNamesCsv);
      if (matchedCsvName) {
        // Find all matching T-shirt rows in CSV
        const matchingRows = tshirts.filter(row => cleanName(row.artwork) === matchedCsvName);
        for (const row of matchingRows) {
          const normColor = normalizeColor(row.color);
          const normSize = normalizeSize(row.size);
          const key = `${normColor}_${normSize}`;
          quantities[key] = (quantities[key] || 0) + row.qty;
          totalQty += row.qty;
        }
      }
    } else if (prod.category === 'Totes') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, toteNamesCsv);
      if (matchedCsvName) {
        // Find all matching Tote rows in CSV
        const matchingRows = totes.filter(row => cleanName(row.artwork) === matchedCsvName);
        for (const row of matchingRows) {
          const normColor = normalizeColor(row.color);
          const normSize = normalizeSize(row.size);
          const key = `${normColor}_${normSize}`;
          quantities[key] = (quantities[key] || 0) + row.qty;
          totalQty += row.qty;
        }
      }
    } else if (prod.category === 'Prints') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, printNamesCsv);
      if (matchedCsvName) {
        // Find all matching Print rows in CSV, excluding Post Cards
        const matchingRows = prints.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeSize(row.size) !== 'postcard');
        for (const row of matchingRows) {
          const normSize = normalizeSize(row.size);
          quantities[normSize] = (quantities[normSize] || 0) + row.qty;
          totalQty += row.qty;
        }
      }
    } else if (prod.category === 'Postcards') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, printNamesCsv);
      if (matchedCsvName) {
        // Find all matching Postcard rows in CSV
        const matchingRows = prints.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeSize(row.size) === 'postcard');
        for (const row of matchingRows) {
          quantities['single'] = (quantities['single'] || 0) + row.qty;
          totalQty += row.qty;
        }
      }
    }

    // Only include in inventory if we found a match in the CSV
    if (matchedCsvName !== null) {
      inventoryMap[prod.id] = {
        id: prod.id,
        inStock: totalQty > 0,
        totalQty,
        quantities
      };
    } else {
      // Missing from the CSV
      inventoryMap[prod.id] = {
        id: prod.id,
        inStock: false,
        totalQty: 0,
        quantities: {}
      };
    }
  }

  return inventoryMap;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const inventory = parseCSVInventory();
    return res.status(200).json({ inventory });
  } catch (error: any) {
    console.error('Inventory parsing error:', error.message);
    return res.status(500).json({ error: 'Failed to read inventory' });
  }
}
