# PicFlam v2 - Comprehensive Build Plan

---

## ⚠️ PREREQUISITE: Read Both Documents

**Agents and collaborators MUST read these in order before beginning any phase:**

1. **DESIGN_SYSTEM.md** — Single source of truth for all styling
   - Color tokens (UI and design canvas)
   - Typography scale and font families
   - Spacing system and layout constants
   - Component specifications (buttons, sliders, modals, etc.)
   - This is shared across all Flam apps for consistency

2. **picflam-v2.md** (this document) — Project roadmap and implementation plan
   - Phases 0–7 with deliverables and gates
   - Technical decisions and architecture
   - UI/UX behavior and state management
   - Links to visuals and technical requirements

**Without both documents, you will lack critical context for color values, spacing, component patterns, and design consistency.**

---

**Version**: 2.0 (SvelteKit Rebuild)  
**Target**: Educational tool for journalists in Africa  
**Mobile-First**: Designed for offline capability on older devices  
**Desktop Constraint**: 480px max width (mobile feel on desktop)

---

## Progress Tracker

| Phase | Status | Notes |
|-------|--------|-------|
| 0.1 Design System Analysis | ✅ Complete | See ANALYSIS.md |
| 0.2 Design System Documentation | ✅ Complete | See DESIGN_SYSTEM.md |
| 0.3 SvelteKit Template | ✅ Complete | Branch: v2-sveltekit |
| 1: Architecture | ✅ Complete | Stores, tabs, utils |
| 2: UI Components | ✅ Complete | Buttons, sliders, modals, drawers |
| 3: Crop Tab | ✅ Complete | Full implementation with all features |
| 4: AI Tab | ✅ Complete | Enhance, Upscale, Background Removal working; CodeFormer integrated |
| 5: Design Tab | ⏳ Pending | |
| 6: Polish & Test | ⏳ Pending | |
| 7: Deployment | ⏳ Pending | |

**Brand Color Decision**: Using `#5422b0` consistently (unified across all Flam apps)

---

## Phase 3 Completion Summary

### Implemented Features

**Crop Sub-tab:**
- Image import via file picker, drag-and-drop, or clipboard paste
- Interactive crop box with corner/edge handles and drag-to-move
- Aspect ratio presets (Custom, 9:16, 1:1, 16:9) with ratio locking
- Manual dimension input with constraint preservation
- Flip horizontal and rotate 90° operations
- Scale slider for canvas zoom
- Apply crop confirmation workflow

**Edit Sub-tab:**
- Brightness, Shadows, Contrast, HDR adjustments with unified slider
- Row-based enhancement selection with reset button
- Blur brush with configurable settings:
  - Brush size, Strength, Soften edges controls
  - Invert mode (blur everything except painted area)
  - Zoom and nudge controls for precision
  - Live brush preview when adjusting brush size
- All edits tracked in undo/redo history

**Filter Sub-tab:**
- Filter grid with live previews (Original, Greyscale, Sepia, Sunset, Azure, Teal)
- Strength slider to adjust filter intensity (0-100%)
- Reset button to return to original
- Disabled state for slider when Original selected

**Core Infrastructure:**
- History-based undo/redo system with reactive state
- Silent updates for smooth slider interaction (commits on release)
- Export renders final image with all effects baked in (edits, filters, blur)
- Copy to clipboard with full effects applied
- Crop pending modal workflow for unsaved changes

### Technical Decisions
- CSS filters for real-time preview (brightness, contrast, etc.)
- Canvas-based blur mask rendering with radial gradients for soft edges
- Blur strength range: 0.5px (min) to 10px (max) for gentle effect
- `renderFinalImage()` utility bakes all effects for export

---

## Executive Summary

Complete rebuild of PicFlam as a SvelteKit application incorporating:
- **Image cropping, editing, filtering** (Crop tab)
- **AI-powered enhancement, upscaling, background removal** (AI tab)
- **Design canvas with typography, overlays, quoted text** (Design tab)

All three tabs share a unified design system derived from AudioFlam + preserved design assets from v1.

**Total estimated timeline**: 13-17 days (with user testing gates between phases)

---

## CRITICAL: Before Each Phase

**AI Agents MUST:**
1. Read the entire previous phase deliverables
2. Review all referenced visuals in `info/visuals/`
3. Understand the design system (colors, typography, spacing)
4. Ask clarifying questions if anything is unclear
5. **PAUSE after each phase for user testing** before proceeding

**User will:**
- Test locally in browser
- Verify design system matches v2guide.md mockups
- Test mobile responsiveness and offline capability
- Sign off or request changes before next phase starts

---

## Phase 0: Design System Foundation (2-3 days)

### ⚠️ GATE: Must complete BEFORE any coding

This phase establishes the single source of truth for styling across v2 and future Flam apps.

### 0.1 Design System Analysis (1 day)

**Agent Task**: Analyze AudioFlam + extract v1 assets

**Study these repositories** (in this order):
1. `https://github.com/masondan/audioflam` (UI pattern reference—most consistent design)
2. `https://github.com/masondan/chartflam`
3. `https://github.com/masondan/mapflam`
4. `https://github.com/masondan/PromptFlam`

**Extract from AudioFlam:**
- Color palette (UI buttons, backgrounds, borders, text)
- Button styles (size, padding, border-radius, hover states)
- Form controls (inputs, sliders, dropdowns)
- Layout patterns (header height, spacing, drawer behaviors)
- Typography (body font, sizes, weights for UI elements)
- Icon integration (size, color, spacing)
- State indicators (loading, active, disabled, error)

**Extract from v1 (existing picflam repo):**
- Design canvas color palette:
  - Solid colors: `#FFFFFF`, `#000000`, `#007C1F`, `#00679D`, `#B20715`
  - Gradients: 6 predefined + custom builder (see `src/components/ColorDrawer.jsx`)
  - Highlight color (yellow `#FFD700`)
- Typography for design canvas:
  - Body fonts: Inter, Roboto Slab, Saira Condensed, Lora, Playfair Display, Special Elite
  - Quote fonts: Playfair Display (serif), Alfa Slab One (slab), Saira Stencil One (fallback)
- Quote styling and positioning logic (in `src/utils/canvasUtils.js` lines 136-150)
- Overlay patterns and text-wrap behavior (from existing design features)

**Deliverable**: Create `ANALYSIS.md` documenting:
- AudioFlam UI patterns (button styles, colors, spacing scale)
- v1 canvas assets (complete color palette with hex codes, font list, quote styling rules)
- Design differences between apps and rationale for unification
- Recommendations for SvelteKit component architecture

**Agent Checklist**:
- [ ] Cloned and studied all 4 reference repos
- [ ] Extracted color tokens with hex values and semantic names
- [ ] Documented typography scale and font families
- [ ] Identified reusable component patterns from AudioFlam
- [ ] Listed all v1 assets to preserve (colors, fonts, quote logic)
- [ ] Created ANALYSIS.md with findings

---

### 0.2 Design System Documentation (1-2 days)

**Agent Task**: Create `DESIGN_SYSTEM.md`—the single source of truth

This document will be used by all current and future Flam apps.

**Create `DESIGN_SYSTEM.md` with these sections:**

#### A. Color System

**Semantic tokens** (for UI):
```
Primary: #8A2BE2 (Purple—brand color from v1 & AudioFlam)
Surface: #FFFFFF (Canvas, panels)
Overlay: #555555 (Dark panels, drawers—from v1)
Text Primary: #000000
Text Secondary: #555555 (from v1)
Text Disabled: #999999
Border: #CCCCCC
Border Light: #EEEEEE
Accent: #FFD700 (Yellow—highlights, quotes)
Error: #E50000 (Red alert from v1)
```

