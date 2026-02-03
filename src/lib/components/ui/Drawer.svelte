<script>
	export let title = '';
	export let onClose = () => {};
</script>

<div class="drawer-overlay" on:click={onClose}>
	<div class="drawer" on:click|stopPropagation>
		<div class="drawer-header">
			<span class="drawer-title">{title}</span>
			<button class="drawer-close" on:click={onClose} aria-label="Close">
				<img src="/icons/icon-close.svg" alt="" class="close-icon" />
			</button>
		</div>
		<div class="drawer-body">
			<slot />
		</div>
	</div>
</div>

<style>
	.drawer-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 100;
	}
	
	.drawer {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: var(--app-max-width);
		max-height: 90vh;
		background-color: var(--color-surface);
		border-radius: var(--radius-xl) var(--radius-xl) 0 0;
		overflow: hidden;
		animation: slideUp 0.3s ease-out;
	}
	
	@keyframes slideUp {
		from { transform: translateX(-50%) translateY(100%); }
		to { transform: translateX(-50%) translateY(0); }
	}
	
	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-surface-dark);
		color: var(--color-text-inverse);
	}
	
	.drawer-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
	}
	
	.drawer-close {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-fast);
	}
	
	.drawer-close:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	.close-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
	}
	
	.drawer-body {
		padding: var(--space-4);
		overflow-y: auto;
		max-height: calc(90vh - 56px);
	}
</style>
