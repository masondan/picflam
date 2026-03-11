<script>
	import { onMount } from 'svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import BeforeAfterSlider from '$lib/components/ui/BeforeAfterSlider.svelte';
	import AIWelcome from '$lib/components/ai/AIWelcome.svelte';
	import UpscaleControls from '$lib/components/ai/UpscaleControls.svelte';
	import RemoveBackgroundControls from '$lib/components/ai/RemoveBackgroundControls.svelte';
	import ImageGenControls from '$lib/components/ai/ImageGenControls.svelte';
	import PexelsDrawer from '$lib/components/design/PexelsDrawer.svelte';
	import { aiState, activeAiMenu, hasAiImage, imageGen, resetImageGen } from '$lib/stores/aiStore.js';
	import { copyImageToClipboard, downloadImage, fileToDataUrl, resizeImage } from '$lib/utils/imageUtils.js';

	onMount(() => {
		aiState.restoreFromStorage();
	});

	let comparisonPosition = 50;
	let showPexelsDrawer = false;
	
	function handleComparisonChange(newPosition) {
		comparisonPosition = newPosition;
		aiState.setComparisonPosition(newPosition);
	}
	
	const subMenuTabs = [
		{ id: 'background', label: 'BG remove' },
		{ id: 'upscale', label: 'Upscale' },
		{ id: 'imageGen', label: 'Image gen' }
	];
	
	function handleImageImport(dataUrl) {
		aiState.setImage(dataUrl);
	}
	
	function handlePexelsImageSelect(imageUrl) {
		handleImageImport(imageUrl);
		showPexelsDrawer = false;
	}
	
	function handleSubMenuChange(tab) {
		activeAiMenu.set(tab);
		
		// If switching to background removal after upscaling, promote upscaled image
		// to "original" so it displays without comparison
		if (tab === 'background' && $aiState.showComparison && $aiState.processedImage) {
			aiState.promoteCurrentToOriginal();
		}
	}
	
	async function handleCopy() {
		if ($aiState.currentImage) {
			await copyImageToClipboard($aiState.currentImage);
		}
	}
	
	function handleExport() {
		if ($aiState.currentImage) {
			const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
	downloadImage($aiState.currentImage, `picflam-ai-${timestamp}.png`);
		}
	}
</script>

<div class="ai-tab">
	{#if showPexelsDrawer}
		<PexelsDrawer 
			onClose={() => showPexelsDrawer = false}
			onImageSelect={handlePexelsImageSelect}
		/>
	{/if}

	<SubMenuTabs 
		tabs={subMenuTabs}
		activeTab={$activeAiMenu}
		onTabChange={handleSubMenuChange}
	/>

	{#if $activeAiMenu === 'imageGen'}
		<ImageGenControls />
	{:else if !$hasAiImage}
		<AIWelcome 
			onImageImport={handleImageImport}
			onSearchClick={() => showPexelsDrawer = true}
		/>
	{:else}
		<ActionBar 
			canUndo={false}
			canRedo={false}
			onUndo={() => {}}
			onRedo={() => {}}
			onStartAgain={() => aiState.reset()}
			onCopy={handleCopy}
			onExport={handleExport}
		/>
		
		<div class="image-container">
			{#if $aiState.showComparison && $aiState.processedImage}
				<BeforeAfterSlider
					beforeImage={$aiState.originalImage}
					afterImage={$aiState.processedImage}
					position={comparisonPosition}
					onChange={handleComparisonChange}
				/>
			{:else}
				<img 
					src={$aiState.currentImage} 
					alt="Working image" 
					class="working-image"
				/>
			{/if}
		</div>
		
		{#if $activeAiMenu === 'upscale'}
			<UpscaleControls />
		{:else if $activeAiMenu === 'background'}
			<RemoveBackgroundControls />
		{/if}
	{/if}
</div>

<style>
	.ai-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.image-container {
		width: 100%;
	}
	
	.working-image {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