**Design canvas palette** (for users to apply to designs):
```
Solids:
  - White: #FFFFFF
  - Black: #000000
  - Green: #007C1F
  - Blue: #00679D
  - Red: #B20715

Gradients (6 preset + custom builder):
  - Purple-Blue: linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)
  - Navy-Dark: linear-gradient(135deg, #15509B 0%, #20244F 100%)
  - Magenta-Dark: linear-gradient(135deg, #A8076B 0%, #62045F 100%)
  - Red-Dark: linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%)
  - Teal-Dark: linear-gradient(135deg, #0A8F9D 0%, #202B54 100%)
  - Orange-Brown: linear-gradient(135deg, #D17A29 0%, #41363C 100%)
```

#### B. Typography

**UI Fonts** (AudioFlam-derived):
```
Body: Inter, sans-serif (default)
Button/Label: Inter, sans-serif (weight: 500)
Monospace: (for technical elements)
```

**Design Canvas Fonts** (v1 preserved):
```
Available fonts for text layers:
  - Inter (Default)
  - Roboto Slab
  - Saira Condensed
  - Lora
  - Playfair Display
  - Special Elite

Quote-specific fonts:
  - Serif quote: Playfair Display, bold
  - Slab quote: Alfa Slab One
```

**Scale**:
```
XS: 12px (captions)
S: 14px (body)
M: 16px (default, inputs)
L: 20px (headings)
XL: 24px (hero text)
```

#### C. Spacing System

**Scale** (multiples of 4px):
```
0: 0
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
```

**Usage**:
- Header height: 56px (standard)
- Horizontal padding: 16px (default), 12px (mobile tight)
- Vertical padding in drawers: 16px
- Gap between elements: 8-12px
- Button height: 40px (minimum touch target 44px)

#### D. Component Specifications

**Buttons**:
```
Primary:
  - Background: #8A2BE2
  - Color: #FFFFFF
  - Height: 40px
  - Padding: 0 16px
  - Border-radius: 8px
  - Border: none

Secondary (Outline):
  - Background: transparent
  - Color: #555555
  - Border: 1px solid #CCCCCC
  - Height: 40px
  - Border-radius: 8px

Active state:
  - Background: #8A2BE2
  - Color: #FFFFFF

Disabled:
  - Opacity: 0.5
  - Cursor: not-allowed
```

**Input Fields**:
```
Height: 40px
Padding: 8px 12px
Border: 1px solid #CCCCCC
Border-radius: 4px
Font-size: 16px
Focus: Border #8A2BE2, outline none
Placeholder: #BBBBBB
```

**Sliders**:
```
Track: #E0E0E0
Handle: #888888 (with shadow)
Handle size: 20px diameter
Track height: 6px
```

**Drawers** (bottom sheets):
```
Background: #FFFFFF
Header background: #555555
Header text: #FFFFFF
Title: 16px, bold
Padding: 16px
Border-radius: 16px 16px 0 0
Slide-up animation: 300ms ease-out
```

**Modals**:
```
Background: rgba(0, 0, 0, 0.5)
Modal background: #FFFFFF
Border-radius: 8px
Max-width: 480px
Padding: 24px
```

**Icon Buttons** (circular):
```
Size: 44px (minimum)
Background: transparent or #FFFFFF (on dark)
Border: 1px solid #CCCCCC
Border-radius: 8px (square icon buttons)
Icon: 20px, centered
```

#### E. Layout Patterns

**Desktop Constraint**:
```
Max-width: 480px (retain mobile feel)
Centered on screen
Overflow-y: scroll (vertical stacking)
No horizontal scroll
```

**Header**:
```
Height: 56px
Position: sticky (scrolls with content)
Border-bottom: 1px solid #EEEEEE
Padding: 8px 16px
Logo + 3 nav buttons
Align: logo left, nav buttons right
```

**Tab Navigation** (for Crop / AI / Design):
```
Below header, inside app
Underline style active indicator
Padding: 12px 16px
Gap between tabs: 24px
Text: 14px, #555555 (inactive), #8A2BE2 (active)
```

**Canvas Area**:
```
Min-height: 50vh (mobile), 60vh (desktop)
Aspect ratio: varies (9:16, 1:1, 16:9 for design)
Border: 1px solid #CCCCCC (for design canvas)
Border-radius: 8px
Background: #FFFFFF (design canvas), transparent (for photos)
```

**Footer Toolbar** (action buttons below canvas):
```
Position: sticky bottom (when controls active)
Background: #FFFFFF
Border-top: 1px solid #EEEEEE
Padding: 12px 16px
Display: flex, gap 8px
Button height: 40px
Wrap on mobile
```

**Menu Controls Row** (Size / Background / Text 1 / Text 2 / Quote / Overlay):
```
Display: flex, horizontal
Padding: 12px 16px
Gap: 16px (desktop), 12px (mobile)
Text: 14px, #555555
Active: #8A2BE2 underline
Wrap on mobile
```

#### F. State Management Patterns

**Store architecture** (Svelte):
```
slideStore: {
  currentSlide: { canvas size, layers, text, background, overlay }
  history: [] (for undo/redo)
}

uiStore: {
  activeTab: 'crop' | 'ai' | 'design'
  activeControl: 'size' | 'background' | 'text1' | etc.
  isLoading: boolean
  processingStep: string
}

projectStore: {
  projects: [] (localStorage-persisted)
  currentProjectId: string
}

settingsStore: {
  theme: 'light' | 'dark' (may be added later)
  language: 'en' | ... (i18n ready)
}
```

#### G. Animation & Transitions

```
Standard duration: 300ms
Easing: ease-out for enter, ease-in for exit
Drawer open: translateY from bottom, opacity fade-in
Button press: scale(0.95) on mousedown
Loading spinner: smooth rotation
Slider handle: smooth color transition on focus
```

#### H. Accessibility Baseline (WCAG AA)

```
Min contrast: 4.5:1 (text on background)
Focus indicators: visible (outline or ring)
Touch targets: minimum 44px
Keyboard navigation: Tab through buttons/inputs
Labels: all inputs have labels (aria-label or <label>)
Images: alt text where needed
ARIA roles: buttons, sliders, sections labeled
```

#### I. Responsive Design Breakpoints

```
Mobile: < 480px (primary target)
Tablet: 480px - 768px (same layout, comfort spacing)
Desktop: > 768px (constrain to 480px max-width, center, no layout shift)

Mobile-first approach:
- Start with single column
- No need for multi-column layouts (fixed width constraint)
- Touch-friendly spacing and buttons
```

#### J. Offline & Performance

```
Canvas rendering: Use native Canvas API (no heavy libraries)
Image caching: IndexedDB for ML models (RMBG, CodeFormer)
Project persistence: localStorage (3 slots, compressed images)
Bundle size target: < 500KB (gzipped, before models)
Mobile optimization:
  - Lazy load models on first use
  - Compress images before storage
  - Avoid unnecessary re-renders
```

**Deliverable**: Complete `DESIGN_SYSTEM.md` with all sections above

**Agent Checklist**:
- [ ] All colors extracted with semantic names and hex codes
- [ ] Typography scale defined for UI and design canvas
- [ ] Spacing system documented with examples
- [ ] All component specs include states (normal, hover, active, disabled)
- [ ] Layout patterns match v2guide.md mockups (header, tabs, canvas, footer)
- [ ] Store architecture supports all three tabs + undo/redo
- [ ] Accessibility guidelines included and realistic (not aspirational)
- [ ] Offline/performance notes are specific and actionable
- [ ] Document is clear enough for new agents to build components without asking questions

