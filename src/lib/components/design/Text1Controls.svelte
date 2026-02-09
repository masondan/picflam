<script>
	import { onMount, onDestroy } from 'svelte';
	import '@melloware/coloris/dist/coloris.css';
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
	export let text1QuoteStyle = 'none';
	export let text1QuoteSize = 5;
	export let onChange = (key, value) => {};

	const TEXT_COLORS = CANVAS_COLORS.solids;
	const HIGHLIGHT_COLORS = ['#FFD700', '#000000', '#007C1F', '#00679D', '#B20715'];
	const ALIGNMENTS = ['left', 'center', 'right'];
	const QUOTE_STYLES = [
		{ id: 'none', icon: '/icons/icon-none.svg', label: 'No quote' },
		{ id: 'serif', icon: '/icons/icon-quote-serif.svg', label: 'Serif quote' },
		{ id: 'slab', icon: '/icons/icon-quote-slab.svg', label: 'Slab quote' }
	];

	const DEFAULTS = {
		text1Size: 5,
		text1YPosition: 5,
		text1LineSpacing: 3,
		text1QuoteSize: 3
	};

	let sliderMode = 'size'; // 'size', 'position', or 'linespacing'
	let highlightColorInputEl;
	let highlightColorInputId = `text1-highlight-${Math.random().toString(36).substr(2, 9)}`;

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
		// Inter defaults to bold, all other fonts default to normal weight
		onChange('text1IsBold', font === 'Inter');
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

	function selectQuoteStyle(style) {
		onChange('text1QuoteStyle', style);
	}

	function handleHighlightColorPick(event) {
		onChange('text1HighlightColor', event.detail.color);
	}

	function resetSlider(key) {
		onChange(key, DEFAULTS[key]);
	}

	onMount(async () => {
		if (highlightColorInputEl) {
			const { default: Coloris, init } = await import('@melloware/coloris');
			init();
			Coloris({
				el: `#${highlightColorInputId}`,
				parent: '.app',
				wrap: false,
				theme: 'polaroid',
				alpha: false
			});
			document.addEventListener('coloris:pick', handleHighlightColorPick);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('coloris:pick', handleHighlightColorPick);
		}
	});
</script>

