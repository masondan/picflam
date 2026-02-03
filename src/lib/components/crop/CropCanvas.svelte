<script>
	import { createEventDispatcher, onMount } from 'svelte';
	
	export let imageSrc = '';
	export let cropBox = { x: 10, y: 10, width: 80, height: 80 };
	export let isCropping = false;
	export let scale = 1;
	export let offsetX = 0;
	export let offsetY = 0;
	export let imageWidth = 0;
	export let imageHeight = 0;
	export let editFilters = '';
	
	const dispatch = createEventDispatcher();
	
	let containerEl;
	let containerRect = { width: 0, height: 0 };
	let isDragging = false;
	let dragType = null;
	let dragStartX = 0;
	let dragStartY = 0;
	let initialCropBox = null;
	let initialPinchDistance = 0;
	let initialScale = 1;
	
	$: displayWidth = containerRect.width;
	$: displayHeight = imageHeight && imageWidth ? (displayWidth * imageHeight) / imageWidth : 0;
	
	$: cropPixels = {
		x: (cropBox.x / 100) * displayWidth,
		y: (cropBox.y / 100) * displayHeight,
		width: (cropBox.width / 100) * displayWidth,
		height: (cropBox.height / 100) * displayHeight
	};
	
	onMount(() => {
		updateContainerRect();
		window.addEventListener('resize', updateContainerRect);
		return () => window.removeEventListener('resize', updateContainerRect);
	});
	
	function updateContainerRect() {
		if (containerEl) {
			const rect = containerEl.getBoundingClientRect();
			containerRect = { width: rect.width, height: rect.height };
		}
	}
	
	function getEventPosition(e) {
		if (e.touches && e.touches.length > 0) {
			return { x: e.touches[0].clientX, y: e.touches[0].clientY };
		}
		return { x: e.clientX, y: e.clientY };
	}
	
	function getPinchDistance(e) {
		if (e.touches && e.touches.length >= 2) {
			const dx = e.touches[0].clientX - e.touches[1].clientX;
			const dy = e.touches[0].clientY - e.touches[1].clientY;
			return Math.sqrt(dx * dx + dy * dy);
		}
		return 0;
	}
	
	function handlePointerDown(e, type = 'move') {
		if (!isCropping) return;
		
		if (e.touches && e.touches.length >= 2) {
			initialPinchDistance = getPinchDistance(e);
			initialScale = scale;
			dragType = 'pinch';
			return;
		}
		
		e.preventDefault();
		isDragging = true;
		dragType = type;
		const pos = getEventPosition(e);
		dragStartX = pos.x;
		dragStartY = pos.y;
		initialCropBox = { ...cropBox };
	}
	
	function handlePointerMove(e) {
		if (!isCropping) return;
		
		if (dragType === 'pinch' && e.touches && e.touches.length >= 2) {
			const currentDistance = getPinchDistance(e);
			const newScale = initialScale * (currentDistance / initialPinchDistance);
			dispatch('scaleChange', { scale: Math.max(0.5, Math.min(3, newScale)) });
			return;
		}
		
		if (!isDragging || !initialCropBox) return;
		
		e.preventDefault();
		const pos = getEventPosition(e);
		const deltaX = ((pos.x - dragStartX) / displayWidth) * 100;
		const deltaY = ((pos.y - dragStartY) / displayHeight) * 100;
		
		let newCropBox = { ...initialCropBox };
		
		if (dragType === 'move') {
			newCropBox.x = Math.max(0, Math.min(100 - initialCropBox.width, initialCropBox.x + deltaX));
			newCropBox.y = Math.max(0, Math.min(100 - initialCropBox.height, initialCropBox.y + deltaY));
		} else if (dragType.includes('corner')) {
			const minSize = 10;
			
			if (dragType.includes('left')) {
				const newX = initialCropBox.x + deltaX;
				const newWidth = initialCropBox.width - deltaX;
				if (newWidth >= minSize && newX >= 0) {
					newCropBox.x = newX;
					newCropBox.width = newWidth;
				}
			}
			if (dragType.includes('right')) {
				const newWidth = initialCropBox.width + deltaX;
				if (newWidth >= minSize && initialCropBox.x + newWidth <= 100) {
					newCropBox.width = newWidth;
				}
			}
			if (dragType.includes('top')) {
				const newY = initialCropBox.y + deltaY;
				const newHeight = initialCropBox.height - deltaY;
				if (newHeight >= minSize && newY >= 0) {
					newCropBox.y = newY;
					newCropBox.height = newHeight;
				}
			}
			if (dragType.includes('bottom')) {
				const newHeight = initialCropBox.height + deltaY;
				if (newHeight >= minSize && initialCropBox.y + newHeight <= 100) {
					newCropBox.height = newHeight;
				}
			}
		}
		
		dispatch('cropChange', { cropBox: newCropBox });
	}
	
	function handlePointerUp() {
		isDragging = false;
		dragType = null;
		initialCropBox = null;
	}
</script>