---

### 0.3 SvelteKit Project Template (Half day)

**Agent Task**: Create starter template with design system baked in

**Create repository**: `picflam-v2-template` (or branch in main repo)

**Folder structure**:
```
picflam-v2/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte          (header, footer, drawer stack)
│   │   ├── +page.svelte            (main tab-based editor)
│   │   └── +error.svelte           (error boundary)
│   ├── lib/
│   │   ├── components/             (reusable UI)
│   │   │   ├── Button.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Slider.svelte
│   │   │   ├── Drawer.svelte
│   │   │   ├── Modal.svelte
│   │   │   ├── IconButton.svelte
│   │   │   ├── Header.svelte
│   │   │   └── TabNav.svelte
│   │   ├── features/               (tab-specific components)
│   │   │   ├── crop/               (Crop tab)
│   │   │   │   ├── CropEditor.svelte
│   │   │   │   ├── CropControls.svelte
│   │   │   │   └── CropPreview.svelte
│   │   │   ├── ai/                 (AI tab)
│   │   │   │   ├── AIEditor.svelte
│   │   │   │   ├── Enhance.svelte
│   │   │   │   ├── Upscale.svelte
│   │   │   │   └── RemoveBackground.svelte
│   │   │   └── design/             (Design tab)
│   │   │       ├── DesignCanvas.svelte
│   │   │       ├── SizeControls.svelte
│   │   │       ├── BackgroundControls.svelte
│   │   │       ├── TextControls.svelte
│   │   │       ├── QuoteControls.svelte
│   │   │       └── OverlayControls.svelte
│   │   ├── stores/                 (Svelte stores)
│   │   │   ├── slideStore.js
│   │   │   ├── uiStore.js
│   │   │   ├── projectStore.js
│   │   │   └── settingsStore.js
│   │   ├── utils/
│   │   │   ├── canvasUtils.js      (from v1—crop, render text/quotes)
│   │   │   ├── imageEnhance.js     (AI features: RMBG, CodeFormer)
│   │   │   ├── imageFilters.js     (crop tab filters)
│   │   │   └── localStorage.js     (project persistence)
│   │   └── styles/
│   │       ├── tokens.css          (design system variables)
│   │       ├── global.css          (reset, base styles)
│   │       ├── animations.css      (transitions, keyframes)
│   │       └── responsive.css      (breakpoints, mobile-first)
│   ├── app.html                    (root HTML)
│   └── app.css                     (global wrapper styles)
├── static/
│   ├── icons/                      (from info/icons/*.svg)
│   └── logos/                      (from info/logos/*.png)
├── DESIGN_SYSTEM.md                (from Phase 0.2)
├── DESIGN.md                       (quick reference)
├── vite.config.js
├── svelte.config.js
├── package.json
└── README.md
```

**Initialize template**:
```bash
npm create vite@latest picflam-v2 -- --template svelte
cd picflam-v2
npm install
# Install dependencies:
npm install -D svelte @sveltejs/adapter-auto
npm install transformers
```

**Create `src/lib/styles/tokens.css`** with all design tokens as CSS custom properties:
```css
:root {
  /* Colors */
  --color-primary: #8A2BE2;
  --color-primary-dark: #6B1DB0;
  --color-surface: #FFFFFF;
  --color-overlay: #555555;
  --color-text-primary: #000000;
  --color-text-secondary: #555555;
  --color-border: #CCCCCC;
  --color-border-light: #EEEEEE;
  --color-accent: #FFD700;
  --color-error: #E50000;

  /* Canvas Palette */
  --color-canvas-white: #FFFFFF;
  --color-canvas-black: #000000;
  --color-canvas-green: #007C1F;
  --color-canvas-blue: #00679D;
  --color-canvas-red: #B20715;

  /* Typography */
  --font-family-body: 'Inter', sans-serif;
  --font-family-mono: 'Courier New', monospace;
  --font-size-xs: 12px;
  --font-size-s: 14px;
  --font-size-m: 16px;
  --font-size-l: 20px;
  --font-size-xl: 24px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Layout */
  --header-height: 56px;
  --button-height: 40px;
  --touch-target: 44px;
  --max-width: 480px;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-standard: 300ms ease-out;
}
```

**Copy assets**:
- Copy all icons from `info/icons/*.svg` → `static/icons/`
- Copy all logos from `info/logos/*.png` → `static/logos/`
- Create `src/lib/styles/global.css` with resets and base styles

**Create sample component** (`src/lib/components/Button.svelte`):
```svelte
<script>
  export let variant = 'primary'; // 'primary', 'secondary'
  export let size = 'md'; // 'sm', 'md', 'lg'
  export let disabled = false;
</script>

<button class="btn btn--{variant} btn--{size}" {disabled} on:click>
  <slot />
</button>

<style>
  .btn {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-medium);
    border: none;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    transition: all var(--transition-fast);
    padding: 0 var(--space-4);
    height: var(--button-height);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn--primary {
    background-color: var(--color-primary);
    color: var(--color-surface);
  }

  .btn--primary:hover {
    background-color: var(--color-primary-dark);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
```

**Deliverable**: 
- Functional SvelteKit project with folder structure
- `tokens.css` with all design system variables
- Template components (Button, Input, Slider, Drawer)
- Static assets (icons, logos) in place
- `DESIGN_SYSTEM.md` copied to root
- README with setup instructions

**Agent Checklist**:
- [ ] SvelteKit project scaffolded and installs without errors
- [ ] All design tokens defined as CSS custom properties
- [ ] Folder structure matches specification
- [ ] Sample components (Button, Input) work and use tokens
- [ ] Icons and logos copied to static folder
- [ ] DESIGN_SYSTEM.md accessible in project root
- [ ] Template can be cloned by new projects

---

## PHASE 0 END: Gate & Review

**Agent MUST**:
1. Commit all work to branch `phase-0-design-system`
2. Push to GitHub
3. Provide summary of DESIGN_SYSTEM.md (token values, component specs)
4. List any questions or assumptions made during analysis

**User WILL**:
1. Review DESIGN_SYSTEM.md for completeness and accuracy
2. Verify template project installs and runs (`npm run dev`)
3. Test that colors/fonts in tokens.css match v1 + AudioFlam
4. Verify folder structure and component scaffolding
5. Approve or request changes before Phase 1 starts

**DO NOT PROCEED to Phase 1 until user signs off.**

---

## Phase 1: Architecture & Project Setup (1 day)

### Goal
Set up the v2 project structure with stores, utilities, and page routing. No UI components yet—just scaffolding.

**Agent Task**: 
1. Read user's feedback on Phase 0
2. Study DESIGN_SYSTEM.md thoroughly
3. Review all visuals in `info/visuals/` (v2guide.md diagrams)
4. Ask any clarifying questions before proceeding

### 1.1 Git Strategy & Deployment Setup

**Current situation**:
- v1 lives in `picflam` repo
- v2 will replace it on the same URL (Cloudflare Pages)

**Strategy**:
```
1. Tag final v1 commit: git tag v1-final
2. Create new branch: git checkout -b v2-sveltekit
3. Replace entire codebase with v2 SvelteKit app
4. Commit v2 work on v2-sveltekit branch
5. When ready to deploy:
   - Merge v2-sveltekit → main
   - Cloudflare Pages auto-deploys from main
   - Same URL serves new v2 app
   - v1 code archived in tag for reference
```

**No separate repos needed**—keep history in one place.

