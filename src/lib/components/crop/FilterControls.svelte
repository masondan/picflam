<script>
	import FilterGrid from '$lib/components/ui/FilterGrid.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';

	export let imageUrl = '';
	export let activeFilter = 'original';
	export let filterStrength = 50;
	export let onFilterChange = (filterId) => {};
	export let onStrengthChange = (value) => {};

	const filters = [
		{ id: 'original', label: 'Original', css: 'none' },
		{ id: 'greyscale', label: 'Greyscale', css: 'grayscale(100%)' },
		{ id: 'sepia', label: 'Sepia', css: 'sepia(100%)' },
		{ id: 'sunset', label: 'Sunset', css: 'sepia(30%) saturate(140%) brightness(110%) hue-rotate(-10deg)' },
		{ id: 'azure', label: 'Azure', css: 'saturate(120%) brightness(105%) hue-rotate(180deg)' },
		{ id: 'teal', label: 'Teal', css: 'saturate(130%) hue-rotate(140deg)' }
	];

	$: showStrengthSlider = activeFilter !== 'original';
</script>

<div class="filter-controls">
	<FilterGrid 
		{filters}
		value={activeFilter}
		{imageUrl}
		onChange={onFilterChange}
	/>
	
	{#if showStrengthSlider}
		<div class="strength-slider">
			<Slider
				label="Strength"
				min={0}
				max={100}
				value={filterStrength}
				onChange={onStrengthChange}
			/>
		</div>
	{/if}
</div>

<style>
	.filter-controls {
		display: flex;
		flex-direction: column;
	}

	.strength-slider {
		margin-top: var(--space-4);
	}
</style>
