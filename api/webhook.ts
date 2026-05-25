import Stripe from 'stripe';
import { Resend } from 'resend';
import { put } from '@vercel/blob';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

// We need to disable the default body parser for Stripe webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

const PRIMARY_EMAIL = 'jared@ottermaticsystems.com';
const CC_EMAILS = ['rachagold.art@gmail.com'];

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
    console.error('[webhook sold-originals] Failed to read blob:', err);
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
      console.log(`[webhook sold-originals] "${paintingName}" already marked as sold.`);
      return;
    }

    const updated = [...current, paintingName];
    const content = JSON.stringify(updated);

    await put(BLOB_FILENAME, content, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    console.log(`[webhook sold-originals] Marked as sold: "${paintingName}". Total sold: ${updated.length}`);
  } catch (err) {
    console.error('[webhook sold-originals] Failed to mark as sold:', err);
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

async function getRawBody(req: any): Promise<Buffer> {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).send('Webhook Error: Missing secret');
  }

  let event;

  try {
    const body = await getRawBody(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ALWAYS return 200 immediately to prevent Stripe from retrying.
  // Process the event asynchronously after acknowledging receipt.
  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // 1. Retrieve the session with expanded line items
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'line_items.data.price.product'],
    }) as any;

    // 2. DEDUPLICATION: Check if we already processed this session.
    //    If metadata contains 'email_sent', skip all email logic.
    if (expandedSession.metadata?.email_sent === 'true') {
      console.log(`[webhook] Already processed session ${session.id} — skipping to prevent duplicate emails.`);
      return res.json({ received: true });
    }

    const customerEmail = expandedSession.customer_details?.email;
    const customerName = expandedSession.customer_details?.name || 'Valued Customer';
    
    // 3. Format items for the email
    const items = expandedSession.line_items?.data.map((li: any) => {
      const product = li.price?.product || {};
      
      let size;
      let color;
      if (product.description) {
          const parts = product.description.split(' | ');
          parts.forEach((p: string) => {
              if (p.startsWith('Size: ')) size = p.replace('Size: ', '');
              if (p.startsWith('Color: ')) color = p.replace('Color: ', '');
          });
      }

      return {
        name: product.name,
        quantity: li.quantity || 1,
        price: (li.price?.unit_amount || 0) / 100,
        size,
        color,
        image: product.images?.[0] || '',
      };
    }) || [];

    // 4. Format shipping address
    const sd = expandedSession.shipping_details;
    const shippingAddress = sd ? [
      sd.name,
      sd.address?.line1,
      sd.address?.line2,
      `${sd.address?.city}${sd.address?.state ? `, ${sd.address.state}` : ''} ${sd.address?.postal_code}`,
      sd.address?.country
    ].filter(Boolean).join('\n') : undefined;

    // 5. Generate HTML
    const emailHtml = generateOrderEmailHtml({
      customerName,
      orderNumber: expandedSession.id.slice(-8).toUpperCase(),
      items,
      region: expandedSession.metadata?.region || 'International',
      shippingAddress,
      total: (expandedSession.amount_total || 0) / 100,
      currency: expandedSession.currency?.toUpperCase(),
    });

    // 6. Send Email to Customer
    if (customerEmail) {
      try {
        await resend.emails.send({
          from: 'Rachel Goldberg Art <thankyou@rachagold.art>',
          to: customerEmail,
          subject: `Thank you for your order! [#${expandedSession.id.slice(-8).toUpperCase()}]`,
          html: emailHtml,
        });
        console.log(`Sent transactional email to ${customerEmail} for session ${session.id}`);
      } catch (emailErr: any) {
        console.error(`Failed to send customer email: ${emailErr.message}`);
      }
    }

    // 7. Notify Merchant (wrapped in try/catch to prevent crashes)
    try {
      await resend.emails.send({
        from: 'Rachel Goldberg Art <thankyou@rachagold.art>',
        to: PRIMARY_EMAIL,
        cc: CC_EMAILS,
        subject: `[Payment Successful] Order #${expandedSession.id.slice(-8).toUpperCase()}`,
        html: `
          <h2>Payment Received!</h2>
          <p>A new order has been paid and confirmed.</p>
          <hr>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail || 'No email'})</p>
          <p><strong>Region:</strong> ${expandedSession.metadata?.region || 'International'}</p>
          <p><strong>Total:</strong> $${((expandedSession.amount_total || 0) / 100).toFixed(2)} ${expandedSession.currency?.toUpperCase()}</p>
          <hr>
          <h3>Shipping Address:</h3>
          <pre>${shippingAddress || 'N/A'}</pre>
          <hr>
          <h3>Order Details:</h3>
          <ul>
            ${items.map(i => `<li>${i.name} x ${i.quantity} (${i.size ? `Size: ${i.size}` : ''}${i.color ? `, Color: ${i.color}` : ''})</li>`).join('')}
          </ul>
        `,
      });
      console.log(`Sent merchant notification for session ${session.id}`);
    } catch (merchantErr: any) {
      console.error(`Failed to send merchant email: ${merchantErr.message}`);
    }

    // 8. Mark session as processed to prevent duplicate emails on retries
    try {
      await stripe.checkout.sessions.update(session.id, {
        metadata: { ...expandedSession.metadata, email_sent: 'true' },
      });
      console.log(`[webhook] Marked session ${session.id} as email_sent=true`);
    } catch (metaErr: any) {
      console.error(`[webhook] Failed to update session metadata: ${metaErr.message}`);
    }

    // 9. Mark any original artworks as sold
    try {
      for (const li of (expandedSession.line_items?.data || [])) {
        const product = (li as any).price?.product;
        const isOriginal = product?.metadata?.category === 'Originals';
        if (isOriginal && product?.name) {
          await markOriginalSold(product.name);
          console.log(`Marked original artwork as sold: ${product.name}`);
        }
      }
    } catch (soldErr: any) {
      console.error(`Error marking originals as sold: ${soldErr.message}`);
    }

  } catch (err: any) {
    console.error(`Error processing checkout session: ${err.message}`);
  }

  // Always return 200 to acknowledge receipt
  res.json({ received: true });
}
