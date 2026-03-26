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
  - `/src/lib/utils/stylePrompts.json` - AI style definitions (name, prompt suffix, negative prompt)
  - `/src/lib/utils/generationStorage.js` - Generation count tracking (50/month localStorage limit)
  - `/functions/api/` - Cloudflare Worker API functions
- **State**: Svelte stores for shared state
- **Design System**: See DESIGN_SYSTEM.md for all tokens and specs

## AI Image Generation
- **API**: Runware API (`https://api.runware.ai/v1`) via Cloudflare Workers (`functions/api/generate.js`)
- **Standard generation**: `taskType: 'imageInference'` with Flux Klein 9B (fast) or Flux.2 Dev (better)
- **Reference image generation**: Uses `model: 'runware:400@1'` (Flux.2 Dev) with `inputs: { referenceImages: [url] }` — preserves identity from uploaded photo
  - Requires `CFGScale: 3.5`, `scheduler: 'FlowMatchEulerDiscreteScheduler'`, `acceleration: 'high'`
  - Reference image must be uploaded first via `taskType: 'imageUpload'` to get a Runware URL
  - Do NOT use PhotoMaker, ACE++, or PuLID — they don't preserve identity reliably
- **Styles**: Defined in `stylePrompts.json` — each style appends to the user's prompt and adds negative prompts
- **Limit**: 50 generations/month per user (localStorage-based, reset via `localStorage.setItem('picflam_gen_count', '0')`)

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

## PWA & Manifest Configuration
- **Location**: `static/manifest.json`, `src/app.html`
- **Manifest requirements**:
  - `"display": "standalone"` (removes browser chrome)
  - `"scope": "/"` (proper PWA scope)
  - `"theme_color"` & `"background_color"`: both `#5422b0`
  - Icons: touch icon (192x192) + maskable icon (512x512) in `/logos/`
- **Meta tags** (in `app.html`):
  - `<meta name="theme-color" content="#5422b0" />`
  - `<meta name="robots" content="noindex, nofollow" />` (training app—prevents indexing)
  - OG tags use full URLs: `https://picflam.flamtools.com/...` (not `%sveltekit.assets%`)
  - Canonical URL: `https://picflam.flamtools.com`
- **Shared Navigation**: `static/flam-nav.js` Web Component (loaded in `app.html`)
