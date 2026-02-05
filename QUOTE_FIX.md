# Quote Positioning Fix - v2

## Problem
When resizing quotes in v2, the following issues occurred:
1. Text 1 jumped to the bottom of the screen
2. Quotes appeared off the top
3. Resizing quotes caused text to move up/down
4. The space between quotes and text was not constant

## Root Cause
The gap between quotes and text was calculated in **EM units**, which are relative to the element's font-size:

```javascript
--quote-gap: {(1 + $slideState.text1LineSpacing * 0.1) * $slideState.text1Size * 0.5 * multiplier}em;
```

**When quote size changed:**
1. Quote font-size updated: `canvasMinDim * 0.08 * quoteSize` (px)
2. The EM-based gap recalculated against the NEW font-size
3. Margin-bottom expanded in pixels (not proportional to quote size)
4. Browser layout reflow moved the text wrapper

## Solution
Changed gap from **EM units to fixed pixel values**, calculated based on **text line-height** (not quote font-size):

```javascript
{@const textFontSizePx = (canvasMinDim * 0.1 * $slideState.text1Size) / 5}
{@const textLineHeightPx = textFontSizePx * (1 + $slideState.text1LineSpacing * 0.1)}
{@const gapPx = textLineHeightPx * ($slideState.text1QuoteStyle === 'slab' ? 0.35 : 0.4)}
```

Then applied directly:
```html
margin-bottom: {gapPx}px;
```

## Key Changes in DesignTab.svelte

### Lines 260-271 (Quote rendering)
- Added three Svelte constants to calculate text font size and gap in pixels
- Changed CSS from `--quote-gap: ...em` to `margin-bottom: {gapPx}px`
- Gap now decoupled from quote's font-size

### Lines 514-519 (CSS)
- Removed `margin-bottom: var(--quote-gap, 0.5em)` from `.canvas-quote` class
- Now uses inline pixel-based margin-bottom instead

## Behavior After Fix

✅ **Quote resizing**: Quote grows/shrinks, gap stays constant  
✅ **Text position**: Text 1 stays in place, unaffected by quote changes  
✅ **Quote positioning**: Quote baseline fixed relative to text  
✅ **Text resizing**: When text size changes, gap scales with it (correct)  
✅ **Text repositioning**: When text Y-position changes, quote moves with it (correct)  

## Formula Alignment with v1

The fix aligns with v1's canvas rendering logic:
```javascript
// v1
const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4);
const quoteBottom = textTop - gap;

// v2 (now)
const gapPx = textLineHeightPx * (quoteStyle === 'slab' ? 0.35 : 0.4);
margin-bottom: {gapPx}px;
```

Both ensure the gap is **proportional to text line-height**, not to quote size.
