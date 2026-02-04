<script>
	import { aiState } from '$lib/stores/aiStore.js';
	import { enhanceImage } from '$lib/utils/aiUtils.js';
	import BeforeAfterSlider from '$lib/components/ui/BeforeAfterSlider.svelte';
	
	let isProcessing = false;
	let progressStatus = '';
	let error = null;
	let showComparison = false;
	let comparisonPosition = 50;
	
	async function handleEnhance() {
		if (!$aiState.currentImage) return;
		
		try {
			isProcessing = true;
			error = null;
			progressStatus = 'Starting...';
			aiState.startProcessing('enhance');
			
			const resultDataUrl = await enhanceImage($aiState.currentImage, (status) => {
				progressStatus = status;
			});
			
			aiState.finishProcessing(resultDataUrl);
			showComparison = true;
		} catch (err) {
			error = err.message || 'Enhancement failed';
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
	
	function handleComparisonChange(newPosition) {
		comparisonPosition = newPosition;
		aiState.setComparisonPosition(newPosition);
	}
</script>

<div class="enhance-controls">
	{#if !showComparison}
		<div class="controls-content">
			{#if isProcessing}
				<button class="processing-btn" disabled>
					<span class="spinner"></span>
					{progressStatus || 'Processing...'}
				</button>
				<button class="cancel-btn" on:click={handleCancel}>Cancel</button>
			{:else}
				<button class="enhance-btn" on:click={handleEnhance}>
					<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
					Enhance image
				</button>
				<p class="hint">Sharpens and enhances images at the same size</p>
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
			
			<button class="enhance-btn" on:click={handleEnhance}>
				<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
				Enhance image
			</button>
			<p class="hint">Sharpens and enhances images at the same size</p>
		</div>
	{/if}
</div>

<style>
	.enhance-controls {
		padding: var(--space-4) 0;
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
	
	.enhance-btn {
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
	
	.enhance-btn:hover {
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
