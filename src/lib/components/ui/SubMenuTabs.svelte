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
		gap: var(--space-2);
		padding: var(--space-2) 0 var(--space-3) 0;
	}
	
	.sub-menu-tab {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-primary);
		background: var(--color-surface);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		text-align: center;
	}
	
	@media (hover: hover) {
		.sub-menu-tab:hover:not(.active) {
			background: var(--color-primary-light, rgba(84, 34, 176, 0.08));
		}
	}
	
	.sub-menu-tab.active {
		background: var(--color-primary);
		color: var(--color-text-inverse);
	}
</style>
