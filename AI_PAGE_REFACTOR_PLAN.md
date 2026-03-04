# AI Page Refactor & Image Generation Implementation Plan

**Project:** PicFlam Image Generation Feature  
**Status:** Ready for Implementation  
**Last Updated:** March 2026

---

## Overview

This plan outlines the step-by-step implementation of a new Image Generation tab alongside existing Background Removal and Upscale functionality on the AI page. The page will use a unified tab navigation system, refactored state management, and integration with Runware API for Flux model inference.

**Key Deliverables:**
1. Unified AI page with three tabs (BG Remove / Upscale / Image Gen)
2. Image generation interface with Flux Klein 9B (fast) and Flux.2 Dev (better) toggle
3. Local storage history of last 10 generated images with metadata
4. Monthly generation limit (50/month) with client-side counter
5. Error handling for network timeouts and API limits

---

## Architecture & Decision Log

### Component Structure
- **Single `AiTab.svelte`** with three conditional render states based on `activeTab` store variable
- Tab menu renders consistently across all three views
- State persists in `appStore.js` for session continuity
- No component splitting; all logic lives in one file for simplicity

### State Management
- Extend existing `appStore.js` with `imageGen` writable store
- Store structure includes: prompt, quality, aspectRatio, generatedImage, loading, error, recentImages metadata
- Monthly limit counter stored in localStorage with date-based reset logic
- Recent images array updated after each successful generation

### API Integration
- **Backend route:** `src/routes/api/generate/+server.js`
- Single Runware API key (`RUNWARE_API_KEY`) for both Klein 9B and Flux.2 Dev models
- Route selects model based on `quality` parameter ('fast' → Klein, 'better' → Flux.2 Dev)
- Error responses categorized: timeout, rate limit, content restriction, general error

---

## Implementation Steps

### **Phase 1: State Management Setup**

**Step 1.1 - Extend appStore.js**
- Add `imageGen` writable store with shape: `{ prompt, quality, aspectRatio, generatedImage, recentImages, loading, error }`
- Initialize all fields with sensible defaults (prompt='', quality='fast', aspectRatio='1:1', etc.)
- Add helper function to check if generation limit exceeded (reads from localStorage)
- Add helper function to increment generation counter and reset if month changed

**Step 1.2 - Create localStorage utilities**
- Create `src/lib/utils/generationStorage.js`
- Implement: `saveGenerationLimit()`, `getGenerationLimit()`, `incrementGeneration()`, `resetIfNewMonth()`
- Implement: `getRecentImages()`, `addToRecentImages()`, `removeRecentImage()`, `clearAllRecent()`
- Each recent image stores: id (uuid), imageUrl (blob or base64), prompt, model ('fast'|'better'), aspectRatio, timestamp

**Testing Checkpoint 1:**
- Verify store initializes correctly
- Verify localStorage functions save/retrieve data
- Verify month-based reset logic works (manually adjust system date if needed)

---

### **Phase 2: Refactor AI Page Component Structure**

**Step 2.1 - Refactor AiTab.svelte header**
- Remove current helper text "Remove backgrounds & upscale images"
- Add tab menu component with three buttons: "BG remove", "Upscale", "Image gen"
- Use same style as current Remove/Upscale toggle buttons (secondary button style)
- Tab menu wraps around activeTab state variable

**Step 2.2 - Restructure component logic**
- Create three conditional render blocks:
  - Block A: If activeTab === 'bgRemove' → render current background removal flow
  - Block B: If activeTab === 'upscale' → render upscale before/after flow
  - Block C: If activeTab === 'imageGen' → render image generation flow (new)
- Move existing remove background logic into Block A (no changes)
- Move existing upscale logic into Block B (no changes)
- Prepare Block C for implementation in Phase 3

**Step 2.3 - Update Remove/Upscale buttons**
- On current "Remove background" and "Upscale" action buttons, replace with tab navigation
- These pages (after image import) should show tab menu at top and no longer have inline Remove/Upscale toggle

**Testing Checkpoint 2:**
- Verify tab switching works (activeTab state updates, UI re-renders)
- Verify BG Remove and Upscale tabs still function as before
- Verify tab menu persists across navigation
- Test on mobile and desktop

---

### **Phase 3: Backend API Route**

