import { put, head, del } from '@vercel/blob';

const BLOB_FILENAME = 'sold-originals.json';

/**
 * Returns the list of sold original painting names from Vercel Blob.
 * Returns an empty array if the file doesn't exist yet.
 */
export async function getSoldOriginals(): Promise<string[]> {
  try {
    // List blobs to find our file by pathname
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
export async function markOriginalSold(paintingName: string): Promise<void> {
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
