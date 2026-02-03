<script>
	import ImportArea from '$lib/components/ui/ImportArea.svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import { cropState, activeSubMenu, hasImage, resetCropState } from '$lib/stores/cropStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	
	const subMenuTabs = [
		{ id: 'crop', label: 'Crop' },
		{ id: 'edit', label: 'Edit' },
		{ id: 'filter', label: 'Filter' }
	];
	
	function handleImageImport(dataUrl) {
		cropState.set({
			...$cropState,
			originalImage: dataUrl,
			currentImage: dataUrl
		});
	}
	
	function handleSubMenuChange(tab) {
		activeSubMenu.set($activeSubMenu === tab ? 'none' : tab);
	}
	
	async function handleCopy() {
		if ($cropState.currentImage) {
			await copyImageToClipboard($cropState.currentImage);
		}
	}
	
	function handleExport() {
		if ($cropState.currentImage) {
			downloadImage($cropState.currentImage, 'picflam-crop.png');
		}
	}
</script>

<div class="crop-tab">
	{#if !$hasImage}
		<ImportArea 
			title="Crop, edit and add filters to photos"
			hint="Import, drag or paste an image"
			onImageImport={handleImageImport}
		/>
	{:else}
		<ActionBar 
			canUndo={cropState.canUndo()}
			canRedo={cropState.canRedo()}
			onUndo={() => cropState.undo()}
			onRedo={() => cropState.redo()}
			onStartAgain={resetCropState}
			onCopy={handleCopy}
			onExport={handleExport}
		/>
		
		<div class="image-container">
			<img 
				src={$cropState.currentImage} 
				alt="Working image" 
				class="working-image"
			/>
		</div>
		
		<SubMenuTabs 
			tabs={subMenuTabs}
			activeTab={$activeSubMenu}
			onTabChange={handleSubMenuChange}
		/>
		
		{#if $activeSubMenu === 'crop'}
			<div class="controls-panel">
				<p class="placeholder">Crop controls coming in Phase 3</p>
			</div>
		{:else if $activeSubMenu === 'edit'}
			<div class="controls-panel">
				<p class="placeholder">Edit controls coming in Phase 3</p>
			</div>
		{:else if $activeSubMenu === 'filter'}
			<div class="controls-panel">
				<p class="placeholder">Filter controls coming in Phase 3</p>
			</div>
		{/if}
	{/if}
</div>

<style>
	.crop-tab {
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
	
	.controls-panel {
		padding: var(--space-4) 0;
	}
	
	.placeholder {
		color: var(--color-text-muted);
		text-align: center;
		font-size: var(--font-size-sm);
	}
</style>