**Step 3.1 - Create Runware API route**
- Create `src/routes/api/generate/+server.js`
- Implement POST endpoint that accepts: `{ prompt, quality, aspectRatio, includeCost }`
- Route validates prompt (10-2000 characters, non-empty)
- Route selects correct Runware model based on quality:
  - quality='fast' → Flux Klein 9B model AIR identifier
  - quality='better' → Flux.2 Dev model AIR identifier
- Route uses aspect ratio to set width/height in Runware request

**Step 3.2 - Handle Runware response**
- Route returns: `{ imageUrl, cost, model, timestamp }`
- Route catches errors and categorizes:
  - Timeout (>15s) → return `{ error: 'timeout' }`
  - Rate limit (HTTP 429) → return `{ error: 'rateLimit' }`
  - Content restriction → return `{ error: 'contentRestriction' }`
  - General error → return `{ error: 'general', message: '...' }`
- Route never exposes RUNWARE_API_KEY to client

**Step 3.3 - Environment variable verification**
- Confirm RUNWARE_API_KEY is present in .env.local
- Confirm RUNWARE_API_KEY is added to Cloudflare Workers variables as secret
- Document that backend routes access env vars via standard SvelteKit mechanisms

**Testing Checkpoint 3:**
- Test API route with valid prompt, both quality settings
- Test API route error handling (simulate timeout, test rate limit behavior)
- Verify imageUrl is valid and downloadable
- Test on Cloudflare Workers (production environment simulation)

---

### **Phase 4: Image Generation UI Implementation**

