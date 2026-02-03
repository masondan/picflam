# PicFlam Design System

**Version**: 2.0  
**Status**: Single Source of Truth  
**Applies to**: PicFlam v2 and future Flam apps

---

## A. Color System

### A.1 Semantic Tokens (UI)

Use these for all interface elements.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#5422b0` | Brand purple - buttons, active states, focus |
| `--color-primary-light` | `#f0e6f7` | Light purple tint - hover backgrounds |
| `--color-surface` | `#ffffff` | Cards, panels, app background |
| `--color-surface-dark` | `#555555` | Dark panels, drawer headers, footer |
| `--color-text-primary` | `#333333` | Main body text |
| `--color-text-secondary` | `#555555` | Secondary text, labels |
| `--color-text-muted` | `#999999` | Disabled text, placeholders |
| `--color-text-inverse` | `#ffffff` | Text on dark backgrounds |
| `--color-border` | `#cccccc` | Standard borders |
| `--color-border-light` | `#eeeeee` | Subtle dividers |
| `--color-accent` | `#FFD700` | Yellow - highlights, CTAs |
| `--color-error` | `#DC143C` | Error states, destructive actions |
| `--color-success` | `#10b981` | Success feedback |

### A.2 Design Canvas Palette (User-Facing)

These colors appear in the Background and Text Color pickers.

**Solid Colors**:
```css
--canvas-white: #FFFFFF;
--canvas-black: #000000;
--canvas-green: #007C1F;
--canvas-blue: #00679D;
--canvas-red: #B20715;
```

**Gradients** (6 presets):
```css
--gradient-purple: linear-gradient(135deg, #5422b0 0%, #4B0082 100%);
--gradient-navy: linear-gradient(135deg, #15509B 0%, #20244F 100%);
--gradient-magenta: linear-gradient(135deg, #A8076B 0%, #62045F 100%);
--gradient-red: linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%);
--gradient-teal: linear-gradient(135deg, #0A8F9D 0%, #202B54 100%);
--gradient-orange: linear-gradient(135deg, #D17A29 0%, #41363C 100%);
```

**Highlight Color**:
```css
--canvas-highlight: #FFD700;  /* Yellow for text highlighting */
```

---

## B. Typography

### B.1 UI Fonts

```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

### B.2 Design Canvas Fonts

Available for user text layers:

| Font | Category | Usage |
|------|----------|-------|
| Inter | Sans-serif | Default body text |
| Roboto Slab | Slab-serif | Headlines, emphasis |
| Saira Condensed | Condensed | Compact headlines |
| Lora | Serif | Elegant body text |
| Playfair Display | Serif | Decorative headlines |
| Special Elite | Typewriter | Stylized text |

**Quote-Specific Fonts**:

| Style | Font | Weight |
|-------|------|--------|
| Serif | Playfair Display | Bold |
| Slab | Alfa Slab One | Regular |

### B.3 Font Scale

```css
--font-size-xs: 0.75rem;    /* 12px - captions, labels */
--font-size-sm: 0.875rem;   /* 14px - secondary text */
--font-size-base: 1rem;     /* 16px - body, inputs */
--font-size-lg: 1.125rem;   /* 18px - emphasis */
--font-size-xl: 1.25rem;    /* 20px - headings */
--font-size-2xl: 1.5rem;    /* 24px - large headings */
```

### B.4 Font Weights

```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### B.5 Line Heights

```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

---

## C. Spacing System

Based on 4px increments.

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

### C.1 Layout Constants

```css
--header-height: 56px;
--footer-height: 70px;
--app-max-width: 480px;
--content-padding: var(--space-4);  /* 16px */
--touch-target-min: 44px;
```

---

## D. Border Radius

```css
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

## E. Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-card: 0 2px 5px rgba(0, 0, 0, 0.05);
```

---

## F. Transitions

```css
--transition-fast: 150ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
--transition-drawer: 300ms ease-out;
```

---

## G. Component Specifications

### G.1 Buttons

**Primary Button**:
```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  height: 44px;
  padding: 0 var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:active { opacity: 0.8; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
```

**Secondary Button (Outline)**:
```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-text-secondary);
  height: 44px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-secondary:hover { background-color: var(--color-border-light); }
.btn-secondary.active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}
```

**Icon Button**:
```css
.btn-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-icon:hover { background-color: var(--color-border-light); }
.btn-icon.active { color: var(--color-primary); }
.btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }
```

**Header Navigation Button** (circular):
```css
.btn-nav {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-text-secondary);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-nav.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}
```

### G.2 Input Fields

```css
.input {
  width: 100%;
  height: 44px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  transition: border-color var(--transition-fast);
}
.input::placeholder { color: var(--color-text-muted); }
.input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.input:disabled {
  background-color: var(--color-border-light);
  cursor: not-allowed;
}
```

**Textarea**:
```css
.textarea {
  /* Inherits .input styles */
  min-height: 100px;
  resize: vertical;
  line-height: var(--line-height-normal);
}
```

### G.3 Sliders

```css
.slider {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--color-border);
  appearance: none;
  cursor: pointer;
}
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-text-secondary);
  cursor: pointer;
  transition: transform var(--transition-fast);
}
.slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background: var(--color-text-secondary);
  border: none;
  cursor: pointer;
}
```

### G.4 Toggle Buttons (Grouped)

```css
.toggle-group {
  display: flex;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.toggle-btn {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: none;
  border-right: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.toggle-btn:last-child { border-right: none; }
.toggle-btn:hover { background-color: var(--color-border-light); }
.toggle-btn.active {
  background-color: var(--color-surface-dark);
  color: var(--color-text-inverse);
}
```

### G.5 Drawers (Bottom Sheets)

```css
.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.drawer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--app-max-width);
  max-height: 90vh;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  overflow: hidden;
  animation: slideUp var(--transition-drawer);
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background-color: var(--color-surface-dark);
  color: var(--color-text-inverse);
}
.drawer-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}
.drawer-body {
  padding: var(--space-4);
  overflow-y: auto;
}

