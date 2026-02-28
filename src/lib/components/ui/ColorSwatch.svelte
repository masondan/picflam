<script>
	import ColorPickerPopup from './ColorPickerPopup.svelte';

	export let colors = [];
	export let value = '';
	export let onChange = (color) => {};
	export let showRainbow = true;

	let pickerOpen = false;
	let customColor = '#5422b0';

	function openPicker() {
		customColor = (value && !colors.includes(value) && value !== 'transparent') ? value : customColor;
		pickerOpen = true;
	}

	function handlePickerChange(color) {
		customColor = color;
		onChange(color);
	}
</script>

<div class="color-swatches">
	{#each colors as color}
		<button 
			class="swatch"
			class:active={value === color}
			class:white={color === '#FFFFFF'}
			style="background-color: {color}; {value === color && color !== '#FFFFFF' ? `box-shadow: 0 0 0 3px ${color};` : ''}"
			on:click={() => onChange(color)}
			aria-label="Select color {color}"
		/>
	{/each}
	
	{#if showRainbow}
		<button 
			class="swatch rainbow"
			class:active={value && !colors.includes(value) && value !== 'transparent'}
			style="border-color: {value && !colors.includes(value) && value !== 'transparent' ? customColor : '#999999'}; {value && !colors.includes(value) && value !== 'transparent' ? `box-shadow: inset 0 0 0 2px white;` : ''}"
			on:click={openPicker}
			aria-label="Custom color picker"
		/>
		<ColorPickerPopup
			color={customColor}
			open={pickerOpen}
			onColorChange={handlePickerChange}
			onClose={() => pickerOpen = false}
		/>
	{/if}
</div>

<style>
	.color-swatches {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		position: relative;
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
	
	.swatch.active {
		border-color: white;
	}
	
	.swatch.white {
		border-color: #999999;
	}
	
	.swatch.white.active {
		border-color: #555555;
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
</style>
