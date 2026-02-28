<script>
	import { pasteImageFromClipboard, fileToDataUrl, resizeImage } from '$lib/utils/imageUtils.js';
	import BeforeAfterSlider from '$lib/components/ui/BeforeAfterSlider.svelte';
	
	export let onImageImport = (dataUrl) => {};
	export let onSearchClick = () => {};
	
	let isDragging = false;
	let fileInput;
	let sliderPosition = 50;
	
	async function handleFile(file) {
		if (!file || !file.type.startsWith('image/')) return;
		
		const dataUrl = await fileToDataUrl(file);
		const resized = await resizeImage(dataUrl, 2048);
		onImageImport(resized);
	}
	
	function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (file) handleFile(file);
	}
	
	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	}
	
	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}
	
	function handleDragLeave() {
		isDragging = false;
	}
	
	async function handlePaste() {
		const dataUrl = await pasteImageFromClipboard();
		if (dataUrl) {
			const resized = await resizeImage(dataUrl, 2048);
			onImageImport(resized);
		}
	}
	
	function handleUploadClick() {
		fileInput?.click();
	}
	
	function handleSliderChange(newPosition) {
		sliderPosition = newPosition;
	}
</script>

<div class="ai-welcome">
	<div class="slider-container">
		<BeforeAfterSlider
			beforeImage="/images/ai-intro-before.png"
			afterImage="/images/ai-intro-after.png"
			position={sliderPosition}
			onChange={handleSliderChange}
		/>
	</div>
	
	<p class="helper-text">Remove backgrounds & upscale images</p>
	
	<div class="input-panel">
		<div
			class="upload-border"
			class:dragging={isDragging}
			on:click={handleUploadClick}
			on:drop={handleDrop}
			on:dragover={handleDragOver}
			on:dragleave={handleDragLeave}
			role="button"
			tabindex="0"
			on:keypress={(e) => e.key === 'Enter' && handleUploadClick()}
		>
			<div class="upload-button">
				<img src="/icons/icon-upload.svg" alt="" class="upload-icon" />
			</div>
		</div>
		
		<div class="button-row">
			<button class="action-button" on:click={onSearchClick}>
				<span class="button-text">Search</span>
				<img src="/icons/icon-search.svg" alt="" class="button-icon" />
			</button>
			
			<button class="action-button" on:click={handlePaste}>
				<span class="button-text">Paste</span>
				<img src="/icons/icon-paste.svg" alt="" class="button-icon" />
			</button>
		</div>
	</div>
	
	<input 
		type="file" 
		accept="image/*" 
		bind:this={fileInput}
		on:change={handleFileSelect}
		class="sr-only"
	/>
</div>

<style>
	.ai-welcome {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	
	.slider-container {
		width: 100%;
		aspect-ratio: 9 / 16;
		flex: 1;
		min-height: 0;
		max-height: 69vh;
	}
	
	.slider-container :global(.before-after-container) {
		height: 100%;
		width: 100%;
	}
	
	.slider-container :global(.before-image),
	.slider-container :global(.before-image img),
	.slider-container :global(.after-image img) {
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
	}
	
	.input-panel {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 0;
		width: 100%;
		flex: 0 0 auto;
	}
	
	.upload-border {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		margin: 5px 0;
		border: 1px dashed var(--color-primary);
		border-radius: var(--radius-xl);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.upload-border:hover {
		opacity: 0.9;
	}
	
	.upload-border.dragging {
		opacity: 0.8;
	}
	
	.upload-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 56px;
		background-color: var(--color-primary);
		border: none;
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.upload-button:hover {
		opacity: 0.9;
	}
	
	.upload-icon {
		width: 24px;
		height: 24px;
		filter: brightness(0) saturate(100%) invert(100%);
	}
	
	.button-row {
		display: flex;
		gap: var(--space-4);
		padding: 0 2px;
	}
	
	.action-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 38px;
		padding: 0 var(--space-4);
		background-color: var(--color-primary-light);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-lg);
		color: var(--color-primary);
		font-size: 12px;
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.action-button:hover {
		background-color: #e6d5f0;
	}
	
	.action-button:active {
		opacity: 0.8;
	}
	
	.button-text {
		flex: 1;
		text-align: left;
	}
	
	.button-icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		filter: brightness(0) saturate(100%) invert(22%) sepia(97%) saturate(3000%) hue-rotate(254deg) brightness(90%) contrast(105%);
	}
	
	.helper-text {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-lg);
		text-align: center;
		line-height: var(--line-height-tight);
		margin-top: var(--space-4);
		margin-bottom: var(--space-2);
	}
	
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
