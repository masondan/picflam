<script>
	import { aiState } from '$lib/stores/aiStore.js';
	import { removeBackground } from '$lib/utils/aiUtils.js';
	import EraseRestoreDrawer from '$lib/components/ai/EraseRestoreDrawer.svelte';
	
	let isProcessing = false;
	let progressStatus = '';
	let error = null;
	let showEraseDrawer = false;
	
	$: hasProcessedImage = $aiState.showComparison && $aiState.processedImage;
	
	async function handleRemoveBackground() {
		if (!$aiState.originalImage) return;
		
		try {
			isProcessing = true;
			error = null;
			progressStatus = 'Starting...';
			aiState.startProcessing('background');
			
			const resultDataUrl = await removeBackground($aiState.originalImage, (status) => {
				progressStatus = status;
			});
			
			aiState.finishProcessing(resultDataUrl);
		} catch (err) {
			error = err.message || 'Background removal failed';
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
	
	function handleEraseRestore() {
		showEraseDrawer = true;
	}
	
	function handleDrawerClose() {
		showEraseDrawer = false;
	}</script>

<div class="background-controls">
	<div class="controls-content">
		{#if isProcessing}
			<button class="processing-btn" disabled>
				<span class="spinner"></span>
				{progressStatus || 'Processing...'}
			</button>
			<button class="cancel-btn" on:click={handleCancel}>Cancel</button>
		{:else}
			<button class="remove-btn" on:click={handleRemoveBackground}>
				<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
				Remove background
			</button>
		{/if}

		<button
			class="erase-btn"
			on:click={handleEraseRestore}
			disabled={!hasProcessedImage}
		>
			<img src="/icons/icon-erase.svg" alt="" class="btn-icon" />
			Erase and restore
		</button>

		{#if error}
			<div class="error-message">{error}</div>
		{/if}
	</div>

	{#if showEraseDrawer}
		<EraseRestoreDrawer
			image={$aiState.processedImage}
			originalFullImage={$aiState.originalImage}
			onClose={handleDrawerClose}
			onSave={(result) => {
				aiState.finishProcessing(result);
				showEraseDrawer = false;
			}}
		/>
	{/if}
</div>

<style>
	.background-controls {
		padding: var(--space-4) 0;
	}
	
	.controls-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.remove-btn {
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
	
	.remove-btn:hover:not(:disabled) {
		opacity: 0.9;
	}
	
	.remove-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.erase-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 38px;
		padding: 0 var(--space-4);
		background-color: var(--color-surface);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition: all var(--transition-fast);
		align-self: flex-start;
		white-space: nowrap;
		gap: var(--space-2);
	}
	
	.erase-btn .btn-icon {
		flex-shrink: 0;
		filter: brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) brightness(98%) contrast(88%);
	}
	
	.erase-btn:not(:disabled) {
		color: var(--color-primary);
		border-color: var(--color-primary);
	}
	
	.erase-btn:not(:disabled) .btn-icon {
		filter: brightness(0) saturate(100%) invert(18%) sepia(75%) saturate(1500%) hue-rotate(255deg) brightness(95%) contrast(102%);
	}
	
	.erase-btn:hover:not(:disabled) {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}
	
	.erase-btn:hover:not(:disabled) .btn-icon {
		filter: brightness(0) invert(1);
	}
	
	.erase-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		text-align: right;
		margin-top: calc(var(--space-4) * -1);
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