**Deliverable**: 
- [ ] v1 tagged as `v1-final`
- [ ] `v2-sveltekit` branch created and switched to
- [ ] v2 project structure committed (Phase 0 template as base)

### 1.2 Store Architecture

**Create `src/lib/stores/slideStore.js`**:
```javascript
import { writable } from 'svelte/store';

const initialSlide = {
  // Metadata
  id: Date.now().toString(),
  createdAt: new Date(),

  // Canvas
  canvasWidth: 1080,
  canvasHeight: 1080,
  canvasRatio: '1:1', // '9:16', '1:1', '16:9'

  // Image layer (for all tabs)
  imageData: null, // base64 or Blob
  imageWidth: null,
  imageHeight: null,

  // Crop state (Crop tab)
  cropX: 0,
  cropY: 0,
  cropWidth: null,
  cropHeight: null,
  cropRatio: 'custom', // '9:16', '1:1', '16:9', 'custom'
  cropScale: 1,

  // Processed images (AI tab)
  enhancedImage: null, // CodeFormer result
  upscaledImage: null, // Upscale result
  backgroundRemovedImage: null, // RMBG result
  backgroundMask: null, // For erase/restore
  activeImage: null, // Which version is displayed

  // Design canvas (Design tab)
  templateId: null, // Selected template or null for blank

  // Background
  backgroundColor: { type: 'solid', value: '#8A2BE2' },

  // Text 1 (quote text)
  text1: 'Add your text',
  text1Font: 'Inter',
  text1Size: 5,
  text1IsBold: false,
  text1IsItalic: false,
  text1Align: 'center', // 'left', 'center', 'right'
  text1YPosition: 5, // 0-10 scale, top to bottom
  text1Color: '#FFFFFF',
  text1HighlightColor: null, // For emphasis
  text1LineSpacing: 5,

  // Quote style (decorative quote mark above text1)
  text1QuoteStyle: 'none', // 'none', 'serif', 'slab'
  text1QuoteSize: 5, // 1-10

  // Text 2 (label text, smaller)
  text2: 'Label',
  text2Font: 'Inter',
  text2Size: 3,
  text2IsBold: false,
  text2IsItalic: false,
  text2Align: 'center',
  text2YPosition: 2, // Bottom of canvas
  text2Color: '#FFFFFF',
  text2HighlightColor: null,
  text2LineSpacing: 5,

  // Overlay (image on top of design)
  overlayImage: null,
  overlaySize: 100,
  overlayOpacity: 1,
  overlayMask: 'none', // 'none', 'rounded', 'circle'
  overlayTextWrap: false,
  overlayBorderWidth: 0, // 0, 1, 2, 3
  overlayBorderColor: '#000000',
  overlayX: 0, // Offset from center
  overlayY: 0,

  // History for undo/redo
  _history: [],
  _historyIndex: -1,
};

export const slideStore = writable(initialSlide);

export function updateSlide(updates) {
  slideStore.update(slide => {
    // Save current state to history before update
    slide._history = slide._history.slice(0, slide._historyIndex + 1);
    slide._history.push(JSON.parse(JSON.stringify(slide)));
    slide._historyIndex++;

    return { ...slide, ...updates };
  });
}

export function undo() {
  slideStore.update(slide => {
    if (slide._historyIndex > 0) {
      slide._historyIndex--;
      return JSON.parse(JSON.stringify(slide._history[slide._historyIndex]));
    }
    return slide;
  });
}

export function redo() {
  slideStore.update(slide => {
    if (slide._historyIndex < slide._history.length - 1) {
      slide._historyIndex++;
      return JSON.parse(JSON.stringify(slide._history[slide._historyIndex]));
    }
    return slide;
  });
}
```

**Create `src/lib/stores/uiStore.js`**:
```javascript
import { writable } from 'svelte/store';

export const uiStore = writable({
  activeTab: 'crop', // 'crop', 'ai', 'design'
  activeControl: null, // Which control panel is open ('size', 'background', 'text1', etc.)
  isLoading: false,
  loadingStep: '', // e.g., "Removing background..."
  error: null,
  showModal: false,
  modalType: null, // e.g., 'confirm', 'error'
  modalMessage: '',
});

export function setActiveTab(tab) {
  uiStore.update(u => ({ ...u, activeTab: tab, activeControl: null }));
}

export function setActiveControl(control) {
  uiStore.update(u => ({ ...u, activeControl: control }));
}

export function setLoading(isLoading, step = '') {
  uiStore.update(u => ({ ...u, isLoading, loadingStep: step }));
}

export function setError(error) {
  uiStore.update(u => ({ ...u, error }));
}
```

**Create `src/lib/stores/projectStore.js`**:
```javascript
import { writable } from 'svelte/store';

export const projectStore = writable({
  projects: [], // Array of { id, name, slides[], createdAt, updatedAt }
  currentProjectId: null,
});

// Load from localStorage on init
export function initProjects() {
  const stored = localStorage.getItem('picflam-projects');
  if (stored) {
    try {
      projectStore.set(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load projects:', e);
    }
  }
}

export function saveProject(name, slides) {
  projectStore.update(p => {
    const project = {
      id: Date.now().toString(),
      name,
      slides,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Keep max 3 projects (user spec)
    const projects = [project, ...p.projects].slice(0, 3);
    localStorage.setItem('picflam-projects', JSON.stringify({ projects, currentProjectId: project.id }));
    return { projects, currentProjectId: project.id };
  });
}
```

**Deliverable**:
- [ ] slideStore.js with complete slide state structure
- [ ] uiStore.js for tab and control management
- [ ] projectStore.js with localStorage persistence (3 slots max)
- [ ] All stores tested and working (console logs or unit tests)

### 1.3 Utility Functions

**Copy from v1**: `src/lib/utils/canvasUtils.js` (unchanged, ~487 lines)
- This is framework-agnostic; copy as-is from v1
- No modifications needed

**Create `src/lib/utils/imageFilters.js`** (placeholder for Phase 4):
```javascript
// Crop tab image processing
export function applyGrayscale(imageData) {
  // TBD: implement with Canvas API
}

export function applySepia(imageData) {
  // TBD: implement with Canvas API
}

// ... other filters (Sunset, Azure, Teal) TBD
```

**Create `src/lib/utils/imageEnhance.js`** (placeholder for Phase 4):
```javascript
// AI features using Transformers.js
export async function removeBackground(imageFile) {
  // TBD: RMBG-1.4 via Transformers.js
}

export async function enhanceImage(imageFile) {
  // TBD: CodeFormer via Transformers.js
}

export async function upscaleImage(imageFile, scale) {
  // TBD: Upscaling logic
}
```

**Create `src/lib/utils/localStorage.js`**:
```javascript
export function compressImage(img, maxDimension = 800, quality = 0.8) {
  // Copy from v1 canvasUtils.js—unchanged
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    let newWidth, newHeight;

    if (img.naturalWidth > img.naturalHeight) {
      newWidth = Math.min(img.naturalWidth, maxDimension);
      newHeight = newWidth / aspectRatio;
    } else {
      newHeight = Math.min(img.naturalHeight, maxDimension);
      newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    resolve(compressedDataUrl);
  });
}
```

**Deliverable**:
- [ ] canvasUtils.js copied from v1 and working
- [ ] imageFilters.js created (placeholders)
- [ ] imageEnhance.js created (placeholders)
- [ ] localStorage.js with compression utility

### 1.4 Page Routing

