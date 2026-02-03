<script>
	import Header from '$lib/components/layout/Header.svelte';
	import CropTab from '$lib/components/crop/CropTab.svelte';
	import AiTab from '$lib/components/ai/AiTab.svelte';
	import DesignTab from '$lib/components/design/DesignTab.svelte';
	import { activeTab } from '$lib/stores/appStore.js';
	
	function handleTabChange(tab) {
		activeTab.set(tab);
	}
</script>

<Header 
	activeTab={$activeTab} 
	onTabChange={handleTabChange} 
/>

<main class="main">
	{#if $activeTab === 'crop'}
		<CropTab />
	{:else if $activeTab === 'ai'}
		<AiTab />
	{:else if $activeTab === 'design'}
		<DesignTab />
	{/if}
</main>

<style>
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--space-4);
		overflow-y: auto;
	}
</style>
