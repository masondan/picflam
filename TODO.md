# PicFlam TODO

## ✅ Completed Tasks

### Remove Carousel and Restore Single Canvas
- [x] Simplify useSlides.js to manage single slide instead of array
- [x] Remove carousel functionality from App.jsx
- [x] Simplify Slide.jsx to remove navigation and drag features
- [x] Update App.css for single canvas layout with proper padding
- [x] Fix ImageDrawer.css layout issues (button stacking)
- [x] Reduce Text2 default size from 5 to 2.5

### Android Artifact Fix - Phase 1 (JUST COMPLETED)
- [x] Investigate artifact issue on Android devices
- [x] Analyze root cause (floating-point coordinates + dirty region optimization)
- [x] Implement integer pixel rounding in drawLayer()
- [x] Implement requestAnimationFrame for drag updates
- [x] Add debug logging for Android testing
- [x] Document implementation and testing procedures

## 🔄 Current Priority: Testing Phase 1 Artifact Fix

### Testing Checklist
- [ ] Test on Android devices (Pixel 9a, Redmi 14c)
  - [ ] Logo images - artifacts below
  - [ ] Logo images - artifacts to right (when near edge)
  - [ ] Landscape main images - artifacts below
  - [ ] Portrait main images - verify no artifacts
  - [ ] Check console logs for debug output
- [ ] Test on iOS devices (regression testing)
  - [ ] Verify smooth dragging
  - [ ] Verify all functionality intact
- [ ] Test on Desktop browsers (regression testing)
  - [ ] Chrome - verify no regressions
  - [ ] Safari - verify no regressions

### If Phase 1 Successful
- [ ] Remove or reduce debug logging (optional)
- [ ] Update documentation
- [ ] Close artifact issue
- [ ] Deploy to production

### If Phase 1 Needs Phase 2
- [ ] Analyze console logs for patterns
- [ ] Implement Android-specific full canvas clear
- [ ] Re-test on all devices

## 📋 Backlog

### Known Issues
- [ ] Screen refresh regression when dragging down (mentioned but not prioritized)
- [ ] Any issues discovered during Phase 1 testing

### Future Enhancements
- [ ] Performance optimization if needed
- [ ] Additional mobile testing on other Android devices
- [ ] Consider removing debug logs after successful deployment

## 📝 Notes

**Phase 1 Implementation Details:**
- Files modified: `src/utils/canvasUtils.js`, `src/components/ImageTransformControl.jsx`
- Changes: Integer pixel rounding + requestAnimationFrame
- Risk level: Very Low
- Expected success rate: 80-90%
- See: `PHASE1_IMPLEMENTATION_SUMMARY.md` for full details

**Testing Resources:**
- Android devices: Pixel 9a, Redmi 14c
- iOS devices: iPhone 11, iPad Mini
- Desktop: Chrome, Safari
- Screenshots: `screenshots/artifact3.png`, `screenshots/artifact4.png`
