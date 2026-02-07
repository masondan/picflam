# Quote Positioning: Final Fix

## Problem

Lock the gap (pixel distance) between a quote glyph (❝) and the text below it to a **fixed value** regardless of:
1. Number of text lines (1 line vs 4+ lines)
2. Text size changes
3. Quote size changes

## Failed Approaches

### 1. Two Separate Absolutely-Positioned Elements
- Quote and text positioned independently with `position: absolute` + `translateY(-50%)`
- Quote Y calculated as offset from text's center point
- **Failed because**: text center stays fixed but top edge moves with line count, causing gap drift

### 2. Anchoring Quote to Text's Measured Top Edge
- Measured text wrapper height via `bind:this` + `offsetHeight`
- Calculated text top edge: `textYPosPct - (textHeightPct / 2)`
- Changed quote to `translateY(-100%)` (bottom-anchored)
- **Failed because**: DOM measurement timing lagged behind slider changes, and font metrics varied with quote size causing the bottom edge to be inconsistent

## The Solution: Flow-Based Layout

**Core concept**: Put quote and text inside a **single flex container** using normal document flow. The browser handles layout; the gap is a simple `margin-bottom`.

### Architecture

```
text1-flow-container (position: absolute; top: X%; translateY(-50%))
  ├── canvas-quote (normal flow, margin-bottom: gapPx)
  └── canvas-text (normal flow)
```

- Only ONE absolutely-positioned element (the container)
- Quote and text stack naturally via `flex-direction: column`
- Gap is a pixel-based `margin-bottom` on the quote
- Container centers as a unit — no compound calculations

### Gap Calculation

```javascript
{@const textFontSizePx = (canvasMinDim * 0.06 * $slideState.text1Size) / 5}
{@const textLineHeightPx = textFontSizePx * (1 + $slideState.text1LineSpacing * 0.1)}
{@const quoteFontSizePx = canvasMinDim * 0.133 * $slideState.text1QuoteSize}
{@const isSlab = $slideState.text1QuoteStyle === 'slab'}
{@const baseGapPx = textLineHeightPx * (isSlab ? -0.5 : -0.25)}
{@const leadingCompensation = quoteFontSizePx * (isSlab ? 0.4 : 0.3)}
{@const gapPx = baseGapPx - leadingCompensation}
```

### Leading Compensation

The quote glyph (❝) has internal leading — dead space between the glyph's visual bottom and the line box bottom. This space scales linearly with font-size, so increasing quote size would increase the visual gap. The `leadingCompensation` term subtracts a fraction of the quote's font-size to cancel this out.

**Tuning parameters** (per font):
- **Slab (Alfa Slab One)**: `leadingCompensation = quoteFontSizePx * 0.4`
- **Serif (Playfair Display)**: `leadingCompensation = quoteFontSizePx * 0.3`

Increase these values if larger quotes still show too much gap. Decrease if small quotes overlap.

### CSS

```css
.text1-flow-container {
    position: absolute;
    left: 7.5%;
    right: 7.5%;
    width: 85%;
    transform: translateY(-50%);
    z-index: 5;
    overflow: visible;
    display: flex;
    flex-direction: column;
}

.canvas-quote {
    line-height: 1;
}
```

## Tuning Reference

### Numbers that adjust the GAP between quote and text

In `DesignTab.svelte`, the gap calculation constants:

| Parameter | Location | Effect |
|-----------|----------|--------|
| `baseGapPx` multipliers | Line ~425 | Base gap size. Currently `-0.5` (slab) / `-0.25` (serif). More negative = smaller gap |
| `leadingCompensation` multipliers | Line ~426 | Cancels font internal leading. Currently `0.4` (slab) / `0.3` (serif). Higher = quote sits closer to text |

### Numbers that adjust TEXT SIZE

| Parameter | Location | Effect |
|-----------|----------|--------|
| `0.3` in `text1Size * 0.3}em` | DesignTab.svelte ~L452 | Visual text size multiplier per slider step |
| `0.06` in `canvasMinDim * 0.06` | DesignTab.svelte ~L421 | Pixel text size for gap calculations |
| Text slider range | Text1Controls.svelte ~L184 | `min={1} max={9}`, default 5 (center) |

### Numbers that adjust QUOTE SIZE

| Parameter | Location | Effect |
|-----------|----------|--------|
| `0.133` in `canvasMinDim * 0.133` | DesignTab.svelte ~L423 | Quote glyph size multiplier per slider step |
| Quote slider range | Text1Controls.svelte ~L280 | `min={1} max={5}`, default 3 (center) |

## Results

- ✅ Adding/removing text lines: gap stays constant
- ✅ Changing text size: gap stays constant
- ✅ Changing quote size: gap stays constant (with leading compensation)
- ✅ Moving text Y position: quote moves with text
- ✅ Switching quote style (serif/slab): gap adjusts per font metrics

## Key Lesson

Avoid positioning interdependent elements independently with absolute positioning. Use a single container with normal document flow — let the browser handle layout, and control the gap with a simple margin.
