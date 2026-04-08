import Stripe from 'stripe';

// This uses the Secret Key from your .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: any, res: any) {
    // Only allow "POST" requests (sending data)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { items, region } = req.body;

        // Currency Logic: Canada = CAD, Everything else = USD
        const currency = region === 'Canada' ? 'cad' : 'usd';

        // Formatting the items for Stripe
        const line_items = items.map((item: any) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100), // Stripe uses cents ($1.00 = 100)
            },
            quantity: item.quantity,
        }));

        // Create the Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            // Where the user goes after paying
            success_url: `${process.env.SITE_URL}/success`,
            cancel_url: `${process.env.SITE_URL}/`,
        });

        // Send the Session ID back to your CartDrawer
        res.status(200).json({ id: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
}