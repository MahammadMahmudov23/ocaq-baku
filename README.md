# OCAQ — Born of Fire

A premium marketing website for **OCAQ**, a live-fire Azerbaijani restaurant in Baku, the Land of Fire. Wood, ember, tandir and saj cooking — rendered in an obsidian-and-ember "Atəş" design language with cinematic, device-friendly animation.

> *Ocaq* (Azerbaijani): the hearth — the fire at the centre of the home, and the family gathered around it.

## Tech

- **HTML + CSS + vanilla JS** — static, no build step. Open `index.html` and it runs.
- **GSAP + ScrollTrigger** — scroll reveals, fire-edge wipes, the pinned "Into the Fire" sequence.
- **Lenis** — smooth momentum scrolling.
- **2D Canvas ember field** — the hero's rising sparks (deliberately lightweight, not WebGL, so it stays smooth on phones; falls back to a static field under `prefers-reduced-motion`).
- All libraries load from CDN.

## Pages

| File | What it is |
|------|-----------|
| `index.html` | Immersive home — hero ember field, the hearth story, the **Into the Fire** pinned flame sequence, signature dishes, the evening, reserve CTA |
| `menu.html` | Full menu by fire method (The Table / Embers / Tandir / Saj / Sweets / Wine), animated filter, AZN prices |
| `reservations.html` | Validated booking form → pre-filled WhatsApp message, hours, fire counter, private hearth, map placeholder |

## Run locally

Just open `index.html`. For CDN assets to behave exactly as in production, serve it:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## What to replace before launch

Search the HTML/JS for `REPLACE`:

1. **WhatsApp number** — `994000000000`
   - `js/reservations.js` line ~6 (`const waNumber = '994000000000';`)
   - every `https://wa.me/994000000000` link across the HTML files
2. **Phone** — `+994 00 000 00 00` / `tel:+994000000000`
3. **Street address** — `[Street Address]`
4. **Email** — `salam@ocaq.az`
5. **Social links** — the `href="#"` on Instagram / Facebook
6. **Map** — in `reservations.html`, swap the `.map-ph` block for a Google Maps `<iframe>`

## Adding real photos

Every photo slot is a `.ph` block with an `aria-label="IMAGE: …"` describing the shot. Replace it with:

```html
<img src="assets/your-photo.webp" alt="[description]" loading="lazy"
     style="width:100%;height:100%;object-fit:cover;">
```

Suggested sizes — hero/full-bleed 2400×1600, dish/story cards 1200×1500 (portrait), gallery 1000×750.

## Deploy (GitHub Pages)

```bash
git init && git add . && git commit -m "OCAQ"
gh repo create ocaq-baku --public --source=. --push
# Settings → Pages → Deploy from a branch → main → /root → Save
```

Live at `https://<username>.github.io/ocaq-baku/`.

---

All content is original. Photos are labelled placeholders — drop in real imagery before launch.
