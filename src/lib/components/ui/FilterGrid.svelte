<script>
	export let filters = [];
	export let value = 'original';
	export let imageUrl = '';
	export let onChange = (filter) => {};
</script>

<div class="filter-grid">
	{#each filters as filter}
		<button 
			class="filter-card"
			class:active={value === filter.id}
			on:click={() => onChange(filter.id)}
		>
			<div 
				class="filter-preview"
				style="
					background-image: url({imageUrl});
					filter: {filter.css || 'none'};
				"
			/>
			<span class="filter-label" class:active={value === filter.id}>
				{filter.label}
			</span>
		</button>
	{/each}
</div>

<style>
	.filter-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
	}
	
	.filter-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		background: none;
		border: none;
		padding: 0;
	}
	
	.filter-preview {
		width: 100%;
		aspect-ratio: 1;
		border-radius: var(--radius-md);
		border: 2px solid var(--color-border);
		background-size: cover;
		background-position: center;
		transition: border-color var(--transition-fast);
	}
	
	.filter-card.active .filter-preview {
		border-color: var(--color-primary);
	}
	
	.filter-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		transition: color var(--transition-fast);
	}
	
	.filter-label.active {
		color: var(--color-primary);
	}
</style>
