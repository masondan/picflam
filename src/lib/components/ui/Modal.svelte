<script>
	import '$lib/styles/modal-base.css';
	
	export let title = '';
	export let message = '';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let onConfirm = () => {};
	export let onCancel = () => {};
</script>

<div 
	class="modal-overlay" 
	on:click={onCancel}
	on:keydown={(e) => e.key === 'Escape' && onCancel()}
	role="dialog" 
	aria-modal="true"
	tabindex="-1"
>
	<div class="modal" on:click|stopPropagation on:keydown|stopPropagation role="document">
		{#if title}
			<h2 class="modal-title">{title}</h2>
		{/if}
		{#if message}
			<p class="modal-message">{message}</p>
		{/if}
		<div class="modal-actions">
			<button class="modal-btn btn-cancel" on:click={onCancel}>
				{cancelText}
			</button>
			<button class="modal-btn btn-confirm" on:click={onConfirm}>
				{confirmText}
			</button>
		</div>
	</div>
</div>

<style>
	.btn-cancel {
		background-color: var(--color-surface);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}
	
	.btn-cancel:hover {
		background-color: var(--color-border-light);
	}
	
	.btn-confirm {
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border: none;
	}
	
	.btn-confirm:hover {
		opacity: 0.9;
	}
</style>
