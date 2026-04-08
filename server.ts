import dotenv from "dotenv";
import express from "express";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";

// Prefer local developer env file, but still allow a normal .env
dotenv.config({ path: ".env.local" });
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const PRIMARY_EMAIL = "rachagold.art@gmail.com";
const CC_EMAILS: string[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/contact", async (req, res) => {
    const { firstName, lastName, email, phone, subject, message, subscribe } = req.body;

    if (!firstName || !lastName || !email || !message) {
      res.status(400).json({ success: false, message: "Missing required fields." });
      return;
    }

    const emailPayload = {
      from: "Rachel Goldberg Art <onboarding@resend.dev>",
      subject: `[Contact] ${subject} — ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>Newsletter signup: ${subscribe ? "Yes" : "No"}</em></p>
      `,
      replyTo: email,
    };

    try {
      await resend.emails.send({ ...emailPayload, to: PRIMARY_EMAIL });
      for (const cc of CC_EMAILS) {
        resend.emails.send({ ...emailPayload, to: cc }).catch(() => {});
      }
      res.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      console.error("Failed to send contact email:", error);
      res.status(500).json({ success: false, message: "Failed to send message. Please try again." });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    const { email, name, phone, contactMethod, items, cartTotal } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: "Email is required." });
      return;
    }

    const orderItemsHtml =
      Array.isArray(items) && items.length > 0
        ? `
          <h3>Items</h3>
          <ul>
            ${items
              .map((i: any) => {
                const qty = i?.quantity ?? 1;
                const size = i?.size ? ` — Size: ${i.size}` : "";
                const color = i?.color ? ` — Color: ${i.color}` : "";
                const price = typeof i?.price === "number" ? ` — $${i.price.toFixed(2)}` : "";
                const itemName = String(i?.name ?? "Item");
                return `<li>${itemName} (x${qty})${size}${color}${price}</li>`;
              })
              .join("")}
          </ul>
        `
        : "";

    const emailPayload = {
      from: "Rachel Goldberg Art <onboarding@resend.dev>",
      subject: `[Waitlist] New signup — ${email}`,
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${contactMethod ? `<p><strong>Preferred contact:</strong> ${contactMethod}</p>` : ""}
        ${orderItemsHtml}
        ${typeof cartTotal === "number" ? `<p><strong>Cart total:</strong> $${cartTotal.toFixed(2)}</p>` : ""}
        <p>This person wants to be notified when shipping/reservations open and/or to confirm their preorder.</p>
      `,
    };

    try {
      await resend.emails.send({ ...emailPayload, to: PRIMARY_EMAIL });
      for (const cc of CC_EMAILS) {
        resend.emails.send({ ...emailPayload, to: cc }).catch(() => {});
      }
      res.json({ success: true, message: "You're on the list!" });
    } catch (error) {
      console.error("Failed to send waitlist email:", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
    }
  });

  // Stripe Checkout route
  app.post("/api/checkout", async (req, res) => {
    try {
      const { default: handler } = await import("./api/checkout.ts");
      await handler(req, res);
    } catch (error) {
      console.error("Checkout Handler Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