<div class="text1-controls">
	<div class="text-input-container">
		<textarea 
			class="text-input"
			placeholder="Add text (with ==highlights==)"
			value={text1}
			on:input={handleTextChange}
		></textarea>
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

	<div class="slider-tabs">
		<button 
			class="slider-tab"
			class:active={sliderMode === 'size'}
			on:click={() => sliderMode = 'size'}
		>
			Size
		</button>
		<button 
			class="slider-tab"
			class:active={sliderMode === 'position'}
			on:click={() => sliderMode = 'position'}
		>
			Position
		</button>
		<button 
			class="slider-tab"
			class:active={sliderMode === 'linespacing'}
			on:click={() => sliderMode = 'linespacing'}
		>
			Line spacing
		</button>
	</div>

	<div class="slider-row">
		<div class="slider-wrapper">
			{#if sliderMode === 'size'}
				<input 
					type="range"
					class="inline-slider"
					min={1}
					max={9}
									value={text1Size}
					on:input={(e) => onChange('text1Size', Number(e.target.value))}
				/>
			{:else if sliderMode === 'position'}
				<input 
					type="range"
					class="inline-slider"
					min={0}
					max={10}
					step={0.1}
					value={text1YPosition}
					on:input={(e) => onChange('text1YPosition', Number(e.target.value))}
				/>
			{:else if sliderMode === 'linespacing'}
				<input 
					type="range"
					class="inline-slider"
					min={1}
					max={10}
					value={text1LineSpacing}
					on:input={(e) => onChange('text1LineSpacing', Number(e.target.value))}
				/>
			{/if}
		</div>
		<button 
			class="reset-btn" 
			on:click={() => {
				if (sliderMode === 'size') resetSlider('text1Size');
				else if (sliderMode === 'position') resetSlider('text1YPosition');
				else if (sliderMode === 'linespacing') resetSlider('text1LineSpacing');
			}}
			aria-label="Reset slider"
		>
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<span class="color-label">Text & Highlights</span>
	<div class="color-row">
		<ColorSwatch 
			colors={TEXT_COLORS}
			value={text1Color}
			onChange={handleColorChange}
			showRainbow={true}
		/>
		<div class="color-separator"></div>
		<button 
			class="swatch"
			class:active={text1HighlightColor === '#FFD700'}
			style="background-color: #FFD700; {text1HighlightColor === '#FFD700' ? 'box-shadow: 0 0 0 3px #FFD700;' : ''}"
			on:click={() => onChange('text1HighlightColor', '#FFD700')}
			aria-label="Select yellow highlight"
		/>
		<input 
			bind:this={highlightColorInputEl}
			id={highlightColorInputId}
			type="text" 
			value={text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent' ? text1HighlightColor : '#FFD700'}
			class="swatch rainbow"
			class:active={text1HighlightColor && text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent'}
			style="border-color: {text1HighlightColor && text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent' ? text1HighlightColor : '#999999'};"
		/>
	</div>

	<div class="quote-row">
		<span class="row-label">Quotes</span>
		<div class="style-row">
			{#each QUOTE_STYLES as style}
				<button
					class="style-btn"
					class:active={text1QuoteStyle === style.id}
					class:is-none={style.id === 'none'}
					on:click={() => selectQuoteStyle(style.id)}
					aria-label={style.label}
				>
					<img src={style.icon} alt="" class="style-icon" />
				</button>
			{/each}
		</div>
	</div>

	{#if text1QuoteStyle !== 'none'}
		<div class="slider-row quote-slider-row">
			<span class="row-label">Size</span>
			<div class="slider-wrapper">
				<input 
					type="range"
					class="inline-slider"
					min={1}
					max={5}
					value={text1QuoteSize}
					on:input={(e) => onChange('text1QuoteSize', Number(e.target.value))}
				/>
			</div>
			<button class="reset-btn" on:click={() => resetSlider('text1QuoteSize')} aria-label="Reset quote size">
				<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
			</button>
		</div>
	{/if}
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
		border: 1px solid #555555;
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
		height: 38px;
		padding: var(--space-2) var(--space-3);
		border: 1px solid #555555;
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
		border: 1px solid #555555;
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
		width: 38px;
		height: 38px;
		border: 1px solid #555555;
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
		border-color: #555555;
		background: #555555;
		color: white;
	}

	.btn-icon {
		width: 22px;
		height: 22px;
	}

	.icon-btn:not(.active) .btn-icon {
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.icon-btn.active .btn-icon {
		filter: brightness(0) invert(1);
	}

	.color-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: calc(var(--space-4) * -0.5);
		margin-bottom: var(--space-4);
	}

	.section-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.color-label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #555555;
		display: block;
		margin-bottom: 0px;
	}

	.color-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: flex-start;
		flex-wrap: nowrap;
		min-width: 0;
		margin-top: -6px;
	}

	.color-row :global(.color-swatches) {
		display: flex;
		gap: var(--space-2);
		flex-wrap: nowrap;
		min-width: 0;
	}

	.color-row .swatch {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-full);
		border: 3px solid transparent;
		cursor: pointer;
		transition: all var(--transition-fast);
		padding: 0;
		box-sizing: border-box;
		overflow: hidden;
		flex-shrink: 0;
	}

	.color-row .swatch.active {
		border-color: white;
	}

	.color-separator {
		width: 1px;
		height: 36px;
		background-color: #cccccc;
		flex-shrink: 0;
	}

	.slider-tabs {
		display: flex;
		gap: var(--space-4);
		margin-bottom: 0;
	}

	.slider-tab {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #555555;
		transition: color var(--transition-fast);
	}

	.slider-tab:hover {
		color: var(--color-text-primary);
	}

	.slider-tab.active {
		color: var(--color-primary);
		font-weight: 700;
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-bottom: 0;
		margin-top: calc(var(--space-2) * -1);
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

	.inline-slider:disabled {
		opacity: 0.4;
		cursor: not-allowed;
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
		margin-bottom: 0;
	}

	.reset-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover:not(:disabled) .reset-icon {
		opacity: 1;
	}

	.quote-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		justify-content: flex-start;
	}

	.style-row {
		display: flex;
		gap: var(--space-2);
	}

	.style-btn {
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
		color: #555555;
	}

	.style-btn:hover:not(.active) {
		background-color: var(--color-border-light);
	}

	.style-btn.active {
		border-color: #555555;
		background: #555555;
		color: white;
	}

	.style-icon {
		width: 22px;
		height: 22px;
	}

	.style-btn:not(.active) .style-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.style-btn.active .style-icon {
		filter: brightness(0) invert(1);
	}

	.quote-slider-row {
		padding-bottom: 0;
	}

	.quote-slider-row.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	.color-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.swatch.rainbow {
		background: conic-gradient(
			red, yellow, lime, aqua, blue, magenta, red
		) !important;
		color: transparent !important;
		font-size: 0 !important;
		padding: 0;
		appearance: none;
		-webkit-appearance: none;
	}

	:global(.clr-picker::before) {
		display: none !important;
	}

	:global(.clr-picker) {
		position: fixed !important;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%) !important;
		z-index: 1000 !important;
	}
</style>
