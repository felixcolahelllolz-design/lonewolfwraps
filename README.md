# Lone Wolf Wraps — Site + Shop

This bundle adds `/order.html` (Shop) and keeps Stripe pieces optional for later.

## What to upload
- `index.html` — includes a **Shop** link in the header nav.
- `order.html` — product grid with Payment Link placeholders.
- `/api/stripe-webhook.js` + `package.json` — for vendor PO emails (only needed once you enable Stripe).
- `sitemap.xml`, `robots.txt`
- `images/logo.png` (placeholder)

## Deploy
Upload all files to your GitHub repo root and commit to `main`. Vercel auto-redeploys. Visit `/order.html`.

## When you're ready for Stripe
1) Create Products/Prices + **Payment Links**, paste links into `order.html` buttons.
2) Set Price **lookup_key** values and update `PRICE_MAP` inside `/api/stripe-webhook.js`.
3) Add env vars in Vercel: `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `VENDOR_PO_EMAIL`.
4) Stripe Dashboard → Webhooks → add endpoint to `/api/stripe-webhook` (listen to `checkout.session.completed`).