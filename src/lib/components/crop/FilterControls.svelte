<script>
	import FilterGrid from '$lib/components/ui/FilterGrid.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';

	export let imageUrl = '';
	export let activeFilter = 'original';
	export let filterStrength = 50;
	export let onFilterChange = (filterId) => {};
	export let onStrengthChange = (value) => {};
	export let onReset = () => {};

	const filters = [
		{ id: 'original', label: 'Original', css: 'none' },
		{ id: 'greyscale', label: 'Greyscale', css: 'grayscale(100%)' },
		{ id: 'sepia', label: 'Sepia', css: 'sepia(100%)' },
		{ id: 'sunset', label: 'Sunset', css: 'sepia(30%) saturate(140%) brightness(110%) hue-rotate(-10deg)' },
		{ id: 'azure', label: 'Azure', css: 'saturate(120%) brightness(105%) hue-rotate(180deg)' },
		{ id: 'teal', label: 'Teal', css: 'saturate(130%) hue-rotate(140deg)' }
	];

	$: isOriginal = activeFilter === 'original';
</script>

<div class="filter-controls">
	<FilterGrid 
		{filters}
		value={activeFilter}
		{imageUrl}
		onChange={onFilterChange}
	/>
	
	<div class="slider-row" class:disabled={isOriginal}>
		<div class="slider-track">
			<Slider
				label="Strength"
				min={0}
				max={100}
				value={filterStrength}
				onChange={isOriginal ? () => {} : onStrengthChange}
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

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.slider-track {
		flex: 1;
	}

	.slider-row.disabled {
		opacity: 0.4;
		pointer-events: none;
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
	}

	.reset-btn:hover {
		opacity: 1;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
	}
</style>
