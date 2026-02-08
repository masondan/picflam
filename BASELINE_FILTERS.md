# Baseline.is CSS Photo Filters Library

36 professional photo filters extracted from https://baseline.is/tools/css-photo-filters/

Each filter includes:
- **CSS filter chain**: applied to the image
- **Overlay color**: hex code for color tint
- **Blend mode**: how overlay combines with image
- **Opacity**: overlay intensity

## Format Reference

```javascript
{
  id: 'filter-id',
  label: 'Filter Name',
  css: 'brightness(100%) contrast(100%) grayscale(0%) saturate(100%) sepia(0%)',
  overlay: '#hexcolor',
  blendMode: 'multiply',
  opacity: 1.0
}
```

---

## Complete Filter Definitions

### Basic Filters
1. **Normal** - No effect
   - CSS: `grayscale(0%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: None

2. **Icy Water**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(140%) sepia(0%)`
   - Overlay: `#00ccfa` (bright cyan)
   - Blend: `multiply`
   - Opacity: `1`

3. **Summer Heat**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#ff6b6b` (warm red)
   - Blend: `multiply`
   - Opacity: `1`

4. **Fever**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#ff3333` (bright red)
   - Blend: `multiply`
   - Opacity: `1`

5. **Strawberry**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#ff1744` (hot pink-red)
   - Blend: `multiply`
   - Opacity: `1`

6. **Ibiza**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#f50057` (magenta)
   - Blend: `multiply`
   - Opacity: `1`

7. **Sweet Sunset**
   - CSS: `brightness(112%) contrast(115%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#ff8a00` (orange)
   - Blend: `multiply`
   - Opacity: `1`

8. **Blue Rock**
   - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#1a237e` (dark blue)
   - Blend: `multiply`
   - Opacity: `0.85`

9. **Ocean Wave**
   - CSS: `brightness(110%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
   - Overlay: `#00838f` (teal)
   - Blend: `multiply`
   - Opacity: `0.8`

10. **Little Red**
    - CSS: `contrast(110%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#c62828` (dark red)
    - Blend: `multiply`
    - Opacity: `1`

11. **Vintage May**
    - CSS: `brightness(120%) contrast(80%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#8b6914` (olive brown)
    - Blend: `multiply`
    - Opacity: `0.8`

12. **Space Trip**
    - CSS: `contrast(150%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#1a0033` (deep purple)
    - Blend: `multiply`
    - Opacity: `0.9`

13. **Desert Morning**
    - CSS: `brightness(130%) contrast(90%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#ff9800` (orange)
    - Blend: `multiply`
    - Opacity: `0.7`

14. **Blue Lagoon**
    - CSS: `brightness(95%) contrast(110%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#0277bd` (bright blue)
    - Blend: `multiply`
    - Opacity: `0.8`

15. **Warm Ice**
    - CSS: `brightness(110%) contrast(105%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#fff59d` (light yellow)
    - Blend: `multiply`
    - Opacity: `0.6`

16. **Burnt Coffee**
    - CSS: `contrast(80%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#5d4e37` (brown)
    - Blend: `multiply`
    - Opacity: `0.8`

17. **Waterness**
    - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#01579b` (deep blue)
    - Blend: `multiply`
    - Opacity: `0.85`

18. **Old Wood**
    - CSS: `brightness(95%) contrast(115%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#4a3f35` (dark brown)
    - Blend: `multiply`
    - Opacity: `0.75`

19. **Distant Mountain**
    - CSS: `brightness(100%) contrast(105%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#37474f` (blue-gray)
    - Blend: `multiply`
    - Opacity: `0.8`

20. **Coal Paper**
    - CSS: `brightness(90%) contrast(120%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#212121` (almost black)
    - Blend: `multiply`
    - Opacity: `0.7`

21. **Simple Gray**
    - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: None (pure grayscale)

22. **Rose Quartz**
    - CSS: `contrast(110%)`
    - Overlay: `#d9a5d1` (soft pink)
    - Blend: `multiply`
    - Opacity: `0.4`

23. **Amazon**
    - CSS: `brightness(95%) contrast(110%) saturate(110%)`
    - Overlay: `#1b5e20` (forest green)
    - Blend: `multiply`
    - Opacity: `0.6`

24. **Baseline Special**
    - CSS: `brightness(95%)`
    - Overlay: `#c4956b` (warm tan)
    - Blend: `multiply`
    - Opacity: `0.35`

25. **Baby Glass**
    - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(140%) sepia(0%)`
    - Overlay: `#00ccfa` (cyan)
    - Blend: `multiply`
    - Opacity: `1`

26. **Rose Glass**
    - CSS: `brightness(106%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#fa0000` (bright red)
    - Blend: `multiply`
    - Opacity: `1`

27. **Yellow Haze**
    - CSS: `brightness(106%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#ffff00` (pure yellow)
    - Blend: `multiply`
    - Opacity: `1`

28. **Blue Haze**
    - CSS: `brightness(110%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)`
    - Overlay: `#002bff` (pure blue)
    - Blend: `multiply`
    - Opacity: `0.76`

29. **Studio 54**
    - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: multiply`
    - Overlay: `#002b96` (dark blue)
    - Blend: `lighten`
    - Opacity: `1`

30. **Burnt Peach**
    - CSS: `grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: hard-light`
    - Overlay: `#f430a9` (magenta-pink)
    - Blend: `lighten`
    - Opacity: `1`

31. **Mono Sky**
    - CSS: `contrast(120%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: multiply`
    - Overlay: `#002a8c` (dark blue)
    - Blend: `lighten`
    - Opacity: `1`

32. **Mustard Grass**
    - CSS: `contrast(125%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: multiply`
    - Overlay: `#0d5c45` (dark green)
    - Blend: `lighten`
    - Opacity: `1`

33. **Leaf**
    - CSS: `contrast(79%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: lighten`
    - Overlay: `#f9ed3a` (bright yellow)
    - Blend: `multiply`
    - Opacity: `1`

34. **Ryellow**
    - CSS: `contrast(90%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: multiply`
    - Overlay: `#c90300` (dark red)
    - Blend: `lighten`
    - Opacity: `1`

35. **Baseline Darken**
    - CSS: `grayscale(0%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: darken`
    - Overlay: `#faaa00` (orange)
    - Blend: None (uses image blend mode)
    - Opacity: `0.13`

36. **Red Sky**
    - CSS: `contrast(120%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%); mix-blend-mode: multiply`
    - Overlay: `#ab0000` (dark red)
    - Blend: `lighten`
    - Opacity: `0.83`

---

## Implementation Notes

**Canvas Blend Modes Supported:**
- `multiply` - Darkens image, typical overlay effect
- `lighten` - Keeps lighter pixels
- `screen` - Brightens image
- `overlay` - Combines multiply and screen
- `hard-light` - Strong contrast enhancement

**Key Observations:**
1. Most filters use grayscale(100%) for a monochrome base
2. Overlay colors are applied via Canvas `fillRect()` with blend mode
3. Opacity values range from 0.13 to 1.0
4. Some filters use CSS filter chains PLUS mix-blend-mode on the image itself
5. Yellow/bright overlays often use lighter opacity (0.35-0.76)
6. Dark color overlays typically use full opacity (0.8-1.0)

---

## Recommended For PicFlam

**For journalists, most useful filters:**
- Rose Quartz (elegant, neutral mood)
- Baseline Special (warm, accessible)
- Blue Lagoon (professional, modern)
- Burnt Coffee (vintage, journalistic feel)
- Simple Gray (timeless, archival quality)
- Red Sky (urgent, breaking news vibe)

