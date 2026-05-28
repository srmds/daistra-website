# ML lifecycle diagrams (static)

Self-contained HTML assets synced from the governance platform repo:

`ai-governance-platform/docs/framework/diagrams/`

| File | Purpose |
|------|---------|
| `ml-lifecycle-e2e-poster.html` | Interactive E2E lifecycle poster (DAPS intake, block drill-down) |
| `ml-lifecycle-mental-model.html` | Executive one-page mental model |
| `ml-lifecycle-executive-layers.html` | Executive layered stack (print-friendly) |

`ml-lifecycle-e2e-data.js` in the source repo is **not** used at runtime (block data is inlined in the poster HTML).

## URLs

SvelteKit serves everything under `static/` at the site root. No SPA routes or nav links are required.

| Page | Path |
|------|------|
| Interactive poster | `/lifecycle/ml-lifecycle-e2e-poster.html` |
| Mental model | `/lifecycle/ml-lifecycle-mental-model.html` |
| Executive layers | `/lifecycle/ml-lifecycle-executive-layers.html` |

Cross-links between pages use sibling filenames and work as-is in this folder.

### Local development

```bash
npm run dev
```

Default Vite port is **5173**:

- http://localhost:5173/lifecycle/ml-lifecycle-e2e-poster.html
- http://localhost:5173/lifecycle/ml-lifecycle-mental-model.html
- http://localhost:5173/lifecycle/ml-lifecycle-executive-layers.html

Production preview (`npm run preview`, port **4173**):

- http://localhost:4173/lifecycle/ml-lifecycle-e2e-poster.html
- http://localhost:4173/lifecycle/ml-lifecycle-mental-model.html
- http://localhost:4173/lifecycle/ml-lifecycle-executive-layers.html

### Production

After `npm run build` and deploy (Cloudflare Pages via `npm run pages:deploy`):

- https://daistra.com/lifecycle/ml-lifecycle-e2e-poster.html
- https://daistra.com/lifecycle/ml-lifecycle-mental-model.html
- https://daistra.com/lifecycle/ml-lifecycle-executive-layers.html
- https://daistra.nl/lifecycle/ml-lifecycle-e2e-poster.html (same paths on `.nl`)

These are deep-link URLs only; they are intentionally omitted from the main site navigation.

## Sync from source

```bash
SRC=../ai-governance-platform/docs/framework/diagrams
cp "$SRC/ml-lifecycle-e2e-poster.html" "$SRC/ml-lifecycle-mental-model.html" "$SRC/ml-lifecycle-executive-layers.html" static/lifecycle/
cp -R "$SRC/assets" static/lifecycle/
```

Hero logos use `static/lifecycle/assets/daistra-logo-full.png` (copied from `daistra-website/static/images/` or the governance `diagrams/assets/` folder).

Verify cross-links after copy:

- Poster → `ml-lifecycle-mental-model.html`
- Mental model → `ml-lifecycle-e2e-poster.html`

## Homepage raster image

The main page (Operations / MLOps section) uses a PNG export of `ml-lifecycle-executive-layers.html`:

| Asset | Path |
|-------|------|
| PNG (2200×1768 @2x) | `static/images/lifecycle/ml-lifecycle-executive-layers.png` |

After syncing HTML from source, regenerate the marketing image:

```bash
npm run lifecycle:screenshot
```

This runs `scripts/lifecycle-screenshot.mjs` (Playwright + Chromium). Requires `npm install` in this repo first. The script clips `article.canvas` at 1200px viewport width and 2× device scale.

Interactive HTML under `static/lifecycle/` is unchanged and remains the click-through target from the homepage figure.
