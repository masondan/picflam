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
		width: 52px;
		height: 52px;
		border: 1px solid #555555;
		border-radius: var(--radius-md);
		background: var(--color-surface);
		transition: all var(--transition-fast);
		cursor: pointer;
	}
	
	.toggle-btn:hover:not(.active) {
		background-color: var(--color-border-light);
	}
	
	.toggle-btn.active {
		border-color: #555555;
		background-color: #555555;
	}
	
	.toggle-icon {
		width: 32px;
		height: 32px;
	}
	
	.toggle-btn:not(.active) .toggle-icon {
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}
	
	.toggle-btn.active .toggle-icon {
		filter: brightness(0) invert(1);
	}
	
	.toggle-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
	}
	
	.toggle-item.active .toggle-label {
		color: #555555;
	}
</style>
