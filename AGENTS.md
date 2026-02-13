# AI Guide (for coding assistants)

This file is machine-targeted context for safe, high-signal edits in this repository.

## Goal of the project

Weekend/date planner app for Southern Hungary with:
- localized content (`en`, `hu`)
- place + combo browsing
- filter and favorites UX
- optional distance calculation via Google Maps APIs

## Tech and runtime

- React 18 + Vite
- TypeScript (`.ts`, `.tsx`)
- SCSS (`.scss`) with shared tokens/mixins
- E2E tests with Playwright

## Core commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run test:e2e
```

## Architecture map

- App shell/state orchestration: `src/App.tsx`
- Shared types: `src/types/domain.ts`
- Content source of truth:
  - `src/data/places.ts`, `src/data/places.hu.ts`
  - `src/data/combos.ts`, `src/data/combos.hu.ts`
  - `src/data/config.ts`, `src/data/config.hu.ts`
  - `src/data/localizedData.ts`
- Contexts:
  - `src/context/LanguageContext.tsx`
  - `src/context/LocationContext.tsx`
- Services:
  - `src/services/locationService.ts`
  - `src/services/distanceService.ts`
- Styling:
  - `src/styles/App.scss`
  - `src/styles/LocationSettings.scss`
  - `src/styles/_tokens.scss`

## Conventions to preserve

1. Keep behavior stable unless explicitly asked.
2. Use existing domain types from `src/types/domain.ts` rather than re-defining shapes.
3. Prefer small focused edits over broad refactors.
4. Keep localization parity:
   - if adding user-facing text, update both languages where needed.
5. SCSS rules:
   - prefer tokens/mixins from `_tokens.scss`
   - avoid deep selector nesting (>3 levels)
6. Avoid introducing new dependencies unless necessary.

## Typical safe edit workflow

1. Read relevant file(s).
2. Edit minimally.
3. Run:
   - `npm run typecheck`
   - `npm run build`
4. If edit impacts critical flows, run `npm run test:e2e`.

## Known sensitive areas

- URL state syncing and filter state in `src/App.tsx`
- Google Maps loading/availability flow in `useGoogleMaps` + `LocationContext`
- Data IDs and coordinates in `src/data/*` (must remain valid)

## PR-quality checklist for AI edits

- TypeScript compile passes
- Build passes
- No broken imports due file extension mismatch
- No English/Hungarian text drift for changed labels
- Styling remains consistent with existing SCSS patterns
