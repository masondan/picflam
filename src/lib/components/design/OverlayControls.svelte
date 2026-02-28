<script>
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import PexelsDrawer from './PexelsDrawer.svelte';
	import { CANVAS_COLORS } from '$lib/stores/designStore.js';

	export let overlay = null;
	export let overlaySize = 50;
	export let overlayOpacity = 100;
	export let overlayMask = 'none';
	export let overlayLayer = 'above';
	export let overlayBorderWidth = 0;
	export let overlayBorderColor = '#FFFFFF';
	export let overlayZoom = 100;
	export let overlayImageOffsetX = 0;
	export let overlayImageOffsetY = 0;
	export let overlayNaturalWidth = 0;
	export let overlayNaturalHeight = 0;
	export let getCanvasDimensions = () => ({ width: 300, height: 300 });
	export let onChange = (key, value) => {};
	export let onPreviewToggle = (value) => {};

	let showPexelsDrawer = false;
	let fileInput;
	let isPreviewActive = false;

	function handlePexelsImageSelect(imageUrl) {
		onChange('overlay', imageUrl);
	}

	function handleUploadClick() {
		fileInput?.click();
	}

	const BORDER_COLORS = CANVAS_COLORS.solids;
	const BORDER_STOPS = [0, 1, 2, 3];
	const NUDGE_AMOUNT = 2;

	function calculateFitSize() {
		if (!overlayNaturalWidth || !overlayNaturalHeight) return 50;
		const { width: cw, height: ch } = getCanvasDimensions();
		const imageAspectRatio = overlayNaturalWidth / overlayNaturalHeight;
		const canvasAspectRatio = cw / ch;
		
		// Fit means the image fits within the canvas maintaining aspect ratio
		if (imageAspectRatio > canvasAspectRatio) {
			// Image is wider, fit to width
			return 100;
		} else {
			// Image is taller, fit to height
			return Math.min(100, (ch / cw) * 100);
		}
	}

	function calculateFillSize() {
		if (!overlayNaturalWidth || !overlayNaturalHeight) return 100;
		
		const { width: cw, height: ch } = getCanvasDimensions();
		const imageAR = overlayNaturalWidth / overlayNaturalHeight;
		
		// Calculate what the overlay renders to (in px) when overlaySize = 100,
		// given how calculateOverlayDimensions() + template work:
		// - Template only sets width%, height is auto from image AR
		// - If imageAR >= 1: width = 100% of canvas width, height = cw / imageAR
		// - If imageAR < 1:  height = cw (as maxWidth), width = cw * imageAR
		const baseW = imageAR >= 1 ? cw : cw * imageAR;
		const baseH = imageAR >= 1 ? cw / imageAR : cw;
		
		// Cover scale: image must cover both canvas width and height
		const scale = Math.max(cw / baseW, ch / baseH);
		
		return 100 * scale + 0.5;
	}

	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				onChange('overlay', event.target.result);
			};
			reader.readAsDataURL(file);
		}
		e.target.value = '';
	}

	function handleDrop(e) {
		e.preventDefault();
		const file = e.dataTransfer?.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (event) => {
				onChange('overlay', event.target.result);
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDragOver(e) {
		e.preventDefault();
	}

	async function handlePaste() {
		try {
			const items = await navigator.clipboard.read();
			for (const item of items) {
				const imageType = item.types.find(t => t.startsWith('image/'));
				if (imageType) {
					const blob = await item.getType(imageType);
					const reader = new FileReader();
					reader.onload = (event) => {
						onChange('overlay', event.target.result);
					};
					reader.readAsDataURL(blob);
					return;
				}
			}
		} catch (err) {
			console.error('Paste failed:', err);
		}
	}

	function handleBorderWidthChange(val) {
		const snapped = BORDER_STOPS.reduce((prev, curr) => 
			Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
		);
		onChange('overlayBorderWidth', snapped);
	}

	function handleNudge(direction) {
		let newOffsetX = overlayImageOffsetX;
		let newOffsetY = overlayImageOffsetY;

		switch (direction) {
			case 'up':
				newOffsetY = overlayImageOffsetY - NUDGE_AMOUNT;
				break;
			case 'down':
				newOffsetY = overlayImageOffsetY + NUDGE_AMOUNT;
				break;
			case 'left':
				newOffsetX = overlayImageOffsetX - NUDGE_AMOUNT;
				break;
			case 'right':
				newOffsetX = overlayImageOffsetX + NUDGE_AMOUNT;
				break;
		}

		onChange('overlayImageOffsetX', newOffsetX);
		onChange('overlayImageOffsetY', newOffsetY);
	}

	function handleFit() {
		onChange('overlaySize', calculateFitSize());
	}

	function handleFill() {
		onChange('overlaySize', calculateFillSize());
	}
</script>

<div class="overlay-controls">
	{#if showPexelsDrawer}
		<PexelsDrawer 
			onClose={() => showPexelsDrawer = false}
			onImageSelect={handlePexelsImageSelect}
		/>
	{/if}

	{#if !overlay}
		<div class="input-panel">
			<div
				class="upload-border"
				on:click={handleUploadClick}
				on:drop={handleDrop}
				on:dragover={handleDragOver}
				role="button"
				tabindex="0"
				on:keypress={(e) => e.key === 'Enter' && handleUploadClick()}
			>
				<div class="upload-button">
					<img src="/icons/icon-upload.svg" alt="" class="upload-icon" />
				</div>
			</div>
			
			<div class="button-row">
				<button class="action-button" on:click={() => showPexelsDrawer = true}>
					<span class="button-text">Search</span>
					<img src="/icons/icon-search.svg" alt="" class="button-icon" />
				</button>
				
				<button class="action-button" on:click={handlePaste}>
					<span class="button-text">Paste</span>
					<img src="/icons/icon-paste.svg" alt="" class="button-icon" />
				</button>
			</div>
		</div>
		
		<input 
			type="file" 
			accept="image/*" 
			bind:this={fileInput}
			on:change={handleFileSelect}
			class="sr-only"
		/>
	{:else}
		<div class="control-row fit-fill-row">
			<div class="button-group">
				<span class="row-label">Fit | Fill</span>
				<button 
					class="fit-fill-btn"
					on:click={handleFit}
					title="Fit image to canvas"
					aria-label="Fit"
				>
					<img src="/icons/icon-fit.svg" alt="Fit" class="control-icon" />
				</button>
				<button 
					class="fit-fill-btn"
					on:click={handleFill}
					title="Fill canvas with image"
					aria-label="Fill"
				>
					<img src="/icons/icon-fill.svg" alt="Fill" class="control-icon" />
				</button>
			</div>
			
			<div class="button-group right-group">
				<span class="row-label">Layers</span>
				<button 
					class="layer-btn"
					class:active={overlayLayer === 'above'}
					on:click={() => onChange('overlayLayer', 'above')}
					title="Image on front layer"
					aria-label="Front"
				>
					<img src="/icons/icon-layer-above.svg" alt="Front" class="layer-icon" />
				</button>
				<button 
					class="layer-btn"
					class:active={overlayLayer === 'below'}
					on:click={() => onChange('overlayLayer', 'below')}
					title="Image on back layer"
					aria-label="Back"
				>
					<img src="/icons/icon-layer-below.svg" alt="Back" class="layer-icon" />
				</button>
				
				<div class="separator"></div>
				
				<button 
					class="layer-btn"
					class:active={isPreviewActive}
					on:click={() => {
						isPreviewActive = !isPreviewActive;
						onPreviewToggle(isPreviewActive);
					}}
					title="Preview - hide bounding box"
					aria-label="Preview"
				>
					<img src="/icons/icon-preview.svg" alt="Preview" class="layer-icon" />
				</button>
			</div>
		</div>

		<div class="slider-row">
			<span class="row-label">Opacity</span>
			<div class="slider-wrapper">
				<input 
					type="range"
					class="inline-slider"
					min={0}
					max={100}
					value={overlayOpacity}
					on:input={(e) => onChange('overlayOpacity', Number(e.target.value))}
				/>
			</div>
			<button class="reset-btn" on:click={() => onChange('overlayOpacity', 100)} aria-label="Reset opacity">
				<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
			</button>
		</div>

		<div class="slider-row">
			<span class="row-label">Border</span>
			<div class="slider-wrapper">
				<input 
					type="range"
					class="inline-slider"
					min={0}
					max={3}
					step={1}
					value={overlayBorderWidth}
					on:input={(e) => handleBorderWidthChange(Number(e.target.value))}
				/>
			</div>
			<button class="reset-btn" on:click={() => onChange('overlayBorderWidth', 0)} aria-label="Reset border">
				<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
			</button>
		</div>

		<div class="color-row">
			<span class="row-label">Border colour</span>
			<div class="color-buttons">
				<ColorSwatch 
					colors={BORDER_COLORS}
					value={overlayBorderColor}
					onChange={(color) => onChange('overlayBorderColor', color)}
					showRainbow={true}
				/>
			</div>
		</div>

		<div class="mask-row">
			<span class="row-label">Mask</span>
			<div class="mask-buttons">
				<button 
					class="mask-btn"
					class:active={overlayMask === 'none'}
					on:click={() => onChange('overlayMask', 'none')}
					aria-label="No mask"
				>
					<img src="/icons/icon-none.svg" alt="" class="mask-icon" />
				</button>
				<button 
					class="mask-btn"
					class:active={overlayMask === 'rounded'}
					on:click={() => onChange('overlayMask', 'rounded')}
					aria-label="Rounded mask"
				>
					<img src="/icons/icon-square.svg" alt="" class="mask-icon" />
				</button>
				<button 
					class="mask-btn"
					class:active={overlayMask === 'circle'}
					on:click={() => onChange('overlayMask', 'circle')}
					aria-label="Circle mask"
				>
					<div class="circle-icon"></div>
				</button>
				<button 
					class="mask-btn"
					class:active={overlayMask === 'diamond'}
					on:click={() => onChange('overlayMask', 'diamond')}
					aria-label="Diamond mask"
				>
					<div class="diamond-icon"></div>
				</button>
			</div>
		</div>

		{#if overlayMask !== 'none'}
			<div class="slider-row">
				<span class="row-label">Zoom</span>
				<div class="slider-wrapper">
					<input 
						type="range"
						class="inline-slider"
						min={100}
						max={300}
						value={overlayZoom}
						on:input={(e) => onChange('overlayZoom', Number(e.target.value))}
					/>
				</div>
				<button class="reset-btn" on:click={() => onChange('overlayZoom', 100)} aria-label="Reset zoom">
					<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
				</button>
			</div>

			<div class="nudge-row">
				<button 
					class="nudge-btn"
					on:click={() => handleNudge('up')}
					aria-label="Nudge up"
				>
					<img src="/icons/icon-nudge-up.svg" alt="" class="nudge-icon" />
				</button>
				<button 
					class="nudge-btn"
					on:click={() => handleNudge('down')}
					aria-label="Nudge down"
				>
					<img src="/icons/icon-nudge-down.svg" alt="" class="nudge-icon" />
				</button>
				<button 
					class="nudge-btn"
					on:click={() => handleNudge('left')}
					aria-label="Nudge left"
				>
					<img src="/icons/icon-nudge-left.svg" alt="" class="nudge-icon" />
				</button>
				<button 
					class="nudge-btn"
					on:click={() => handleNudge('right')}
					aria-label="Nudge right"
				>
					<img src="/icons/icon-nudge-right.svg" alt="" class="nudge-icon" />
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.overlay-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.input-panel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 5px 0;
		width: 100%;
		flex: 0 0 auto;
		margin-top: -12px;
	}

	.upload-border {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		margin: 5px 0;
		border: 1px dashed var(--color-primary);
		border-radius: var(--radius-xl);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.upload-border:hover {
		opacity: 0.9;
	}

	.upload-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 56px;
		background-color: var(--color-primary);
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.upload-button:hover {
		opacity: 0.9;
	}

	.upload-icon {
		width: 24px;
		height: 24px;
		filter: brightness(0) saturate(100%) invert(100%);
	}

	.button-row {
		display: flex;
		gap: var(--space-4);
		padding: 0 2px;
	}

	.action-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 38px;
		padding: 0 var(--space-4);
		background-color: var(--color-primary-light);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-lg);
		color: var(--color-primary);
		font-size: 12px;
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.action-button:hover {
		background-color: #e6d5f0;
	}

	.action-button:active {
		opacity: 0.8;
	}

	.button-text {
		flex: 1;
		text-align: left;
	}

	.button-icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		filter: brightness(0) saturate(100%) invert(22%) sepia(97%) saturate(3000%) hue-rotate(254deg) brightness(90%) contrast(105%);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.control-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.fit-fill-row {
		justify-content: space-between;
	}

	.button-group {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.right-group {
		margin-left: auto;
		justify-content: space-between;
	}

	.separator {
		width: 1px;
		height: 24px;
		background-color: #555555;
		margin: 0 var(--space-1);
	}

	.layer-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		padding: 0;
		border: 1px solid #555555;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.fit-fill-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		padding: 0;
		border: 1px solid #555555;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.fit-fill-btn:hover:not(.active) {
		background: var(--color-surface);
	}

	.fit-fill-btn.active {
		background: #555555;
		border-color: #555555;
		color: white;
	}

	.fit-fill-btn:not(.active) .control-icon {
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.fit-fill-btn.active .control-icon {
		filter: brightness(0) invert(1);
	}

	.icon-btn:hover:not(.active),
	.layer-btn:hover:not(.active) {
		background: var(--color-surface);
	}

	.icon-btn.active,
	.layer-btn.active {
		background: #555555;
		border-color: #555555;
		color: white;
	}

	.control-icon {
		width: 22px;
		height: 22px;
	}

	.icon-btn:not(.active) .control-icon {
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.icon-btn.active .control-icon {
		filter: brightness(0) invert(1);
	}

	.layer-icon {
		width: 22px;
		height: 22px;
	}

	.layer-btn:not(.active) .layer-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.layer-btn.active .layer-icon {
		filter: brightness(0) invert(1);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.row-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.slider-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.inline-slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--color-border);
		appearance: none;
		cursor: pointer;
	}

	.inline-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		cursor: pointer;
		transition: transform var(--transition-fast);
	}

	.inline-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}

	.inline-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		border: none;
		cursor: pointer;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover .reset-icon {
		opacity: 1;
	}

	.color-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: space-between;
	}

	.color-buttons {
		display: flex;
		gap: var(--space-1);
	}

	.mask-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: space-between;
	}

	.mask-buttons {
		display: flex;
		gap: var(--space-2);
	}

	.mask-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border: 1px solid #555555;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mask-btn:hover:not(.active) {
		background: var(--color-surface);
	}

	.mask-btn.active {
		background: #555555;
		border-color: #555555;
		color: white;
	}

	.mask-icon {
		width: 22px;
		height: 22px;
	}

	.mask-btn:not(.active) .mask-icon {
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.mask-btn.active .mask-icon {
		filter: brightness(0) invert(1);
	}

	.circle-icon {
		width: 18px;
		height: 18px;
		border: 2px solid currentColor;
		border-radius: 50%;
	}

	.mask-btn:not(.active) .circle-icon {
		border-color: #555555;
	}

	.mask-btn.active .circle-icon {
		border-color: white;
	}

	.diamond-icon {
		width: 18px;
		height: 18px;
		border: 2px solid currentColor;
		border-radius: var(--radius-sm);
		transform: rotate(45deg);
	}

	.mask-btn:not(.active) .diamond-icon {
		border-color: #555555;
	}

	.mask-btn.active .diamond-icon {
		border-color: white;
	}

	.nudge-row {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
	}

	.nudge-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		padding: 0;
		border: 1px solid #555555;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.nudge-btn:hover {
		background: #f0f0f0;
	}

	.nudge-icon {
		width: 22px;
		height: 22px;
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.nudge-btn:hover .nudge-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}
</style>
