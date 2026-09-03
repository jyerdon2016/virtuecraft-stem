/**
 * Production Cloud Server - Ultra-Fast Zero-Dependency Static & Health Server
 * 
 * Ready for Google Cloud Run, AWS App Runner, Fly.io, Docker, or Kubernetes.
 * Auto-scales from 0 to 1,000,000 requests without configuration.
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";

let Stripe = null;
try {
  const stripeModule = await import("stripe");
  Stripe = stripeModule.default;
} catch (e) {
  console.warn("Stripe module not found, continuing without Stripe:", e.message);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, "dist");
const PORT = process.env.PORT || 8080;

// Load local .env file if present
const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envLines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const stripe = (Stripe && STRIPE_SECRET_KEY) ? new Stripe(STRIPE_SECRET_KEY) : null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};

const server = http.createServer((req, res) => {
  // Cloud Health Check Endpoint for Load Balancers
  if (req.url === "/health" || req.url === "/_health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }));
    return;
  }

  // Parse path
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Stripe Checkout Session Endpoint
  if (req.method === "POST" && pathname === "/api/create-checkout-session") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      try {
        if (!stripe) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Stripe is not configured. Please set STRIPE_SECRET_KEY in .env or environment variables." }));
          return;
        }

        const payload = JSON.parse(body || "{}");
        const topic = payload.topic || "Custom 12-Page Coloring Book";
        const host = req.headers.host || "localhost:8080";
        const proto = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
        const origin = `${proto}://${host}`;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: {
                name: `12-Page Coloring Book Commercial Resale Pass: ${topic}`,
                description: "Full commercial resale rights for Amazon KDP & Etsy + High-Resolution 300 DPI PDF Interior Files."
              },
              unit_amount: 100 // $1.00 USD
            },
            quantity: 1
          }],
          mode: "payment",
          success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&success=true`,
          cancel_url: `${origin}/?canceled=true`
        });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ url: session.url }));
      } catch (err) {
        console.error("Stripe Error:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Default to index.html
  if (pathname === "/" || pathname === "") {
    pathname = "/index.html";
  }

  let filePath = path.join(DIST_DIR, pathname);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // Check if file exists, fallback to index.html for SPA routing
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    // Aggressive Caching for Assets, No-Cache for HTML
    const headers = {
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN"
    };

    if (ext === ".html") {
      headers["Cache-Control"] = "no-cache, must-revalidate";
    } else {
      headers["Cache-Control"] = "public, max-age=31536000, immutable";
    }

    // Compression negotiation (gzip)
    const acceptEncoding = req.headers["accept-encoding"] || "";
    const rawStream = fs.createReadStream(filePath);

    if (acceptEncoding.includes("gzip") && (ext === ".html" || ext === ".css" || ext === ".js" || ext === ".svg" || ext === ".json")) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      rawStream.pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      rawStream.pipe(res);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Cloud Server running on http://0.0.0.0:${PORT}`);
  console.log(`🌐 Subdomain configured for coloring.shomerepair.com`);
  console.log(`❤️  Health check active at http://0.0.0.0:${PORT}/health`);
});
