import Stripe from 'stripe';
import crypto from 'crypto';
import { Resend } from 'resend';
import { generateOrderEmailHtml } from './_utils/email-template';
import { markOriginalSold } from './_utils/sold-originals';

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
      });

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

      // Trigger Transactional Email for Stripe (US/Canada)
      // This ensures the customer gets their receipt immediately upon landing on the success page,
      // acting as a backup/synchronization with the webhook.
      const customerEmail = session.customer_details?.email;
      if (customerEmail) {
          try {
              const emailHtml = generateOrderEmailHtml({
                  customerName: session.customer_details?.name || 'Valued Customer',
                  orderNumber: session.id.slice(-8).toUpperCase(),
                  items: items.map((item: any) => ({
                      name: item.product.name,
                      quantity: item.quantity,
                      price: item.unitPrice,
                      size: item.selectedSize,
                      color: item.selectedColor,
                      image: item.product.image,
                  })),
                  region: region || (session.metadata?.region as string) || 'International',
                  total: (session.amount_total || 0) / 100,
                  currency: session.currency?.toUpperCase() || 'USD',
                  shippingAddress: session.shipping_details ? [
                      session.shipping_details.name,
                      session.shipping_details.address?.line1,
                      session.shipping_details.address?.line2,
                      `${session.shipping_details.address?.city}${session.shipping_details.address?.state ? `, ${session.shipping_details.address.state}` : ''} ${session.shipping_details.address?.postal_code}`,
                      session.shipping_details.address?.country
                  ].filter(Boolean).join('\n') : undefined,
              });

              await resend.emails.send({
                  from: 'Rachel Goldberg Art <onboarding@resend.dev>',
                  to: customerEmail,
                  subject: `Thank you for your order! [#${session.id.slice(-8).toUpperCase()}]`,
                  html: emailHtml,
              });
              console.log(`Sent Stripe transactional email to ${customerEmail}`);
          } catch (emailErr) {
              console.error('Failed to send Stripe transactional email:', emailErr);
          }
      }

      return res.status(200).json({ items, region: region || session.metadata?.region || 'International' });
      
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
                  from: 'Rachel Goldberg Art <onboarding@resend.dev>',
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

      return res.status(200).json({ items, region: data.region });
    }

    return res.status(400).json({ error: 'Missing session_id or token' });
  } catch (error: any) {
    console.error('Session Verification Error:', error.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
}
