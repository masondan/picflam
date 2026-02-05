<script>
	import { onMount, onDestroy } from 'svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import { CANVAS_COLORS, FONTS } from '$lib/stores/designStore.js';

	export let text1 = '';
	export let text1Font = 'Inter';
	export let text1Size = 5;
	export let text1YPosition = 3;
	export let text1LineSpacing = 5;
	export let text1Color = '#000000';
	export let text1HighlightColor = 'transparent';
	export let text1IsBold = true;
	export let text1Align = 'center';
	export let onChange = (key, value) => {};

	const TEXT_COLORS = CANVAS_COLORS.solids;
	const HIGHLIGHT_COLORS = ['#FFD700', '#000000', '#007C1F', '#00679D', '#B20715'];
	const ALIGNMENTS = ['left', 'center', 'right'];

	const DEFAULTS = {
		text1Size: 5,
		text1YPosition: 3,
		text1LineSpacing: 5
	};

	let showFontDropdown = false;
	let fontDropdownRef;

	function handleClickOutside(event) {
		if (fontDropdownRef && !fontDropdownRef.contains(event.target)) {
			showFontDropdown = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});

	function handleTextChange(e) {
		onChange('text1', e.target.value);
	}

	function selectFont(font) {
		onChange('text1Font', font);
		showFontDropdown = false;
	}

	function toggleBold() {
		onChange('text1IsBold', !text1IsBold);
	}

	function cycleAlign() {
		const currentIndex = ALIGNMENTS.indexOf(text1Align);
		const nextIndex = (currentIndex + 1) % ALIGNMENTS.length;
		onChange('text1Align', ALIGNMENTS[nextIndex]);
	}

	function handleColorChange(color) {
		onChange('text1Color', color);
	}

	function handleHighlightChange(color) {
		onChange('text1HighlightColor', color === text1HighlightColor ? 'transparent' : color);
	}

	function resetSlider(key) {
		onChange(key, DEFAULTS[key]);
	}
</script>

<div class="text1-controls">
	<div class="text-input-container">
		<textarea 
			class="text-input"
			placeholder="How to ==highlight== text"
			value={text1}
			on:input={handleTextChange}
		></textarea>
		<div class="resize-handle"></div>
	</div>

	<div class="font-row">
		<span class="row-label">Font</span>
		<div class="font-dropdown-wrapper" bind:this={fontDropdownRef}>
			<button 
				class="font-dropdown-trigger"
				style="font-family: '{text1Font}'"
				on:click={() => showFontDropdown = !showFontDropdown}
			>
				{text1Font === 'Inter' ? 'Inter (Default)' : text1Font}
				<span class="dropdown-arrow">▾</span>
			</button>
			{#if showFontDropdown}
				<div class="font-dropdown-menu">
					{#each FONTS as font}
						<button 
							class="font-option"
							class:selected={text1Font === font}
							style="font-family: '{font}'"
							on:click={() => selectFont(font)}
						>
							{font === 'Inter' ? 'Inter (Default)' : font}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		
		<button 
			class="icon-btn"
			class:active={text1IsBold}
			on:click={toggleBold}
			aria-label="Bold"
		>
			<img src="/icons/icon-bold.svg" alt="" class="btn-icon" />
		</button>
		
		<button 
			class="icon-btn"
			on:click={cycleAlign}
			aria-label="Align {text1Align}"
		>
			<img src="/icons/icon-align-{text1Align}.svg" alt="" class="btn-icon" />
		</button>
	</div>

	<div class="slider-row">
		<Slider 
			label="Size"
			min={1}
			max={10}
			value={text1Size}
			onChange={(val) => onChange('text1Size', val)}
		/>
		<button class="reset-btn" on:click={() => resetSlider('text1Size')} aria-label="Reset size">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<div class="slider-row">
		<Slider 
			label="Position"
			min={0}
			max={10}
			value={text1YPosition}
			onChange={(val) => onChange('text1YPosition', val)}
		/>
		<button class="reset-btn" on:click={() => resetSlider('text1YPosition')} aria-label="Reset position">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<div class="slider-row">
		<Slider 
			label="Line spacing"
			min={1}
			max={10}
			value={text1LineSpacing}
			onChange={(val) => onChange('text1LineSpacing', val)}
		/>
		<button class="reset-btn" on:click={() => resetSlider('text1LineSpacing')} aria-label="Reset line spacing">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<div class="color-section">
		<span class="section-label">Text colour</span>
		<ColorSwatch 
			colors={TEXT_COLORS}
			value={text1Color}
			onChange={handleColorChange}
			showRainbow={true}
		/>
	</div>

	<div class="color-section">
		<span class="section-label">Highlight colour</span>
		<ColorSwatch 
			colors={HIGHLIGHT_COLORS}
			value={text1HighlightColor}
			onChange={handleHighlightChange}
			showRainbow={true}
		/>
	</div>
</div>

<style>
	.text1-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.text-input-container {
		position: relative;
	}

	.text-input {
		width: 100%;
		min-height: 60px;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-family: var(--font-family-base);
		color: var(--color-text-primary);
		background: var(--color-surface);
		resize: vertical;
	}

	.text-input::placeholder {
		color: var(--color-text-muted);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.resize-handle {
		position: absolute;
		bottom: 4px;
		right: 4px;
		width: 12px;
		height: 12px;
		background: linear-gradient(135deg, transparent 50%, var(--color-border) 50%);
		pointer-events: none;
	}

	.font-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.row-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
	}

	.font-dropdown-wrapper {
		flex: 1;
		position: relative;
	}

	.font-dropdown-trigger {
		width: 100%;
		height: 44px;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		cursor: pointer;
		text-align: left;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.font-dropdown-trigger:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.dropdown-arrow {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}

	.font-dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-lg);
		z-index: 100;
		max-height: 240px;
		overflow-y: auto;
		margin-top: 4px;
	}

	.font-option {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: none;
		background: transparent;
		text-align: left;
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		cursor: pointer;
	}

	.font-option:hover {
		background: var(--color-border-light);
	}

	.font-option.selected {
		background: var(--color-primary-light);
		color: var(--color-primary);
	}

	.icon-btn {
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
		flex-shrink: 0;
	}

	.icon-btn:hover:not(.active) {
		background-color: var(--color-border-light);
	}

	.icon-btn.active {
		border-color: var(--color-primary);
	}

	.btn-icon {
		width: 20px;
		height: 20px;
	}

	.icon-btn:not(.active) .btn-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
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

	.slider-row {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		padding-bottom: var(--space-1);
	}

	.slider-row :global(.slider-container) {
		flex: 1;
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
		margin-bottom: -6px;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover .reset-icon {
		opacity: 1;
	}
</style>
