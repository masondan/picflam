<script>
	export let label = '';
	export let options = [];
	export let value = '';
	export let onChange = (val) => {};
	
	function handleChange(e) {
		value = e.target.value;
		onChange(value);
	}
</script>

<div class="select-field">
	{#if label}
		<label class="select-label">{label}</label>
	{/if}
	<select class="select" {value} on:change={handleChange}>
		{#each options as option}
			<option value={option.value} style={option.style || ''}>
				{option.label}
			</option>
		{/each}
	</select>
</div>

<style>
	.select-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	
	.select-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
	
	.select {
		width: 100%;
		height: 44px;
		padding: var(--space-2) var(--space-3);
		padding-right: 36px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-base);
		font-family: var(--font-family-base);
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23777777'%3E%3Cpath d='M12 15L7 10h10l-5 5z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 8px center;
		background-size: 20px;
		appearance: none;
		cursor: pointer;
		transition: border-color var(--transition-fast);
	}
	
	.select:focus {
		outline: none;
		border-color: var(--color-primary);
	}
</style>
