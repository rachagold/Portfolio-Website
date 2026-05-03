import Stripe from 'stripe';
import { Resend } from 'resend';
import { generateOrderEmailHtml } from './_utils/email-template';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

// We need to disable the default body parser for Stripe webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable: any): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
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

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 1. Retrieve the session with expanded line items
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product'],
      });

      const customerEmail = expandedSession.customer_details?.email;
      const customerName = expandedSession.customer_details?.name || 'Valued Customer';
      
      if (customerEmail) {
        // 2. Format items for the email
        const items = expandedSession.line_items?.data.map((li: any) => {
          const product = li.price?.product || {};
          
          // Parse size/color from description if available
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

        // 3. Format shipping address
        const sd = expandedSession.shipping_details;
        const shippingAddress = sd ? [
          sd.name,
          sd.address?.line1,
          sd.address?.line2,
          `${sd.address?.city}${sd.address?.state ? `, ${sd.address.state}` : ''} ${sd.address?.postal_code}`,
          sd.address?.country
        ].filter(Boolean).join('\n') : undefined;

        // 4. Generate HTML
        const emailHtml = generateOrderEmailHtml({
          customerName,
          orderNumber: expandedSession.id.slice(-8).toUpperCase(), // Use last 8 chars as order number
          items,
          region: expandedSession.metadata?.region || 'International',
          shippingAddress,
          total: (expandedSession.amount_total || 0) / 100,
          currency: expandedSession.currency?.toUpperCase(),
        });

        // 5. Send Email
        await resend.emails.send({
          from: 'Rachel Goldberg Art <onboarding@resend.dev>',
          to: customerEmail,
          subject: `Thank you for your order! [#${expandedSession.id.slice(-8).toUpperCase()}]`,
          html: emailHtml,
        });

        console.log(`Sent transactional email to ${customerEmail} for session ${session.id}`);
      }
    } catch (err: any) {
      console.error(`Error processing checkout session: ${err.message}`);
      // We don't want to return 400 here because Stripe will retry, and the error might be with Resend or something else
      // but let's at least log it.
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
}
