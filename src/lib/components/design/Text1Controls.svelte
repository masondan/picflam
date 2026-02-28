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
	export let text1LetterSpacing = 0;
	export let text1Color = '#FFFFFF';
	export let text1HighlightColor = 'transparent';
	export let text1IsBold = true;
	export let text1Align = 'center';
	export let text1QuoteStyle = 'none';
	export let text1QuoteSize = 5;
	export let onChange = (key, value) => {};
	export let onPreviewToggle = (value) => {};

	const TEXT_COLORS = CANVAS_COLORS.solids;
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
		text1LetterSpacing: 0,
		text1QuoteSize: 3
	};

	let spacingMode = 'line'; // 'line' or 'letter'
	let isPreviewActive = false;
	let highlightColorInputEl;
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

	function resetSlider(key) {
		onChange(key, DEFAULTS[key]);
	}

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

	<div class="size-row">
		<span class="row-label">Text size</span>
		<div class="slider-wrapper">
			<input 
				type="range"
				class="inline-slider"
				min={1}
				max={9}
				value={text1Size}
				on:input={(e) => onChange('text1Size', Number(e.target.value))}
			/>
		</div>
		<button 
			class="reset-btn" 
			on:click={() => resetSlider('text1Size')}
			aria-label="Reset text size"
		>
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
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

		<button 
			class="icon-btn"
			class:active={isPreviewActive}
			on:click={() => {
				isPreviewActive = !isPreviewActive;
				onPreviewToggle(isPreviewActive);
			}}
			aria-label="Preview"
		>
			<img src="/icons/icon-preview.svg" alt="" class="btn-icon" />
		</button>
	</div>

	<div class="spacing-label-row">
		<button 
			class="spacing-label"
			class:active={spacingMode === 'line'}
			on:click={() => spacingMode = 'line'}
		>
			Line spacing
		</button>
		<button 
			class="spacing-label"
			class:active={spacingMode === 'letter'}
			on:click={() => spacingMode = 'letter'}
		>
			Letter spacing
		</button>
	</div>

	<div class="spacing-row">
		<div class="slider-wrapper">
			{#if spacingMode === 'line'}
				<input 
					type="range"
					class="inline-slider"
					min={1}
					max={10}
					value={text1LineSpacing}
					on:input={(e) => onChange('text1LineSpacing', Number(e.target.value))}
				/>
			{:else if spacingMode === 'letter'}
				<input 
					type="range"
					class="inline-slider"
					min={-2}
					max={5}
					value={text1LetterSpacing}
					on:input={(e) => onChange('text1LetterSpacing', Number(e.target.value))}
				/>
			{/if}
		</div>
		<button 
			class="reset-btn" 
			on:click={() => {
				if (spacingMode === 'line') resetSlider('text1LineSpacing');
				else if (spacingMode === 'letter') resetSlider('text1LetterSpacing');
			}}
			aria-label="Reset spacing"
		>
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<span class="color-label">Text | Highlights</span>
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
			on:click={() => onChange('text1HighlightColor', text1HighlightColor === '#FFD700' ? 'transparent' : '#FFD700')}
			aria-label="Select yellow highlight"
		/>
		<button
			class="swatch rainbow"
			class:active={text1HighlightColor && text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent'}
			style="border-color: {text1HighlightColor && text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent' ? text1HighlightColor : '#999999'}; {text1HighlightColor && text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent' ? 'box-shadow: inset 0 0 0 2px white;' : ''}"
			on:click={() => highlightColorInputEl?.click()}
			aria-label="Custom highlight color"
		/>
		<input
			bind:this={highlightColorInputEl}
			type="color"
			value={text1HighlightColor !== '#FFD700' && text1HighlightColor !== 'transparent' ? text1HighlightColor : '#FFD700'}
			on:input={(e) => onChange('text1HighlightColor', e.target.value)}
			class="hidden-highlight-input"
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
		margin: 0 var(--space-3);
	}

	.size-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-bottom: 0;
	}

	.spacing-label-row {
		display: flex;
		gap: var(--space-4);
		margin-bottom: 0;
	}

	.spacing-label {
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #555555;
		transition: color var(--transition-fast);
	}

	.spacing-label:hover {
		color: var(--color-text-primary);
	}

	.spacing-label.active {
		color: var(--color-primary);
		font-weight: 700;
	}

	.spacing-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-bottom: 0;
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
		margin-top: var(--space-2);
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

	.swatch {
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

	.swatch:hover {
		transform: scale(1.1);
	}

	.swatch.rainbow {
		background: conic-gradient(
			red, yellow, lime, aqua, blue, magenta, red
		) !important;
	}

	.hidden-highlight-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.color-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

</style>