**Create `src/routes/+layout.svelte`** (root layout):
```svelte
<script>
  import { uiStore } from '$lib/stores/uiStore.js';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '$lib/styles/tokens.css';
  import '$lib/styles/global.css';
</script>

<div class="app-wrapper">
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style>
  .app-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: var(--max-width);
    margin: 0 auto;
  }

  main {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
  }
</style>
```

**Create `src/routes/+page.svelte`** (main editor):
```svelte
<script>
  import { uiStore, setActiveTab } from '$lib/stores/uiStore.js';
  import TabNav from '$lib/components/TabNav.svelte';
  import CropEditor from '$lib/features/crop/CropEditor.svelte';
  import AIEditor from '$lib/features/ai/AIEditor.svelte';
  import DesignCanvas from '$lib/features/design/DesignCanvas.svelte';
</script>

<div class="editor-container">
  <TabNav />

  {#if $uiStore.activeTab === 'crop'}
    <CropEditor />
  {:else if $uiStore.activeTab === 'ai'}
    <AIEditor />
  {:else if $uiStore.activeTab === 'design'}
    <DesignCanvas />
  {/if}
</div>

<style>
  .editor-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }
</style>
```

**Create placeholder components**:
- `src/lib/components/Header.svelte` (logo + nav buttons)
- `src/lib/components/Footer.svelte` (placeholder)
- `src/lib/components/TabNav.svelte` (Crop / AI / Design tabs)
- `src/lib/features/crop/CropEditor.svelte` (placeholder)
- `src/lib/features/ai/AIEditor.svelte` (placeholder)
- `src/lib/features/design/DesignCanvas.svelte` (placeholder)

All can be minimal—just `<div>Component Name</div>` for now.

**Deliverable**:
- [ ] Routing works (`npm run dev` shows tabs switching)
- [ ] Header and tabs visible
- [ ] All three tabs load (empty placeholders OK)
- [ ] No console errors

---

## PHASE 1 END: Gate & Review

**Agent MUST**:
1. Verify stores are initialized and reactive
2. Test tab switching in browser
3. Commit to `v2-sveltekit` branch
4. Summarize store structure and routing

**User WILL**:
1. Test locally: `npm run dev`
2. Verify tab switching works
3. Open DevTools → console → test store updates manually
4. Approve or request changes

**DO NOT PROCEED to Phase 2 until user signs off.**

---

## Phase 2: UI Shell & Component Library (2-3 days)

### Goal
Build all reusable UI components (buttons, inputs, sliders, drawers, modals) and the main layout structure. No tab logic yet—just visual.

**Agent Task**:
1. Read user's feedback on Phase 1
2. Study DESIGN_SYSTEM.md section D (Component Specifications)
3. Review v2guide.md mockups to see component usage
4. Ask clarifying questions if component behavior is unclear

### 2.1 Core Components

Build these Svelte components in `src/lib/components/`:

**Button.svelte** (primary, secondary, sizes)
**Input.svelte** (text, number with optional icon)
**Slider.svelte** (range input with live value display)
**IconButton.svelte** (square icon button, size options)
**Drawer.svelte** (bottom sheet modal)
**Modal.svelte** (centered modal with backdrop)
**ColorSwatch.svelte** (single color circle, clickable)
**Header.svelte** (sticky header with logo + nav buttons)
**TabNav.svelte** (Crop / AI / Design tabs with underline)
**Spinner.svelte** (loading indicator)
**BeforeAfter.svelte** (slider to compare two images)

**Deliverable**: All components styled to match tokens.css, responsive, and callable from other components

### 2.2 Layout Components

**CanvasWrapper.svelte**: Container for design/crop canvas with border
**ControlPanel.svelte**: Container for controls below canvas
**RatioButtonGroup.svelte**: 9:16, 1:1, 16:9, Custom ratio buttons
**ColorPalette.svelte**: Grid of color swatches + custom color picker

**Deliverable**: Layout scaffolding matches v2guide.md visual structure

### 2.3 Typography & Styling

**Global CSS** (`src/lib/styles/global.css`):
- Font imports (Google Fonts: Inter, Roboto Slab, Saira, Lora, Playfair, Special Elite, Alfa Slab One)
- Reset (margin, padding, box-sizing)
- Base styles (body, p, h1, h2, button)
- Scrollbar styling (light grey, thin)

**Responsive CSS** (`src/lib/styles/responsive.css`):
- Mobile-first media queries
- Desktop constraint (max-width: 480px, center)
- Spacing adjustments for mobile vs desktop

**Deliverable**:
- [ ] All fonts load correctly (no FOUT)
- [ ] Component library complete with all variants
- [ ] Responsive at mobile (320px) and desktop (768px+)
- [ ] No layout shifts on resize

---

## PHASE 2 END: Gate & Review

**Agent MUST**:
1. Component library storybook or demo page
2. Verify all components use design tokens
3. Test responsive behavior

**User WILL**:
1. Review each component in browser
2. Verify colors match DESIGN_SYSTEM.md
3. Test on mobile device (or DevTools mobile view)
4. Approve or request tweaks

**DO NOT PROCEED to Phase 3 until user signs off.**

---

## Phase 3: Tab Implementation - Crop (3-4 days)

### Goal
Build the complete Crop tab with image import, cropping controls, editing, and filters.

**Agent Task**:
1. Read user's feedback on Phase 2
2. Study v2guide.md Crop section thoroughly (crop1 → crop7 diagrams)
3. Review mockups: crop1.png, crop2.png, crop3.png, crop4.png, crop5.png, crop6.png, crop7.png
4. Ask questions about crop interaction behavior

### 3.1 Crop Start Screen (crop1)

Display when no image loaded:
- Large dotted border box
- Icon: icon-upload
- Text: "Import, drag or paste an image"
- Button: "Paste" (for clipboard paste)
- Drag-drop zone

**Component**: `CropStart.svelte`

**Deliverable**: Image can be uploaded, dragged, or pasted

### 3.2 Crop Display (crop2 - crop6)

Once image loaded:
- **Top toolbar**: Undo/Redo buttons (left), Start Again / Copy / Export buttons (right)
- **Image display**: Full-width, constrained by canvas
- **Menu buttons**: Crop / Edit / Filter tabs (horizontally scrollable)
- **Control panels**: Hidden until user taps a menu button

### 3.3 Crop Controls (crop3 - crop4)

When "Crop" button tapped:
- **Ratio buttons**: 9:16 (vertical), 1:1 (square), 16:9 (horizontal), Custom
- **Width/Height inputs**: Display current crop dimensions
- **Lock toggle**: Lock aspect ratio
- **Flip toggle**: Flip horizontally
- **Rotate button**: Rotate 90° (or keep simple for MVP?)
- **Scale slider**: Zoom in/out of image
- **Crop overlay**: White bounding box with corner handles
  - Draggable with one finger
  - Pinch-to-scale
  - Visual feedback

**Component**: `CropControls.svelte`

**Key behavior**:
- Default crop is full image (Custom ratio, unlocked)
- When ratio selected (9:16, 1:1, 16:9), crop centers on image
- Handles allow free resize (or constrained to ratio if locked)
- Scale slider works with pinch gesture (mobile)

### 3.4 Edit Controls (crop6 - blur example)

When "Edit" button tapped:
- **Brightness slider**: -100 to +100
- **Shadows slider**: -100 to +100
- **Contrast slider**: -100 to +100
- **HDR slider**: -100 to +100 (cosmetic enhancement)
- **Blur brush slider**: 0 to 50px radius
  - Shows translucent purple circle on image
  - Tap to paint blur on image
  - Zoom controls (enlarge, nudge buttons, reset)

**Component**: `EditControls.svelte`

