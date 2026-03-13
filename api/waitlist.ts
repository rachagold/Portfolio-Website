import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PRIMARY_EMAIL = 'jared@ottermaticsystems.com';
const CC_EMAILS = ['rachagold.art@gmail.com'];

interface PreorderItem {
  name: string;
  quantity: number;
  size: string | null;
  color: string | null;
  price: number;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, phone, contactMethod, items, cartTotal } = req.body;
  const contactLabel = contactMethod === 'phone' ? 'Phone' : 'WhatsApp';

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: 'Name, email, and phone are required.' });
  }

  const itemRows = items && items.length > 0
    ? (items as PreorderItem[]).map((item: PreorderItem) => {
        const details = [
          item.size && `Size: ${item.size}`,
          item.color && `Color: ${item.color}`,
        ].filter(Boolean).join(', ');
        return `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${details || '—'}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${item.price.toFixed(2)}</td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="4" style="padding:8px">No items specified</td></tr>';

  const emailPayload = {
    from: 'Rachel Goldberg Art <onboarding@resend.dev>',
    subject: `[Preorder] ${name} — International Order`,
    replyTo: email,
    html: `
      <h2>New International Preorder</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>${contactLabel}:</strong> ${phone}</p>
      <hr>
      <h3>Items</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f5f0e8">
            <th style="padding:8px;text-align:left">Product</th>
            <th style="padding:8px;text-align:left">Options</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      ${cartTotal ? `<p style="margin-top:16px;font-size:18px"><strong>Subtotal: $${cartTotal.toFixed(2)}</strong></p>` : ''}
      <hr>
      <p><em>This is a preorder — no payment has been collected. Reach out to confirm the order and arrange shipping.</em></p>
    `,
  };

  try {
    // Primary recipient — must succeed
    await resend.emails.send({ ...emailPayload, to: PRIMARY_EMAIL });

    // CC copies — best-effort, don't block on failure
    for (const cc of CC_EMAILS) {
      resend.emails.send({ ...emailPayload, to: cc }).catch(() => {});
    }

    return res.json({ success: true, message: 'Preorder submitted!' });
  } catch (error) {
    console.error('Failed to send preorder email:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
}
