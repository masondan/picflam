<script>
	import { onMount, onDestroy } from 'svelte';
	import '@melloware/coloris/dist/coloris.css';

	export let colors = [];
	export let value = '';
	export let onChange = (color) => {};
	export let showRainbow = true;
	
	let customColor = '#5422b0';
	let colorInputEl;
	let inputId = `color-picker-${Math.random().toString(36).substr(2, 9)}`;

	function handleColorPick(event) {
		customColor = event.detail.color;
		onChange(event.detail.color);
	}

	onMount(async () => {
		if (colorInputEl && showRainbow) {
			const { default: Coloris, init } = await import('@melloware/coloris');
			init();
			Coloris({
				el: `#${inputId}`,
				parent: '.app',
				wrap: false,
				theme: 'polaroid',
				alpha: false
			});
			document.addEventListener('coloris:pick', handleColorPick);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('coloris:pick', handleColorPick);
		}
	});
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
		<input 
			bind:this={colorInputEl}
			id={inputId}
			type="text" 
			value={customColor}
			class="swatch rainbow"
			class:active={value && !colors.includes(value) && value !== 'transparent'}
			style="border-color: {value && !colors.includes(value) && value !== 'transparent' ? customColor : '#999999'}; {value && !colors.includes(value) && value !== 'transparent' ? `box-shadow: inset 0 0 0 2px white;` : ''}"
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
