<script>
	export let label = '';
	export let value = '';
	export let type = 'text';
	export let placeholder = '';
	export let disabled = false;
	export let onChange = (val) => {};
	
	function handleInput(e) {
		value = e.target.value;
		onChange(value);
	}
</script>

<div class="input-field">
	{#if label}
		<label class="input-label">
			{label}
			<input 
				class="input"
				{type}
				{value}
				{placeholder}
				{disabled}
				on:input={handleInput}
			/>
		</label>
	{:else}
		<input 
			class="input"
			{type}
			{value}
			{placeholder}
			{disabled}
			on:input={handleInput}
		/>
	{/if}
</div>

<style>
	.input-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}
	
	.input-label {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
	
	.input {
		width: 100%;
		height: 44px;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		background-color: var(--color-surface);
		transition: border-color var(--transition-fast);
	}
	
	.input::placeholder {
		color: var(--color-text-muted);
	}
	
	.input:focus {
		outline: none;
		border-color: var(--color-primary);
	}
	
	.input:disabled {
		background-color: var(--color-border-light);
		cursor: not-allowed;
	}
</style>
