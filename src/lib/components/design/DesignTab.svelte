<script>
	import { onMount, onDestroy } from 'svelte';
	import html2canvas from 'html2canvas';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import SizeControls from './SizeControls.svelte';
	import BackgroundControls from './BackgroundControls.svelte';
	import Text1Controls from './Text1Controls.svelte';
	import Text2Controls from './Text2Controls.svelte';
	import OverlayControls from './OverlayControls.svelte';
	import { slideState, showTemplatePicker, activeDesignMenu, resetDesignState } from '$lib/stores/designStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	import templatesData from '$lib/data/templates.json';
	
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
	let isResizingOverlay = false;
	let resizeStartX = 0;
	let resizeStartY = 0;
	let resizeStartSize = 0;
	let lastTouchDistance = 0;
	
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
	// Depends on both element existence and text content changes
	$: if (text1WrapperEl && $slideState.text1) {
		// Use setTimeout to ensure DOM has been fully rendered with new content
		setTimeout(() => {
			text1HeightPx = text1WrapperEl.offsetHeight || 0;
		}, 0);
	}
	
	const subMenuTabs = [
		{ id: 'ratio', label: 'Ratio' },
		{ id: 'background', label: 'Background' },
		{ id: 'text1', label: 'Text 1' },
		{ id: 'text2', label: 'Text 2' },
		{ id: 'image', label: 'Image' }
	];
	
	function selectTemplate(templateId) {
		if (templateId === 'blank') {
			slideState.reset();
		} else {
			const template = templatesData.templates.find(t => t.id === templateId);
			if (template) {
				slideState.set(JSON.parse(JSON.stringify(template.state)));
			}
		}
		showTemplatePicker.set(false);
		activeDesignMenu.set('ratio');
	}

	function handleSaveTemplate() {
		const templateName = prompt('Template name:', `template-${templatesData.templates.length + 1}`);
		if (!templateName) return;

		let maxId = 0;
		templatesData.templates.forEach(t => {
			if (t.id > maxId) maxId = t.id;
		});

		const newTemplate = {
			id: maxId + 1,
			name: templateName,
			state: JSON.parse(JSON.stringify($slideState))
		};

		// Add to templates array in memory
		templatesData.templates.push(newTemplate);

		// Trigger download of updated templates.json
		const dataStr = JSON.stringify(templatesData, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'templates.json';
		link.click();
		URL.revokeObjectURL(url);

		alert(`Template "${templateName}" exported. Replace /src/lib/data/templates.json with the downloaded file.`);
	}
	
	function handleSubMenuChange(tab) {
		activeDesignMenu.set(tab);
	}
	
	async function handleCopy() {
		if (!canvasEl) return;
		try {
			const canvas = await html2canvas(canvasEl, {
				backgroundColor: null,
				scale: 2,
				logging: false
			});
			const dataUrl = canvas.toDataURL('image/png');
			await copyImageToClipboard(dataUrl);
		} catch (err) {
			console.error('Failed to copy canvas:', err);
		}
	}
	
	async function handleExport() {
		if (!canvasEl) return;
		try {
			// Hide interactive elements during export
			const deleteButtons = canvasEl.querySelectorAll('.delete-btn');
			const resizeHandles = canvasEl.querySelectorAll('.resize-handle');
			const boundingBoxes = canvasEl.querySelectorAll('.overlay-wrapper.active .overlay-bounding-box');
			
			deleteButtons.forEach(btn => btn.style.display = 'none');
			resizeHandles.forEach(handle => handle.style.display = 'none');
			boundingBoxes.forEach(box => box.style.outline = 'none');
			
			const canvas = await html2canvas(canvasEl, {
				backgroundColor: null,
				scale: 2,
				logging: false
			});
			
			// Restore interactive elements
			deleteButtons.forEach(btn => btn.style.display = '');
			resizeHandles.forEach(handle => handle.style.display = '');
			boundingBoxes.forEach(box => box.style.outline = '');
			
			const dataUrl = canvas.toDataURL('image/png');
			downloadImage(dataUrl, 'picflam-design.png');
		} catch (err) {
			console.error('Failed to export canvas:', err);
		}
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
	
	function getCanvasDimensions() {
		if (canvasEl) {
			const rect = canvasEl.getBoundingClientRect();
			return { width: rect.width, height: rect.height };
		}
		return { width: canvasWidth, height: canvasHeight };
	}
	
	function handleImageChange(key, value) {
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
				activeDesignMenu.set('image');
			};
			img.src = value;
		} else if (key === 'overlayLayer') {
			slideState.update(state => ({ ...state, [key]: value }));
			activeDesignMenu.set('none');
		} else if (key === 'overlayMask') {
			slideState.update(state => {
				const newState = { ...state, [key]: value };
				
				// Reset zoom/nudge when switching to 'none'
				if (value === 'none') {
					newState.overlayZoom = 100;
					newState.overlayImageOffsetX = 0;
					newState.overlayImageOffsetY = 0;
				}
				
				return newState;
			});
		} else {
			slideState.update(state => ({ ...state, [key]: value }));
		}
	}

	function handleDeleteImage() {
		slideState.update(state => ({
			...state,
			overlay: null,
			overlayNaturalWidth: 0,
			overlayNaturalHeight: 0,
			overlaySize: 50,
			overlayOpacity: 100,
			overlayX: 50,
			overlayY: 50,
			overlayMask: 'none',
			overlayLayer: 'above',
			overlayBorderWidth: 0,
			overlayBorderColor: '#FFFFFF',
			overlayZoom: 100,
			overlayImageOffsetX: 0,
			overlayImageOffsetY: 0
		}));
		activeDesignMenu.set('none');
	}

	function handleOverlayDragStart(e) {
		if (e.target.closest('.delete-btn') || e.target.closest('.resize-handle')) return;
		if (e.touches && e.touches.length > 1) return;
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

	function handleResizeStart(e) {
		e.preventDefault();
		e.stopPropagation();
		isResizingOverlay = true;
		resizeStartX = e.touches?.[0].clientX || e.clientX;
		resizeStartY = e.touches?.[0].clientY || e.clientY;
		resizeStartSize = $slideState.overlaySize;
		
		window.addEventListener('mousemove', handleResizeMove);
		window.addEventListener('mouseup', handleResizeEnd);
		window.addEventListener('touchmove', handleResizeMove, { passive: false });
		window.addEventListener('touchend', handleResizeEnd);
	}

	function handleResizeMove(e) {
		if (!isResizingOverlay) return;
		e.preventDefault();
		const currentX = e.touches?.[0].clientX || e.clientX;
		const currentY = e.touches?.[0].clientY || e.clientY;
		const deltaX = currentX - resizeStartX;
		const deltaY = currentY - resizeStartY;
		const delta = Math.max(deltaX, deltaY);
		const deltaPercent = (delta / canvasMinDim) * 100;
		const newSize = Math.max(10, Math.min(200, resizeStartSize + deltaPercent));
		slideState.update(state => ({ ...state, overlaySize: newSize }));
	}

	function handleResizeEnd() {
		isResizingOverlay = false;
		window.removeEventListener('mousemove', handleResizeMove);
		window.removeEventListener('mouseup', handleResizeEnd);
		window.removeEventListener('touchmove', handleResizeMove);
		window.removeEventListener('touchend', handleResizeEnd);
	}

	function getTouchDistance(touches) {
		if (touches.length < 2) return 0;
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function handleOverlayTouchStart(e) {
		if (e.touches.length === 2) {
			e.preventDefault();
			lastTouchDistance = getTouchDistance(e.touches);
		}
	}

	function handleOverlayTouchMove(e) {
		if (e.touches.length === 2 && lastTouchDistance > 0) {
			e.preventDefault();
			const currentDistance = getTouchDistance(e.touches);
			const delta = currentDistance - lastTouchDistance;
			const percentChange = (delta / canvasMinDim) * 50;
			const newSize = Math.max(10, Math.min(200, $slideState.overlaySize + percentChange));
			slideState.update(state => ({ ...state, overlaySize: newSize }));
			lastTouchDistance = currentDistance;
		}
	}

	function handleOverlayTouchEnd(e) {
		if (e.touches.length < 2) {
			lastTouchDistance = 0;
		}
	}

	function handleOverlayWheel(e) {
		// Trackpad pinch gestures fire as wheel events with ctrlKey
		if (e.ctrlKey) {
			e.preventDefault();
			const delta = -e.deltaY * 0.5;
			const newSize = Math.max(10, Math.min(200, $slideState.overlaySize + delta));
			slideState.update(state => ({ ...state, overlaySize: newSize }));
		}
	}

	function handleCanvasClick(e) {
		const target = e.target;
		if (target.closest('.overlay-wrapper')) {
			activeDesignMenu.set('image');
		} else if (target.closest('.text1-flow-container')) {
			activeDesignMenu.set('text1');
		} else if (target.closest('.canvas-text.text2')) {
			activeDesignMenu.set('text2');
		} else if (target.closest('.canvas-quote')) {
			activeDesignMenu.set('text1');
		}
	}

	$: overlayDimensions = calculateOverlayDimensions($slideState);

	function calculateOverlayDimensions(state) {
		if (!state.overlay || !state.overlayNaturalWidth) return null;
		
		const maxWidth = (state.overlaySize / 100) * 100;
		
		// For circle and diamond masks, force square dimensions; otherwise respect aspect ratio
		if (state.overlayMask === 'circle' || state.overlayMask === 'diamond') {
			return { width: maxWidth, height: maxWidth };
		}
		
		const aspectRatio = state.overlayNaturalWidth / state.overlayNaturalHeight;
		
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
			<p class="picker-title">Create quotes & cards with<br>a template or blank canvas</p>
			
			<button 
				class="blank-canvas-btn"
				on:click={() => selectTemplate('blank')}
			>
				<img src="/icons/icon-add.svg" alt="" class="add-icon" />
			</button>
			
			<div class="template-grid">
				{#each templatesData.templates as template (template.id)}
					<button 
						class="template-card"
						on:click={() => selectTemplate(template.id)}
					>
						<div class="template-placeholder">
							{template.name}
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
					{@const textFontSizePx = (canvasMinDim * 0.072 * $slideState.text1Size) / 5}
					{@const textLineHeightPx = textFontSizePx * (1 + $slideState.text1LineSpacing * 0.1)}
					{@const quoteFontSizePx = canvasMinDim * 0.133 * $slideState.text1QuoteSize}
					{@const isSlab = $slideState.text1QuoteStyle === 'slab'}
					{@const baseGapPx = textLineHeightPx * (isSlab ? -0.2 : 0.0)}
					{@const leadingCompensation = quoteFontSizePx * (isSlab ? 0.6 : 0.45)}
					{@const gapPx = baseGapPx - leadingCompensation}
					{@const textYPosPct = $slideState.text1YPosition * 10}
					
					<div 
						class="text1-flow-container"
						style="top: {textYPosPct}%;"
					>
						{#if $slideState.text1QuoteStyle !== 'none'}
							<div 
								class="canvas-quote"
								style="
									text-align: {$slideState.text1Align};
									font-family: {isSlab ? '\"Alfa Slab One\", cursive' : '\"Playfair Display\", serif'};
									font-size: {quoteFontSizePx}px;
									font-weight: {isSlab ? 'normal' : 'bold'};
									color: {$slideState.text1Color};
									margin-bottom: {gapPx}px;
								"
							>&#8220;</div>
						{/if}
						
						<div 
							class="canvas-text text1"
							style="
								font-family: '{$slideState.text1Font}';
								font-size: {$slideState.text1Size * 0.36}em;
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
						class:active={$activeDesignMenu === 'image'}
						style="
							left: {$slideState.overlayX}%;
							top: {$slideState.overlayY}%;
							width: {overlayDimensions.width}%;
							opacity: {$slideState.overlayOpacity / 100};
							z-index: {$activeDesignMenu === 'image' ? 11 : ($slideState.overlayLayer === 'below' ? 1 : 10)};
						"
						on:mousedown={handleOverlayDragStart}
						on:touchstart={handleOverlayTouchStart}
						on:touchmove={handleOverlayTouchMove}
						on:touchend={handleOverlayTouchEnd}
						on:wheel={handleOverlayWheel}
						role="button"
						tabindex="0"
					>
						<div 
							class="overlay-bounding-box"
							class:mask-none={$slideState.overlayMask === 'none'}
							class:mask-rounded={$slideState.overlayMask === 'rounded'}
							class:mask-circle={$slideState.overlayMask === 'circle'}
							class:mask-diamond={$slideState.overlayMask === 'diamond'}
							style="
								border-width: {$slideState.overlayBorderWidth * 2}px;
								border-color: {$slideState.overlayBorderColor};
							"
						>
							<button 
								class="delete-btn"
								on:click={handleDeleteImage}
								aria-label="Delete image"
							>
								<img src="/icons/icon-close.svg" alt="" class="delete-icon" />
							</button>
							<button
								class="resize-handle"
								on:mousedown={handleResizeStart}
								on:touchstart={handleResizeStart}
								aria-label="Resize image"
							>
								<img src="/icons/icon-resize.svg" alt="" class="resize-icon" />
							</button>
							<div 
								class="overlay-image-container"
								class:mask-rounded={$slideState.overlayMask === 'rounded'}
								class:mask-circle={$slideState.overlayMask === 'circle'}
								class:mask-diamond={$slideState.overlayMask === 'diamond'}
								style="overflow: hidden;"
							>
								<img 
									src={$slideState.overlay} 
									alt="Overlay" 
									class="overlay-image"
									draggable="false"
									style="
										transform: translate({$slideState.overlayImageOffsetX}%, {$slideState.overlayImageOffsetY}%) scale({$slideState.overlayZoom / 100});
										transform-origin: center;
									"
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
			{#if $activeDesignMenu === 'image' || ($activeDesignMenu === 'none' && $slideState.overlay)}
				<OverlayControls 
					overlay={$slideState.overlay}
					overlaySize={$slideState.overlaySize}
					overlayOpacity={$slideState.overlayOpacity}
					overlayMask={$slideState.overlayMask}
					overlayLayer={$slideState.overlayLayer}
					overlayBorderWidth={$slideState.overlayBorderWidth}
					overlayBorderColor={$slideState.overlayBorderColor}
					overlayZoom={$slideState.overlayZoom}
					overlayImageOffsetX={$slideState.overlayImageOffsetX}
					overlayImageOffsetY={$slideState.overlayImageOffsetY}
					overlayNaturalWidth={$slideState.overlayNaturalWidth}
					overlayNaturalHeight={$slideState.overlayNaturalHeight}
					getCanvasDimensions={getCanvasDimensions}
					onChange={handleImageChange}
					onDelete={handleDeleteImage}
				/>
			{:else if $activeDesignMenu === 'ratio'}
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
					text1QuoteStyle={$slideState.text1QuoteStyle}
					text1QuoteSize={$slideState.text1QuoteSize}
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
			{/if}
		</div>

		{#if import.meta.env.DEV}
			<div class="admin-footer">
				<button class="save-template-btn" on:click={handleSaveTemplate}>
					💾 Save as Template
				</button>
			</div>
		{/if}
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

	.text1-flow-container {
		position: absolute;
		left: 7.5%;
		right: 7.5%;
		width: 85%;
		transform: translateY(-50%);
		z-index: 5;
		overflow: visible;
		display: flex;
		flex-direction: column;
	}

	.canvas-quote {
		line-height: 1;
	}

	.canvas-text {
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.canvas-text.text2 {
		position: absolute;
		left: 7.5%;
		right: 7.5%;
		width: 85%;
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
		border-radius: 0;
	}

	.overlay-bounding-box.mask-rounded {
		border-radius: var(--radius-lg);
	}

	.overlay-bounding-box.mask-circle {
		border-radius: 50%;
		aspect-ratio: 1 / 1;
	}

	.overlay-bounding-box.mask-diamond {
		aspect-ratio: 1 / 1;
		border-color: transparent !important;
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
		width: 14px;
		height: 14px;
		filter: brightness(0) invert(1);
	}

	.resize-handle {
		position: absolute;
		bottom: -12px;
		right: -12px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: none;
		background: #777777;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: nwse-resize;
		z-index: 11;
		opacity: 0;
		transition: opacity var(--transition-fast);
		padding: 0;
	}

	.resize-icon {
		width: 10px;
		height: 10px;
		filter: brightness(0) invert(1);
	}

	.overlay-wrapper.active .resize-handle {
		opacity: 1;
	}

	.resize-handle:hover {
		background: var(--color-text-primary);
	}

	.overlay-image-container {
		width: 100%;
		overflow: hidden;
		height: 100%;
	}

	.overlay-image-container.mask-rounded {
		border-radius: var(--radius-lg);
	}

	.overlay-image-container.mask-circle {
		border-radius: 50%;
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.overlay-image-container.mask-diamond {
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
	}

	.overlay-image {
		width: 100%;
		height: 100%;
		display: block;
		pointer-events: none;
		object-fit: cover;
		object-position: center;
	}

	.overlay-image-container.mask-circle .overlay-image,
	.overlay-image-container.mask-diamond .overlay-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.controls-panel {
		padding: var(--space-4) 0;
	}

	.admin-footer {
		padding: var(--space-3) var(--space-4);
		border-top: 1px solid var(--color-border-light);
		text-align: center;
	}

	.save-template-btn {
		font-size: var(--font-size-sm);
		padding: var(--space-2) var(--space-3);
		background: none;
		border: none;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: color var(--transition-fast);
	}

	.save-template-btn:hover {
		color: var(--color-primary);
	}
</style>
