import Stripe from 'stripe';
import crypto from 'crypto';
import { Resend } from 'resend';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { cleanName, normalizeSize, normalizeColor } from './cambodia-inventory';

const processedOrdersPath = path.join(process.cwd(), 'Docs/processed-orders.json');

function getProcessedOrders(): string[] {
  try {
    if (fs.existsSync(processedOrdersPath)) {
      const data = fs.readFileSync(processedOrdersPath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to read processed-orders.json', err);
  }
  return [];
}

function markOrderProcessed(orderId: string) {
  try {
    const orders = getProcessedOrders();
    if (!orders.includes(orderId)) {
      orders.push(orderId);
      if (!fs.existsSync(path.dirname(processedOrdersPath))) {
        fs.mkdirSync(path.dirname(processedOrdersPath), { recursive: true });
      }
      fs.writeFileSync(processedOrdersPath, JSON.stringify(orders, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to write processed-orders.json', err);
  }
}

function deductInventoryFromCSV(items: any[]) {
  const csvPath = path.join(process.cwd(), 'Docs/Inventory.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('Inventory.csv not found, skipping deduction');
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split(/\r?\n/);
  if (lines.length < 3) return;

  const tshirts: { index: number; artwork: string; color: string; size: string; qty: number }[] = [];
  const totes: { index: number; artwork: string; color: string; size: string; qty: number }[] = [];
  const prints: { index: number; artwork: string; size: string; qty: number }[] = [];

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const parts = line.split(',');

    if (parts[0] && parts[0].trim()) {
      tshirts.push({
        index: i,
        artwork: parts[0].trim(),
        color: parts[2] ? parts[2].trim() : '',
        size: parts[3] ? parts[3].trim() : '',
        qty: parseInt(parts[4]) || 0
      });
    }
    if (parts[7] && parts[7].trim()) {
      totes.push({
        index: i,
        artwork: parts[7].trim(),
        color: parts[8] ? parts[8].trim() : '',
        size: parts[9] ? parts[9].trim() : '',
        qty: parseInt(parts[10]) || 0
      });
    }
    if (parts[13] && parts[13].trim()) {
      prints.push({
        index: i,
        artwork: parts[13].trim(),
        size: parts[14] ? parts[14].trim() : '',
        qty: parseInt(parts[15]) || 0
      });
    }
  }

  const tshirtNamesCsv = Array.from(new Set(tshirts.map(t => cleanName(t.artwork))));
  const toteNamesCsv = Array.from(new Set(totes.map(t => cleanName(t.artwork))));
  const printNamesCsv = Array.from(new Set(prints.map(p => cleanName(p.artwork))));

  const fuzzyMatch = (codeCleaned: string, csvCleanedNames: string[]): string | null => {
    if (csvCleanedNames.includes(codeCleaned)) return codeCleaned;
    const prefixMatch = csvCleanedNames.find(name => name.startsWith(codeCleaned) || codeCleaned.startsWith(name));
    if (prefixMatch) return prefixMatch;
    const includesMatch = csvCleanedNames.find(name => name.includes(codeCleaned) || codeCleaned.includes(name));
    if (includesMatch) return includesMatch;
    return null;
  };

  for (const item of items) {
    const qtyToDeduct = item.quantity || 1;
    const category = item.product?.category || item.category;
    if (category === 'Originals') continue;

    const cleanedCodeName = cleanName(item.product?.name || item.name || '');
    let matchedCsvName: string | null = null;

    if (category === 'T-shirts') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, tshirtNamesCsv);
      if (matchedCsvName) {
        const itemColor = normalizeColor(item.selectedColor || item.color || '');
        const itemSize = normalizeSize(item.selectedSize || item.size || '');

        const matchingRows = tshirts.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeColor(row.color) === itemColor && normalizeSize(row.size) === itemSize);
        let remainingDeduct = qtyToDeduct;
        for (const row of matchingRows) {
          if (remainingDeduct <= 0) break;
          const parts = lines[row.index].split(',');
          const currentQty = parseInt(parts[4]) || 0;
          const deducted = Math.min(currentQty, remainingDeduct);
          parts[4] = Math.max(0, currentQty - deducted).toString();
          lines[row.index] = parts.join(',');
          remainingDeduct -= deducted;
        }
      }
    } else if (category === 'Totes') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, toteNamesCsv);
      if (matchedCsvName) {
        const itemColor = normalizeColor(item.selectedColor || item.color || '');
        const itemSize = normalizeSize(item.selectedSize || item.size || '');

        const matchingRows = totes.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeColor(row.color) === itemColor && normalizeSize(row.size) === itemSize);
        let remainingDeduct = qtyToDeduct;
        for (const row of matchingRows) {
          if (remainingDeduct <= 0) break;
          const parts = lines[row.index].split(',');
          const currentQty = parseInt(parts[10]) || 0;
          const deducted = Math.min(currentQty, remainingDeduct);
          parts[10] = Math.max(0, currentQty - deducted).toString();
          lines[row.index] = parts.join(',');
          remainingDeduct -= deducted;
        }
      }
    } else if (category === 'Prints') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, printNamesCsv);
      if (matchedCsvName) {
        const itemSize = normalizeSize(item.selectedSize || item.size || '');

        const matchingRows = prints.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeSize(row.size) === itemSize);
        let remainingDeduct = qtyToDeduct;
        for (const row of matchingRows) {
          if (remainingDeduct <= 0) break;
          const parts = lines[row.index].split(',');
          const currentQty = parseInt(parts[15]) || 0;
          const deducted = Math.min(currentQty, remainingDeduct);
          parts[15] = Math.max(0, currentQty - deducted).toString();
          lines[row.index] = parts.join(',');
          remainingDeduct -= deducted;
        }
      }
    } else if (category === 'Postcards') {
      matchedCsvName = fuzzyMatch(cleanedCodeName, printNamesCsv);
      if (matchedCsvName) {
        const matchingRows = prints.filter(row => cleanName(row.artwork) === matchedCsvName && normalizeSize(row.size) === 'postcard');
        let remainingDeduct = qtyToDeduct;
        for (const row of matchingRows) {
          if (remainingDeduct <= 0) break;
          const parts = lines[row.index].split(',');
          const currentQty = parseInt(parts[15]) || 0;
          const deducted = Math.min(currentQty, remainingDeduct);
          parts[15] = Math.max(0, currentQty - deducted).toString();
          lines[row.index] = parts.join(',');
          remainingDeduct -= deducted;
        }
      }
    }
  }

  fs.writeFileSync(csvPath, lines.join('\n'), 'utf-8');
}

