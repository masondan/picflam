<script>
	export let colors = [];
	export let value = '';
	export let onChange = (color) => {};
	export let showRainbow = true;
	
	let showPicker = false;
	let customColor = '#5422b0';
</script>

<div class="color-swatches">
	{#each colors as color}
		<button 
			class="swatch"
			class:active={value === color}
			class:white={color === '#FFFFFF'}
			style="background-color: {color};"
			on:click={() => onChange(color)}
			aria-label="Select color {color}"
		/>
	{/each}
	
	{#if showRainbow}
		<button 
			class="swatch rainbow"
			class:active={!colors.includes(value) && value !== 'transparent'}
			on:click={() => showPicker = !showPicker}
			aria-label="Custom color"
		/>
		
		{#if showPicker}
			<div class="color-picker-popover">
				<input 
					type="color" 
					bind:value={customColor}
					on:change={() => onChange(customColor)}
				/>
			</div>
		{/if}
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
		border: 2px solid transparent;
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.swatch:hover {
		transform: scale(1.1);
	}
	
	.swatch.active {
		border-color: var(--color-primary);
	}
	
	.swatch.white {
		border-color: var(--color-border);
	}
	
	.swatch.white.active {
		border-color: var(--color-primary);
	}
	
	.swatch.rainbow {
		background: conic-gradient(
			red, yellow, lime, aqua, blue, magenta, red
		);
		overflow: hidden;
		padding: 0;
		background-clip: padding-box;
	}
	
	.color-picker-popover {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
		background: var(--color-surface);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-lg);
	}
	
	.color-picker-popover input[type="color"] {
		width: 200px;
		height: 200px;
		border: none;
		padding: 0;
		cursor: pointer;
	}
</style>
