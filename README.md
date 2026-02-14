# 🌹 Weekend Escape

Weekend and date-planning app for exploring 95+ places and 35 curated plans across Southern Hungary.

## What’s in this app

- Place discovery with filters (mood, distance, duration)
- Ready-made combos (day trips + weekend plans)
- Favorites + URL-persisted filter state
- Optional Google Maps-based distance calculation from user location
- English/Hungarian localization
- TypeScript + SCSS codebase

## Developer setup

### Prerequisites

- Node.js 20.19+ (or 22.12+)
- npm 9+

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open http://localhost:5173

### Build (includes typecheck)

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Environment variables

Google Maps is optional, but required for distance-from-location features.

Create `.env.local`:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

If this key is missing, the app still works for static browsing/filtering but location distance features will show related errors.

## Deploy to GitHub Pages

1. Update base path in [vite.config.ts](vite.config.ts) to match your repo name:

```ts
base: '/planner/'
```

2. Deploy:

```bash
npm run deploy
```

This builds and publishes `dist` to the `gh-pages` branch.

## Project structure

```text
src/
  components/         # UI components
  context/            # App state providers (language, location)
  data/               # Static localized content + filter config
  hooks/              # Reusable React hooks (Google Maps loader)
  i18n/               # Translation messages + translator
  services/           # External/browser service integrations
  styles/             # SCSS styles + tokens
  types/              # Domain and app-wide TypeScript types
  utils/              # Shared helper functions
```

## Editing content

Primary content files:

- [src/data/places.ts](src/data/places.ts)
- [src/data/places.hu.ts](src/data/places.hu.ts)
- [src/data/combos.ts](src/data/combos.ts)
- [src/data/combos.hu.ts](src/data/combos.hu.ts)
- [src/data/config.ts](src/data/config.ts)
- [src/data/config.hu.ts](src/data/config.hu.ts)

When adding a place, keep IDs unique and include:

- `id`, `name`, `loc`, `cat`, `vibes`
- `lat`, `lng` (required for distance calculations)
- `maps`, `duration`, `emoji`

## Styling notes

- SCSS entry files:
  - [src/styles/App.scss](src/styles/App.scss)
  - [src/styles/LocationSettings.scss](src/styles/LocationSettings.scss)
- Shared tokens + mixins:
  - [src/styles/_tokens.scss](src/styles/_tokens.scss)

Use mixins/tokens first before introducing new raw style values.

## QA checks

Recommended before PR/merge:

```bash
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e:ui
```

First-time Playwright run:

```bash
npx playwright install
```

## Documentation for AI/code agents

For machine-targeted context, conventions, and safe edit workflow, see [AGENTS.md](AGENTS.md).

