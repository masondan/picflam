<script>
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import RecentImagesDrawer from '$lib/components/ai/RecentImagesDrawer.svelte';
	import { imageGen, resetImageGen } from '$lib/stores/aiStore.js';
	import { copyImageToClipboard, downloadImage } from '$lib/utils/imageUtils.js';
	import { incrementGeneration, isLimitReached, addToRecentImages, getRecentImages, MONTHLY_LIMIT, getGenerationCount } from '$lib/utils/generationStorage.js';

	let showRecentDrawer = false;
	let showAspectDropdown = false;
	let aspectDropdownEl;

	const aspectOptions = [
		{ id: '16:9', label: 'Horizontal', icon: '/icons/icon-horizontal.svg' },
		{ id: '1:1', label: 'Square', icon: '/icons/icon-square.svg' },
		{ id: '9:16', label: 'Vertical', icon: '/icons/icon-vertical.svg' }
	];

	$: promptLength = $imageGen.prompt.length;
	$: canGenerate = promptLength >= 10 && !$imageGen.loading && !isLimitReached();
	$: selectedAspect = aspectOptions.find(a => a.id === $imageGen.aspectRatio) || aspectOptions[1];

	async function handleGenerate() {
		if (!canGenerate) return;

		imageGen.update(s => ({ ...s, loading: true, error: null }));

		try {
			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					prompt: $imageGen.prompt,
					quality: $imageGen.quality,
					aspectRatio: $imageGen.aspectRatio
				})
			});

			const result = await response.json();

			if (!response.ok || result.error) {
				handleError(result);
				return;
			}

			const count = incrementGeneration();

			addToRecentImages({
				id: crypto.randomUUID(),
				imageUrl: result.imageUrl,
				prompt: $imageGen.prompt,
				model: result.model,
				aspectRatio: $imageGen.aspectRatio,
				timestamp: result.timestamp
			});

			imageGen.update(s => ({
				...s,
				generatedImage: result.imageUrl,
				loading: false,
				error: null,
				generationsThisMonth: count
			}));
		} catch (err) {
			imageGen.update(s => ({
				...s,
				loading: false,
				error: 'Network error. Check your connection and try again.'
			}));
		}
	}

	function handleError(result) {
		let message;
		switch (result.error) {
			case 'timeout':
				message = 'This is taking longer than expected. Please try again.';
				break;
			case 'rateLimit':
				message = `Monthly generation limit reached (${MONTHLY_LIMIT}/${MONTHLY_LIMIT}).`;
				break;
			case 'contentRestriction':
				message = 'Prompt contains restricted content. Try rephrasing.';
				break;
			default:
				message = result.message || 'Something went wrong. Please try again.';
		}
		imageGen.update(s => ({ ...s, loading: false, error: message }));
	}

	async function handleCopy() {
		if ($imageGen.generatedImage) {
			await copyImageToClipboard($imageGen.generatedImage);
		}
	}

	function handleExport() {
		if ($imageGen.generatedImage) {
			const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
			downloadImage($imageGen.generatedImage, `picflam-gen-${timestamp}.png`);
		}
	}

	function handleStartAgain() {
		resetImageGen();
	}

	function toggleAspectDropdown() {
		showAspectDropdown = !showAspectDropdown;
	}

	function selectAspect(id) {
		imageGen.update(s => ({ ...s, aspectRatio: id }));
		showAspectDropdown = false;
	}

	function handleWindowClick(e) {
		if (showAspectDropdown && aspectDropdownEl && !aspectDropdownEl.contains(e.target)) {
			showAspectDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleWindowClick} />

<div class="image-gen-tab">
	<ActionBar
		showUndoRedo={false}
		onStartAgain={handleStartAgain}
		onCopy={handleCopy}
		onExport={handleExport}
	/>

	<div class="image-display">
		{#if $imageGen.generatedImage}
			<img src={$imageGen.generatedImage} alt="Generated" class="generated-image" />
		{:else}
			<div class="placeholder">
				<span class="placeholder-icon" style="--icon-url: url(/icons/icon-ai.svg)"></span>
			</div>
		{/if}
	</div>

	<div class="controls">
		<div class="prompt-wrapper">
			<textarea
				class="prompt-input"
				placeholder="Describe the image you want to create..."
				bind:value={$imageGen.prompt}
				maxlength="2000"
				rows="3"
			></textarea>
			<span class="char-count" class:warning={promptLength > 1800}>{promptLength}/2000</span>
		</div>

		<div class="options-row">
			<div class="quality-toggle">
				<button
					class="toggle-btn"
					class:active={$imageGen.quality === 'fast'}
					on:click={() => imageGen.update(s => ({ ...s, quality: 'fast' }))}
				>
					Faster
				</button>
				<button
					class="toggle-btn"
					class:active={$imageGen.quality === 'better'}
					on:click={() => imageGen.update(s => ({ ...s, quality: 'better' }))}
				>
					Better
				</button>
			</div>

			<div class="aspect-dropdown" bind:this={aspectDropdownEl}>
				<button class="aspect-btn" on:click={toggleAspectDropdown}>
					<span class="aspect-label">
						<img src={selectedAspect.icon} alt="" class="aspect-icon" />
						<span>{selectedAspect.label}</span>
					</span>
					<img 
						src={showAspectDropdown ? '/icons/icon-collapse.svg' : '/icons/icon-expand.svg'} 
						alt="" 
						class="dropdown-icon" 
					/>
				</button>
				{#if showAspectDropdown}
					<div class="aspect-menu">
						{#each aspectOptions as option}
							<button
								class="aspect-option"
								class:selected={option.id === $imageGen.aspectRatio}
								on:click={() => selectAspect(option.id)}
							>
								<span class="aspect-option-icon" style="--icon-url: url({option.icon})"></span>
								<span>{option.label}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<button
			class="generate-btn"
			disabled={!canGenerate}
			on:click={handleGenerate}
		>
			{#if $imageGen.loading}
				<span class="spinner"></span>
				Generating...
			{:else}
				<img src="/icons/icon-ai.svg" alt="" class="btn-icon" />
				Generate
			{/if}
		</button>

		<div class="gen-footer">
			<span class="gen-counter">{$imageGen.generationsThisMonth}/{MONTHLY_LIMIT}</span>
			<button class="recent-btn" on:click={() => showRecentDrawer = true}>
				Recent images
			</button>
		</div>

		{#if $imageGen.error}
			<div class="error-message">{$imageGen.error}</div>
		{/if}
	</div>

	{#if showRecentDrawer}
		<RecentImagesDrawer onClose={() => showRecentDrawer = false} />
	{/if}
</div>

<style>
	.image-gen-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.image-display {
		width: 100%;
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: radial-gradient(circle at center, #f5f0fa, #efefef);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.generated-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-icon {
		width: 192px;
		height: 192px;
		opacity: 0.15;
		display: inline-block;
		background-color: var(--color-primary);
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
		animation: breathe 5s ease-in-out infinite;
	}

	@keyframes breathe {
		0%, 100% { opacity: 0.1; transform: scale(1); }
		50% { opacity: 0.2; transform: scale(1.05); }
	}

	.controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.prompt-wrapper {
		position: relative;
	}

	.prompt-input {
		width: 100%;
		padding: var(--space-3);
		padding-bottom: var(--space-6);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: var(--font-family-base);
		font-size: var(--font-size-sm);
		resize: vertical;
		background: var(--color-surface);
		color: var(--color-text-primary);
		box-sizing: border-box;
	}

	.prompt-input::placeholder {
		color: var(--color-border);
	}

	.prompt-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.char-count {
		position: absolute;
		bottom: var(--space-2);
		right: var(--space-3);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.char-count.warning {
		color: var(--color-error);
	}

	.options-row {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		margin-top: var(--space-1);
		margin-bottom: var(--space-2);
	}

	.quality-toggle {
		flex: 1;
		display: flex;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.toggle-btn {
		flex: 1;
		padding: var(--space-2) var(--space-4);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		border: none;
		background: var(--color-surface);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.toggle-btn.active {
		background: var(--color-primary);
		color: var(--color-text-inverse);
	}

	.aspect-dropdown {
		flex: 1;
		position: relative;
	}

	.aspect-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		cursor: pointer;
	}

	.aspect-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.aspect-icon {
		width: 18px;
		height: 18px;
		filter: brightness(0) saturate(100%) invert(33%);
	}

	.dropdown-icon {
		width: 16px;
		height: 16px;
		filter: brightness(0) saturate(100%) invert(33%);
	}

	.aspect-menu {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: var(--space-1);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		z-index: 10;
		min-width: 100%;
	}

	.aspect-option {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: none;
		background: none;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: background var(--transition-fast);
	}

	.aspect-option:hover {
		background: var(--color-border-light);
	}

	.aspect-option.selected {
		color: var(--color-primary);
		font-weight: var(--font-weight-semibold);
	}

	.aspect-option-icon {
		width: 18px;
		height: 18px;
		display: inline-block;
		background-color: #555555;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}

	.aspect-option.selected .aspect-option-icon {
		background-color: var(--color-primary);
	}

	.generate-btn {
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

	.generate-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.generate-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
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
		to { transform: rotate(360deg); }
	}

	.gen-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.gen-counter {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.recent-btn {
		background: none;
		border: none;
		color: var(--color-primary);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-bold);
		cursor: pointer;
		padding: 0;
	}

	.recent-btn:hover {
		text-decoration: underline;
	}

	.error-message {
		padding: var(--space-3) var(--space-4);
		background-color: rgba(220, 20, 60, 0.1);
		color: var(--color-error);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
	}
</style>
