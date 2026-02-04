<script>
	import { aiState } from '$lib/stores/aiStore.js';
	import { upscaleImage, upscaleImageCloud } from '$lib/utils/aiUtils.js';
	import { loadImage } from '$lib/utils/imageUtils.js';
	import BeforeAfterSlider from '$lib/components/ui/BeforeAfterSlider.svelte';
	
	const scaleFactor = 4;
	let isProcessing = false;
	let progressStatus = '';
	let error = null;
	let showComparison = false;
	let comparisonPosition = 50;
	let outputDimensions = null;
	let useCloud = true;
	
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
		if (!$aiState.currentImage) return;
		
		try {
			isProcessing = true;
			error = null;
			progressStatus = 'Starting...';
			aiState.startProcessing('upscale');
			
			let resultDataUrl;
			if (useCloud) {
				resultDataUrl = await upscaleImageCloud(
					$aiState.currentImage, 
					scaleFactor, 
					(status) => { progressStatus = status; }
				);
			} else {
				resultDataUrl = await upscaleImage($aiState.currentImage, scaleFactor, (status) => {
					progressStatus = status;
				});
			}
			
			aiState.finishProcessing(resultDataUrl);
			showComparison = true;
		} catch (err) {
			error = err.message || 'Upscaling failed';
			aiState.cancelProcessing();
		} finally {
			isProcessing = false;
			progressStatus = '';
		}
	}
	
	function toggleMode() {
		useCloud = !useCloud;
	}
	
	function handleCancel() {
		isProcessing = false;
		progressStatus = '';
		error = null;
		aiState.cancelProcessing();
	}
	
	function handleComparisonChange(newPosition) {
		comparisonPosition = newPosition;
		aiState.setComparisonPosition(newPosition);
	}
</script>

<div class="upscale-controls">
	<div class="mode-toggle">
		<button 
			class="mode-btn" 
			class:active={!useCloud}
			on:click={() => useCloud = false}
		>
			Fast (Local)
		</button>
		<button 
			class="mode-btn" 
			class:active={useCloud}
			on:click={() => useCloud = true}
		>
			HQ (Cloud)
		</button>
	</div>
	
	{#if useCloud}
		<div class="cloud-info">
			<span class="cloud-badge">✓ CodeFormer (Upscaling + Face Enhancement)</span>
		</div>
	{/if}
	
	{#if !showComparison}
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
					Upscale {useCloud ? '(Cloud)' : '(Local)'}
				</button>
				<p class="hint">{useCloud ? 'Uses CodeFormer for upscaling and face restoration' : 'Upscales using local Real-ESRGAN model'}</p>
			{/if}
			
			{#if error}
				<div class="error-message">{error}</div>
			{/if}
		</div>
	{:else}
		<div class="comparison-content">
			<BeforeAfterSlider 
				beforeImage={$aiState.originalImage}
				afterImage={$aiState.processedImage}
				position={comparisonPosition}
				onChange={handleComparisonChange}
			/>
			
			<button class="upscale-btn" on:click={handleUpscale}>
				<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
				Upscale {useCloud ? '(Cloud)' : '(Local)'}
			</button>
			<p class="hint">{useCloud ? 'Uses CodeFormer for upscaling and face restoration' : 'Upscales using local Real-ESRGAN model'}</p>
		</div>
	{/if}
</div>

<style>
	.upscale-controls {
		padding: var(--space-4) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.mode-toggle {
		display: flex;
		background: var(--color-surface-secondary);
		border-radius: var(--radius-md);
		padding: var(--space-1);
	}
	
	.mode-btn {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.mode-btn.active {
		background: var(--color-surface);
		color: var(--color-text-primary);
		font-weight: var(--font-weight-medium);
	}
	
	.cloud-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-3);
		background: var(--color-surface-secondary);
		border-radius: var(--radius-md);
	}
	
	.cloud-badge {
		font-size: var(--font-size-xs);
		color: var(--color-success);
		font-weight: var(--font-weight-medium);
	}
	
	.controls-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.comparison-content {
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
