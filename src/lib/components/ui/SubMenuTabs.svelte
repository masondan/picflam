<script>
	export let tabs = [];
	export let activeTab = '';
	export let onTabChange = (tab) => {};
</script>

<div class="sub-menu-tabs">
	{#each tabs as tab}
		<button 
			class="sub-menu-tab"
			class:active={activeTab === tab.id}
			on:click={() => onTabChange(tab.id)}
		>
			{tab.label}
		</button>
	{/each}
</div>

<style>
	.sub-menu-tabs {
		display: flex;
		gap: var(--space-4);
		padding: var(--space-3) 0;
	}
	
	.sub-menu-tab {
		padding: var(--space-1) 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		transition: all var(--transition-fast);
	}
	
	.sub-menu-tab:hover {
		color: var(--color-text-primary);
	}
	
	.sub-menu-tab.active {
		color: var(--color-primary);
		font-weight: var(--font-weight-bold);
		border-bottom: 3px solid var(--color-primary);
	}
</style>
