<script>
	export let variant = 'secondary';
	export let disabled = false;
	export let icon = null;
	export let fullWidth = false;
</script>

<button 
	class="btn btn-{variant}"
	class:full-width={fullWidth}
	{disabled}
	on:click
>
	{#if icon}
		<img src="/icons/{icon}.svg" alt="" class="btn-icon" />
	{/if}
	<slot />
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		height: 44px;
		padding: 0 var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		transition: all var(--transition-fast);
	}
	
	.btn.full-width {
		width: 100%;
	}
	
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.btn-primary {
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border: none;
	}
	
	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}
	
	.btn-primary .btn-icon {
		filter: brightness(0) invert(1);
	}
	
	.btn-secondary {
		background-color: var(--color-surface);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}
	
	.btn-secondary:hover:not(:disabled) {
		background-color: var(--color-border-light);
	}
	
	.btn-icon {
		width: 20px;
		height: 20px;
	}
</style>
