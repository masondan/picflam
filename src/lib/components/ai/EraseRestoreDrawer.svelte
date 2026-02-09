<script>
	import { onMount } from 'svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import { loadImage } from '$lib/utils/imageUtils.js';
	
	export let image = '';
	export let originalFullImage = '';
	export let onClose = () => {};
	export let onSave = () => {};
	
	let canvasElement;
	let canvasWrapper;
	let ctx;
	let isEraseMode = true;
	let brushSize = 20;
	let softenEdges = 50;
	let zoomLevel = 1;
	let offsetX = 0;
	let offsetY = 0;
	let isDrawing = false;
	let history = [];
	let historyIndex = 0;
	let restoreSourceImage = null;
	let brushPosition = { x: 0, y: 0, visible: false };
	let showBrushPreview = false;
	let displayWidth = 0;
	let displayHeight = 0;
	let showCompare = false;
	let initialHistoryIndex = 0;
	
	$: brushDisplaySize = (brushSize / 100) * Math.min(displayWidth || 300, displayHeight || 300) * 0.5;
	$: hasChanges = historyIndex !== initialHistoryIndex;
	
	onMount(async () => {
		const img = await loadImage(image);
		canvasElement.width = img.naturalWidth;
		canvasElement.height = img.naturalHeight;
		ctx = canvasElement.getContext('2d');
		ctx.drawImage(img, 0, 0);
		
		if (originalFullImage) {
			restoreSourceImage = await loadImage(originalFullImage);
		} else {
			restoreSourceImage = img;
		}
		
		updateDisplayDimensions();
		saveToHistory();
		initialHistoryIndex = historyIndex;
	});
	
	function updateDisplayDimensions() {
		if (canvasWrapper) {
			const rect = canvasWrapper.getBoundingClientRect();
			displayWidth = rect.width;
			displayHeight = rect.height;
		}
	}
	
	function saveToHistory() {
		history = history.slice(0, historyIndex + 1);
		history.push(canvasElement.toDataURL());
		historyIndex = history.length - 1;
	}
	
	function undo() {
		if (historyIndex > 0) {
			historyIndex--;
			restoreFromHistory();
		}
	}
	
	function redo() {
		if (historyIndex < history.length - 1) {
			historyIndex++;
			restoreFromHistory();
		}
	}
	
	function restoreFromHistory() {
		const img = new Image();
		img.onload = () => {
			ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
			ctx.drawImage(img, 0, 0);
		};
		img.src = history[historyIndex];
	}
	
	function getCanvasCoordinates(e) {
		const rect = canvasWrapper.getBoundingClientRect();
		const scaleX = canvasElement.width / rect.width;
		const scaleY = canvasElement.height / rect.height;
		const x = (e.clientX - rect.left) * scaleX;
		const y = (e.clientY - rect.top) * scaleY;
		return { x, y };
	}
	
	function handleMouseDown(e) {
		isDrawing = true;
		const { x, y } = getCanvasCoordinates(e);
		paint(x, y);
	}
	
	function handleMouseMove(e) {
		const rect = canvasWrapper.getBoundingClientRect();
		brushPosition = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
			visible: true
		};
		
		if (!isDrawing) return;
		const { x, y } = getCanvasCoordinates(e);
		paint(x, y);
	}
	
	function handleMouseUp() {
		if (isDrawing) {
			isDrawing = false;
			saveToHistory();
		}
	}
	
	function handleMouseLeave() {
		brushPosition = { ...brushPosition, visible: false };
		if (isDrawing) {
			isDrawing = false;
			saveToHistory();
		}
	}
	
	function paint(x, y) {
		const scaleX = canvasElement.width / canvasWrapper.getBoundingClientRect().width;
		const radius = (brushDisplaySize / 2) * scaleX;
		const softness = softenEdges / 100;
		const innerRadius = Math.min(radius - 0.001, radius * (1 - softness));
		
		ctx.save();
		try {
			if (isEraseMode) {
				const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, radius);
				gradient.addColorStop(0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1, 'rgba(0,0,0,0)');
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			} else {
				if (!restoreSourceImage) return;
				
				const tempCanvas = document.createElement('canvas');
				tempCanvas.width = canvasElement.width;
				tempCanvas.height = canvasElement.height;
				const tempCtx = tempCanvas.getContext('2d');
				
				const gradient = tempCtx.createRadialGradient(x, y, innerRadius, x, y, radius);
				gradient.addColorStop(0, 'rgba(0,0,0,1)');
				gradient.addColorStop(1, 'rgba(0,0,0,0)');
				
				tempCtx.globalCompositeOperation = 'source-over';
				tempCtx.drawImage(restoreSourceImage, 0, 0, tempCanvas.width, tempCanvas.height);
				
				tempCtx.globalCompositeOperation = 'destination-in';
				tempCtx.fillStyle = gradient;
				tempCtx.beginPath();
				tempCtx.arc(x, y, radius, 0, Math.PI * 2);
				tempCtx.fill();
				
				ctx.globalCompositeOperation = 'source-over';
				ctx.drawImage(tempCanvas, 0, 0);
			}
		} finally {
			ctx.restore();
		}
	}
	
	function resetBrushSize() {
		brushSize = 20;
	}
	
	function resetSoftenEdges() {
		softenEdges = 50;
	}
	
	function resetZoom() {
		zoomLevel = 1;
		offsetX = 0;
		offsetY = 0;
	}
	
	function handleNudge(direction) {
		const step = 10;
		switch (direction) {
			case 'up':
				offsetY -= step;
				break;
			case 'down':
				offsetY += step;
				break;
			case 'left':
				offsetX -= step;
				break;
			case 'right':
				offsetX += step;
				break;
		}
	}
	
	function handleCancel() {
		onClose();
	}
	
	function handleDone() {
		const result = canvasElement.toDataURL('image/png');
		onSave(result);
	}
