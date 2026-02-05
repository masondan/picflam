<script>
	export let options = [];
	export let value = '';
	export let onChange = (val) => {};
	export let showLabels = true;
	export let centered = false;
</script>

<div class="toggle-group" class:centered>
	{#each options as option}
		<div class="toggle-item" class:active={value === option.id}>
			<button 
				class="toggle-btn"
				class:active={value === option.id}
				on:click={() => onChange(option.id)}
				aria-label={option.label}
			>
				{#if option.icon}
					<img src="/icons/{option.icon}.svg" alt="" class="toggle-icon" />
				{/if}
			</button>
			{#if showLabels && option.label}
				<span class="toggle-label">{option.label}</span>
			{/if}
		</div>
	{/each}
</div>

<style>
	.toggle-group {
		display: flex;
		gap: var(--space-3);
	}
	
	.toggle-group.centered {
		justify-content: center;
	}

	.toggle-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}
	
	.toggle-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		transition: all var(--transition-fast);
		cursor: pointer;
	}
	
	.toggle-btn:hover:not(.active) {
		background-color: var(--color-border-light);
	}
	
	.toggle-btn.active {
		border-color: var(--color-primary);
		background-color: var(--color-surface);
	}
	
	.toggle-icon {
		width: 32px;
		height: 32px;
	}
	
	.toggle-btn:not(.active) .toggle-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}
	
	.toggle-btn.active .toggle-icon {
		filter: none;
	}
	
	.toggle-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}
	
	.toggle-item.active .toggle-label {
		color: var(--color-primary);
	}
</style>
