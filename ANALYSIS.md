# PicFlam v2 Design System Analysis

**Phase 0.1 Deliverable** | Analyzed: AudioFlam, ChartFlam, MapFlam, PromptFlam, PicFlam v1

---

## 1. AudioFlam UI Patterns (Primary Reference)

AudioFlam is the most refined Flam app and serves as the primary UI pattern source.

### 1.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-indigo-bloom` | `#5422b0` | Primary brand purple (buttons, active states) |
| `--color-lavender-veil` | `#f0e6f7` | Light purple tint |
| `--color-text-primary` | `#333333` | Main text |
| `--color-text-secondary` | `#777777` | Secondary text, inactive icons |
| `--color-app-bg` | `#efefef` | App background |
| `--color-white` | `#ffffff` | Surface, cards |
| `--color-border` | `#999999` | Standard borders |
| `--color-border-dark` | `#777777` | Darker borders |

### 1.2 Typography

```css
--font-family-base: 'Inter', sans-serif;
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
```

### 1.3 Spacing Scale

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### 1.4 Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

### 1.5 Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### 1.6 Button Patterns

**Primary (Active/Purple)**:
- Background: `#5422b0`
- Text: `#ffffff`
- Border-radius: `8px`

**Secondary (Inactive)**:
- Background: transparent or `#e0e0e0`
- Icon/text: `#777777`
- Border: `1px solid #cccccc`

**Icon Buttons (Header Navigation)**:
- Inactive: `#777777` icon inside `#777777` circle outline
- Active: White icon inside solid `#5422b0` circle

### 1.7 Control Patterns

**Sliders**:
- Track: `#ccc` (4px height)
- Thumb: `#555555` (16px diameter, rounded)
- Hover: scale 1.15

**Toggle Panels**:
- Expandable `<details>` elements
- Header with chevron icons (expand/collapse)
- Auto-close other panels when one opens

**Drawers**:
- Full-screen slide-up from bottom
- Header with title + Done/Close button
- Animation: 300ms ease-out

---

## 2. ChartFlam UI Patterns

### 2.1 Additional Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--splash-gradient` | `#5422b0` | Splash screen background |
| `--enter-btn` | `#FFD700` | Yellow CTA button |
| `--enter-btn-hover` | `#FFC107` | Yellow hover state |
| `--favourite-active` | `#DC143C` | Red/error states |
| `--copy-active` | `#4f0388` | Copy/action states |

### 2.2 App Container Pattern

```css
.app-container {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
}

@media (min-width: 768px) {
  .app-container {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
}
```

### 2.3 Control Sections

- White background with `border-radius: 12px`
- Box-shadow: `0 2px 5px rgba(0, 0, 0, 0.05)`
- Min-height: `56px`
- Padding: `8px 16px`

---

## 3. PicFlam v1 Canvas Assets (PRESERVE)

These assets MUST be preserved in v2.

### 3.1 Design Canvas Solid Colors

```javascript
const SOLID_COLORS = [
  '#FFFFFF',  // White
  '#000000',  // Black
  '#007C1F',  // Green
  '#00679D',  // Blue
  '#B20715',  // Red
];
```

### 3.2 Design Canvas Gradients

```javascript
const GRADIENTS = [
  'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',  // Purple-Indigo
  'linear-gradient(135deg, #15509B 0%, #20244F 100%)',  // Navy-Dark
  'linear-gradient(135deg, #A8076B 0%, #62045F 100%)',  // Magenta-Dark
  'linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%)',  // Red-Dark
  'linear-gradient(135deg, #0A8F9D 0%, #202B54 100%)',  // Teal-Dark
  'linear-gradient(135deg, #D17A29 0%, #41363C 100%)',  // Orange-Brown
];
```

### 3.3 Highlight Color

```javascript
const HIGHLIGHT_COLOR = '#FFD700';  // Yellow for text highlighting
```

### 3.4 Design Canvas Typography

**Body Fonts** (for text layers):
- Inter (default)
- Roboto Slab
- Saira Condensed
- Lora
- Playfair Display
- Special Elite

**Quote Fonts**:
- Serif quote: `Playfair Display, bold`
- Slab quote: `Alfa Slab One`
- Fallback: `Saira Stencil One`

### 3.5 Quote Styling Logic (from canvasUtils.js)