</script>

<div class="drawer-overlay" on:click={handleCancel} role="presentation">
	<div class="drawer" on:click|stopPropagation role="dialog">
		<div class="drawer-header">
			<button class="icon-btn" on:click={undo} title="Undo">
				<img src="/icons/icon-undo.svg" alt="Undo" />
			</button>
			<button class="icon-btn" on:click={redo} title="Redo">
				<img src="/icons/icon-redo.svg" alt="Redo" />
			</button>
			
			<div class="spacer"></div>
			
			<button 
				class="action-btn cancel-btn"
				on:click={handleCancel}
				aria-label="Cancel"
			>
				Cancel
			</button>
			
			<button 
				class="action-btn save-btn"
				class:active={hasChanges}
				class:inactive={!hasChanges}
				on:click={handleDone}
				disabled={!hasChanges}
				aria-label="Save changes"
			>
				Save
			</button>
			
			<button 
				class="icon-btn" 
				class:active={showCompare}
				title="Compare"
				on:mousedown={() => showCompare = true}
				on:mouseup={() => showCompare = false}
				on:mouseleave={() => showCompare = false}
				on:touchstart={() => showCompare = true}
				on:touchend={() => showCompare = false}
			>
				<img src="/icons/icon-compare.svg" alt="Compare" />
			</button>
		</div>
		
		<div class="canvas-container">
			<div 
				class="canvas-wrapper"
				bind:this={canvasWrapper}
				on:mousedown={handleMouseDown}
				on:mousemove={handleMouseMove}
				on:mouseup={handleMouseUp}
				on:mouseleave={handleMouseLeave}
				style="transform: scale({zoomLevel}) translate({offsetX}px, {offsetY}px)"
				role="presentation"
			>
				<canvas bind:this={canvasElement}></canvas>
				
				{#if showCompare && originalFullImage}
					<img 
						src={originalFullImage} 
						alt="Original" 
						class="compare-overlay"
					/>
				{/if}
				
				{#if brushPosition.visible && displayWidth > 0}
					<div 
						class="brush-indicator"
						style="
							left: {brushPosition.x}px;
							top: {brushPosition.y}px;
							width: {brushDisplaySize}px;
							height: {brushDisplaySize}px;
						"
					></div>
				{/if}
				
				{#if showBrushPreview && displayWidth > 0 && displayHeight > 0}
					<div 
						class="brush-preview"
						style="
						left: {displayWidth / 2}px;
						top: {displayHeight / 2}px;
						width: {brushDisplaySize}px;
						height: {brushDisplaySize}px;
					"
					></div>
				{/if}
			</div>
		</div>
		
		<div class="controls-section">
			<div class="button-group">
				<button 
					class="mode-btn"
					class:active={isEraseMode}
					on:click={() => isEraseMode = true}
				>
					<img src="/icons/icon-erase.svg" alt="" />
					Erase
				</button>
				<button 
					class="mode-btn"
					class:active={!isEraseMode}
					on:click={() => isEraseMode = false}
				>
					<img src="/icons/icon-restore.svg" alt="" />
					Restore
				</button>
			</div>
			
			<div class="control-row">
				<label>Brush size</label>
				<Slider 
					min={5}
					max={100}
					step={1}
					value={brushSize}
					onChange={(newValue) => brushSize = newValue}
					onInteractionStart={() => { updateDisplayDimensions(); showBrushPreview = true; }}
					onInteractionEnd={() => showBrushPreview = false}
				/>
				<button class="reset-btn" on:click={resetBrushSize} title="Reset">
					<img src="/icons/icon-reset.svg" alt="Reset" />
				</button>
			</div>
			
			<div class="control-row">
				<label>Soften edges</label>
				<Slider 
					min={0}
					max={100}
					step={1}
					value={softenEdges}
					onChange={(newValue) => softenEdges = newValue}
				/>
				<button class="reset-btn" on:click={resetSoftenEdges} title="Reset">
					<img src="/icons/icon-reset.svg" alt="Reset" />
				</button>
			</div>
			
			<div class="control-row">
				<label>Zoom in</label>
				<Slider 
					min={1}
					max={3}
					step={0.1}
					value={zoomLevel}
					onChange={(newValue) => zoomLevel = newValue}
				/>
				<button class="reset-btn" on:click={resetZoom} title="Reset">
					<img src="/icons/icon-reset.svg" alt="Reset" />
				</button>
			</div>
			
			<div class="nudge-buttons">
				<button class="nudge-btn" on:click={() => handleNudge('up')} aria-label="Nudge up">
					<img src="/icons/icon-nudge-up.svg" alt="" class="nudge-icon" />
				</button>
				<button class="nudge-btn" on:click={() => handleNudge('down')} aria-label="Nudge down">
					<img src="/icons/icon-nudge-down.svg" alt="" class="nudge-icon" />
				</button>
				<button class="nudge-btn" on:click={() => handleNudge('left')} aria-label="Nudge left">
					<img src="/icons/icon-nudge-left.svg" alt="" class="nudge-icon" />
				</button>
				<button class="nudge-btn" on:click={() => handleNudge('right')} aria-label="Nudge right">
					<img src="/icons/icon-nudge-right.svg" alt="" class="nudge-icon" />
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.drawer-overlay {
		position: absolute;
		inset: 0;
		background-color: transparent;
		display: flex;
		align-items: flex-end;
		z-index: 100;
	}
	
	.drawer {
		width: 100%;
		max-width: 100%;
		background-color: var(--color-surface);
		border-radius: 0;
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow-y: auto;
	}
	
	.drawer-header {
		display: flex;
		align-items: center;
		padding: var(--space-6) var(--space-6) var(--space-1) var(--space-6);
		margin-bottom: 0;
		gap: var(--space-2);
	}
	
	.icon-btn {
		width: 38px;
		height: 38px;
		border-radius: var(--radius-md);
		border: 1px solid #555555;
		background-color: var(--color-surface);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.icon-btn:hover {
		background-color: var(--color-border-light);
	}

	.icon-btn.active {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.icon-btn.active img {
		filter: brightness(0) invert(1);
	}

	.icon-btn img {
		width: 22px;
		height: 22px;
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}
	
	.spacer {
		flex: 1;
	}
	
	.action-btn {
		height: 38px;
		padding: 0 var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
		flex: 1;
		min-width: 0;
	}
	
	.cancel-btn {
		border: 1px solid #555555;
		background-color: var(--color-surface);
		color: #555555;
	}
	
	.cancel-btn:hover {
		background-color: var(--color-border-light);
	}
	
	.save-btn {
		border: none;
		color: white;
	}
	
	.save-btn.active {
		background-color: var(--color-primary);
	}
	
	.save-btn.inactive {
		background-color: #555555;
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.canvas-container {
		overflow: hidden;
		margin: var(--space-4) var(--space-6);
		width: calc(100% - var(--space-6) * 2);
		border: 1px solid #555555;
	}
	
	.canvas-wrapper {
		display: block;
		background-color: transparent;
		width: 100%;
		position: relative;
		transform-origin: center center;
	}
	
	canvas {
		width: 100%;
		height: auto;
		cursor: none;
		display: block;
	}
	
	.compare-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		pointer-events: none;
	}
	
	.brush-indicator {
		position: absolute;
		border-radius: 50%;
		background-color: rgba(84, 34, 176, 0.3);
		border: 2px solid var(--color-primary);
		pointer-events: none;
		transform: translate(-50%, -50%);
	}
	
	.brush-preview {
		position: absolute;
		border-radius: 50%;
		background-color: rgba(84, 34, 176, 0.2);
		border: 1px solid var(--color-primary);
		pointer-events: none;
		transform: translate(-50%, -50%);
	}
	
	.controls-section {
		padding: 0 var(--space-6) var(--space-4) var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.button-group {
		display: flex;
		gap: var(--space-2);
	}
	
	.mode-btn {
		flex: 1;
		height: 40px;
		padding: 0 var(--space-2);
		border: 1px solid #555555;
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		transition: all var(--transition-fast);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	.mode-btn:hover {
		background-color: var(--color-border-light);
	}

	.mode-btn.active {
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border-color: var(--color-primary);
	}

	.mode-btn img {
		width: 16px;
		height: 16px;
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.mode-btn.active img {
		filter: brightness(0) invert(1);
	}
	
	.control-row {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}
	
	.control-row label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		white-space: nowrap;
		flex-shrink: 0;
		min-width: 80px;
	}
	
	.reset-btn {
		width: 32px;
		height: 32px;
		border: none;
		background: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity var(--transition-fast);
		flex-shrink: 0;
		opacity: 0.6;
	}
	
	.reset-btn:hover {
		opacity: 1;
	}
	
	.reset-btn img {
		width: 20px;
		height: 20px;
	}
	
	.nudge-buttons {
		display: grid;
		grid-template-columns: repeat(4, 38px);
		gap: var(--space-2);
		justify-content: center;
	}
	
	.nudge-btn {
		width: 38px;
		height: 38px;
		padding: 0;
		border: 1px solid #555555;
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
	}

	.nudge-btn:hover {
		background-color: var(--color-border-light);
	}

	.nudge-icon {
		width: 22px;
		height: 22px;
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}
	

</style>
