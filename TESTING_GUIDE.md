# Quick Testing Guide - Android Artifact Fix

## 🚀 Quick Start

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Access on Android device:**
   - Connect to same WiFi as your computer
   - Open Chrome on Android
   - Navigate to: `http://[your-computer-ip]:5173`
   - Or use USB debugging with port forwarding

3. **Enable Console Logging (Android):**
   - Connect device via USB
   - Open Chrome DevTools on computer
   - Go to `chrome://inspect`
   - Click "Inspect" on your device
   - Open Console tab to see `[Android Debug]` logs

---

## 📱 Test Scenarios

### Test 1: Logo Image Artifacts Below
**Expected Before Fix:** Artifacts appear below logo when dragging
**Expected After Fix:** No artifacts or significantly reduced

**Steps:**
1. Import a logo image (use small PNG/JPG)
2. Drag the logo around the canvas slowly
3. Drag it quickly
4. Watch for ghost images appearing below
5. Check console for position logs

**What to Look For:**
- ✅ No visible artifacts below image
- ✅ Console shows integer pixel positions (no decimals in finalX/finalY)
- ✅ Smooth dragging motion

---

### Test 2: Logo Image Artifacts to Right
**Expected Before Fix:** Artifacts appear to right when near edge
**Expected After Fix:** No artifacts or significantly reduced

**Steps:**
1. Import a logo image
2. Drag it close to the RIGHT edge of canvas
3. Move it up and down while near right edge
4. Watch for ghost images appearing to the right

**What to Look For:**
- ✅ No visible artifacts to right of image
- ✅ Smooth dragging even near edge
- ✅ Console logs show consistent position updates

---

### Test 3: Landscape Main Image Artifacts Below
**Expected Before Fix:** Artifacts appear below landscape images
**Expected After Fix:** No artifacts or significantly reduced

**Steps:**
1. Import a landscape photo (wider than tall)
2. Drag it around the canvas
3. Pay attention to bottom edge
4. Try different drag speeds

**What to Look For:**
- ✅ No visible artifacts below image
- ✅ Dragging to right edge shows NO artifacts to right (expected behavior)

---

### Test 4: Portrait Main Image (Should Be Clean)
**Expected Before Fix:** No artifacts (baseline)
**Expected After Fix:** Still no artifacts (regression test)

**Steps:**
1. Import a portrait photo (taller than wide)
2. Drag it around the canvas
3. Verify no artifacts anywhere

**What to Look For:**
- ✅ No artifacts (same as before)
- ✅ Smooth dragging maintained
- ✅ No new issues introduced

---

### Test 5: Resize Behavior
**Expected:** Resizing should still eliminate any remaining artifacts

**Steps:**
1. Import any image
2. Drag and observe (note any artifacts)
3. Open image drawer
4. Move resize slider even slightly
5. Close drawer and drag again

**What to Look For:**
- ✅ Artifacts gone after resize (if any were present)
- ✅ Console logs show scale change
- ✅ Behavior consistent with before

---

## 🔍 Console Log Examples

### Good Logs (What You Want to See):

```
[Android Debug] Drawing image at: {
  finalX: 512,        ← Integer (no decimals)
  finalY: 384,        ← Integer (no decimals)
  width: 800,
  height: 600,
  scale: "1.000"
}

[Android Debug] Updating position: {
  layer: "logoImage",
  x: "45.00",
  y: "120.00",
  dx: "5.00",
  dy: "10.00"
}
```

### What to Check:
- ✅ `finalX` and `finalY` are whole numbers
- ✅ Position updates happen smoothly (not 100+ per second)
- ✅ No error messages
- ✅ Scale changes after resize

---

## 📊 Success Criteria

### Phase 1 is Successful If:
- ✅ Artifacts reduced by 80% or more
- ✅ Dragging remains smooth (not choppy)
- ✅ All click/tap functionality works
- ✅ No new bugs introduced
- ✅ iOS and Desktop show no regressions

### Phase 1 Needs Phase 2 If:
- ⚠️ Artifacts reduced but still visible (50-80% improvement)
- ⚠️ Specific edge cases still show artifacts
- ✅ No new bugs introduced
- ✅ Dragging still smooth

### Rollback Required If:
- ❌ Dragging becomes choppy or unresponsive
- ❌ New bugs appear (clicking broken, etc.)
- ❌ Artifacts worse than before
- ❌ iOS or Desktop functionality broken

---

## 🐛 Troubleshooting

### If Dragging Feels Choppy:
- Check console for excessive logs
- May need to adjust requestAnimationFrame implementation
- Try on different Android device to confirm

### If Console Shows No Logs:
- Verify you're on Android device (logs only show on Android)
- Check USB debugging connection
- Refresh the page
- Check Chrome DevTools is connected

### If Artifacts Persist:
- Document which scenarios still show artifacts
- Save console logs
- Take screenshots
- Prepare for Phase 2 implementation

### If New Bugs Appear:
- Document the bug clearly
- Check if it happens on all platforms
- Rollback changes if critical
- Review code changes for issues

---

## 📸 Documentation

### Take Screenshots Of:
1. Before fix: Artifacts visible
2. After fix: Clean dragging
3. Console logs showing integer positions
4. Any remaining edge cases

### Record:
- Which device (Pixel 9a vs Redmi 14c)
- Which image type (logo, landscape, portrait)
- Specific scenario (dragging where, how fast)
- Console log output

---

## ✅ Quick Checklist

**Before Testing:**
- [ ] Dev server running
- [ ] Android device connected to same network
- [ ] Chrome DevTools connected (for console logs)
- [ ] Test images ready (logo, landscape, portrait)

**During Testing:**
- [ ] Test all 5 scenarios above
- [ ] Check console logs
- [ ] Note any artifacts (location, frequency)
- [ ] Test on both Android devices if possible

**After Testing:**
- [ ] Document results
- [ ] Take screenshots
- [ ] Save console logs
- [ ] Report findings

---

## 📞 Next Steps Based on Results

### If Successful:
1. Report success! 🎉
2. Decide on keeping/removing debug logs
3. Test on iOS/Desktop for regressions
4. Prepare for deployment

### If Needs Phase 2:
1. Share console logs and screenshots
2. Describe remaining artifact patterns
3. Proceed with Android-specific canvas clear
4. Re-test after Phase 2

### If Issues Found:
1. Document clearly
2. Share error messages
3. Discuss rollback or fixes
4. Adjust approach as needed

---

## 💡 Tips

- **Test in good lighting** - artifacts can be hard to see
- **Try different image sizes** - small logos vs large photos
- **Vary drag speed** - slow, medium, fast
- **Test near edges** - especially right and bottom
- **Compare devices** - Pixel vs Redmi behavior
- **Take breaks** - fresh eyes catch more issues

Good luck with testing! 🚀
