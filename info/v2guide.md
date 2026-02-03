# PicFlam v2 description
—
A new set of svg icons are provided in info/icons (referred to in the description below). All icons are .svg
—
The visuals are all in info/visuals. All visuals are .png
—
A set of .png logos are provided in info/logos
logo-picflam-logotype.png
logo-picflam-maskable.png
logo-picflam-touch.png
logo-picflam-gen.png
—
Header and navigation
crop1 
PicFlam logotype to left
Three navigation buttons to right: Crop, AI, Design
Header scrolls with page content
Fine light separator under header row
icons: icon-ai, icon-crop, icon-design
—
# Crop, Edit, Filter

## Crop 

crop1
Users land first on the crop start tab (crop1)
Page with dotted border. Options to import, drag or paste an
image from clipboard (allows copy/paste from other tabs in PicFlam)
Icons: icon-upload

crop2
After import/paste, image appears full width
Above the image are buttons: left - undo/redo buttons. Right - Start again, copy, export
Below the image, aligned left, are menu buttons for Crop, Edit, Filter
Icons: icon-undo, icon-redo, icon-startagain, icon-copy, icon-export

crop3
Tapping the Crop button displays the crop controls below.
A row of ratio buttons: 9:16, 1:1, 16:9 and Custom
Icons: icon-vertical, icon-square, icon-horizontal, icon-custom
A row with boxes displaying the width and hight of the image (changes to display size of image as cropped), a lock toggle to lock/unlock the ratio, a flip toggle and rotate button
Icons: icon-lock, icon-unlock, icon-flip-horizontal, icon-rotate
Default crop is Custom, with the ratio lock unlocked. This allows the user to freely crop the image OR use the size input boxes to specify height/width. The user can toggle the lock on to lock the ratio at their chosen size.
Cropping is displayed as a fine white box with white right-angled handles in the four corners. Areas outside the cropped selection are covered by a light translucent grey.
The image can be scaled beyond the bounding area by pinching or using the Scale slider. The images can be dragged with one finger.

crop4
Tapping the vertical or square positions the crop area in the centre of the image. 
The start point for horizontal crop is the full width of the image, centered verticallly. The start point for the custom crop is full image.

crop5
After cropping, the user must tap Apply to apply the changes.
if the user tries to tap any other button a centered white modal is displayed asking the user to confirm the changes or cancel

crop6
When the user taps the Apply button, the crop is applied and the resulting crop is displayed full width on the viewport.
The crop tools reset to default (ie no menu displayed). 
The undo button becomes active.
The image can now be downloaded or copied (for pasting in, for example, the AI tab)
Tapping the start again button clears the canvas and reverts to the original start screen (crop1)

## Edit

crop6
Tapping the Edit button displays the Edit controls
A row of standard image editing functions: Brightness, Shadows, Contrast and HDR (note: HDR should add HDR pop to images), controlled by a single slider.
An additional edit control is included: blur (useful in journalism for blurring faces, number plates etc)
When the blur brush slider is moved to the left (smaller) or right (larger) a translucent purple dot appears on the screen, resizing in real time as the slider is moved. The finger can then be used to blur part of the image
To enable blurring of detailed parts of the image, a Zoom In slider is included to enlarge the image, with nudge buttons to move the image, and Rest button to reset the image to its original size/position (the zoom slider resets to far left when Reset is tapped).
icons: icon-nudge-up, icon-nudge-down, icon-nudge-left, icon-nudge-right

## Filter
crop7
Tapping filter displays two rows of filters (six in total), visualising the image on the canvas, with filters applied. Note: I need your help to create filters - is there a library of filters to choose from (and can I view to select) or do you create from scratch?
There is a slider to control filter strength. Sliding left from default center position reduces the filter strength, moving right increases the strength of the filter
I envision the filters as follows: Original (no filter), Greyscale, Sepia, Sunset (warm), Azure (elegant colder blue), teal (rich green/blue)

# AI

## Enhance 
ai1
Start page exactly as Crop start page, with changed information wording.
ai2
Adding an image displays the same top menu as Crop (undo, redo, start again, copy, export)
Under the image (displayed full width) are three buttons, aligned left: Enhance, Upscale, Background remove
ai3
Tapping Enhance displays the Enhance image button (including AI icon) and explainer beneath.
icon: icon-ai
ai4
When the Enhance image button is tapped:
The image becomes blurred while processing
The Enhance image bar wording changes to Processing, and a spinner is displayed to the left of the bar
The explainer text is hidden and a cancel button is added, aligned right
ai5
When processing is complete, the Processing button reverts to its Enhance image state, the explainer text returns and concel button is hidden.
The image is displayed with the AI enhanced version visible. A purple vertical slider with handle allows the user to compare original and AI enhanced images.
icon: icon-ai-slider

## Upscale
ai6
Tapping the Upscale menu button displays the upscale controls
A slider allows the user to select scale: x1 (current) x2, x3, x4
The current or predicted image size is displayed below the slider, aligned right
The Upscale button has ai icon. Below the button is explainer text
Icon: icon-ai
ai7
Follows style of Enhance process: Blurred image, Processing button with spinner, Cancel button replaces explainer text.
ai8
Follows style of Enhance display: Image with before/after slider, button reverts to Upscale  image, Cancel button hidden, explainer text returns. 

