<script>
	import Header from '$lib/components/layout/Header.svelte';
	import CropTab from '$lib/components/crop/CropTab.svelte';
	import AiTab from '$lib/components/ai/AiTab.svelte';
	import DesignTab from '$lib/components/design/DesignTab.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import { activeTab } from '$lib/stores/appStore.js';
	import { cropState } from '$lib/stores/cropStore.js';
	import { applyCrop, getImageDimensions } from '$lib/utils/imageUtils.js';
	
	let showSaveModal = false;
	let pendingTab = null;
	
	function handleTabChange(tab) {
		if ($activeTab === 'crop' && $cropState.cropPending && tab !== 'crop') {
			pendingTab = tab;
			showSaveModal = true;
			return;
		}
		activeTab.set(tab);
	}
	
	async function handleSaveConfirm() {
		showSaveModal = false;
		
		const state = $cropState;
		if (state.currentImage && state.cropPending) {
			const croppedImage = await applyCrop(
				state.currentImage,
				state.cropBox,
				state.imageWidth,
				state.imageHeight
			);
			const dims = await getImageDimensions(croppedImage);
			
			cropState.set({
				...state,
				currentImage: croppedImage,
				imageWidth: dims.width,
				imageHeight: dims.height,
				cropBox: { x: 0, y: 0, width: 100, height: 100 },
				cropPending: false,
				isCropping: false
			});
		}
		
		if (pendingTab) {
			activeTab.set(pendingTab);
			pendingTab = null;
		}
	}
	
	function handleSaveCancel() {
		showSaveModal = false;
		pendingTab = null;
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

{#if showSaveModal}
	<ConfirmModal
		message="Save changes?"
		confirmText="Yes"
		cancelText="Cancel"
		onConfirm={handleSaveConfirm}
		onCancel={handleSaveCancel}
	/>
{/if}

<style>
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: var(--space-4) var(--space-6);
		overflow-y: auto;
	}
</style>
