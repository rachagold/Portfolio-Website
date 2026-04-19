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
    try {
      const { default: handler } = await import("./api/contact.ts");
      await handler(req, res);
    } catch (error) {
      console.error("Contact Handler Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const { default: handler } = await import("./api/waitlist.ts");
      await handler(req, res);
    } catch (error) {
      console.error("Waitlist Handler Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.post("/api/cambodia-checkout", async (req, res) => {
    try {
      const { default: handler } = await import("./api/cambodia-checkout.ts");
      await handler(req, res);
    } catch (error) {
      console.error("Cambodia Checkout Handler Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
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
