<script>
	import { onMount, onDestroy } from 'svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import SizeControls from './SizeControls.svelte';
	import BackgroundControls from './BackgroundControls.svelte';
	import Text1Controls from './Text1Controls.svelte';
	import Text2Controls from './Text2Controls.svelte';
	import QuoteControls from './QuoteControls.svelte';
	import OverlayControls from './OverlayControls.svelte';
	import { slideState, showTemplatePicker, activeDesignMenu, resetDesignState } from '$lib/stores/designStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	
	let canvasEl;
	let canvasMinDim = 300;
	let canvasWidth = 300;
	let canvasHeight = 300;
	let resizeObserver;
	let text1WrapperEl;
	let text1HeightPx = 0;
	let isDraggingOverlay = false;
	let dragStartX = 0;
	let dragStartY = 0;
	let overlayStartX = 0;
	let overlayStartY = 0;
	
	onMount(() => {
		if (canvasEl) {
			resizeObserver = new ResizeObserver(([entry]) => {
				const { width, height } = entry.contentRect;
				canvasWidth = width;
				canvasHeight = height;
				canvasMinDim = Math.min(width, height);
			});
			resizeObserver.observe(canvasEl);
		}
	});
	
	onDestroy(() => {
		if (resizeObserver) resizeObserver.disconnect();
	});
	
	// Measure text1 wrapper height dynamically to adjust quote position
	$: if (text1WrapperEl) {
		// Use setTimeout to ensure DOM has been fully rendered
		setTimeout(() => {
			text1HeightPx = text1WrapperEl.offsetHeight || 0;
		}, 0);
	}
	
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
	
	function handleSizeChange(size) {
		slideState.update(state => ({ ...state, canvasSize: size }));
	}
	
	function handleBackgroundChange(bg) {
		slideState.update(state => ({ ...state, background: bg }));
	}
	
	function handleText1Change(key, value) {
		slideState.update(state => ({ ...state, [key]: value }));
	}
	
	function handleText2Change(key, value) {
		slideState.update(state => ({ ...state, [key]: value }));
	}
	
	function handleQuoteChange(key, value) {
		slideState.update(state => ({ ...state, [key]: value }));
	}

	function handleOverlayChange(key, value) {
		if (key === 'overlay' && value) {
			const img = new Image();
			img.onload = () => {
				slideState.update(state => ({
					...state,
					overlay: value,
					overlayNaturalWidth: img.naturalWidth,
					overlayNaturalHeight: img.naturalHeight,
					overlayX: 50,
					overlayY: 50
				}));
				activeDesignMenu.set('overlay');
			};
			img.src = value;
		} else if (key === 'overlayLayer') {
			slideState.update(state => ({ ...state, [key]: value }));
			activeDesignMenu.set('none');
		} else {
			slideState.update(state => ({ ...state, [key]: value }));
		}
	}

	function handleDeleteOverlay() {
		slideState.update(state => ({
			...state,
			overlay: null,
			overlayNaturalWidth: 0,
			overlayNaturalHeight: 0
		}));
		activeDesignMenu.set('none');
	}

	function handleOverlayDragStart(e) {
		if (e.target.closest('.delete-btn')) return;
		e.preventDefault();
		isDraggingOverlay = true;
		const touch = e.touches?.[0] || e;
		dragStartX = touch.clientX;
		dragStartY = touch.clientY;
		overlayStartX = $slideState.overlayX;
		overlayStartY = $slideState.overlayY;
		
		window.addEventListener('mousemove', handleOverlayDragMove);
		window.addEventListener('mouseup', handleOverlayDragEnd);
		window.addEventListener('touchmove', handleOverlayDragMove, { passive: false });
		window.addEventListener('touchend', handleOverlayDragEnd);
	}

	function handleOverlayDragMove(e) {
		if (!isDraggingOverlay) return;
		e.preventDefault();
		const touch = e.touches?.[0] || e;
		const deltaX = touch.clientX - dragStartX;
		const deltaY = touch.clientY - dragStartY;
		
		const deltaXPercent = (deltaX / canvasWidth) * 100;
		const deltaYPercent = (deltaY / canvasHeight) * 100;
		
		const newX = Math.max(0, Math.min(100, overlayStartX + deltaXPercent));
		const newY = Math.max(0, Math.min(100, overlayStartY + deltaYPercent));
		
		slideState.update(state => ({
			...state,
			overlayX: newX,
			overlayY: newY
		}));
	}

	function handleOverlayDragEnd() {
		isDraggingOverlay = false;
		window.removeEventListener('mousemove', handleOverlayDragMove);
		window.removeEventListener('mouseup', handleOverlayDragEnd);
		window.removeEventListener('touchmove', handleOverlayDragMove);
		window.removeEventListener('touchend', handleOverlayDragEnd);
	}

	function handleCanvasClick(e) {
		const target = e.target;
		if (target.closest('.overlay-wrapper')) {
			activeDesignMenu.set('overlay');
		} else if (target.closest('.text1-wrapper')) {
			activeDesignMenu.set('text1');
		} else if (target.closest('.canvas-text.text2')) {
			activeDesignMenu.set('text2');
		} else if (target.closest('.canvas-quote')) {
			activeDesignMenu.set('quote');
		} else {
			activeDesignMenu.set('none');
		}
	}

	$: overlayDimensions = calculateOverlayDimensions($slideState);

	function calculateOverlayDimensions(state) {
		if (!state.overlay || !state.overlayNaturalWidth) return null;
		
		const aspectRatio = state.overlayNaturalWidth / state.overlayNaturalHeight;
		const maxWidth = (state.overlaySize / 100) * 100;
		
		let width, height;
		if (aspectRatio >= 1) {
			width = maxWidth;
			height = maxWidth / aspectRatio;
		} else {
			height = maxWidth;
			width = maxWidth * aspectRatio;
		}
		
		return { width, height };
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
				bind:this={canvasEl}
				class="design-canvas"
				on:click={handleCanvasClick}
				on:keydown={(e) => e.key === 'Enter' && handleCanvasClick(e)}
				style="
					aspect-ratio: {$slideState.canvasSize};
					background: {$slideState.background.type === 'solid' 
						? $slideState.background.value 
						: $slideState.background.value};
				"
				role="button"
				tabindex="0"
			>
				{#if $slideState.text1}
					{@const textFontSizePx = (canvasMinDim * 0.1 * $slideState.text1Size) / 5}
					{@const textLineHeightPx = textFontSizePx * (1 + $slideState.text1LineSpacing * 0.1)}
					{@const gapPx = textLineHeightPx * ($slideState.text1QuoteStyle === 'slab' ? 0.35 : 0.4)}
					{@const textYPosPct = $slideState.text1YPosition * 10}
					{@const textHeightPct = (text1HeightPx / canvasHeight) * 100}
					{@const quoteYPosPct = textYPosPct - (textHeightPct / 2) - (gapPx / canvasHeight * 100)}
					
					{#if $slideState.text1QuoteStyle !== 'none'}
						<div 
							class="canvas-quote"
							style="
								top: {quoteYPosPct}%;
								font-family: {$slideState.text1QuoteStyle === 'serif' ? '\"Playfair Display\", serif' : '\"Alfa Slab One\", cursive'};
								font-size: {canvasMinDim * 0.08 * $slideState.text1QuoteSize}px;
								font-weight: {$slideState.text1QuoteStyle === 'serif' ? 'bold' : 'normal'};
								color: {$slideState.text1Color};
							"
						>&#8220;</div>
					{/if}
					
					<div 
						class="text1-wrapper"
						bind:this={text1WrapperEl}
						style="top: {textYPosPct}%;"
					>
						<div 
							class="canvas-text text1"
							style="
								font-family: '{$slideState.text1Font}';
								font-size: {$slideState.text1Size * 0.5}em;
								font-weight: {$slideState.text1IsBold ? 'bold' : 'normal'};
								color: {$slideState.text1Color};
								text-align: {$slideState.text1Align};
								line-height: {1 + $slideState.text1LineSpacing * 0.1};
							"
						>
							{@html $slideState.text1.replace(/==(.+?)==/g, `<span style="color: ${$slideState.text1HighlightColor};">$1</span>`).replace(/\n/g, '<br>')}
						</div>
					</div>
				{/if}
				{#if $slideState.text2}
					<div 
						class="canvas-text text2"
						style="
							font-family: '{$slideState.text2Font}';
							font-size: {$slideState.text2Size * 0.5}em;
							font-weight: {$slideState.text2IsBold ? 'bold' : 'normal'};
							color: {$slideState.text2Color};
							text-align: {$slideState.text2Align};
							top: {$slideState.text2YPosition * 10}%;
							line-height: {1 + $slideState.text2LineSpacing * 0.1};
						"
					>
						{@html $slideState.text2.replace(/==(.+?)==/g, `<span style="color: ${$slideState.text2LabelColor};">$1</span>`).replace(/\n/g, '<br>')}
					</div>
				{/if}
				{#if $slideState.overlay && overlayDimensions}
					<div 
						class="overlay-wrapper"
						class:active={$activeDesignMenu === 'overlay'}
						style="
							left: {$slideState.overlayX}%;
							top: {$slideState.overlayY}%;
							width: {overlayDimensions.width}%;
							opacity: {$slideState.overlayOpacity / 100};
							z-index: {$activeDesignMenu === 'overlay' ? 11 : ($slideState.overlayLayer === 'below' ? 1 : 10)};
						"
						on:mousedown={handleOverlayDragStart}
						on:touchstart={handleOverlayDragStart}
						role="button"
						tabindex="0"
					>
						<div 
							class="overlay-bounding-box"
							class:mask-none={$slideState.overlayMask === 'none'}
							class:mask-rounded={$slideState.overlayMask === 'rounded'}
							class:mask-circle={$slideState.overlayMask === 'circle'}
							style="
								border-width: {$slideState.overlayBorderWidth * 2}px;
								border-color: {$slideState.overlayBorderColor};
							"
						>
							<button 
								class="delete-btn"
								on:click={handleDeleteOverlay}
								aria-label="Delete overlay"
							>
								<img src="/icons/icon-close.svg" alt="" class="delete-icon" />
							</button>
							<div 
								class="overlay-image-container"
								class:mask-rounded={$slideState.overlayMask === 'rounded'}
								class:mask-circle={$slideState.overlayMask === 'circle'}
							>
								<img 
									src={$slideState.overlay} 
									alt="Overlay" 
									class="overlay-image"
									draggable="false"
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		
		<SubMenuTabs 
			tabs={subMenuTabs}
			activeTab={$activeDesignMenu}
			onTabChange={handleSubMenuChange}
		/>
		
		<div class="controls-panel">
			{#if $activeDesignMenu === 'overlay' || ($activeDesignMenu === 'none' && $slideState.overlay)}
				<OverlayControls 
					overlay={$slideState.overlay}
					overlaySize={$slideState.overlaySize}
					overlayOpacity={$slideState.overlayOpacity}
					overlayMask={$slideState.overlayMask}
					overlayLayer={$slideState.overlayLayer}
					overlayBorderWidth={$slideState.overlayBorderWidth}
					overlayBorderColor={$slideState.overlayBorderColor}
					onChange={handleOverlayChange}
					onDelete={handleDeleteOverlay}
				/>
			{:else if $activeDesignMenu === 'size'}
				<SizeControls 
					canvasSize={$slideState.canvasSize}
					onSizeChange={handleSizeChange}
				/>
			{:else if $activeDesignMenu === 'background'}
				<BackgroundControls 
					background={$slideState.background}
					onBackgroundChange={handleBackgroundChange}
				/>
			{:else if $activeDesignMenu === 'text1'}
				<Text1Controls 
					text1={$slideState.text1}
					text1Font={$slideState.text1Font}
					text1Size={$slideState.text1Size}
					text1YPosition={$slideState.text1YPosition}
					text1LineSpacing={$slideState.text1LineSpacing}
					text1Color={$slideState.text1Color}
					text1HighlightColor={$slideState.text1HighlightColor}
					text1IsBold={$slideState.text1IsBold}
					text1Align={$slideState.text1Align}
					onChange={handleText1Change}
				/>
			{:else if $activeDesignMenu === 'text2'}
				<Text2Controls 
					text2={$slideState.text2}
					text2Font={$slideState.text2Font}
					text2Size={$slideState.text2Size}
					text2YPosition={$slideState.text2YPosition}
					text2LineSpacing={$slideState.text2LineSpacing}
					text2Color={$slideState.text2Color}
					text2LabelColor={$slideState.text2LabelColor}
					text2IsBold={$slideState.text2IsBold}
					text2Align={$slideState.text2Align}
					onChange={handleText2Change}
				/>
			{:else if $activeDesignMenu === 'quote'}
				<QuoteControls 
					quoteStyle={$slideState.text1QuoteStyle}
					quoteSize={$slideState.text1QuoteSize}
					onChange={handleQuoteChange}
				/>
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
		position: relative;
		overflow: hidden;
	}

	.text1-wrapper {
		position: absolute;
		left: 5%;
		right: 5%;
		width: 90%;
		transform: translateY(-50%);
		z-index: 5;
		overflow: visible;
	}

	.canvas-quote {
		position: absolute;
		left: 5%;
		right: 5%;
		width: 90%;
		text-align: center;
		line-height: 1;
		transform: translateY(-50%);
		z-index: 5;
	}

	.canvas-text {
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.canvas-text.text2 {
		position: absolute;
		left: 5%;
		right: 5%;
		width: 90%;
		z-index: 5;
	}

	.overlay-wrapper {
		position: absolute;
		transform: translate(-50%, -50%);
		cursor: grab;
		z-index: 10;
	}

	.overlay-wrapper:active {
		cursor: grabbing;
	}

	.overlay-bounding-box {
		position: relative;
		border-style: solid;
		background: transparent;
	}

	.overlay-bounding-box.mask-none {
		border-radius: var(--radius-sm);
	}

	.overlay-bounding-box.mask-rounded {
		border-radius: var(--radius-lg);
	}

	.overlay-bounding-box.mask-circle {
		border-radius: 50%;
	}

	.overlay-wrapper.active .overlay-bounding-box {
		outline: 1px dashed var(--color-text-muted);
		outline-offset: 2px;
	}

	.delete-btn {
		position: absolute;
		top: -12px;
		left: -12px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: none;
		background: var(--color-text-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 11;
		opacity: 0;
		transition: opacity var(--transition-fast);
	}

	.overlay-wrapper.active .delete-btn {
		opacity: 1;
	}

	.delete-btn:hover {
		background: var(--color-text-primary);
	}

	.delete-icon {
		width: 12px;
		height: 12px;
		filter: brightness(0) invert(1);
	}

	.overlay-image-container {
		width: 100%;
		overflow: hidden;
	}

	.overlay-image-container.mask-rounded {
		border-radius: var(--radius-lg);
	}

	.overlay-image-container.mask-circle {
		border-radius: 50%;
	}

	.overlay-image {
		width: 100%;
		height: auto;
		display: block;
		pointer-events: none;
	}
	
	.controls-panel {
		padding: var(--space-4) 0;
	}
</style>
