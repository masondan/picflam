<script>
	import ImportArea from '$lib/components/ui/ImportArea.svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import EnhanceControls from '$lib/components/ai/EnhanceControls.svelte';
	import UpscaleControls from '$lib/components/ai/UpscaleControls.svelte';
	import RemoveBackgroundControls from '$lib/components/ai/RemoveBackgroundControls.svelte';
	import { aiState, activeAiMenu, hasAiImage } from '$lib/stores/aiStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	
	const subMenuTabs = [
		{ id: 'enhance', label: 'Enhance' },
		{ id: 'upscale', label: 'Upscale' },
		{ id: 'background', label: 'Remove background' }
	];
	
	function handleImageImport(dataUrl) {
		aiState.setImage(dataUrl);
	}
	
	function handleSubMenuChange(tab) {
		activeAiMenu.set(tab);
	}
	
	async function handleCopy() {
		if ($aiState.currentImage) {
			await copyImageToClipboard($aiState.currentImage);
		}
	}
	
	function handleExport() {
		if ($aiState.currentImage) {
			downloadImage($aiState.currentImage, 'picflam-ai.png');
		}
	}
</script>

<div class="ai-tab">
	{#if !$hasAiImage}
		<ImportArea 
			title="Enhance, upscale and remove backgrounds using AI power"
			hint="Import, drag or paste an image"
			onImageImport={handleImageImport}
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
			<img 
				src={$aiState.currentImage} 
				alt="Working image" 
				class="working-image"
			/>
		</div>
		
		<SubMenuTabs 
			tabs={subMenuTabs}
			activeTab={$activeAiMenu}
			onTabChange={handleSubMenuChange}
		/>
		
		{#if $activeAiMenu === 'enhance'}
			<EnhanceControls />
		{:else if $activeAiMenu === 'upscale'}
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
