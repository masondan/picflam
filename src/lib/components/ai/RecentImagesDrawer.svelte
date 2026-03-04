<script>
	import { getRecentImages, removeRecentImages } from '$lib/utils/generationStorage.js';
	import { downloadImage } from '$lib/utils/imageUtils.js';

	export let onClose = () => {};

	let recentImages = getRecentImages();
	let selectedIds = new Set();
	let selectionMode = false;
	let promptInfoImage = null;

	function toggleSelect(id) {
		if (!selectionMode) {
			selectionMode = true;
		}
		if (selectedIds.has(id)) {
			selectedIds.delete(id);
			selectedIds = selectedIds;
			if (selectedIds.size === 0) selectionMode = false;
		} else {
			selectedIds.add(id);
			selectedIds = selectedIds;
		}
	}

	function handleDownload() {
		const selected = recentImages.filter(img => selectedIds.has(img.id));
		selected.forEach((img, i) => {
			const ts = new Date(img.timestamp).toISOString().slice(0, 19).replace(/:/g, '-');
			downloadImage(img.imageUrl, `picflam-gen-${ts}.png`);
		});
		exitSelection();
	}

	function handleDelete() {
		const ids = [...selectedIds];
		recentImages = removeRecentImages(ids);
		exitSelection();
	}

	function exitSelection() {
		selectedIds = new Set();
		selectionMode = false;
	}

	function handleCopyPrompt(prompt) {
		navigator.clipboard.writeText(prompt);
	}
</script>

<div class="drawer-overlay" on:click={onClose} role="presentation">
	<div class="drawer" on:click|stopPropagation>
		<div class="drawer-header">
			<button class="close-btn" on:click={onClose} aria-label="Close">
				<img src="/icons/icon-close.svg" alt="" class="header-icon" />
			</button>
			<span class="drawer-title">Recent images</span>
			<div class="header-actions">
				{#if selectionMode}
					<button class="header-action-btn" on:click={handleDownload} aria-label="Download selected">
						<img src="/icons/icon-export.svg" alt="" class="header-icon" />
					</button>
					<button class="header-action-btn" on:click={handleDelete} aria-label="Delete selected">
						<img src="/icons/icon-trash.svg" alt="" class="header-icon" />
					</button>
				{/if}
			</div>
		</div>

		<div class="drawer-body">
			{#if recentImages.length === 0}
				<p class="empty-message">No recent images</p>
			{:else}
				<div class="image-grid">
					{#each recentImages as img}
						<div class="grid-cell">
							<button
								class="grid-item"
								class:selected={selectedIds.has(img.id)}
								on:click={() => toggleSelect(img.id)}
							>
								<img src={img.imageUrl} alt={img.prompt} class="grid-thumb" />
								{#if selectionMode}
									<div class="select-circle" class:checked={selectedIds.has(img.id)}>
										{#if selectedIds.has(img.id)}✓{/if}
									</div>
								{/if}
							</button>
							<button class="prompt-info-btn" on:click={() => promptInfoImage = img}>
								Prompt info
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

{#if promptInfoImage}
	<div class="modal-overlay" on:click={() => promptInfoImage = null} role="presentation">
		<div class="modal" on:click|stopPropagation role="dialog">
			<p class="modal-model">Model: {promptInfoImage.model}</p>
			<p class="modal-prompt">{promptInfoImage.prompt}</p>
			<div class="modal-actions">
				<button class="modal-btn secondary" on:click={() => promptInfoImage = null}>Close</button>
				<button class="modal-btn primary" on:click={() => handleCopyPrompt(promptInfoImage.prompt)}>Copy prompt</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.drawer-overlay {
		position: fixed;
		inset: 0;
		background-color: white;
		z-index: 100;
		display: flex;
		flex-direction: column;
	}

	.drawer {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: var(--app-max-width);
		bottom: 0;
		background-color: var(--color-surface);
		display: flex;
		flex-direction: column;
		animation: fadeIn 0.3s ease-out;
	}

	@media (min-width: 481px) {
		.drawer {
			box-shadow: var(--shadow-lg);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		flex-shrink: 0;
		border-bottom: 1px solid var(--color-border-light);
	}

	.close-btn {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-fast);
	}

	.close-btn:hover {
		background-color: var(--color-border-light);
	}

	.header-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.drawer-title {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
		min-width: 72px;
		justify-content: flex-end;
	}

	.header-action-btn {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		background: none;
		border: none;
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.header-action-btn:hover {
		background-color: var(--color-border-light);
	}

	.drawer-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
	}

	.empty-message {
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--font-size-sm);
		padding: var(--space-8) 0;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.grid-cell {
		display: flex;
		flex-direction: column;
	}

	.grid-item {
		position: relative;
		aspect-ratio: 1;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 2px solid transparent;
		padding: 0;
		background: none;
		cursor: pointer;
		transition: border-color var(--transition-fast);
	}

	.grid-item.selected {
		border-color: var(--color-primary);
	}

	.grid-thumb {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.select-circle {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 2px solid white;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: white;
		font-weight: var(--font-weight-bold);
	}

	.select-circle.checked {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	.prompt-info-btn {
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-bold);
		cursor: pointer;
		padding: var(--space-1) 0;
		text-align: left;
	}

	.prompt-info-btn:hover {
		text-decoration: underline;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 200;
		padding: var(--space-4);
	}

	.modal {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		max-width: 400px;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.modal-model {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.modal-prompt {
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
		line-height: var(--line-height-relaxed);
		margin: 0;
		word-break: break-word;
	}

	.modal-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
	}

	.modal-btn {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}

	.modal-btn.secondary {
		background: none;
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
	}

	.modal-btn.primary {
		background: var(--color-primary);
		border: none;
		color: var(--color-text-inverse);
	}

	.modal-btn:hover {
		opacity: 0.9;
	}
</style>
