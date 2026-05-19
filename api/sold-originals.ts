import { getSoldOriginals, markOriginalSold } from './_utils/sold-originals';

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
