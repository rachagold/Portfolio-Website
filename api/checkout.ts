import Stripe from 'stripe';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PRIMARY_EMAIL = 'jared@ottermaticsystems.com';
const CC_EMAILS = ['rachagold.art@gmail.com'];

// Deploy Trigger: Syncing new environment variables
export default async function handler(req: any, res: any) {
    // Only allow "POST" requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { items, region, location } = req.body;

    // 1. Validate environment variables
    const secretKey = process.env.STRIPE_SECRET_KEY;
    console.log('Secret key exists:', !!secretKey); // Add this line
    console.log('All env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
    if (!secretKey) {
        console.error('Missing STRIPE_SECRET_KEY');
        return res.status(500).json({ error: 'Stripe configuration error: Missing Secret Key' });
    }

    // 2. Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // 3. Determine Base URL (Stripe requires absolute URLs)
    // Preference: SITE_URL > VERCEL_URL > Request Host
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = process.env.SITE_URL
        ? (process.env.SITE_URL.startsWith('http') ? process.env.SITE_URL : `https://${process.env.SITE_URL}`)
        : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://${host}`);

    try {
        // Currency Logic: Canada = CAD, Everything else = USD
        // Note: location === 'CA' also implies CAD if we want consistency, 
        // but sticking to existing 'region' check to avoid breaking product price assumptions.
        const currency = (region === 'Canada' || location === 'CA') ? 'cad' : 'usd';

        // Formatting items for Stripe
        const line_items = items.map((item: any) => {
            // Ensure images are absolute URLs
            let imageUrls: string[] = [];
            if (item.image) {
                const img = item.image.startsWith('http')
                    ? item.image
                    : `${baseUrl}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
                imageUrls.push(encodeURI(img));
            }

            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                        description: [item.selectedSize && `Size: ${item.selectedSize}`, item.selectedColor && `Color: ${item.selectedColor}`].filter(Boolean).join(' | ') || undefined,
                        images: imageUrls,
                        // Include category so webhook can detect original artwork purchases
                        metadata: { category: item.category || '' },
                    },
                    unit_amount: Math.round((item.price || 0) * 100),
                },
                quantity: item.quantity || 1,
            };
        });

        // Calculate Delivery Fee (fixed rates for US/CA, with free override)
        let deliveryFee = 0;
        if (location === 'US' || location === 'CA') {
            const onlyEligibleItems = items.every((item: any) => 
                item.category === 'Postcards' || 
                (item.category === 'Prints' && item.selectedSize === 'A4')
            );
            const totalQty = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            
            if (!(onlyEligibleItems && totalQty <= 4)) {
                deliveryFee = location === 'CA' ? 12 : 6;
            }
        }

        // Define Shipping Options for Stripe
        const shipping_options: any[] = [];
        if (location === 'US' || location === 'CA') {
            shipping_options.push({
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: deliveryFee * 100, currency: currency },
                    display_name: 'Delivery',
                },
            });
            shipping_options.push({
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: currency },
                    display_name: 'Pick up - I will pick up directly from Rachel this summer!',
                },
            });
        }

        // Calculate discountable subtotal (exclude Original Paintings)
        const discountableSubtotal = items
            .filter((item: any) => item.category !== 'Originals')
            .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        // Create the Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            locale: 'auto',
            line_items,
            mode: 'payment',
            allow_promotion_codes: true,
            metadata: {
                discountable_subtotal: discountableSubtotal.toString(),
                region: region || 'International',
                location: location || 'Unknown',
                base_delivery_fee: deliveryFee.toString(),
            },
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&region=${region}`,
            cancel_url: `${baseUrl}/`,
            custom_text: {
                submit: {
                    message: "Discounts apply to merchandise only and exclude original artworks."
                }
            },
            shipping_address_collection: (location === 'US' || location === 'CA') ? {
                allowed_countries: ['US', 'CA'],
            } : undefined,
            shipping_options: shipping_options.length > 0 ? shipping_options : undefined,
            phone_number_collection: {
                enabled: true,
            },
            custom_fields: [
                {
                    key: 'contact_method',
                    label: {
                        type: 'custom',
                        custom: 'Preferred Contact Method',
                    },
                    type: 'dropdown',
                    dropdown: {
                        options: [
                            { label: 'WhatsApp', value: 'whatsapp' },
                            { label: 'Telegram', value: 'telegram' },
                            { label: 'iMessage', value: 'imessage' },
                        ],
                    },
                }
            ],
        });

        // Send the URL back (CartDrawer will handle redirect)
        const responseData = { id: session.id, url: session.url };

        // 4. Notify Merchant (Asynchronous, don't block the redirect)
        try {
            const itemSummary = items.map((item: any) => `${item.name} (Qty: ${item.quantity})`).join(', ');
            const emailPayload = {
                from: 'Rachel Goldberg Art <thankyou@rachagold.art>',
                to: PRIMARY_EMAIL,
                cc: CC_EMAILS,
                subject: `[Checkout Started] ${region || 'International'} — Pending Payment`,
                html: `
                    <h2>New Checkout Session Started</h2>
                    <p>A customer in <strong>${region || 'International'}</strong> has just started the checkout process.</p>
                    <hr>
                    <h3>Items in Cart:</h3>
                    <p>${itemSummary}</p>
                    <p><strong>Estimated Total: $${items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong></p>
                    <hr>
                    <p><em>You will receive another notification once payment is confirmed via Stripe.</em></p>
                    <p><small>Session ID: ${session.id}</small></p>
                `,
            };
            await resend.emails.send(emailPayload);
        } catch (emailErr) {
            console.error('Failed to send checkout started notification:', emailErr);
        }

        return res.status(200).json(responseData);
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}