<script>
	import { onMount, onDestroy } from 'svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import ColorPickerPopup from '$lib/components/ui/ColorPickerPopup.svelte';
	import { CANVAS_COLORS, FONTS } from '$lib/stores/designStore.js';

	export let text2 = '';
	export let text2Font = 'Inter';
	export let text2Size = 3;
	export let text2YPosition = 8;
	export let text2LineSpacing = 5;
	export let text2LetterSpacing = 0;
	export let text2Color = '#FFFFFF';
	export let text2LabelColor = 'transparent';
	export let text2IsBold = false;
	export let text2Align = 'center';
	export let onChange = (key, value) => {};
	export let onPreviewToggle = (value) => {};

	const TEXT_COLORS = CANVAS_COLORS.solids;
	const ALIGNMENTS = ['left', 'center', 'right'];

	const DEFAULTS = {
		text2Size: 2,
		text2YPosition: 8,
		text2LineSpacing: 3,
		text2LetterSpacing: 0
	};

	let spacingMode = 'line'; // 'line' or 'letter'
	let isPreviewActive = false;
	let highlightPickerOpen = false;
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
		onChange('text2', e.target.value);
	}

	function selectFont(font) {
		onChange('text2Font', font);
		// Inter defaults to bold, all other fonts default to normal weight
		onChange('text2IsBold', font === 'Inter');
		showFontDropdown = false;
	}

	function toggleBold() {
		onChange('text2IsBold', !text2IsBold);
	}

	function cycleAlign() {
		const currentIndex = ALIGNMENTS.indexOf(text2Align);
		const nextIndex = (currentIndex + 1) % ALIGNMENTS.length;
		onChange('text2Align', ALIGNMENTS[nextIndex]);
	}

	function handleColorChange(color) {
		onChange('text2Color', color);
	}

	function resetSlider(key) {
		onChange(key, DEFAULTS[key]);
	}

</script>

<div class="text2-controls">
	<div class="text-input-container">
		<textarea 
			class="text-input"
			placeholder="Add text (with ==highlights==)"
			value={text2}
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
				max={10}
				value={text2Size}
				on:input={(e) => onChange('text2Size', Number(e.target.value))}
			/>
		</div>
		<button 
			class="reset-btn" 
			on:click={() => resetSlider('text2Size')}
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
				style="font-family: '{text2Font}'"
				on:click={() => showFontDropdown = !showFontDropdown}
			>
				{text2Font === 'Inter' ? 'Inter (Default)' : text2Font}
				<span class="dropdown-arrow">▾</span>
			</button>
			{#if showFontDropdown}
				<div class="font-dropdown-menu">
					{#each FONTS as font}
						<button 
							class="font-option"
							class:selected={text2Font === font}
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
			class:active={text2IsBold}
			on:click={toggleBold}
			aria-label="Bold"
		>
			<img src="/icons/icon-bold.svg" alt="" class="btn-icon" />
		</button>
		
		<button 
			class="icon-btn"
			on:click={cycleAlign}
			aria-label="Align {text2Align}"
		>
			<img src="/icons/icon-align-{text2Align}.svg" alt="" class="btn-icon" />
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
					value={text2LineSpacing}
					on:input={(e) => onChange('text2LineSpacing', Number(e.target.value))}
				/>
			{:else if spacingMode === 'letter'}
				<input 
					type="range"
					class="inline-slider"
					min={-2}
					max={5}
					value={text2LetterSpacing}
					on:input={(e) => onChange('text2LetterSpacing', Number(e.target.value))}
				/>
			{/if}
		</div>
		<button 
			class="reset-btn" 
			on:click={() => {
				if (spacingMode === 'line') resetSlider('text2LineSpacing');
				else if (spacingMode === 'letter') resetSlider('text2LetterSpacing');
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
			value={text2Color}
			onChange={handleColorChange}
			showRainbow={true}
			/>
		<div class="color-separator"></div>
		<button
			class="swatch"
			class:active={text2LabelColor === '#FFD700'}
			style="background-color: #FFD700; {text2LabelColor === '#FFD700' ? 'box-shadow: 0 0 0 3px #FFD700;' : ''}"
			on:click={() => onChange('text2LabelColor', text2LabelColor === '#FFD700' ? 'transparent' : '#FFD700')}
			aria-label="Select yellow highlight"
		/>
		<button
			class="swatch rainbow"
			class:active={text2LabelColor && text2LabelColor !== '#FFD700' && text2LabelColor !== 'transparent'}
			style="border-color: {text2LabelColor && text2LabelColor !== '#FFD700' && text2LabelColor !== 'transparent' ? text2LabelColor : '#999999'}; {text2LabelColor && text2LabelColor !== '#FFD700' && text2LabelColor !== 'transparent' ? 'box-shadow: inset 0 0 0 2px white;' : ''}"
			on:click={() => highlightPickerOpen = true}
			aria-label="Custom highlight color"
		/>
		<ColorPickerPopup
			color={text2LabelColor !== '#FFD700' && text2LabelColor !== 'transparent' ? text2LabelColor : '#FFD700'}
			open={highlightPickerOpen}
			onColorChange={(color) => onChange('text2LabelColor', color)}
			onClose={() => highlightPickerOpen = false}
		/>
	</div>
</div>

<style>
	.text2-controls {
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
	}

	.section-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
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

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover .reset-icon {
		opacity: 1;
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

	.swatch.rainbow {
		background: conic-gradient(
			red, yellow, lime, aqua, blue, magenta, red
		) !important;
	}

	.swatch:hover {
		transform: scale(1.1);
	}

	.color-separator {
		width: 1px;
		height: 36px;
		background-color: #cccccc;
		flex-shrink: 0;
		margin: 0 var(--space-3);
	}

</style>
