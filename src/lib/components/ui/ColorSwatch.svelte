<script>
	export let colors = [];
	export let value = '';
	export let onChange = (color) => {};
	export let showRainbow = true;

	let customColor = '#5422b0';
	let colorInputEl;

	function handleNativePick(e) {
		customColor = e.target.value;
		onChange(e.target.value);
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
			on:click={() => colorInputEl?.click()}
			aria-label="Custom color picker"
		/>
		<input 
			bind:this={colorInputEl}
			type="color"
			value={customColor}
			on:input={handleNativePick}
			class="hidden-color-input"
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

	.hidden-color-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}
</style>
