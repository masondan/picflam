<script>
	export let title = '';
	export let message = '';
	export let confirmText = 'Confirm';
	export let cancelText = 'Cancel';
	export let onConfirm = () => {};
	export let onCancel = () => {};
</script>

<div class="modal-overlay" on:click={onCancel} role="dialog" aria-modal="true">
	<div class="modal" on:click|stopPropagation>
		{#if title}
			<h2 class="modal-title">{title}</h2>
		{/if}
		{#if message}
			<p class="modal-message">{message}</p>
		{/if}
		<div class="modal-actions">
			<button class="btn-cancel" on:click={onCancel}>
				{cancelText}
			</button>
			<button class="btn-confirm" on:click={onConfirm}>
				{confirmText}
			</button>
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		padding: var(--space-4);
	}
	
	.modal {
		width: 100%;
		max-width: 320px;
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		text-align: center;
	}
	
	.modal-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--space-2);
		color: var(--color-text-primary);
	}
	
	.modal-message {
		color: var(--color-text-secondary);
		margin-bottom: var(--space-6);
		line-height: var(--line-height-normal);
	}
	
	.modal-actions {
		display: flex;
		gap: var(--space-3);
	}
	
	.modal-actions > button {
		flex: 1;
		height: 44px;
		border-radius: var(--radius-md);
		font-weight: var(--font-weight-medium);
		transition: all var(--transition-fast);
	}
	
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
