# 🚀 Quick Start Guide

## 1) Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## 2) Optional: enable location distance features

Create `.env.local`:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Without this key, browsing and filters still work, but map distance calculations will be unavailable.

## 3) Build and verify

```bash
npm run build
```

Build runs TypeScript checks and outputs production files in `dist`.

## 4) Deploy to GitHub Pages

1. Ensure base path in [vite.config.ts](vite.config.ts) matches your repo name.
2. Run:

```bash
npm run deploy
```

## Daily workflow

1. Edit source/content files.
2. Test locally with `npm run dev`.
3. Validate with `npm run build`.
4. Push changes and deploy.

## High-value files to edit

- Places data: [src/data/places.ts](src/data/places.ts), [src/data/places.hu.ts](src/data/places.hu.ts)
- Combo plans: [src/data/combos.ts](src/data/combos.ts), [src/data/combos.hu.ts](src/data/combos.hu.ts)
- Filter config: [src/data/config.ts](src/data/config.ts), [src/data/config.hu.ts](src/data/config.hu.ts)
- Styles: [src/styles/App.scss](src/styles/App.scss), [src/styles/LocationSettings.scss](src/styles/LocationSettings.scss)

## Troubleshooting

- 404 after deploy: check `base` in [vite.config.ts](vite.config.ts)
- Type errors on build: run `npm run typecheck` and fix reported file
- Style issues: run formatter (`npx prettier --write "src/styles/**/*.scss"`)

