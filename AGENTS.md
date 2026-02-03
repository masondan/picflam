# picflam - Agents Guide

## Commands
- **Dev server**: `npm run dev` (Vite dev server on port 5173)
- **Build**: `npm run build` (production build to `dist/`)
- **Preview**: `npm run preview` (preview production build)
- **Check**: `npm run check` (Svelte type checking)
- **No tests configured**: This project has no test suite

## Architecture
- **Stack**: SvelteKit 2 + Svelte 5 + Vite 6, JavaScript (no TypeScript)
- **Adapter**: @sveltejs/adapter-static (SPA mode with fallback)
- **Structure**: Single-page app with three tabs (Crop, AI, Design)
  - `/src/lib/components/ui/` - Reusable UI components
  - `/src/lib/components/layout/` - Header, layout components
  - `/src/lib/components/crop/` - Crop tab components
  - `/src/lib/components/ai/` - AI tab components
  - `/src/lib/components/design/` - Design tab components
  - `/src/lib/stores/` - Svelte stores (appStore.js, etc.)
  - `/src/lib/utils/` - Utility functions
  - `/src/lib/styles/` - CSS (tokens.css, global.css)
  - `/src/routes/` - SvelteKit routes (+page.svelte, +layout.svelte)
  - `/static/` - Static assets (icons, logos, manifest)
- **State**: Svelte stores for shared state
- **Design System**: See DESIGN_SYSTEM.md for all tokens and specs

## Code Style
- **Language**: JavaScript (ES modules), Svelte components
- **Imports**: Svelte imports first, then $lib imports, then relative
- **Components**: Svelte 5 syntax with props via `export let`
- **Naming**: PascalCase for components, camelCase for functions/variables
- **CSS**: Use CSS custom properties from tokens.css (never hardcode colors/spacing)
- **No comments**: Code should be self-explanatory

## Key Files
- **DESIGN_SYSTEM.md**: Single source of truth for styling
- **ANALYSIS.md**: Design system analysis from Flam apps
- **tokens.css**: CSS custom properties