const BLOB_FILENAME = 'sold-originals.json';

/**
 * Returns the list of sold original painting names from Vercel Blob.
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
    console.error('[verify-session sold-originals] Failed to read blob:', err);
    return [];
  }
}

/**
 * Adds a painting name to the sold list, then re-uploads to Vercel Blob.
 */
async function markOriginalSold(paintingName: string): Promise<void> {
  try {
    const current = await getSoldOriginals();
    if (current.includes(paintingName)) {
      console.log(`[verify-session sold-originals] "${paintingName}" already marked as sold.`);
      return;
    }

    const updated = [...current, paintingName];
    const content = JSON.stringify(updated);

    await put(BLOB_FILENAME, content, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    console.log(`[verify-session sold-originals] Marked as sold: "${paintingName}". Total sold: ${updated.length}`);
  } catch (err) {
    console.error('[verify-session sold-originals] Failed to mark as sold:', err);
    throw err;
  }
}

export interface EmailItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  image?: string;
}

function generateOrderEmailHtml(data: {
  customerName: string;
  orderNumber: string;
  items: EmailItem[];
  region: string;
  shippingAddress?: string;
  total: number;
  currency?: string;
}) {
  const { customerName, orderNumber, items, region, shippingAddress, total, currency = 'USD' } = data;

  const itemRows = items.map(item => `
    <div style="display: flex; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(45, 31, 28, 0.1);">
      <div style="width: 64px; height: 64px; background: white; border-radius: 8px; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
        <img src="${item.image || ''}" alt="${item.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
      </div>
      <div style="flex: 1;">
        <h4 style="margin: 0; font-family: 'Times New Roman', serif; color: #2D1F1C;">${item.name}</h4>
        <p style="margin: 4px 0 0; font-size: 14px; color: rgba(45, 31, 28, 0.6);">
          ${[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(' | ')}
        </p>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; font-weight: 500; color: #2D1F1C;">$${item.price.toFixed(2)}</p>
        <p style="margin: 4px 0 0; font-size: 14px; color: rgba(45, 31, 28, 0.6);">Qty: ${item.quantity}</p>
      </div>
    </div>
  `).join('');

  const deliveryMessage = region === 'Cambodia' 
    ? "You will receive a personal message shortly to coordinate Grab delivery."
    : "Delivery begins in July. Thank you so much for your patience!";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for your order</title>
</head>
<body style="margin: 0; padding: 0; background-color: #E5DCCD; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D1F1C;">
  <div style="max-width: 600px; margin: 40px auto; padding: 40px 20px;">
    <div style="background-color: rgba(255, 255, 255, 0.5); border-radius: 32px; padding: 40px; border: 1px solid rgba(255, 255, 255, 0.4); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <h1 style="font-family: 'Times New Roman', serif; font-size: 32px; margin-bottom: 24px;">Thank you for supporting my art, ${customerName}</h1>
      
      <div style="background-color: rgba(119, 156, 145, 0.1); border-radius: 20px; padding: 24px; margin-bottom: 32px; border: 1px solid rgba(119, 156, 145, 0.2);">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 20px; color: #93312A; margin: 0 0 8px;">Delivery Information</h3>
        <p style="margin: 0; color: rgba(45, 31, 28, 0.8); line-height: 1.5;">${deliveryMessage}</p>
      </div>
 
      <div style="text-align: left; background-color: rgba(255, 255, 255, 0.6); border-radius: 20px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.6);">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 24px; margin: 0 0 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(45, 31, 28, 0.1);">Order Summary</h3>
        <p style="font-size: 14px; color: rgba(45, 31, 28, 0.6); margin-bottom: 20px;">Order #: ${orderNumber}</p>
        
        <div style="margin-bottom: 24px;">
          ${itemRows}
        </div>
 
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 2px solid rgba(45, 31, 28, 0.05);">
          <span style="font-size: 18px;">Total</span>
          <span style="font-size: 24px; font-weight: 600;">$${total.toFixed(2)} ${currency}</span>
        </div>
      </div>
 
      ${shippingAddress ? `
      <div style="text-align: left; margin-top: 32px; padding: 0 8px;">
        <h3 style="font-family: 'Times New Roman', serif; font-size: 18px; margin-bottom: 12px;">Shipping Address</h3>
        <p style="margin: 0; color: rgba(45, 31, 28, 0.7); line-height: 1.6; white-space: pre-line;">${shippingAddress}</p>
      </div>
      ` : ''}
 
      <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(45, 31, 28, 0.1);">
        <p style="font-size: 14px; color: rgba(45, 31, 28, 0.6); margin-bottom: 12px;">Follow the journey behind the art</p>
        <a href="https://instagram.com/rachagold.art" style="color: #2D1F1C; text-decoration: none; font-weight: 500;">@rachagold.art</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { session_id, token, region } = req.query;

  try {
    if (session_id) {
      // Validate Stripe Session
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: 'Stripe configuration error' });
      }

      const stripe = new Stripe(secretKey as string);
      
      const session = await stripe.checkout.sessions.retrieve(session_id as string, {
        expand: ['line_items', 'line_items.data.price.product']
      }) as any;

      if (!session || session.payment_status !== 'paid') {
        if (session.status !== 'complete') {
            return res.status(401).json({ error: 'Session not complete' });
        }
      }

      const items = session.line_items?.data.map((li: any) => {
        const product = li.price?.product || {};
        
        let selectedSize;
        let selectedColor;
        if (product.description) {
            const parts = product.description.split(' | ');
            parts.forEach((p: string) => {
                if (p.startsWith('Size: ')) selectedSize = p.replace('Size: ', '');
                if (p.startsWith('Color: ')) selectedColor = p.replace('Color: ', '');
            });
        }

        return {
          product: {
            name: product.name,
            image: product.images?.[0] || '',
          },
          quantity: li.quantity,
          unitPrice: (li.price?.unit_amount || 0) / 100,
          selectedSize,
          selectedColor,
        };
      }) || [];


      const orderRegion = region || session.metadata?.region || 'International';
      if (orderRegion === 'Cambodia') {
        const orderId = session.id;
        const processed = getProcessedOrders();
        if (!processed.includes(orderId)) {
          deductInventoryFromCSV(items);
          markOrderProcessed(orderId);
        }
      }

      return res.status(200).json({ items, region: orderRegion });
      
    } else if (token) {
      // Validate Cambodia HMAC Token
      const decoded = Buffer.from(token as string, 'base64').toString('utf-8');
      const { payload, signature } = JSON.parse(decoded);

      const hmac = crypto.createHmac('sha256', process.env.STRIPE_SECRET_KEY || 'default_secret');
      hmac.update(payload);
      const expectedSignature = hmac.digest('hex');

      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid token signature' });
      }

      const data = JSON.parse(payload);
      
      // Token expiration check (e.g., 2 hours)
      const isExpired = Date.now() - data.timestamp > 2 * 60 * 60 * 1000;
      if (isExpired) {
          return res.status(401).json({ error: 'Token expired' });
      }

      // Trigger Transactional Email for Cambodia (ABA Pay)
      // Note: This triggers on success page load. Without a DB, we can't easily prevent duplicates on refresh,
      // but it ensures the customer gets their receipt immediately after "completing" payment.
      if (data.email) {
          try {
              const emailHtml = generateOrderEmailHtml({
                  customerName: data.name || 'Valued Customer',
                  orderNumber: `CAM-${Math.floor(data.timestamp / 1000)}`,
                  items: data.items.map((item: any) => ({
                      name: item.name,
                      quantity: item.quantity,
                      price: item.price,
                      size: item.size || item.selectedSize,
                      color: item.color || item.selectedColor,
                      image: item.image,
                  })),
                  region: data.region || 'Cambodia',
                  total: data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
                  currency: 'USD',
              });

              await resend.emails.send({
                  from: 'Rachel Goldberg Art <thankyou@rachagold.art>',
                  to: data.email,
                  subject: `Thank you for your order! [#CAM-${Math.floor(data.timestamp / 1000)}]`,
                  html: emailHtml,
              });
              console.log(`Sent Cambodia transactional email to ${data.email}`);
          } catch (emailErr) {
              console.error('Failed to send Cambodia transactional email:', emailErr);
          }
      }

      // Format items to match CartItem structure for consistency
      const items = data.items.map((item: any) => ({
          product: {
              name: item.name,
              image: item.image || '',
              category: item.category,
          },
          quantity: item.quantity,
          unitPrice: item.price,
          selectedSize: item.size || item.selectedSize,
          selectedColor: item.color || item.selectedColor,
      }));

      // Mark any original artworks as sold so they are removed from both shops
      try {
        for (const item of data.items) {
          if (item.category === 'Originals' && item.name) {
            await markOriginalSold(item.name);
            console.log(`[ABA] Marked original artwork as sold: ${item.name}`);
          }
        }
      } catch (soldErr: any) {
        console.error(`[ABA] Error marking originals as sold: ${soldErr.message}`);
      }

      if (data.region === 'Cambodia') {
        const orderId = token as string;
        const processed = getProcessedOrders();
        if (!processed.includes(orderId)) {
          deductInventoryFromCSV(items);
          markOrderProcessed(orderId);
        }
      }

      return res.status(200).json({ items, region: data.region });
    }

    return res.status(400).json({ error: 'Missing session_id or token' });
  } catch (error: any) {
    console.error('Session Verification Error:', error.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
