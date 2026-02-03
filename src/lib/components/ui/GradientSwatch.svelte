<script>
	export let gradients = [];
	export let value = '';
	export let onChange = (gradient) => {};
</script>

<div class="gradient-swatches">
	{#each gradients as gradient}
		<button 
			class="swatch"
			class:active={value === gradient}
			style="background: {gradient};"
			on:click={() => onChange(gradient)}
			aria-label="Select gradient"
		/>
	{/each}
</div>

<style>
	.gradient-swatches {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
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
</style>
