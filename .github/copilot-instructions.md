# GitHub Copilot Instructions

This file provides guidance for GitHub Copilot when working with this repository.

## Project Overview

Weekend Escape is a weekend and date-planning app for exploring 95+ places and 35+ curated plans across Southern Hungary. It features:

- Place discovery with filters (mood, distance, duration)
- Ready-made combos (day trips + weekend plans)
- Favorites with URL-persisted filter state
- Optional Google Maps-based distance calculation from user location
- English/Hungarian bilingual localization

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: SCSS with shared tokens and mixins
- **Testing**: Playwright for E2E tests
- **State Management**: React Context (LanguageContext, LocationContext)
- **Localization**: Custom i18n implementation with messages in `src/i18n/messages.ts`

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (includes data generation)
npm run dev

# Type checking
npm run typecheck

# Build for production (includes typecheck and data generation)
npm run build

# Preview production build
npm run preview

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# First-time Playwright setup
npx playwright install
```

## Project Structure

- `src/components/` - UI components
- `src/context/` - App state providers (LanguageContext, LocationContext)
- `src/data/` - Static localized content (places, combos, config) in both English and Hungarian
- `src/hooks/` - Reusable React hooks (e.g., useGoogleMaps)
- `src/i18n/` - Translation messages and translator function
- `src/services/` - External/browser service integrations (location, distance calculation)
- `src/styles/` - SCSS styles with shared tokens in `_tokens.scss`
- `src/types/` - Domain and app-wide TypeScript types
- `src/utils/` - Shared helper functions

## Key Files

- **App shell**: `src/App.tsx` - Main orchestration and state management
- **Domain types**: `src/types/domain.ts` - Shared types (Place, Combo, etc.)
- **Content files**:
  - `src/data/places.ts` and `src/data/places.hu.ts`
  - `src/data/combos.ts` and `src/data/combos.hu.ts`
  - `src/data/config.ts` and `src/data/config.hu.ts`
- **Styling tokens**: `src/styles/_tokens.scss`

## Coding Conventions

### General Principles

1. **Minimal changes**: Make surgical, focused edits rather than broad refactors
2. **Type safety**: Use existing domain types from `src/types/domain.ts` instead of redefining
3. **Stability**: Keep behavior stable unless explicitly asked to change it

### Localization

- **ALWAYS maintain English/Hungarian parity**: When adding or modifying user-facing text, update both languages
- All translations are in `src/i18n/messages.ts`
- Access translations using the `t()` function from the translator
- Content files exist in pairs: `*.ts` (English) and `*.hu.ts` (Hungarian)

### SCSS Conventions

- Use tokens and mixins from `src/styles/_tokens.scss` before introducing new raw values
- Avoid deep selector nesting (max 3 levels)
- Keep styling consistent with existing patterns
- Respect `prefers-reduced-motion` for accessibility

### TypeScript

- Strict mode is disabled in `tsconfig.json`
- Always run `npm run typecheck` before committing
- Avoid importing with `.tsx` or `.ts` extensions - imports should be extensionless

### Data Files

- Keep IDs unique across all places and combos
- Include required fields for places: `id`, `name`, `loc`, `cat`, `vibes`, `lat`, `lng`, `maps`, `duration`, `emoji`
- Coordinates (`lat`, `lng`) are required for distance calculations

## Testing Guidelines

1. Run `npm run typecheck` to verify TypeScript
2. Run `npm run build` to ensure production build works
3. For changes affecting critical flows, run `npm run test:e2e`
4. E2E tests are in the `tests/` directory using Playwright

## Sensitive Areas (Extra Care Required)

- **URL state syncing**: Changes to filter state and URL parameters in `src/App.tsx`
- **Google Maps integration**: Loading and availability flow in `useGoogleMaps` hook and `LocationContext`
- **Data integrity**: IDs and coordinates in `src/data/*` files must remain valid
- **First visit detection**: Logic in `LocationContext` using localStorage
- **Theme animations**: Ensure `prefers-reduced-motion` is respected

## Environment Variables

- `VITE_GOOGLE_MAPS_API_KEY`: Optional, required for distance-from-location features
- Create `.env.local` for local development
- App works without this key for static browsing/filtering

## Common Pitfalls

1. **Forgetting bilingual updates**: Always update both English and Hungarian when changing UI text
2. **Breaking imports**: Don't use `.ts`/`.tsx` extensions in import statements
3. **Deep SCSS nesting**: Keep selectors shallow (≤3 levels)
4. **Missing data generation**: `npm run dev` and `npm run build` automatically run `data:generate` script
5. **Assuming Google Maps availability**: Code should gracefully handle missing API key

## Dependencies

- Avoid adding new dependencies unless absolutely necessary
- Use existing libraries from `package.json` (React, Bootstrap, etc.)
- Check security advisories before adding packages

## Deployment

- GitHub Pages deployment: `npm run deploy`
- Update `base` path in `vite.config.ts` to match repo name
- Builds to `dist/` directory

## Additional Context

For more detailed machine-targeted context, see `AGENTS.md` in the repository root.
