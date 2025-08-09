# Lone Wolf Wraps — Static Site

This is a single-page static site ready to deploy on Vercel/Netlify/Cloudflare.

## Structure
- `index.html` — the whole site
- `images/logo.png` — header + favicon (replace with your own if needed)
- `robots.txt` — allows crawling + lists sitemap
- `sitemap.xml` — lists key sections for SEO

## Deploy (Vercel)
1. Create a new GitHub repo and add these files.
2. Go to https://vercel.com/new → Import your repo.
3. Framework preset: **Other** (static).
4. Deploy → you'll get a URL like `https://lonewolfwraps.vercel.app`.

### Deploy (Netlify)
- Drag-and-drop this folder onto https://app.netlify.com/drop

### Deploy (Cloudflare Pages)
- Connect Git → pick repo → Deploy.

## After deploy
- Tell your actual URL to your assistant so the canonical tag + schema + sitemap can be updated to your domain.
- In `index.html`, update:
  - `<link rel="canonical" href="...">`
  - `og:url` and `og:image` (if you host the image)
  - JSON-LD `@id`, `url`, `image`, `logo` fields

## Calendly
- Already embedded with: https://calendly.com/felixcolahelllolz/30min

## Contact (Mark Helgeson)
- Phone: (803) 873-4617
- Email: mark.helgeson@yahoo.com
- Address: 4 Dupre Court, Irmo, SC 29063