**Note**: Blur implementation is complex (canvas mask painting). For MVP, implement basic brightness/contrast/saturation via Canvas filters. Blur brush can be deferred to v2.1.

### 3.5 Filter Controls (crop7)

When "Filter" button tapped:
- **Filter buttons**: Original (no effect), Greyscale, Sepia, Sunset, Azure, Teal
- **Filter strength slider**: 0-100% (center is default, left decreases, right increases)
- **Live preview**: Image updates as slider moves

**Component**: `FilterControls.svelte`

**Agent Task** (3.5): Research filter libraries
- Investigate Canvas-based filters (native filters via context.filter)
- Check if Transformers.js or other library provides pre-built filters
- Implement simplest approach: CSS filters or Canvas context filters
- Document findings in comments for future reference

**Deliverable**:
- [ ] 6 filters implemented (Greyscale, Sepia, Sunset, Azure, Teal, Original)
- [ ] Strength slider works
- [ ] Live preview updates

### 3.6 Export

After crop/edit/filter applied:
- **Export button**: Download as PNG or JPEG
- **Copy button**: Copy image to clipboard (for pasting in AI or Design tabs)

**Deliverable**:
- [ ] Complete Crop tab fully functional
- [ ] All controls respond to input
- [ ] Image processing applies correctly
- [ ] Export/copy works

---

## PHASE 3 END: Gate & Review

**Agent MUST**:
1. Test full crop workflow: import → crop → edit → filter → export
2. Verify all controls are responsive
3. Test on mobile (drag, pinch, touch)
4. Commit to v2-sveltekit branch

**User WILL**:
1. Test locally on desktop and mobile
2. Verify crop handles and pinch work
3. Test filters visually
4. Verify export/copy functionality
5. Approve or request fixes

**DO NOT PROCEED to Phase 4 until user signs off.**

---

## Phase 4: Tab Implementation - AI (2-3 days)

### Goal
Build the AI tab with background removal, face enhancement, and upscaling using Transformers.js.

**Agent Task**:
1. Read user's feedback on Phase 3
2. Study v2guide.md AI section (ai1 → ai12 diagrams)
3. Review mockups: ai1.png through ai12.png
4. Review DESIGN_SYSTEM.md section J (Offline & Performance)

### 4.1 AI Start Screen (ai1)

Same as Crop start screen, but with AI-specific wording.

### 4.2 Enhance Feature (ai2 - ai5)

- **UI State 1 (ai3)**: Show "Enhance image" button (with AI icon) + explainer text
- **UI State 2 (ai4)**: On click:
  - Image becomes blurred
  - Button changes to "Processing" with spinner
  - Explainer hidden, Cancel button shown
  - Models download in background (cached in IndexedDB)
- **UI State 3 (ai5)**: Processing complete:
  - Image sharpens, shows enhanced version
  - Purple vertical slider appears (before/after compare)
  - Button reverts to "Enhance image"
  - Cancel hidden, explainer returns

**Component**: `EnhanceControls.svelte`

**Backend**: `src/lib/utils/imageEnhance.js`
```javascript
export async function enhanceImage(imageFile) {
  // 1. Load CodeFormer model (cached)
  const pipeline = await transformers.pipeline('image-to-image', 'Xenova/CodeFormer');
  // 2. Process image
  const result = await pipeline(imageFile);
  // 3. Return enhanced canvas or blob
  return result;
}
```

### 4.3 Upscale Feature (ai6 - ai8)

- **Slider**: Select scale (x1, x2, x3, x4)
- **Size display**: Show predicted output size (e.g., "2160 x 2160")
- **Upscale button**: Tap to start processing
- **Processing UI**: Same pattern as Enhance (blur, Processing, Cancel)
- **Result UI**: Before/after slider

**Component**: `UpscaleControls.svelte`

**Backend**: Research if CodeFormer includes upscaling, or use separate model.

### 4.4 Background Removal (ai9 - ai12)

- **UI State 1 (ai9)**: Two buttons:
  - "Remove background" button + explainer
  - "Erase and restore" button + explainer (initially inactive)
- **UI State 2 (ai10)**: On "Remove background" click:
  - Processing state (blur, spinner, cancel)
  - "Erase and restore" still visible but inactive
- **UI State 3 (ai11)**: Complete:
  - Image displayed with transparent background (shown as white + thin grey border)
  - Before/after slider
  - "Erase and restore" button now active
- **UI State 4 (ai12)**: On "Erase and restore" click:
  - Full-page drawer opens from bottom
  - **Toolbar**: Undo/Redo buttons (left), Compare button (right)
  - **Image**: Removed background with transparent areas shown as white + grey border
  - **Controls**:
    - Erase / Restore toggle buttons (primary/secondary states)
    - Brush size slider + reset button
    - Soften edges slider + reset button
    - Zoom in slider + reset button
    - Four nudge buttons (up, down, left, right)
  - **Actions**: Cancel / Done buttons (bottom)
  - Close drawer on Done/Cancel, return to ai11

**Component**: `RemoveBackgroundControls.svelte` + `EraseRestoreDrawer.svelte` (using shared `BrushEditor.svelte`)

**Backend**: 
```javascript
export async function removeBackground(imageFile) {
  const pipeline = await transformers.pipeline('image-segmentation', 'Xenova/remove-background');
  const result = await pipeline(imageFile);
  return { image: result.image, mask: result.masks };
}

export function applyMaskToImage(imageFile, mask) {
  // Convert mask to transparency, apply to image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // ... implementation
}
```

### 4.5 Integration with Crop Tab

- Image from Crop tab can be used in AI tab
- After AI processing, result can be copied back to Crop tab or exported

**Deliverable**:
- [ ] Enhance feature fully working (download, process, display result)
- [ ] Upscale feature fully working
- [ ] Background removal working (with erase/restore UI)
- [ ] Before/after sliders work on all features
- [ ] Processing states clear and responsive
- [ ] Models cached (no re-download on reuse)
- [ ] Offline capability verified (models cached in IndexedDB)

### 4.6 Implementation Challenges & Solutions (CodeFormer Integration)

**Challenge 1: API Selection for Face Enhancement**
- **Problem**: Initial consideration was to self-host GFPGAN or CodeFormer on a backend server, but the project has no backend infrastructure.
- **Solution**: Evaluated three approaches:
  1. Self-host GFPGAN/CodeFormer (zero cost but requires Python backend)
  2. Use Replicate API (pay-per-use, highly flexible)
  3. ONNX client-side model (offline capability but model hunting and compilation required)
  - **Decision**: **Replicate API + CodeFormer** — simplest integration, negligible cost ($0.0045/image), no infrastructure required, offline fallback available

**Challenge 2: Two-Step Pipeline vs. Single Model**
- **Problem**: Initial implementation used two sequential API calls (Real-ESRGAN for upscaling + CodeFormer for face enhancement), which was slower and costlier.
- **Solution**: CodeFormer handles both upscaling AND face restoration in a single call. Consolidated to one API endpoint (`/api/face-enhance`) with parameters:
  - `image`: input image URL
  - `scale`: upscaling factor (1-4)
  - `codeformer_fidelity`: balance between quality and fidelity (0-1, default 0.5)
  - `upscale`: whether to apply upscaling (integer scale factor)
  - `face_upsample`: enhance detected faces (boolean)
  - `background_enhance`: enhance non-face areas with Real-ESRGAN (boolean)
- **Result**: Faster processing, simpler API, cost reduced by ~50%

