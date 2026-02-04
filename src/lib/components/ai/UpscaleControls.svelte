<script>
	import { aiState } from '$lib/stores/aiStore.js';
	import { upscaleImageCloud } from '$lib/utils/aiUtils.js';
	import { loadImage } from '$lib/utils/imageUtils.js';
	
	const scaleFactor = 4;
	let isProcessing = false;
	let progressStatus = '';
	let error = null;
	let outputDimensions = null;
	
	$: if ($aiState.originalImage) {
		updateOutputDimensions();
	}
	
	async function updateOutputDimensions() {
		try {
			const img = await loadImage($aiState.originalImage);
			const width = Math.round(img.naturalWidth * scaleFactor);
			const height = Math.round(img.naturalHeight * scaleFactor);
			outputDimensions = `${width} x ${height}`;
		} catch (err) {
			console.error('Failed to get image dimensions:', err);
		}
	}
	
	async function handleUpscale() {
		if (!$aiState.originalImage) return;
		
		try {
			isProcessing = true;
			error = null;
			progressStatus = 'Starting...';
			aiState.startProcessing('upscale');
			
			const resultDataUrl = await upscaleImageCloud(
				$aiState.originalImage, 
				scaleFactor, 
				(status) => { progressStatus = status; }
			);
			
			aiState.finishProcessing(resultDataUrl);
		} catch (err) {
			error = err.message || 'Upscaling failed';
			aiState.cancelProcessing();
		} finally {
			isProcessing = false;
			progressStatus = '';
		}
	}
	
	function handleCancel() {
		isProcessing = false;
		progressStatus = '';
		error = null;
		aiState.cancelProcessing();
	}
</script>

<div class="upscale-controls">
	<div class="controls-content">
		{#if outputDimensions}
			<div class="size-display">
				Output: {outputDimensions}
			</div>
		{/if}
		
		{#if isProcessing}
			<button class="processing-btn" disabled>
				<span class="spinner"></span>
				{progressStatus || 'Processing...'}
			</button>
			<button class="cancel-btn" on:click={handleCancel}>Cancel</button>
		{:else}
			<button class="upscale-btn" on:click={handleUpscale}>
				<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
				Upscale image
			</button>
			<p class="hint">Upscales, sharpens and enhances images</p>
		{/if}
		
		{#if error}
			<div class="error-message">{error}</div>
		{/if}
	</div>
</div>

<style>
	.upscale-controls {
		padding: var(--space-4) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.controls-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.size-display {
		text-align: right;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
	
	.upscale-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}
	
	.upscale-btn:hover {
		opacity: 0.9;
	}
	
	.processing-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background-color: var(--color-primary);
		color: var(--color-text-inverse);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		cursor: not-allowed;
		opacity: 0.8;
	}
	
	.spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.cancel-btn {
		padding: var(--space-3) var(--space-4);
		background: none;
		color: var(--color-text-secondary);
		border: none;
		font-size: var(--font-size-sm);
		cursor: pointer;
		text-align: right;
	}
	
	.cancel-btn:hover {
		text-decoration: underline;
	}
	
	.hint {
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		margin: 0;
	}
	
	.btn-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
	}
	
	.error-message {
		padding: var(--space-3) var(--space-4);
		background-color: rgba(220, 20, 60, 0.1);
		color: var(--color-error);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
	}
</style>
