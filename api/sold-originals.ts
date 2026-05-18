import { getSoldOriginals } from './_utils/sold-originals';

/**
 * GET /api/sold-originals
 * Returns the list of sold original painting names as { sold: string[] }
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const sold = await getSoldOriginals();
    // Cache for 60 seconds to keep the shop up-to-date without hammering Blob
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ sold });
  } catch (err: any) {
    console.error('[sold-originals API] Error:', err.message);
    return res.status(500).json({ sold: [] });
  }
}
