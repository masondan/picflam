<script>
	import { fileToDataUrl, pasteImageFromClipboard, resizeImage } from '$lib/utils/imageUtils.js';
	
	export let title = 'Import an image';
	export let subtitle = '';
	export let hint = 'Import, drag or paste an image';
	export let onImageImport = (dataUrl) => {};
	
	let isDragging = false;
	let fileInput;
	
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
	
	function handleClick() {
		fileInput?.click();
	}
</script>

<div 
	class="import-area"
	class:dragging={isDragging}
	on:click={handleClick}
	on:drop={handleDrop}
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && handleClick()}
>
	<p class="import-title">{title}{#if subtitle}<br />{subtitle}{/if}</p>
	
	<img src="/icons/icon-upload.svg" alt="" class="import-icon" />
	
	<p class="import-hint">{hint}</p>
	
	<button class="btn-paste" on:click|stopPropagation={handlePaste}>
		Paste
	</button>
	
	<input 
		type="file" 
		accept="image/*" 
		bind:this={fileInput}
		on:change={handleFileSelect}
		class="sr-only"
	/>
</div>

<style>
	.import-area {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-4);
		padding: var(--space-8);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		background-color: var(--color-border-light);
		text-align: center;
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.import-area:hover,
	.import-area.dragging {
		border-color: var(--color-primary);
		background-color: var(--color-primary-light);
	}
	
	.import-title {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-tight);
		margin-bottom: calc(var(--space-4) * 6);
	}
	
	.import-icon {
		width: 48px;
		height: 48px;
		filter: brightness(0) saturate(100%) invert(18%) sepia(75%) saturate(1500%) hue-rotate(255deg) brightness(95%) contrast(102%);
	}
	
	.import-hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
	}
	
	.btn-paste {
		padding: var(--space-2) var(--space-6);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius-md);
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
		background: var(--color-border-light);
		transition: all var(--transition-fast);
	}
	
	.import-area:hover .btn-paste,
	.import-area.dragging .btn-paste {
		background-color: var(--color-primary-light);
	}
	
	.btn-paste:hover {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}
</style>
