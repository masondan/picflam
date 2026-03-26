<script>
	export let tabs = [];
	export let activeTab = '';
	export let onTabChange = (tab) => {};
	export let variant = 'default';
</script>

<div class="sub-menu-tabs" class:design={variant === 'design'}>
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

	.sub-menu-tabs.design {
		gap: var(--space-3);
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

	.sub-menu-tabs.design .sub-menu-tab {
		flex: 0 1 auto;
		padding: var(--space-2) 0;
		font-weight: var(--font-weight-semibold);
		color: #333333;
		background: none;
		border: none;
		border-radius: 0;
	}
	
	@media (hover: hover) {
		.sub-menu-tab:hover:not(.active) {
			background: var(--color-primary-light, rgba(84, 34, 176, 0.08));
		}

		.sub-menu-tabs.design .sub-menu-tab:hover:not(.active) {
			background: none;
		}
	}
	
	.sub-menu-tab.active {
		background: var(--color-primary);
		color: var(--color-text-inverse);
	}

	.sub-menu-tabs.design .sub-menu-tab.active {
		background: none;
		color: var(--color-primary);
		font-weight: var(--font-weight-bold);
	}
</style>