## Remove background
ai9
Tapping the Remove background buttons displays controls: Remove background button with ai icon + explainer text, Erase and restore button + explainer text.
ai10
Follows the style of Enhance and Upscale. When the Remove background button is tapped, button wording changes to Processing, Spinner displays, explainer text hidden, cancel button displayed. Note: The Erase and restore button is still visible but inactive.
ai11
Follows the style of Enhance and Upscale. After background removal is complete, image with before/after slider displayed, button reverts to Remove background image, Cancel button hidden, explainer text returns. Erase and restore button now active. Note: Display the erased background as solid white and add a fine grey border to the image.
ai12
Tapping Erase and restore displays a full-page drawer, rising from the bottom of the screen. Displayed on the screen, from  top down:
Undo/Redo buttons
Compare button (tap and hold to compare with original image with background)
The image with background removed
Erase and Restore buttons, with icons
Brush size slider. Follows style of blur controls - moving slider displays live translucent purple circle on the image. Single finger to erase / restore depending on button selected.
Zoom in slider, with nudge controls and Reset button
Cancel and Done buttons. Tapping these closes the drawer and returns to the Remove background controls, with any erase/restore adjustments visible in the image.
Icons: icon-compare, icon-erase, icon-restore, 

# Design
design1
Tapping the Design header navigation button first opens a drawer with six templates and option to start with a blank canvas. 
From the top down: Explainer text, Blank canvas button, six templates. Note: The templates are in square format. if selected, they will fill square format, or sit in the center of a vertical and horizontal format. Background colours will fill the available format canvas.
Use placeholder templates to begin. Actual template design will be added later.
Icon: icon-add
design2
When a template or blank is selected, the template drawer closes and the canvas displays, from top down:
Redo/undo buttons. Start again, Copy, Export buttons (as previously)
Canvas with template or blank (square by default). Fine border around blank.
A row of menu buttons: Size, Background, Text 1, Text 2, Quote, Overlay

## Size
design3
Tapping the Size button display three options: 9:16, 1:1, 16:9 with icons and text displayed under.
Icons: icon-vertical, icon-square, icon-horizontal
Tapping a size icon displays the size full width. Vertical size extends downward.

## Background
design4
Tapping Background displays the choise of solid and gradient backgrounds. Use exactly the colours and design from PicFlam v1

## Text 1
design5
Tapping Text 1 displays the text input and controls. From top down:
Text input window (with resize handle bars to lower right). Placeholder text (if a blank canvas): How to highlight text
Font dropdown with font name displayed as actual font. Use the fonts as in PicFlam v1
To the right of the font dropdown, same row, toggle buttons for Bold and Alignment
Text size slider. Follow exactly the style for sizing and constraining text as in v1 (ie text cannot extend beyond canvas boundaries to left and right)
Position slider. Vertical position of text. As in v1
Line spacing. As in v1
Note: Sliders take default blank canvas position from v1
Icons: icon-bold, icon-align-left, icon-align-center (default), icon-align-right
design6 (continuation of design5 to show lower part of page)
As design5 plus:
Text colour. Use solid background presets + rainbow button from v1
Highlight colour. Based on background presets + rainbow button from v1 BUT ... replace white with Yellow (from v1 highlight colour)

## Text 2
design7
Text two controls exactly follow Text 1 controls, with smaller default text (slider will be further left) and position at the bottom of the page (slider left)

## Quote
design8
Displays three toggle buttons: No quote, serif quote, slab quote. Size slider below
Important! icon provided for non quote but NO icons are  provided for the quote buttons - your design in v1 was perfect, use these. Also, the size behaviour and positioning of active quotes took a lot of time in v1. Use exactly the sizes, fonts, rules, positions as in v1
icons: icon-none

## Overlay
design9
When the Overlay button is tapped and NO overlay currently exists on the canvas, display a dotted border box under the canvas with the Import and Paste buttons + explainer text (same style as the start page for Crop and AI tabs
design10
When an image is imported, place it first in the center of the canvas at a smaller size with consistent space to the left and right (or top and bottom if the image is taller on a 16:9 canvas)
The overlay has a fine bounding box with delete button in the top left corner. 
The overlay can be dragged with one finger or expanded/contracted by using pinch and zoom OR the Size slider (which would respond in real time if pinch and zoom is being used)
The overlay can sit partially over the canvas boundary, and will be cropped. It will not be visible outside the canvas.
By default, the overlay covers the text (no-wrap) but there is a toggle button to activate text wrap around the image.
All controls in the Overlay menu, from top down:
Size slider
Opacity slider
Mask toggle buttons: No mask, square mask with rounded corners, circular mask.
Also on the mask row, to the right: Wrap and No-wrap
Border width. Sticky slider with four incremenets: 0 (none - default), 1, 2, 3
Border colour. Use v1 solid background colours
Icon: icon-wrap, icon-no-wrap, icon-none
design11
This illustrates how mask and text wrap can be used. Text wrap should detect the border of the mask. Similarly, if text wrap is applied to an image with background removed, text wrap should detect and follow the outline of the cutout.