**Challenge 3: Rate Limiting & Throttling**
- **Problem**: Replicate free accounts are throttled to 6 requests/minute with <$5 available credit, causing 429 errors during testing.
- **Solution**: 
  - Ensured minimum $5 available credit before rolling out to users
  - For 35-person training sessions (2x/year), recommend adding $5-10 buffer credit before each session
  - At $0.0045/image, even heavy usage is <$1-2 per session
  - Rate limit lifts automatically when account has $5+ available

**Challenge 4: API Model Version Hash**
- **Problem**: Initial hardcoded model hash was incorrect, resulting in 422 errors.
- **Solution**: Referenced Replicate's official API schema page to get the correct CodeFormer version hash (`cc4956dd26fa5a7185d5660cc9100fab1b8070a1d1654a8bb5eb6d443b020bb2`) and verified all input parameter names and types against official documentation.

**Final Result**:
- Single cloud endpoint (`/api/face-enhance`) for upscaling + face restoration
- Both local (Real-ESRGAN ONNX) and cloud (CodeFormer API) modes available
- Graceful fallback: if face enhancement fails, upscaling result still delivered
- Cost: ~$0.0045/image, affordable for nonprofit use case with limited training sessions
- Production-ready and tested with real journalist photos

---

## PHASE 4 END: Gate & Review

**Agent MUST**:
1. Test full AI workflow: import → enhance/upscale/remove-bg → export
2. Verify model download and caching (check IndexedDB in DevTools)
3. Test on slow network (throttle in DevTools)
4. Verify before/after sliders
5. Commit to v2-sveltekit branch

**User WILL**:
1. Test locally (may take time for models to download first time)
2. Verify each feature produces good results
3. Test erase/restore UX
4. Verify offline capability (models cached)
5. Approve or request fixes

**DO NOT PROCEED to Phase 5 until user signs off.**

---

## Phase 5: Tab Implementation - Design (3-4 days)

### Goal
Build the Design tab with canvas, text controls, background, quotes, and overlays.

**Agent Task**:
1. Read user's feedback on Phase 4
2. Study v2guide.md Design section (design1 → design11 diagrams)
3. Review mockups: design1.png through design11.png
4. Review DESIGN_SYSTEM.md section F (State Management—slideStore details)

### 5.1 Template Selection (design1)

- **Drawer**: Bottom sheet with templates
- **Templates**: 6 placeholder squares (user will replace with actual designs)
- **Blank canvas button**: Start with empty canvas
- **Size indicator**: "(9:16, 1:1, 16:9 default)"

**Component**: `TemplateDrawer.svelte`

### 5.2 Design Canvas (design2)

Once template/blank selected:
- **Top toolbar**: Undo/Redo, Start Again, Copy, Export (same as Crop tab)
- **Canvas area**: 
  - Default 1:1 (square)
  - Background color/gradient
  - Text layers (T1, T2)
  - Optional quote mark (visual, not separate layer)
  - Optional overlay image
  - Fine border, rounded corners
- **Menu buttons**: Size / Background / Text 1 / Text 2 / Quote / Overlay
  - Flex layout, horizontal, wraps on mobile
  - Active underline

**Component**: `DesignCanvas.svelte` + `CanvasRenderer.svelte`

### 5.3 Canvas Rendering

Use Canvas API to draw:
1. Background (solid or gradient)
2. Text 1 (large, centered by default)
   - Font, size, color, bold, alignment, position, line spacing
   - Highlight color (for selected words, e.g., "==highlight==")
3. Quote mark (if style selected)
   - Serif (Playfair Display, bold) or Slab (Alfa Slab One)
   - Above text 1
4. Text 2 (smaller, lower)
5. Overlay image (if added)
   - With mask (rounded, circle, or none)
   - With border
   - With opacity

**Component**: `CanvasRenderer.svelte` (uses canvasUtils.js from v1)

**Deliverable**: Canvas renders all elements correctly

### 5.4 Size Controls (design3)

When "Size" tapped:
- **Ratio buttons**: 9:16 (vertical), 1:1 (square), 16:9 (horizontal) with icons
- **Tap effect**: Canvas resizes and is displayed full-width
- **Default**: 1:1

**Component**: `SizeControls.svelte`

### 5.5 Background Controls (design4)

When "Background" tapped:
- **Solid colors**: 5 preset circles + custom color picker
  - From v1: White, Black, Green, Blue, Red (plus rainbow button)
- **Gradients**: 6 preset + custom gradient builder
  - Direction buttons (up, down, left, right)
  - Color pickers for start/end

**Component**: `BackgroundControls.svelte`

**Uses**: Existing color picker logic from v1 ColorDrawer.jsx (adapt to Svelte)

### 5.6 Text 1 Controls (design5 - design6)

When "Text 1" tapped:
- **Text input**: Editable text with placeholder "How to ==highlight== text"
  - Resize handle (bottom-right corner)
- **Font dropdown**: List of fonts (Inter, Roboto Slab, Saira, Lora, Playfair, Special Elite)
  - Display each option in its own font
- **Bold toggle**: icon-bold
- **Alignment buttons**: Left, Center (default), Right
- **Size slider**: 1-10 scale, default 5
- **Position slider**: 0-10 (top to bottom), default 5 (center)
- **Line spacing slider**: 1-10, default 5
- **Color palette**: Preset colors + rainbow picker
- **Highlight color**: Preset colors + rainbow, or Yellow as default

**Component**: `Text1Controls.svelte`

**Special**: Support "==word==" syntax for highlighting (render word in highlight color)

### 5.7 Text 2 Controls (design7)

Same as Text 1, but:
- **Default size**: Smaller (slider more to left)
- **Default position**: Lower (slider toward right)
- **No highlight color** (or optional)

**Component**: `Text2Controls.svelte`

### 5.8 Quote Controls (design8)

When "Quote" tapped:
- **Quote style buttons**: No quote (icon-none, dark), Serif quote (custom design), Slab quote (custom design)
  - Active button has filled background
- **Size slider**: 1-10 scale

**Component**: `QuoteControls.svelte`

**Important**: Use exact quote styling from v1 (fonts, sizes, positioning). Preserve visual hierarchy.

### 5.9 Overlay Controls (design9 - design11)

Initial state (design9):
- Dotted border box with Import/Paste buttons

After import (design10):
- **Image**: Centered, smaller, with bounding box
- **Delete button**: Top-left corner of bounding box
- **Draggable**: One finger to move
- **Resizable**: Pinch-to-scale or Size slider
- **Visible bounds**: Image cropped by canvas boundary

Controls panel (design10):
- **Size slider**: Adjust overlay width
- **Opacity slider**: 0-100%
- **Mask buttons**: None (icon-none), Rounded square, Circle
  - Active has filled background
- **Text wrap toggle**: Wrap (icon-wrap) or No-wrap (icon-no-wrap)
- **Border width slider**: 0 (none), 1, 2, 3 (sticky slider with 4 stops)
- **Border color palette**: Use v1 solid colors

**Component**: `OverlayControls.svelte`

**Special behavior** (design11):
- Text wraps around mask boundary (if mask is rounded/circle)
- Text wraps around removed background outline (if image has transparent areas)

### 5.10 Undo/Redo & History

All controls update slideStore, which maintains history. Undo/Redo buttons use slideStore.undo() / slideStore.redo().

**Deliverable**:
- [ ] Complete Design tab fully functional
- [ ] Canvas renders correctly with all layers
- [ ] All controls update canvas in real-time
- [ ] Undo/Redo works
- [ ] Overlay with masks and text wrapping works
- [ ] Quote styling matches v1 exactly

---

## PHASE 5 END: Gate & Review

