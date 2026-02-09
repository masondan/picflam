<script>
	export let canUndo = false;
	export let canRedo = false;
	export let onUndo = () => {};
	export let onRedo = () => {};
	export let onStartAgain = () => {};
	export let onCopy = () => {};
	export let onExport = () => {};
</script>

<div class="action-bar">
	<div class="action-group">
		<button 
			class="action-btn" 
			disabled={!canUndo}
			on:click={onUndo}
			aria-label="Undo"
		>
			<img src="/icons/icon-undo.svg" alt="" class="action-icon" />
		</button>
		<button 
			class="action-btn" 
			disabled={!canRedo}
			on:click={onRedo}
			aria-label="Redo"
		>
			<img src="/icons/icon-redo.svg" alt="" class="action-icon" />
		</button>
	</div>
	
	<div class="action-group">
		<button 
			class="action-btn"
			on:click={onStartAgain}
			aria-label="Start again"
		>
			<img src="/icons/icon-startagain.svg" alt="" class="action-icon" />
		</button>
		<button 
			class="action-btn"
			on:click={onCopy}
			aria-label="Copy to clipboard"
		>
			<img src="/icons/icon-copy.svg" alt="" class="action-icon" />
		</button>
		<button 
			class="action-btn"
			on:click={onExport}
			aria-label="Export"
		>
			<img src="/icons/icon-export.svg" alt="" class="action-icon" />
		</button>
	</div>
</div>

<style>
	.action-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-0.1) 0;
		margin-bottom: var(--space-0.0);
	}
	
	.action-group {
		display: flex;
		gap: var(--space-2);
	}
	
	.action-btn {
		width: 38px;
		height: 38px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		transition: all var(--transition-fast);
	}
	
	.action-btn:hover:not(:disabled) {
		background-color: var(--color-border-light);
	}
	
	.action-btn:disabled {
		opacity: 0.4;
	}
	
	.action-icon {
		width: 22px;
		height: 22px;
		filter: brightness(0) saturate(100%) invert(46%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}
	
	.action-btn:disabled .action-icon {
		filter: brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) brightness(98%) contrast(88%);
	}
</style>
