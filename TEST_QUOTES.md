# Quote Fix - Testing Checklist

## Setup
1. Run `npm run dev` (should run on http://localhost:5174)
2. Click the **Design** tab
3. Click **Start with blank canvas**
4. Enter some text in the **Text 1** field (e.g., "Testing the quotes in PicFlam")
5. Set **text1YPosition** to 3 (upper half of canvas) via Text 1 controls

## Test 1: Quote Addition (Initial State)
- [ ] Click the **Quote** tab
- [ ] Select quote style: **Serif** or **Slab**
- [ ] Verify quotes appear just above the text
- [ ] Verify there is a fixed, consistent gap between quote baseline and text top

## Test 2: Quote Resizing (Critical Test)
- [ ] With quote visible, adjust **Quote Size** slider from min to max
- **VERIFY (each resize):**
  - [ ] Quote grows/shrinks (expected)
  - [ ] Text 1 stays in exact same Y position (should NOT move)
  - [ ] Gap between quote and text remains visually constant
  - [ ] No layout shift or reflow

## Test 3: Quote Style Change
- [ ] Toggle between **Serif** and **Slab** styles
- **VERIFY:**
  - [ ] Text 1 does NOT move
  - [ ] Gap stays constant (slab has slightly tighter gap than serif, but within text)

## Test 4: Text Resizing (Should Scale Gap Correctly)
- [ ] Adjust **Text 1 Size** slider
- **VERIFY:**
  - [ ] Text grows/shrinks
  - [ ] Gap between quote and text scales proportionally (gap gets bigger when text is bigger)
  - [ ] This is CORRECT behavior (gap should scale with text, not be independent)

## Test 5: Text Line Spacing (Should Scale Gap)
- [ ] Adjust **Text 1 Line Spacing** slider
- **VERIFY:**
  - [ ] Text spacing increases/decreases
  - [ ] Gap scales accordingly (more line spacing = bigger gap)
  - [ ] This is CORRECT behavior

## Test 6: Text Repositioning (Quote Should Follow)
- [ ] Adjust **Text 1 Y Position** slider
- **VERIFY:**
  - [ ] Text moves up/down the canvas
  - [ ] Quote moves with text, maintaining exact same relative position
  - [ ] Gap remains constant

## Expected Results
All 6 tests should pass with:
- ✅ Text never jumps unexpectedly
- ✅ Gap between text and quote always appears static
- ✅ Resizing quotes does NOT affect text position
- ✅ Quote size changes only affect the quote glyph, not spacing
- ✅ Text size changes DO scale the gap proportionally (correct)

## If Issues Occur
Check browser console for errors:
```javascript
// Should see no errors in console
// Dev tools should show inline margin-bottom: XXpx on .canvas-quote
```

Verify the inline style on the quote element contains:
```html
margin-bottom: 12.5px; <!-- or similar pixel value -->
```

NOT:
```html
--quote-gap: 0.5em;
```