<div 
	class="crop-canvas"
	bind:this={containerEl}
	on:mousemove={handlePointerMove}
	on:mouseup={handlePointerUp}
	on:mouseleave={handlePointerUp}
	on:touchmove={handlePointerMove}
	on:touchend={handlePointerUp}
	role="application"
	aria-label="Image crop canvas"
>
	<div 
		class="image-wrapper"
		style="transform: scale({scale}) translate({offsetX}px, {offsetY}px);"
	>
		<img 
			src={imageSrc} 
			alt="Crop preview"
			class="canvas-image"
			style="filter: {editFilters};"
			draggable="false"
		/>
	</div>
	
	{#if isCropping && displayHeight > 0}
		<div class="crop-overlay">
			<div 
				class="overlay-top" 
				style="height: {cropPixels.y}px;"
			></div>
			<div 
				class="overlay-bottom" 
				style="top: {cropPixels.y + cropPixels.height}px; height: {displayHeight - cropPixels.y - cropPixels.height}px;"
			></div>
			<div 
				class="overlay-left" 
				style="top: {cropPixels.y}px; height: {cropPixels.height}px; width: {cropPixels.x}px;"
			></div>
			<div 
				class="overlay-right" 
				style="top: {cropPixels.y}px; height: {cropPixels.height}px; left: {cropPixels.x + cropPixels.width}px; width: {displayWidth - cropPixels.x - cropPixels.width}px;"
			></div>
			
			<div 
				class="crop-box"
				style="left: {cropPixels.x}px; top: {cropPixels.y}px; width: {cropPixels.width}px; height: {cropPixels.height}px;"
				on:mousedown={(e) => handlePointerDown(e, 'move')}
				on:touchstart={(e) => handlePointerDown(e, 'move')}
				role="button"
				aria-label="Drag to move crop area"
				tabindex="0"
			>
				<div class="crop-border"></div>
				
				<div 
					class="corner-handle top-left"
					on:mousedown|stopPropagation={(e) => handlePointerDown(e, 'corner-top-left')}
					on:touchstart|stopPropagation={(e) => handlePointerDown(e, 'corner-top-left')}
					role="button"
					aria-label="Resize top-left corner"
					tabindex="0"
				></div>
				<div 
					class="corner-handle top-right"
					on:mousedown|stopPropagation={(e) => handlePointerDown(e, 'corner-top-right')}
					on:touchstart|stopPropagation={(e) => handlePointerDown(e, 'corner-top-right')}
					role="button"
					aria-label="Resize top-right corner"
					tabindex="0"
				></div>
				<div 
					class="corner-handle bottom-left"
					on:mousedown|stopPropagation={(e) => handlePointerDown(e, 'corner-bottom-left')}
					on:touchstart|stopPropagation={(e) => handlePointerDown(e, 'corner-bottom-left')}
					role="button"
					aria-label="Resize bottom-left corner"
					tabindex="0"
				></div>
				<div 
					class="corner-handle bottom-right"
					on:mousedown|stopPropagation={(e) => handlePointerDown(e, 'corner-bottom-right')}
					on:touchstart|stopPropagation={(e) => handlePointerDown(e, 'corner-bottom-right')}
					role="button"
					aria-label="Resize bottom-right corner"
					tabindex="0"
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.crop-canvas {
		position: relative;
		width: 100%;
		overflow: hidden;
		touch-action: none;
		user-select: none;
	}
	
	.image-wrapper {
		transform-origin: center center;
	}
	
	.canvas-image {
		width: 100%;
		height: auto;
		display: block;
		pointer-events: none;
	}
	
	.crop-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
	}
	
	.overlay-top,
	.overlay-bottom,
	.overlay-left,
	.overlay-right {
		position: absolute;
		background: rgba(0, 0, 0, 0.4);
	}
	
	.overlay-top,
	.overlay-bottom {
		left: 0;
		right: 0;
	}
	
	.overlay-top {
		top: 0;
	}
	
	.crop-box {
		position: absolute;
		pointer-events: auto;
		cursor: move;
	}
	
	.crop-border {
		position: absolute;
		inset: 0;
		border: 2px solid white;
		pointer-events: none;
	}
	
	.corner-handle {
		position: absolute;
		width: 24px;
		height: 24px;
		pointer-events: auto;
	}
	
	.corner-handle.top-left {
		top: 6px;
		left: 6px;
		border-left: 3px solid white;
		border-top: 3px solid white;
		cursor: nwse-resize;
	}
	
	.corner-handle.top-right {
		top: 6px;
		right: 6px;
		border-right: 3px solid white;
		border-top: 3px solid white;
		cursor: nesw-resize;
	}
	
	.corner-handle.bottom-left {
		bottom: 6px;
		left: 6px;
		border-left: 3px solid white;
		border-bottom: 3px solid white;
		cursor: nesw-resize;
	}
	
	.corner-handle.bottom-right {
		bottom: 6px;
		right: 6px;
		border-right: 3px solid white;
		border-bottom: 3px solid white;
		cursor: nwse-resize;
	}
</style>
