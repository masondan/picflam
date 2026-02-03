<script>
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import { slideState, showTemplatePicker, activeDesignMenu, resetDesignState } from '$lib/stores/designStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	
	const subMenuTabs = [
		{ id: 'size', label: 'Size' },
		{ id: 'background', label: 'Background' },
		{ id: 'text1', label: 'Text 1' },
		{ id: 'text2', label: 'Text 2' },
		{ id: 'quote', label: 'Quote' },
		{ id: 'overlay', label: 'Overlay' }
	];
	
	function selectTemplate(template) {
		if (template === 'blank') {
			slideState.reset();
		}
		showTemplatePicker.set(false);
	}
	
	function handleSubMenuChange(tab) {
		activeDesignMenu.set($activeDesignMenu === tab ? 'none' : tab);
	}
	
	async function handleCopy() {
		// TODO: Export canvas to image and copy
	}
	
	function handleExport() {
		// TODO: Export canvas to image and download
	}
</script>

<div class="design-tab">
	{#if $showTemplatePicker}
		<div class="template-picker">
			<p class="picker-title">Create quotes and cards. Start with a template or blank canvas</p>
			
			<button 
				class="blank-canvas-btn"
				on:click={() => selectTemplate('blank')}
			>
				<img src="/icons/icon-add.svg" alt="" class="add-icon" />
			</button>
			
			<div class="template-grid">
				{#each [1, 2, 3, 4, 5, 6] as templateNum}
					<button 
						class="template-card"
						on:click={() => selectTemplate(`template-${templateNum}`)}
					>
						<div class="template-placeholder">
							Template {templateNum}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{:else}
		<ActionBar 
			canUndo={slideState.canUndo()}
			canRedo={slideState.canRedo()}
			onUndo={() => slideState.undo()}
			onRedo={() => slideState.redo()}
			onStartAgain={resetDesignState}
			onCopy={handleCopy}
			onExport={handleExport}
		/>
		
		<div class="canvas-container">
			<div 
				class="design-canvas"
				style="
					aspect-ratio: {$slideState.canvasSize};
					background: {$slideState.background.type === 'solid' 
						? $slideState.background.value 
						: $slideState.background.value};
				"
			>
				<!-- Canvas content will be rendered here -->
			</div>
		</div>
		
		<SubMenuTabs 
			tabs={subMenuTabs}
			activeTab={$activeDesignMenu}
			onTabChange={handleSubMenuChange}
		/>
		
		<div class="controls-panel">
			{#if $activeDesignMenu === 'size'}
				<p class="placeholder">Size controls coming in Phase 5</p>
			{:else if $activeDesignMenu === 'background'}
				<p class="placeholder">Background controls coming in Phase 5</p>
			{:else if $activeDesignMenu === 'text1'}
				<p class="placeholder">Text 1 controls coming in Phase 5</p>
			{:else if $activeDesignMenu === 'text2'}
				<p class="placeholder">Text 2 controls coming in Phase 5</p>
			{:else if $activeDesignMenu === 'quote'}
				<p class="placeholder">Quote controls coming in Phase 5</p>
			{:else if $activeDesignMenu === 'overlay'}
				<p class="placeholder">Overlay controls coming in Phase 5</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.design-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.template-picker {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.picker-title {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-lg);
		text-align: center;
		line-height: var(--line-height-tight);
	}
	
	.blank-canvas-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-6);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		transition: all var(--transition-fast);
	}
	
	.blank-canvas-btn:hover {
		border-color: var(--color-primary);
		background-color: var(--color-primary-light);
	}
	
	.add-icon {
		width: 32px;
		height: 32px;
		opacity: 0.5;
	}
	
	.template-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}
	
	.template-card {
		aspect-ratio: 1;
		border: none;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-primary);
		transition: transform var(--transition-fast);
	}
	
	.template-card:hover {
		transform: scale(1.02);
	}
	
	.template-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-inverse);
		font-size: var(--font-size-sm);
	}
	
	.canvas-container {
		width: 100%;
	}
	
	.design-canvas {
		width: 100%;
		border: 1px solid var(--color-border-light);
		border-radius: var(--radius-sm);
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
