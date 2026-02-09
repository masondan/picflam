<script>
	import FilterGrid from '$lib/components/ui/FilterGrid.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import { FILTER_DEFINITIONS } from '$lib/stores/cropStore.js';

	export let imageUrl = '';
	export let activeFilter = 'normal';
	export let filterStrength = 50;
	export let onFilterChange = (filterId) => {};
	export let onStrengthChange = (value) => {};
	export let onReset = () => {};

	$: isNormal = activeFilter === 'normal';
</script>

<div class="filter-controls">
	<FilterGrid 
		filters={FILTER_DEFINITIONS}
		value={activeFilter}
		{imageUrl}
		onChange={onFilterChange}
	/>
	
	<div class="strength-controls" class:disabled={isNormal}>
		<span class="strength-label">Strength</span>
		<div class="slider-track">
			<Slider
				min={0}
				max={100}
				value={filterStrength}
				onChange={isNormal ? () => {} : onStrengthChange}
			/>
		</div>
		<button class="reset-btn" on:click={onReset} aria-label="Reset filter">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>
</div>

<style>
	.filter-controls {
		display: flex;
		flex-direction: column;
	}

	.strength-controls {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.strength-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
		min-width: 65px;
		padding-top: 2px;
	}

	.slider-track {
		flex: 1;
	}

	.strength-controls.disabled {
		pointer-events: none;
	}

	.strength-controls.disabled .strength-label {
		color: #777777;
	}

	.strength-controls.disabled :global(.slider) {
		background: #cccccc;
	}

	.strength-controls.disabled :global(.slider::-webkit-slider-thumb) {
		background: #777777;
	}

	.strength-controls.disabled :global(.slider::-moz-range-thumb) {
		background: #777777;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: none;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity var(--transition-fast);
		flex-shrink: 0;
		padding: 0;
		padding-top: 2px;
	}

	.reset-btn:hover {
		opacity: 1;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
	}
</style>
