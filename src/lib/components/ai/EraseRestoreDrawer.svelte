<script>
	import { onMount } from 'svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import { loadImage } from '$lib/utils/imageUtils.js';
	
	export let image = '';
	export let onClose = () => {};
	export let onSave = () => {};
	
	let canvasElement;
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
	
	onMount(async () => {
		const img = await loadImage(image);
		canvasElement.width = img.naturalWidth;
		canvasElement.height = img.naturalHeight;
		ctx = canvasElement.getContext('2d');
		ctx.drawImage(img, 0, 0);
		
		saveToHistory();
	});
	
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
	
	function handleMouseDown(e) {
		isDrawing = true;
		const rect = canvasElement.getBoundingClientRect();
		const x = (e.clientX - rect.left) / zoomLevel - offsetX;
		const y = (e.clientY - rect.top) / zoomLevel - offsetY;
		paint(x, y);
	}
	
	function handleMouseMove(e) {
		if (!isDrawing) return;
		const rect = canvasElement.getBoundingClientRect();
		const x = (e.clientX - rect.left) / zoomLevel - offsetX;
		const y = (e.clientY - rect.top) / zoomLevel - offsetY;
		paint(x, y);
	}
	
	function handleMouseUp() {
		isDrawing = false;
		saveToHistory();
	}
	
	function paint(x, y) {
		const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
		
		if (isEraseMode) {
			gradient.addColorStop(0, 'rgba(0,0,0,1)');
			gradient.addColorStop(0.5, 'rgba(0,0,0,0.5)');
			gradient.addColorStop(1, 'rgba(0,0,0,0)');
			ctx.globalCompositeOperation = 'destination-out';
		} else {
			gradient.addColorStop(0, 'rgba(255,255,255,1)');
			gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
			gradient.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.globalCompositeOperation = 'destination-over';
		}
		
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, brushSize, 0, Math.PI * 2);
		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
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
			
			<button class="icon-btn" title="Compare">
				<img src="/icons/icon-compare.svg" alt="Compare" />
			</button>
		</div>
		
		<div 
			class="canvas-wrapper"
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseUp}
			style="transform: scale({zoomLevel}) translate({offsetX}px, {offsetY}px)"
			role="presentation"
		>
			<canvas bind:this={canvasElement}></canvas>
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
				<div class="control-item">
					<Slider 
						min={5}
						max={100}
						step={1}
						value={brushSize}
						onChange={(newValue) => brushSize = newValue}
					/>
					<button class="reset-btn" on:click={resetBrushSize} title="Reset">
						<img src="/icons/icon-reset.svg" alt="Reset" />
					</button>
				</div>
			</div>
			
			<div class="control-row">
				<label>Soften edges</label>
				<div class="control-item">
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
			</div>
			
			<div class="control-row">
				<label>Zoom in</label>
				<div class="control-item">
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
			</div>
			
			<div class="nudge-buttons">
				<button class="nudge-btn" on:click={() => handleNudge('up')}>↑</button>
				<button class="nudge-btn" on:click={() => handleNudge('down')}>↓</button>
				<button class="nudge-btn" on:click={() => handleNudge('left')}>←</button>
				<button class="nudge-btn" on:click={() => handleNudge('right')}>→</button>
			</div>
			
			<div class="drawer-footer">
				<button class="btn-cancel" on:click={handleCancel}>Cancel</button>
				<button class="btn-done" on:click={handleDone}>Done</button>
			</div>
		</div>
	</div>
</div>

<style>
	.drawer-overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: flex-end;
		z-index: 100;
	}
	
	.drawer {
		width: 100%;
		max-width: 480px;
		background-color: var(--color-surface);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		display: flex;
		flex-direction: column;
		max-height: 90vh;
		overflow-y: auto;
	}
	
	.drawer-header {
		display: flex;
		align-items: center;
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border-light);
		gap: var(--space-2);
	}
	
	.icon-btn {
		width: 44px;
		height: 44px;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
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
	
	.icon-btn img {
		width: 20px;
		height: 20px;
	}
	
	.spacer {
		flex: 1;
	}
	
	.canvas-wrapper {
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		transform-origin: center;
	}
	
	canvas {
		max-width: 100%;
		max-height: 100%;
		cursor: crosshair;
		display: block;
	}
	
	.controls-section {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border-light);
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
		padding: var(--space-3) var(--space-2);
		border: 1px solid var(--color-border);
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
		filter: brightness(0) invert(1);
	}
	
	.mode-btn.active img {
		filter: none;
	}
	
	.control-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	
	.control-row label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
	}
	
	.control-item {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}
	
	.reset-btn {
		width: 32px;
		height: 32px;
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}
	
	.reset-btn:hover {
		background-color: var(--color-border-light);
	}
	
	.reset-btn img {
		width: 16px;
		height: 16px;
	}
	
	.nudge-buttons {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--space-2);
	}
	
	.nudge-btn {
		padding: var(--space-2) var(--space-1);
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--font-size-base);
		transition: all var(--transition-fast);
		height: 44px;
	}
	
	.nudge-btn:hover {
		background-color: var(--color-border-light);
	}
	
	.drawer-footer {
		display: flex;
		gap: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-border-light);
	}
	
	.btn-cancel {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-surface);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		transition: all var(--transition-fast);
	}
	
	.btn-cancel:hover {
		background-color: var(--color-border-light);
	}
	
	.btn-done {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		transition: all var(--transition-fast);
	}
	
	.btn-done:hover {
		opacity: 0.9;
	}
</style>
