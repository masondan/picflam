# PicFlam UI Tweaks TODO

## High Priority
- [x] Update TextToolbar.jsx: Change position icon to TbTextResize, style icon to BsSliders
- [x] Update TextToolbar.jsx: Remove cross/chevron from rainbow swatch in color row
- [x] Update TextToolbar.jsx: Make swatches conditional - T1: 5 colors, T2: 4 colors (#000000, #FFFFFF, #FFD700, #5EAFE5) + rainbow
- [x] Update TextToolbar.jsx: Add white border to active swatch in color row
- [x] Update TextToolbar.jsx: Add microphone icon (FiMic) to edit row left, adjust layout for even spacing (mic left, textarea center, check right)
- [x] Update TextToolbar.jsx: Implement basic audio input using SpeechRecognition API in edit row
- [x] Update TextToolbar.jsx: Replace align button text "↔" with cycling RxTextAlignLeft/Center/Right icons in style row
- [x] Update TextToolbar.css: Remove grey borders from swatches, add dynamic white border for active swatch
- [x] Update TextToolbar.css: Remove .cross styling from rainbow swatch
- [x] Update TextToolbar.css: Update edit row layout for mic, textarea, check with even spacing
- [x] Delete redundant Text1InputDrawer.jsx and Text1InputDrawer.css files

## Testing
- [ ] Test UI rendering on mobile/desktop: Icon alignment, spacing, color selection
- [ ] Test audio input: Microphone click, transcription append, permissions/fallback
- [ ] Test no regressions: Text editing, toolbar tabs, swatch selection, align cycle
- [ ] Run dev server and check console for errors

## Followup
- [ ] If needed, adjust icon sizes or spacing based on testing
- [ ] Consider adding audio feedback (e.g., visual indicator during recording)
