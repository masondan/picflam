# Phase 1 Implementation Plan - Artifact Fix

## Changes to Implement

### Change 1: Round Canvas Coordinates (canvasUtils.js)
**File**: `src/utils/canvasUtils.js`
**Function**: `drawLayer()`
**Lines**: ~155-157

**Current Code**:
```javascript
const finalX = (canvas.width - renderWidthHighRes) / 2 + xHighRes;
const finalY = (canvas.height - renderHeightHighRes) / 2 + yHighRes;
```

**New Code**:
```javascript
const finalX = Math.round((canvas.width - renderWidthHighRes) / 2 + xHighRes);
const finalY = Math.round((canvas.height - renderHeightHighRes) / 2 + yHighRes);
```

**Debugging Addition**:
```javascript
// Debug logging for Android testing
if (typeof window !== 'undefined' && /Android/i.test(navigator.userAgent)) {
  console.log('[Android Debug] Drawing image at:', { 
    finalX, 
    finalY, 
    width: renderWidthHighRes, 
    height: renderHeightHighRes,
    scale: layer.scale 
  });
}
```

---

### Change 2: Use requestAnimationFrame (ImageTransformControl.jsx)
**File**: `src/components/ImageTransformControl.jsx`

**Add at top of component**:
```javascript
const rafRef = useRef(null);
```

**Modify handleMouseMove function**:
- Wrap `onLayerUpdate` call in `requestAnimationFrame`
- Cancel previous frame if still pending
- Add debug logging

**Add cleanup in handleMouseUp**:
- Cancel any pending animation frame

---

## Testing Checklist

After implementation, test:

### On Android Devices (Pixel 9a, Redmi 14c):
- [ ] Logo images - drag anywhere, check for artifacts below
- [ ] Logo images - drag to right edge, check for artifacts to right
- [ ] Landscape main images - drag anywhere, check for artifacts below
- [ ] Portrait main images - drag anywhere, verify no artifacts
- [ ] Verify smooth dragging (not too choppy)
- [ ] Check console logs for debug output

### On iOS Devices (iPhone 11, iPad Mini):
- [ ] Verify no regressions
- [ ] Smooth dragging maintained
- [ ] No new issues introduced

### On Desktop (Chrome/Safari):
- [ ] Verify no regressions
- [ ] Smooth dragging maintained
- [ ] No new issues introduced

### Functionality Tests (All Platforms):
- [ ] Click/tap to select elements still works
- [ ] Image resizing still works
- [ ] Text editing still works
- [ ] Delete button still works
- [ ] Save/load projects still works

---

## Rollback Plan

If issues arise:
1. Git revert the changes
2. Document what went wrong
3. Proceed to Phase 2 with additional Android-specific clear

---

## Success Criteria

Phase 1 is successful if:
1. Artifacts reduced by 80%+ on Android
2. No regressions on any platform
3. Dragging remains smooth and responsive
4. All existing functionality intact
