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
		gap: var(--space-3);
		padding: var(--space-2) 0 var(--space-3) 0;
	}
	
	.sub-menu-tab {
		padding: 0;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-regular);
		color: var(--color-text-muted);
		background: none;
		border: none;
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: left;
	}
	
	@media (hover: hover) {
		.sub-menu-tab:hover:not(.active) {
			color: var(--color-primary);
		}
	}
	
	.sub-menu-tab.active {
		color: var(--color-primary);
		font-weight: var(--font-weight-bold);
	}
</style>
