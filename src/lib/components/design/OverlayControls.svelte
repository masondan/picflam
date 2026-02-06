<script>
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
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
</script>

<div class="overlay-controls">
	{#if !overlay}
		<div 
			class="import-box"
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			role="button"
			tabindex="0"
		>
			<label class="import-area">
				<input 
					type="file" 
					accept="image/*" 
					on:change={handleFileSelect}
					class="file-input"
				/>
				<img src="/icons/icon-upload.svg" alt="" class="upload-icon" />
				<span class="import-text">Import, drag or<br>paste an image</span>
			</label>
			<button class="paste-btn" on:click={handlePaste}>
				Paste
			</button>
		</div>
	{:else}
		<div class="control-row fit-fill-row">
			<div class="button-group">
				<span class="row-label">Fit & Fill</span>
				<button 
					class="icon-btn"
					on:click={() => onChange('overlaySize', calculateFitSize())}
					title="Fit image to canvas"
					aria-label="Fit"
				>
					<img src="/icons/icon-fit.svg" alt="Fit" class="control-icon" />
				</button>
				<button 
					class="icon-btn"
					on:click={() => onChange('overlaySize', calculateFillSize())}
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
			<span class="row-label">Colour</span>
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

	.import-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-6);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}

	.import-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
	}

	.file-input {
		display: none;
	}

	.upload-icon {
		width: 32px;
		height: 32px;
		opacity: 0.6;
	}

	.import-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		text-align: center;
		line-height: var(--line-height-normal);
	}

	.paste-btn {
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--color-primary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.paste-btn:hover {
		background: var(--color-primary-light);
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

	.icon-btn,
	.layer-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		padding: 0;
		border: 1px solid #777777;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.icon-btn:hover:not(.active),
	.layer-btn:hover:not(.active) {
		background: var(--color-surface);
	}

	.icon-btn.active,
	.layer-btn.active {
		background: #777777;
		border-color: #777777;
	}

	.control-icon {
		width: 22px;
		height: 22px;
	}

	.icon-btn:not(.active) .control-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
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
		background: var(--color-text-secondary);
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
		background: var(--color-text-secondary);
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
		border: 1px solid #777777;
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mask-btn:hover:not(.active) {
		background: var(--color-surface);
	}

	.mask-btn.active {
		background: #777777;
		border-color: #777777;
	}

	.mask-icon {
		width: 22px;
		height: 22px;
	}

	.mask-btn:not(.active) .mask-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
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
		border-color: #777777;
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
		border-color: #777777;
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
		border: 1px solid #777777;
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
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.nudge-btn:hover .nudge-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}
</style>