**Agent MUST**:
1. Test complete design workflow: template/blank → background → text → quote → overlay → export
2. Verify canvas rendering on all device sizes
3. Test undo/redo
4. Test quote styling visually
5. Test overlay with text wrap
6. Commit to v2-sveltekit branch

**User WILL**:
1. Test locally: Create multiple designs
2. Verify canvas looks correct (colors, fonts, quotes, overlays)
3. Test text wrapping visually
4. Verify all controls are intuitive
5. Approve or request changes (styling tweaks, UX improvements)

**DO NOT PROCEED to Phase 6 until user signs off.**

---

## Phase 6: Polish, Testing & Optimization (1-2 days)

### 6.1 Cross-Tab Workflows

- Image from Crop → AI → Design (copy between tabs)
- Result from AI → Crop again (iterative workflow)
- Save/load projects from all tabs

**Test all workflows** to ensure data flows correctly between tabs.

### 6.2 Mobile Responsiveness

- Test on actual mobile device (iOS, Android)
- Verify touch gestures (drag, pinch, tap)
- Test portrait and landscape orientation
- Verify 480px max-width constraint on desktop

**Use tools**: Chrome DevTools device emulation, actual phone testing

### 6.3 Performance Optimization

- **Bundle size**: Check gzipped size (target < 500KB without models)
- **Model caching**: Verify models cached in IndexedDB
- **Canvas rendering**: Ensure no jank on slower devices
- **Memory**: Test with large images (2+ MB)

**Tools**: Lighthouse, Chrome DevTools Performance tab

### 6.4 Offline Capability

- **Models cached**: Verify models load from IndexedDB after first download
- **Test offline**: Disable network, verify models still work
- **Project save/load**: localStorage persists across sessions

**Test**: DevTools Network tab set to "Offline", verify app still functions

### 6.5 Error Handling

- **Failed image import**: Show clear error message
- **Model download failure**: Offer retry option
- **localStorage quota exceeded**: Handle gracefully (warn user, oldest project deleted)
- **Large image crash**: Gracefully handle if image > canvas limits

### 6.6 Browser Compatibility

Test on:
- Chrome/Edge (latest)
- Safari (iOS 15+)
- Firefox (latest)

**Verify**: Canvas API, IndexedDB, localStorage all work

### 6.7 Accessibility

- **Keyboard navigation**: Tab through buttons, inputs, controls
- **Focus indicators**: Visible on all interactive elements
- **Color contrast**: Verify 4.5:1 ratio (use WebAIM contrast checker)
- **ARIA labels**: All buttons/inputs have meaningful labels

### 6.8 Documentation

**Update README.md**:
- What PicFlam v2 does (3 tabs, AI features, offline capability)
- How to use (install, run, build)
- Browser support
- Offline requirements
- Performance notes (first-time model download ~100MB)

**Create CONTRIBUTING.md**:
- How to add new templates
- How to extend AI features
- Code style (following AGENTS.md)
- Testing workflow

**Deliverable**:
- [ ] All three tabs work end-to-end
- [ ] Cross-tab workflows tested
- [ ] Mobile responsive (tested on real device)
- [ ] Offline capability verified
- [ ] Performance acceptable
- [ ] No console errors or warnings
- [ ] Browser compatibility verified
- [ ] Accessibility baseline met
- [ ] README and docs updated

---

## PHASE 6 END: Final Gate & Review

**Agent MUST**:
1. Run full test suite (all workflows, all devices)
2. Generate Lighthouse report
3. Verify no console errors
4. Commit final version to v2-sveltekit branch
5. Create pull request to main (but DO NOT MERGE)

**User WILL**:
1. Comprehensive local testing (all devices, all workflows)
2. Review documentation
3. Final approval or requests for changes

**After user approval:**
- Merge PR to main
- Cloudflare Pages auto-deploys v2 to live URL
- v1 code archived in `v1-final` tag

---

## Phase 7: Deployment & Launch (0.5 days)

### 7.1 Pre-Deployment Checklist

- [ ] All phases complete and tested
- [ ] No outstanding bugs or TODOs
- [ ] README and docs finalized
- [ ] Icons and logos optimized
- [ ] Model caching verified
- [ ] Performance acceptable on target devices

### 7.2 Deploy to Cloudflare Pages

**Process**:
1. Merge `v2-sveltekit` → `main` in GitHub
2. Cloudflare Pages sees new commit on main
3. Triggers build: `npm run build`
4. Output (`dist/`) deployed to picflam.com or current custom domain
5. Live immediately (no downtime)

**Verify**:
- [ ] Site loads on live URL
- [ ] All features work
- [ ] Models download and cache
- [ ] Export/download works on live site

### 7.3 Monitor

- Check error logs (Cloudflare)
- Monitor performance (Lighthouse)
- Gather user feedback

---

## Timeline Summary

| Phase | Duration | Key Deliverable | User Sign-Off |
|-------|----------|-----------------|---------------|
| 0: Design System | 2-3 days | DESIGN_SYSTEM.md + template | User reviews colors, fonts |
| 1: Architecture | 1 day | Stores, routing, utilities | User tests tab switching |
| 2: UI Components | 2-3 days | Button library, layout | User reviews component styles |
| 3: Crop Tab | 3-4 days | Image import, crop, filter | User tests crop workflow |
| 4: AI Tab | 2-3 days | Enhance, upscale, bg removal | User tests AI features |
| 5: Design Tab | 3-4 days | Canvas, text, quotes, overlay | User tests design workflow |
| 6: Polish & Test | 1-2 days | Mobile, offline, perf, docs | User final approval |
| 7: Deployment | 0.5 days | Live on picflam.com | Live verification |
| **Total** | **13-17 days** | **Production-ready v2** | |

---

## Important Notes for Agents

### Before Starting Each Phase

1. **Read the entire phase description** twice
2. **Study the referenced visuals** in `info/visuals/` (view all relevant .png files)
3. **Review DESIGN_SYSTEM.md** for component specs and tokens
4. **Ask clarifying questions** if anything is ambiguous
5. **DO NOT skip ahead** to next phase until user approves

### Git Workflow

- Work on `v2-sveltekit` branch
- Commit frequently with clear messages
- At each phase end, push and request user sign-off
- Do NOT merge to main until Phase 6 is complete

### Design System Consistency

- **Always use CSS custom properties** from `tokens.css`
- **Never hardcode colors or spacing** values
- **Reference DESIGN_SYSTEM.md** when building components
- **Match v2guide.md mockups exactly** for layout and spacing
- **Preserve v1 assets** (colors, fonts, quote styling)

### Testing Expectations

- **Each phase has a user testing gate**
- **Agent tests locally** before requesting sign-off
- **User tests on actual device** when possible
- **No phase gate is skipped** (prevents cascading issues)

### AI Features (Phases 4-5)

- **Transformers.js**: Official library for running models in browser
- **RMBG-1.4**: Background removal model (~50-60MB, cached)
- **CodeFormer**: Face enhancement + upscaling (~40MB, cached)
- **IndexedDB**: Store downloaded models (browser cache layer)
- **Research required**: Filter implementations (Phase 3.5) and upscaling approach

---

## Contact Points for Agent

When unclear:
- Reference v2guide.md diagrams for visual behavior
- Check DESIGN_SYSTEM.md for component specs
- Ask user directly if design ambiguity exists
- Do NOT assume or improvise UI patterns

---

## Next Steps

1. **Agent**: Begin Phase 0 (Design System Analysis)
   - Clone the 4 reference repos
   - Create ANALYSIS.md and DESIGN_SYSTEM.md
   - Build SvelteKit template
2. **User**: Await Phase 0 delivery for review
