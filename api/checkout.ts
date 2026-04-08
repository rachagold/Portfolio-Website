import Stripe from 'stripe';

export default async function handler(req: any, res: any) {
    // Only allow "POST" requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { items, region } = req.body;

    // 1. Validate environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        console.error('Missing STRIPE_SECRET_KEY');
        return res.status(500).json({ error: 'Stripe configuration error: Missing Secret Key' });
    }

    // 2. Initialize Stripe
    const stripe = new Stripe(secretKey);

    // 3. Determine Base URL (Stripe requires absolute URLs)
    // Preference: SITE_URL > VERCEL_URL > Request Host
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = process.env.SITE_URL 
        ? (process.env.SITE_URL.startsWith('http') ? process.env.SITE_URL : `https://${process.env.SITE_URL}`)
        : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://${host}`);

    try {
        // Currency Logic: Canada = CAD, Everything else = USD
        const currency = region === 'Canada' ? 'cad' : 'usd';

        // Formatting items for Stripe
        const line_items = items.map((item: any) => {
            // Ensure images are absolute URLs
            let imageUrls: string[] = [];
            if (item.image) {
                const img = item.image.startsWith('http') 
                    ? item.image 
                    : `${baseUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
                imageUrls.push(img);
            }

            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                        images: imageUrls,
                    },
                    unit_amount: Math.round((item.price || 0) * 100),
                },
                quantity: item.quantity || 1,
            };
        });

        // Create the Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${baseUrl}/success`,
            cancel_url: `${baseUrl}/`,
        });

        // Send the URL back (CartDrawer will handle redirect)
        return res.status(200).json({ id: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}