```javascript
// Quote size calculation
const quoteSizeVal = baseFontSize * 4 * (quoteSize / 5);

// Quote fonts
if (quoteStyle === 'serif') {
  quoteFont = `bold ${quoteSizeVal}px "Playfair Display", serif`;
} else if (quoteStyle === 'slab') {
  quoteFont = `${quoteSizeVal}px "Alfa Slab One", cursive`;
}

// Quote positioning
const textTop = yPosition - (totalTextHeight / 2);
const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4);
const quoteBottom = textTop - gap;
```

### 3.6 Text Label Background

```javascript
// Label padding
const paddingHorizontal = lineHeight * 0.6;
const paddingTop = lineHeight * 0.5;
const paddingBottom = lineHeight * 0.3;
const cornerRadius = lineHeight * 0.3;
```

### 3.7 Footer Menu

```css
.footer-menu {
  height: 70px;
  background-color: #555555;
  color: white;
}
```

---

## 4. Design Differences & Unification Rationale

| Aspect | AudioFlam | ChartFlam | PicFlam v1 | v2 Recommendation |
|--------|-----------|-----------|------------|-------------------|
| Primary purple | `#5422b0` | `#5422b0` | `#8A2BE2` | Use `#5422b0` for UI, keep `#8A2BE2` in canvas gradients |
| Background | `#efefef` | `#ffffff` | `#ffffff` | Use `#ffffff` (cleaner for image editing) |
| Footer | N/A | N/A | `#555555` | Keep `#555555` for dark panels/drawers |
| Text primary | `#333333` | `#333333` | `#333` | Use `#333333` |
| Text secondary | `#777777` | `#555555` | `#555555` | Use `#555555` (darker, better contrast) |
| Border | `#999999` | `#cccccc` | `#cccccc` | Use `#cccccc` (lighter, cleaner) |

### Key Decisions

1. **Primary Brand Color**: `#5422b0` for all UI elements (consistency with other Flam apps)
2. **Canvas Palette**: Preserve ALL v1 colors and gradients exactly (users expect them)
3. **Typography**: Use Inter for UI, preserve all v1 canvas fonts
4. **Spacing**: Adopt AudioFlam's 4px-based scale
5. **Components**: Follow AudioFlam patterns for buttons, sliders, toggles

---

## 5. SvelteKit Component Architecture Recommendations

### 5.1 Folder Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.svelte
│   │   │   ├── Slider.svelte
│   │   │   ├── Toggle.svelte
│   │   │   ├── Drawer.svelte
│   │   │   ├── Modal.svelte
│   │   │   └── Icon.svelte
│   │   ├── layout/
│   │   │   ├── Header.svelte
│   │   │   ├── TabBar.svelte
│   │   │   └── ActionBar.svelte
│   │   ├── crop/               # Crop tab components
│   │   ├── ai/                 # AI tab components
│   │   └── design/             # Design tab components
│   ├── stores/
│   │   ├── imageStore.js       # Current image state
│   │   ├── cropStore.js        # Crop settings
│   │   ├── aiStore.js          # AI processing state
│   │   └── slideStore.js       # Design canvas state (from v1)
│   ├── utils/
│   │   ├── canvasUtils.js      # Canvas rendering (port from v1)
│   │   ├── imageUtils.js       # Image processing
│   │   └── storageUtils.js     # localStorage/IndexedDB
│   └── styles/
│       ├── tokens.css          # CSS custom properties
│       └── global.css          # Global styles
├── routes/
│   └── +page.svelte            # Single-page app (no routing needed)
└── app.html
```

### 5.2 State Management

Use Svelte stores for:
- `imageStore`: Current working image (shared across tabs)
- `historyStore`: Undo/redo stack
- `uiStore`: Active tab, drawer state, modals

### 5.3 Component Patterns

**Drawer Pattern** (reusable):
```svelte
<Drawer title="Background" on:close={handleClose}>
  <slot />
</Drawer>
```

**Icon Pattern** (SVG sprites):
```svelte
<Icon name="crop" size={24} />
```

**Slider Pattern**:
```svelte
<Slider 
  label="Brightness" 
  min={-100} 
  max={100} 
  value={brightness} 
  on:change={handleChange} 
/>
```

---

## 6. Agent Checklist

- [x] Studied AudioFlam repository (UI patterns, CSS tokens)
- [x] Studied ChartFlam repository (additional patterns)
- [x] Extracted color tokens with hex values and semantic names
- [x] Documented typography scale and font families
- [x] Identified reusable component patterns from AudioFlam
- [x] Listed all v1 assets to preserve (colors, fonts, quote logic)
- [x] Created ANALYSIS.md with findings

---

## Next Step

Proceed to **Phase 0.2**: Create `DESIGN_SYSTEM.md` as the single source of truth for styling.
