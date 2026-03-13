import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PRIMARY_EMAIL = 'jared@ottermaticsystems.com';
const CC_EMAILS = ['rachagold.art@gmail.com'];

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { firstName, lastName, email, phone, subject, message, subscribe } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const emailPayload = {
    from: 'Rachel Goldberg Art <onboarding@resend.dev>',
    subject: `[Contact] ${subject} — ${firstName} ${lastName}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone / WhatsApp:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${String(message).replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Newsletter signup: ${subscribe ? 'Yes' : 'No'}</em></p>
    `,
    replyTo: email,
  };

  try {
    // Primary recipient — must succeed
    await resend.emails.send({ ...emailPayload, to: PRIMARY_EMAIL });

    // CC copies — best-effort, don't block on failure
    for (const cc of CC_EMAILS) {
      resend.emails.send({ ...emailPayload, to: cc }).catch(() => {});
    }

    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
}
