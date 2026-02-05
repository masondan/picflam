<script>
	import Slider from '$lib/components/ui/Slider.svelte';
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import { CANVAS_COLORS } from '$lib/stores/designStore.js';

	export let overlay = null;
	export let overlaySize = 50;
	export let overlayOpacity = 100;
	export let overlayMask = 'none';
	export let overlayLayer = 'above';
	export let overlayBorderWidth = 0;
	export let overlayBorderColor = '#FFFFFF';
	export let onChange = (key, value) => {};

	const BORDER_COLORS = CANVAS_COLORS.solids;
	const BORDER_STOPS = [0, 1, 2, 3];

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
		<div class="slider-row">
			<Slider 
				label="Size"
				min={10}
				max={100}
				value={overlaySize}
				onChange={(val) => onChange('overlaySize', val)}
			/>
		</div>

		<div class="slider-row">
			<Slider 
				label="Opacity"
				min={0}
				max={100}
				value={overlayOpacity}
				onChange={(val) => onChange('overlayOpacity', val)}
			/>
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
			</div>
			<span class="row-label layer-label">Layers</span>
			<div class="layer-buttons">
				<button 
					class="layer-btn"
					class:active={overlayLayer === 'above'}
					on:click={() => onChange('overlayLayer', 'above')}
					aria-label="Overlay above text"
				>
					<img src="/icons/icon-layer-above.svg" alt="" class="layer-icon" />
				</button>
				<button 
					class="layer-btn"
					class:active={overlayLayer === 'below'}
					on:click={() => onChange('overlayLayer', 'below')}
					aria-label="Overlay below text"
				>
					<img src="/icons/icon-layer-below.svg" alt="" class="layer-icon" />
				</button>
			</div>
		</div>

		<div class="slider-row">
			<Slider 
				label="Border width"
				min={0}
				max={3}
				step={1}
				value={overlayBorderWidth}
				onChange={handleBorderWidthChange}
			/>
		</div>

		<div class="color-section">
			<span class="section-label">Border colour</span>
			<ColorSwatch 
				colors={BORDER_COLORS}
				value={overlayBorderColor}
				onChange={(color) => onChange('overlayBorderColor', color)}
				showRainbow={true}
			/>
		</div>
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

	.slider-row {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
	}

	.slider-row :global(.slider-container) {
		flex: 1;
	}

	.mask-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.row-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.layer-label {
		margin-left: auto;
	}

	.mask-buttons,
	.layer-buttons {
		display: flex;
		gap: var(--space-1);
	}

	.mask-btn,
	.layer-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.mask-btn:hover:not(.active),
	.layer-btn:hover:not(.active) {
		background: var(--color-border-light);
	}

	.mask-btn.active,
	.layer-btn.active {
		background: var(--color-text-primary);
		border-color: var(--color-text-primary);
	}

	.mask-icon,
	.layer-icon {
		width: 20px;
		height: 20px;
	}

	.mask-btn:not(.active) .mask-icon,
	.layer-btn:not(.active) .layer-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.mask-btn.active .mask-icon,
	.layer-btn.active .layer-icon {
		filter: brightness(0) invert(1);
	}

	.circle-icon {
		width: 18px;
		height: 18px;
		border: 2px solid currentColor;
		border-radius: 50%;
	}

	.mask-btn:not(.active) .circle-icon {
		border-color: #777;
	}

	.mask-btn.active .circle-icon {
		border-color: white;
	}

	.color-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.section-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
</style>