@keyframes slideUp {
  from { transform: translateX(-50%) translateY(100%); }
  to { transform: translateX(-50%) translateY(0); }
}
```

### G.6 Modals

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: var(--space-4);
}
.modal {
  width: 100%;
  max-width: 320px;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
}
.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-2);
}
.modal-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}
.modal-actions {
  display: flex;
  gap: var(--space-3);
}
.modal-actions > * { flex: 1; }
```

### G.7 Color Swatches

```css
.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.color-swatch:hover { transform: scale(1.1); }
.color-swatch.active { border-color: var(--color-primary); }

/* White swatch needs visible border */
.color-swatch[data-color="#FFFFFF"] {
  border-color: var(--color-border);
}
.color-swatch[data-color="#FFFFFF"].active {
  border-color: var(--color-primary);
}
```

### G.8 Import Area (Dotted Border)

```css
.import-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.import-area:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}
.import-area-icon {
  width: 48px;
  height: 48px;
  color: var(--color-text-muted);
}
.import-area-text {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}
.import-area-hint {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
```

### G.9 Action Bar (Undo/Redo/Export Row)

```css
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
}
.action-bar-left,
.action-bar-right {
  display: flex;
  gap: var(--space-2);
}
```

### G.10 Menu Tabs (Crop/Edit/Filter)

```css
.menu-tabs {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
}
.menu-tab {
  background: none;
  border: none;
  padding: var(--space-2) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all var(--transition-fast);
}
.menu-tab:hover { color: var(--color-text-secondary); }
.menu-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

---

## H. Layout Patterns

### H.1 App Container

```css
.app {
  max-width: var(--app-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
}

@media (min-width: 481px) {
  .app {
    box-shadow: var(--shadow-lg);
  }
}
```

### H.2 Header

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border-light);
}
.header-logo {
  height: 28px;
}
.header-nav {
  display: flex;
  gap: var(--space-2);
}
```

### H.3 Main Content Area

```css
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: var(--space-4);
}
```

### H.4 Control Panel

```css
.control-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}
.control-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.control-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  min-width: 80px;
}
```

---

## I. Icons

All icons are 24x24 SVGs by default. Use the provided icon set in `info/icons/`.

### I.1 Icon Sizing

```css
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 24px; height: 24px; }  /* Default */
.icon-lg { width: 32px; height: 32px; }
```

### I.2 Icon Colors

Icons inherit `currentColor`. Set color via parent element:

```css
.btn-icon { color: var(--color-text-secondary); }
.btn-icon.active { color: var(--color-primary); }
```

---

## J. Accessibility

### J.1 Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### J.2 Touch Targets

All interactive elements must have minimum 44x44px touch target.

### J.3 Color Contrast

- Text on light backgrounds: minimum 4.5:1 ratio
- Text on dark backgrounds (`--color-surface-dark`): use `--color-text-inverse`

### J.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## K. CSS Custom Properties (tokens.css)

Complete token file for import:

```css
:root {
  /* Colors - UI */
  --color-primary: #5422b0;
  --color-primary-light: #f0e6f7;
  --color-surface: #ffffff;
  --color-surface-dark: #555555;
  --color-text-primary: #333333;
  --color-text-secondary: #555555;
  --color-text-muted: #999999;
  --color-text-inverse: #ffffff;
  --color-border: #cccccc;
  --color-border-light: #eeeeee;
  --color-accent: #FFD700;
  --color-error: #DC143C;
  --color-success: #10b981;

  /* Colors - Canvas */
  --canvas-white: #FFFFFF;
  --canvas-black: #000000;
  --canvas-green: #007C1F;
  --canvas-blue: #00679D;
  --canvas-red: #B20715;
  --canvas-highlight: #FFD700;

  /* Typography */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;

  /* Layout */
  --header-height: 56px;
  --footer-height: 70px;
  --app-max-width: 480px;
  --content-padding: var(--space-4);
  --touch-target-min: 44px;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-card: 0 2px 5px rgba(0, 0, 0, 0.05);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease;
  --transition-drawer: 300ms ease-out;
}
```

---

## L. Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Inter:wght@400;500;600;700&family=Lora:wght@400;700&family=Playfair+Display:wght@400;700&family=Roboto+Slab:wght@400;700&family=Saira+Condensed:wght@400;700&family=Special+Elite&display=swap');
```

---

## M. Quote Styling Rules (from v1)

### M.1 Quote Size Calculation

```javascript
const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.1;
const quoteSizeVal = baseFontSize * 4 * (quoteSize / 5);
```

### M.2 Quote Fonts

```javascript
if (quoteStyle === 'serif') {
  font = `bold ${quoteSizeVal}px "Playfair Display", serif`;
} else if (quoteStyle === 'slab') {
  font = `${quoteSizeVal}px "Alfa Slab One", cursive`;
}
```

### M.3 Quote Positioning

```javascript
const textTop = yPosition - (totalTextHeight / 2);
const gap = quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4;
const quoteBottom = textTop - gap;
```

---

*End of Design System*
