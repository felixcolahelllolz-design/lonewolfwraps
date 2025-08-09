// /api/stripe-webhook.js — Vercel serverless function
// Validates Stripe webhook and emails a purchase order to your vendor via Resend.
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: "2024-06-20" });

export const config = { api: { bodyParser: false } };

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

// Map Stripe Price lookup keys -> vendor SKU
const PRICE_MAP = {
  "LOOKUP_INOZETEK_MP_5x25": { vendorSku: "VENDOR-INO-MP-525", name: "Inozetek Midnight Purple — 5x25" },
  "LOOKUP_3M_2080_SatinBlack": { vendorSku: "VENDOR-3M-2080-S12", name: "3M 2080 Satin Black — 5x25" },
  "LOOKUP_AVERY_GlossRed": { vendorSku: "VENDOR-AVERY-RED-525", name: "Avery Gloss Red — 5x25" },
  "LOOKUP_PPF_Front_Kit": { vendorSku: "VENDOR-PPF-FRONT-KIT", name: "PPF Front Kit" }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object;
    const items = await stripe.checkout.sessions.listLineItems(s.id, { expand: ["data.price.product"] });
    const poItems = items.data.map(it => {
      const price = it.price || {};
      const key = price.lookup_key || price.id;
      const mapped = PRICE_MAP[key] || { vendorSku: price.id || "UNKNOWN", name: it.description || "Item" };
      return { vendorSku: mapped.vendorSku, name: mapped.name, qty: it.quantity || 1 };
    });

    const shipping = s.shipping_details || {};
    const customer = s.customer_details || {};

    const html = `
      <h2>New Purchase Order</h2>
      <p><strong>Stripe Session:</strong> ${s.id}</p>
      <h3>Ship To</h3>
      <pre>${shipping.name || ""}
${shipping.address?.line1 || ""}
${shipping.address?.line2 || ""}
${shipping.address?.city || ""}, ${shipping.address?.state || ""} ${shipping.address?.postal_code || ""}
${shipping.address?.country || ""}</pre>
      <h3>Items</h3>
      <ul>${poItems.map(i => `<li>${i.vendorSku} — ${i.name} × ${i.qty}</li>`).join("")}</ul>
      <h3>Customer</h3>
      <p>${customer.email || ""}</p>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "orders@lonewolfwraps.com",
        to: process.env.VENDOR_PO_EMAIL,
        cc: ["mark.helgeson@yahoo.com"],
        subject: `PO for order ${s.id}`,
        html
      })
    }).catch(err => console.error("Resend error", err));
  }

  return res.json({ received: true });
}
