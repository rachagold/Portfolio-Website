import { put } from '@vercel/blob';

const BLOB_FILENAME = 'sold-originals.json';

/**
 * Returns the list of sold original painting names from Vercel Blob.
 * Returns an empty array if the file doesn't exist yet.
 */
async function getSoldOriginals(): Promise<string[]> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: BLOB_FILENAME });
    if (blobs.length === 0) return [];

    const blob = blobs[0];
    const res = await fetch(blob.url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('[sold-originals] Failed to read blob:', err);
    return [];
  }
}

/**
 * Adds a painting name to the sold list, then re-uploads to Vercel Blob.
 * Safe to call multiple times for the same name (deduplicates).
 */
async function markOriginalSold(paintingName: string): Promise<void> {
  try {
    const current = await getSoldOriginals();
    if (current.includes(paintingName)) {
      console.log(`[sold-originals] "${paintingName}" already marked as sold.`);
      return;
    }

    const updated = [...current, paintingName];
    const content = JSON.stringify(updated);

    await put(BLOB_FILENAME, content, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    console.log(`[sold-originals] Marked as sold: "${paintingName}". Total sold: ${updated.length}`);
  } catch (err) {
    console.error('[sold-originals] Failed to mark as sold:', err);
    throw err;
  }
}

/**
 * GET /api/sold-originals - Returns the list of sold original painting names as { sold: string[] }
 * POST /api/sold-originals - Marks an original artwork as sold (expects { name: string })
 */
export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const sold = await getSoldOriginals();
      // Cache for 60 seconds to keep the shop up-to-date without hammering Blob
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(200).json({ sold });
    } catch (err: any) {
      console.error('[sold-originals API] Error:', err.message);
      return res.status(500).json({ sold: [] });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      await markOriginalSold(name);
      return res.status(200).json({ success: true, message: `Successfully marked "${name}" as sold.` });
    } catch (err: any) {
      console.error('[sold-originals API] Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
