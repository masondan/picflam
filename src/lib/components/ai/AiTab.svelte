<script>
	import ImportArea from '$lib/components/ui/ImportArea.svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
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
			<div class="controls-panel">
				<button class="ai-action-btn">
					<img src="/icons/icon-ai.svg" alt="" class="ai-icon" />
					Enhance image
				</button>
				<p class="ai-hint">Sharpens and enhances images at the same size</p>
			</div>
		{:else if $activeAiMenu === 'upscale'}
			<div class="controls-panel">
				<p class="placeholder">Upscale controls coming in Phase 4</p>
			</div>
		{:else if $activeAiMenu === 'background'}
			<div class="controls-panel">
				<p class="placeholder">Background removal coming in Phase 4</p>
			</div>
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
	
	.controls-panel {
		padding: var(--space-4) 0;
	}
	
	.ai-action-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		transition: opacity var(--transition-fast);
	}
	
	.ai-action-btn:hover {
		opacity: 0.9;
	}
	
	.ai-icon {
		width: 24px;
		height: 24px;
		filter: brightness(0) invert(1);
	}
	
	.ai-hint {
		margin-top: var(--space-3);
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}
	
	.placeholder {
		color: var(--color-text-muted);
		text-align: center;
		font-size: var(--font-size-sm);
	}
</style>
