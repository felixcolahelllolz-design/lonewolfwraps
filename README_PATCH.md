# Quick patch: logo path + Shop link

**What changed**
- Updated all `/images/logo.png` references to `/logo.png` in `index.html`.
- Inserted a **Shop** link pointing to `/order.html` in the header `<nav>`.
- `order.html` header also uses `/logo.png` and is ready to go.

**How to apply**
1. Download this ZIP and upload `index.html` and `order.html` to your GitHub repo root (replace existing files).
2. Commit to `main` — Vercel redeploys automatically (~30–60s).
3. Test:
   - Header logo shows (no broken image).
   - Header has a **Shop** link; `/order.html` loads.
   - Calendly + Formspree keep working.