**Step 4.1 - Build Image Gen tab interface (static layout)**
- Toolbar (top): Start again, Copy, Download (aligned right)
- Placeholder image: Square grey (#999999) with centered light AI icon
- Prompt input: Textarea with 10-2000 character validation, live count feedback
- Quality toggle: Two-button toggle (Faster left, Better right) using secondary button style
- Aspect ratio dropdown: Label shows selected ratio, chevron icon, expandable menu with Horizontal/Square/Vertical
- Generate button: Grey/disabled until prompt ≥10 chars, then purple active state
- Recent images button: Bold purple text button at bottom
- Prompt info button: Small simple text button (location TBD, recommend above Generate button)

**Step 4.2 - Connect prompt input to store**
- Textarea binds to imageGen.prompt
- Character count badge updates live
- Generate button disabled state: `imageGen.prompt.length < 10 || loading || generationsThisMonth >= 50`

**Step 4.3 - Connect quality toggle to store**
- Two buttons toggle imageGen.quality between 'fast' and 'better'
- Active state styling on selected button

**Step 4.4 - Connect aspect ratio dropdown to store**
- Clicking chevron opens/closes dropdown menu
- Three menu items (Horizontal/Square/Vertical) update imageGen.aspectRatio and label
- Placeholder image remains 1:1 until generation completes

**Testing Checkpoint 4:**
- Test prompt input validation (count feedback, button disable/enable)
- Test quality toggle switching
- Test aspect ratio dropdown expand/collapse and selection
- Verify all inputs are wired to store correctly

---

### **Phase 5: Generation Workflow & Progress**

**Step 5.1 - Implement generate function**
- Generate button click calls backend `/api/generate` with prompt, quality, aspectRatio
- Before calling: Verify generationsThisMonth < 50 (client-side check)
- Set imageGen.loading = true
- Show spinner + "Generating..." text in Generate button

**Step 5.2 - Handle success response**
- On imageUrl received: Set imageGen.generatedImage = imageUrl
- Increment generationsThisMonth counter in localStorage
- Add entry to recentImages array (with metadata: prompt, model, aspectRatio, timestamp)
- Clear imageGen.error
- Set imageGen.loading = false
- Generate button returns to "Generate" text (remains enabled for regeneration)

**Step 5.3 - Handle error responses**
- Timeout error: Show modal "This is taking longer than expected. [Retry]"
- Rate limit error: Show modal "Monthly generation limit reached (50/50). Limit resets on [DATE]."
- Content restriction error: Show modal "Prompt contains restricted content. Try rephrasing."
- General error: Show modal with generic message
- Modal click Retry → call generate again; click close → dismiss modal and stay on page
- Set imageGen.error message for debugging

**Step 5.4 - Regenerate workflow**
- Prompt and quality remain in inputs after generation
- User modifies prompt (or keeps same) and clicks Generate again
- Workflow repeats; new image replaces previous imageGen.generatedImage

**Testing Checkpoint 5:**
- Test successful generation with both quality settings
- Verify image renders in placeholder area (check aspect ratio display)
- Test generation counter increments correctly
- Test error modals appear and dismiss properly
- Test regeneration (modify prompt and regenerate)
- Verify spinner shows during generation

---

### **Phase 6: Download, Copy, and Toolbar**

**Step 6.1 - Implement Download**
- Download button calls utility function to save imageUrl as PNG
- Filename format: `picflam-gen-{timestamp}.png`
- Uses browser's download API

**Step 6.2 - Implement Copy**
- Copy button fetches image URL and converts to blob
- Copies blob to clipboard using Clipboard API
- Show brief toast "Image copied to clipboard"

**Step 6.3 - Implement Start Again**
- Reset imageGen store: prompt='', generatedImage=null, error=null
- Clear all inputs
- Focus on prompt textarea

**Testing Checkpoint 6:**
- Test Download button saves PNG with correct filename
- Test Copy button places image in clipboard (verify with paste test)
- Test Start Again clears all fields and resets state

---

### **Phase 7: Recent Images Drawer**

**Step 7.1 - Build drawer component**
- Drawer slides in from right (full depth)
- Header: X close icon (top left), Download and Trash icons (top right, hidden until selection)
- Content: 2×5 grid of recent images (10 images max)
- Each grid item: Rounded corners, image thumb, small selection circle (top right, hidden by default)
- Footer: "No recent images" message if recentImages array is empty

**Step 7.2 - Implement selection mode**
- Tap/click and hold on mobile, click on desktop → enter selection mode
- When selection mode active: Show all circles, show Download/Trash buttons in header
- Clicking circle toggles selection state
- Clicking image after circle appears highlights/unhighlights selection

**Step 7.3 - Implement bulk actions**
- Download button: Convert selected images to PNG, trigger batch download (or individual if single)
- Trash button: Remove selected images from recentImages array and localStorage
- After action completes, exit selection mode and refresh grid
- Selection mode persists until user closes drawer or taps elsewhere

**Step 7.4 - Connect to Recent Images button**
- Button at bottom of Image Gen page, purple bold text
- Click toggles drawer open/closed
- Drawer is hidden by default

**Testing Checkpoint 7:**
- Test drawer opens/closes
- Test images load in 2×5 grid
- Test selection mode activation (click/hold vs click)
- Test Download and Trash buttons work
- Test drawer closes with X icon
- Verify recent images persist across page refreshes
- Test 10-image limit (11th image added → 1st image removed)

---

### **Phase 8: Metadata Modals**

**Step 8.1 - Implement Prompt Info modal**
- Small purple text button: "Prompt info"
- Click opens centered white modal:
  - First line: "Model: Flux Klein 9B" or "Model: Flux.2 Dev" (based on model used)
  - Large prompt text display
  - Buttons: [Close] [Copy Prompt]
- Copy Prompt button copies text to clipboard, shows toast "Prompt copied"
- Close button dismisses modal

**Step 8.2 - Store and display metadata**
- Prompt info button appears only after generation (show/hide based on imageGen.generatedImage)
- Modal pulls data from imageGen store (model name, prompt text)

**Testing Checkpoint 8:**
- Generate image, verify Prompt info button appears
- Click button, verify modal shows correct model and prompt
- Test Copy Prompt functionality
- Test Close button dismisses modal
- Verify modal appears only after generation

---

### **Phase 9: Generation Limit Counter**

**Step 9.1 - Display counter**
- Small grey text below Generate button: "3/50" (used/total)
- Counter updates real-time as generations complete
- On month reset, counter shows "1/50" (after new month begins)

**Step 9.2 - Implement limit enforcement**
- Before generation: Check `generationsThisMonth >= 50`
- If true: Disable Generate button, show tooltip or small message "Limit reached this month"
- On successful generation: Increment generationsThisMonth in localStorage
- On app load: Check if month changed; if yes, reset generationsThisMonth to 0

**Step 9.3 - Limit exceeded message**
- If user somehow bypasses (dev tools), API call will fail with rate limit error
- Error modal shows: "Monthly generation limit reached (50/50). Limit resets on [DATE]."

**Testing Checkpoint 9:**
- Verify counter displays correctly (1/50 on first use)
- Generate 5 images, verify counter increments to 6/50
- Test month-based reset (manually adjust system date if needed)
- Test Generate button disables at 50/50
- Verify limit error message appears if limit exceeded

---

### **Phase 10: Integration & End-to-End Testing**

**Step 10.1 - Full workflow test**
1. Navigate to AI tab
2. Verify three tabs visible (BG remove, Upscale, Image gen)
3. Click Image gen tab
4. Enter prompt (e.g., "a red car on a beach")
5. Select quality (try both Fast and Better)
6. Select aspect ratio (try all three)
7. Click Generate
8. Verify spinner shows
9. Verify image renders
10. Verify counter increments
11. Test Download, Copy, Start Again
12. Click Prompt info, verify modal
13. Generate another image
14. Click Recent images, verify drawer shows both
15. Test selection, download, delete in drawer

**Step 10.2 - Error scenario testing**
1. Simulate network timeout (throttle in DevTools)
2. Verify timeout modal appears with Retry button
3. Click Retry, verify regeneration works
4. Generate 50 images (or manually set counter to 49)
5. Try 51st generation, verify limit error modal
6. Test content restriction (if available in Runware)

**Step 10.3 - Cross-platform testing**
- Test on mobile (iOS Safari, Android Chrome)
- Test on desktop (Chrome, Safari, Firefox)
- Verify tap/click behaviors work correctly
- Verify drawer swipe/close behavior on mobile
- Verify spinner animation smooth on all platforms

**Step 10.4 - Performance check**
- Monitor network requests (DevTools Network tab)
- Verify images load without stutter
- Verify localStorage operations are fast
- Verify no memory leaks (DevTools Memory)

**Testing Checkpoint 10:**
- Complete end-to-end flow works without errors
- All three tabs functional and integrated
- Error handling robust across scenarios
- Performance acceptable on mobile and desktop

---

## Testing Checklist (Per Phase)

Use this after completing each phase:

- [ ] **Phase 1:** Store initializes, localStorage reads/writes, month reset logic works
- [ ] **Phase 2:** Tab switching works, BG Remove and Upscale still function, tab menu persists
- [ ] **Phase 3:** API route responds correctly, errors categorized, env vars configured
- [ ] **Phase 4:** All UI elements render, inputs bound to store, validation works
- [ ] **Phase 5:** Generation works, spinner shows, counter increments, errors display modals
- [ ] **Phase 6:** Download saves PNG, Copy uses clipboard, Start Again resets
- [ ] **Phase 7:** Drawer opens/closes, 2×5 grid renders, selection mode works, bulk actions work
- [ ] **Phase 8:** Prompt info button appears, modal displays, Copy Prompt works
- [ ] **Phase 9:** Counter displays, limit enforces, month reset works, error message clear
- [ ] **Phase 10:** Full workflow end-to-end, error scenarios handled, cross-platform works, performance acceptable

---

## File Structure Summary

**New Files:**
- `src/routes/api/generate/+server.js` — Runware API integration
- `src/lib/utils/generationStorage.js` — localStorage utilities

**Modified Files:**
- `src/lib/stores/appStore.js` — Add imageGen store
- `src/lib/components/ai/AiTab.svelte` — Refactor with tab structure

**Assets Needed:**
- `static/images/ai-upscale-before.png` (provide)
- `static/images/ai-upscale-after.png` (provide)
- `static/icons/icon-horizontal.svg` (already exists)
- `static/icons/icon-square.svg` (already exists)
- `static/icons/icon-vertical.svg` (already exists)

---

## Notes & Constraints

- **No TypeScript:** Project uses JavaScript; all code follows existing patterns
- **Svelte 5 syntax:** Use reactive declarations and stores, no Class components
- **CSS:** Use design tokens from `tokens.css`; no hardcoded colors
- **Browser Compatibility:** Target modern browsers (iOS 14+, Android Chrome 90+)
- **localStorage Limits:** ~5-10MB available; with 10 images stored, comfortably under limit
- **Runware API:** Single key for both models; route handles model selection internally
- **Privacy:** No user accounts needed; generation data lives in localStorage only

---

## Sign-Off

When all 10 phases complete and Phase 10 testing passes, the feature is ready for production deployment.

**Ready to hand off to AI agent for implementation.**
