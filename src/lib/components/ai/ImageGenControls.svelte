<script>
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import { imageGen, resetImageGen } from '$lib/stores/aiStore.js';
	import { copyImageToClipboard, downloadImage, generateFilename } from '$lib/utils/imageUtils.js';
	import { incrementGeneration, isLimitReached, addToRecentImages, getRecentImages, MONTHLY_LIMIT, getGenerationCount } from '$lib/utils/generationStorage.js';
	import stylePrompts from '$lib/utils/stylePrompts.json';


	export let onArchiveOpen = () => {};

	let showAspectDropdown = false;
	let aspectDropdownEl;
	let showStylePanel = false;
	let selectedStyle = 'No style';
	let styleScrollEl;
	let fileInputEl;

	const styleNames = Object.keys(stylePrompts);

	const aspectOptions = [
		{ id: '16:9', label: 'Horizontal', icon: '/icons/icon-horizontal.svg' },
		{ id: '1:1', label: 'Square', icon: '/icons/icon-square.svg' },
		{ id: '9:16', label: 'Vertical', icon: '/icons/icon-vertical.svg' }
	];

	function getStyleThumb(name) {
		if (name === 'No style') return null;
		const filename = name.toLowerCase().replace(/\s+/g, '-');
		return `/images/styles/${filename}.png`;
	}

	$: promptLength = $imageGen.prompt.length;
	$: canGenerate = promptLength >= 10 && !$imageGen.loading && !isLimitReached();
	$: selectedAspect = aspectOptions.find(a => a.id === $imageGen.aspectRatio) || aspectOptions[1];

	function fileToDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	function handleUploadClick() {
		fileInputEl?.click();
	}

	async function handleFileSelect(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) return;
		const dataUrl = await fileToDataUrl(file);
		imageGen.update(s => ({ ...s, referenceImage: dataUrl }));
		e.target.value = '';
	}

	async function handlePaste() {
		try {
			const items = await navigator.clipboard.read();
			for (const item of items) {
				const imageType = item.types.find(t => t.startsWith('image/'));
				if (imageType) {
					const blob = await item.getType(imageType);
					const dataUrl = await fileToDataUrl(blob);
					imageGen.update(s => ({ ...s, referenceImage: dataUrl }));
					return;
				}
			}
		} catch {
			// Clipboard API not available or no image
		}
	}

	function removeReferenceImage() {
		imageGen.update(s => ({ ...s, referenceImage: null }));
	}

	async function handleGenerate() {
		if (!canGenerate) return;

		imageGen.update(s => ({ ...s, loading: true, error: null }));

		try {
			const stylePrefix = stylePrompts[selectedStyle] || '';
			let fullPrompt = stylePrefix
				? `${stylePrefix}, ${$imageGen.prompt}`
				: $imageGen.prompt;

			const payload = {
				prompt: fullPrompt,
				quality: $imageGen.quality,
				aspectRatio: $imageGen.aspectRatio
			};

			if ($imageGen.referenceImage) {
				payload.referenceImage = $imageGen.referenceImage;
			}

			const response = await fetch('/api/generate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok || result.error) {
				handleError(result);
				return;
			}

			const count = incrementGeneration();

			addToRecentImages(
				{
					id: crypto.randomUUID(),
					imageUrl: result.imageUrl,
					prompt: $imageGen.prompt,
					model: result.model,
					aspectRatio: $imageGen.aspectRatio,
					timestamp: result.timestamp
				},
				'ai',
				{
					prompt: $imageGen.prompt,
					quality: $imageGen.quality,
					aspectRatio: $imageGen.aspectRatio
				}
			);

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
			downloadImage($imageGen.generatedImage, generateFilename());
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

	function toggleStylePanel() {
		showStylePanel = !showStylePanel;
	}

	function selectStyle(name) {
		selectedStyle = name;
	}

	function scrollStyles(direction) {
		if (!styleScrollEl) return;
		const scrollAmount = 140;
		styleScrollEl.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
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
		showArchive={true}
		onArchive={onArchiveOpen}
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

		<div class="prompt-wrapper" class:has-image={$imageGen.referenceImage}>
			{#if $imageGen.referenceImage}
				<div class="ref-image-area">
					<div class="ref-image-container">
						<img src={$imageGen.referenceImage} alt="Reference" class="ref-image" />
						<button class="ref-image-close" on:click={removeReferenceImage} aria-label="Remove image">
							<img src="/icons/icon-close-fill.svg" alt="" class="ref-close-icon" />
						</button>
					</div>
				</div>
			{/if}
			<textarea
				class="prompt-input"
				placeholder="Describe the image you want to create..."
				bind:value={$imageGen.prompt}
				maxlength="2000"
				rows="3"
			></textarea>
			<span class="char-count" class:warning={promptLength > 1800}>{promptLength}/2000</span>
		</div>

		<input
			type="file"
			accept="image/*"
			class="hidden-file-input"
			bind:this={fileInputEl}
			on:change={handleFileSelect}
		/>

		<div class="style-row">
			<button class="style-dropdown-btn" on:click={toggleStylePanel}>
				<img
					src={showStylePanel ? '/icons/icon-collapse.svg' : '/icons/icon-expand.svg'}
					alt=""
					class="style-chevron"
				/>
				<span class="style-label">Style:</span>
				<span class="style-value">{selectedStyle}</span>
			</button>

			<button class="action-btn" on:click={handlePaste} aria-label="Paste from clipboard">
				<img src="/icons/icon-clipboard.svg" alt="" class="action-icon" />
			</button>
			<button class="action-btn" on:click={handleUploadClick} aria-label="Upload image">
				<img src="/icons/icon-image.svg" alt="" class="action-icon" />
			</button>
		</div>

		{#if showStylePanel}
			<div class="style-panel">
				<button class="style-arrow style-arrow-left" on:click={() => scrollStyles(-1)} aria-label="Scroll left">
					<img src="/icons/icon-arrow-left-circle-fill.svg" alt="" />
				</button>
				<div class="style-scroll" bind:this={styleScrollEl}>
					{#each styleNames as name}
						<button
							class="style-thumb-btn"
							class:selected={selectedStyle === name}
							on:click={() => selectStyle(name)}
						>
							<div class="style-thumb">
								{#if name === 'No style'}
									<span class="style-thumb-icon" style="--icon-url: url(/icons/icon-ai.svg)"></span>
								{:else}
									<img src={getStyleThumb(name)} alt={name} class="style-thumb-img" />
								{/if}
							</div>
							<span class="style-thumb-label">{name}</span>
						</button>
					{/each}
				</div>
				<button class="style-arrow style-arrow-right" on:click={() => scrollStyles(1)} aria-label="Scroll right">
					<img src="/icons/icon-arrow-right-circle-fill.svg" alt="" />
				</button>
			</div>
		{/if}

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
		</div>

		{#if $imageGen.error}
			<div class="error-message">{$imageGen.error}</div>
		{/if}
	</div>

</div>

<style>
	.image-gen-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.image-display {
		width: 100%;
		aspect-ratio: 4/3;
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
		width: 148px;
		height: 148px;
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

	.options-row {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		margin-bottom: var(--space-1);
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

	.prompt-wrapper {
		position: relative;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		display: flex;
		flex-direction: column;
	}

	.prompt-wrapper:focus-within {
		border-color: var(--color-primary);
	}

	.prompt-input {
		width: 100%;
		padding: var(--space-3);
		padding-bottom: var(--space-6);
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-family-base);
		font-size: var(--font-size-sm);
		resize: vertical;
		background: transparent;
		color: var(--color-text-primary);
		box-sizing: border-box;
	}

	.prompt-wrapper.has-image .prompt-input {
		min-height: 80px;
	}

	.prompt-input::placeholder {
		color: var(--color-border);
	}

	.prompt-input:focus {
		outline: none;
	}

	.hidden-file-input {
		display: none;
	}

	.ref-image-area {
		padding: var(--space-3) var(--space-3) 0;
	}

	.ref-image-container {
		position: relative;
		width: 96px;
		height: 96px;
	}

	.ref-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--radius-sm, 4px);
		display: block;
	}

	.ref-image-close {
		position: absolute;
		top: -8px;
		right: -8px;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: none;
		cursor: pointer;
		line-height: 0;
	}

	.ref-close-icon {
		width: 24px;
		height: 24px;
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

	/* Style row */
	.style-row {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.style-dropdown-btn {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: border-color var(--transition-fast);
	}

	.style-dropdown-btn:hover {
		border-color: var(--color-primary);
	}

	.style-chevron {
		width: 16px;
		height: 16px;
		filter: brightness(0) saturate(100%) invert(33%);
		flex-shrink: 0;
	}

	.style-label {
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		white-space: nowrap;
	}

	.style-value {
		color: var(--color-text-muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.action-btn {
		width: 38px;
		height: 38px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-md);
		border: 1px solid #555555;
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	@media (hover: hover) {
		.action-btn:hover {
			background-color: var(--color-border-light);
		}
	}

	.action-icon {
		width: 22px;
		height: 22px;
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	/* Style panel */
	.style-panel {
		position: relative;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-3);
	}

	.style-scroll {
		display: flex;
		gap: var(--space-3);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 0 var(--space-1);
	}

	.style-scroll::-webkit-scrollbar {
		display: none;
	}

	.style-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-60%);
		z-index: 2;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		line-height: 0;
		opacity: 0.6;
		transition: opacity var(--transition-fast);
	}

	.style-arrow:hover {
		opacity: 1;
	}

	.style-arrow img {
		width: 28px;
		height: 28px;
	}

	.style-arrow-left {
		left: var(--space-1);
	}

	.style-arrow-right {
		right: var(--space-1);
	}

	.style-thumb-btn {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		scroll-snap-align: start;
	}

	.style-thumb {
		width: 100px;
		height: 100px;
		border-radius: var(--radius-md);
		overflow: hidden;
		border: 2px solid transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #e8e8e8;
		transition: border-color var(--transition-fast);
	}

	.style-thumb-btn.selected .style-thumb {
		border-color: var(--color-primary);
	}

	.style-thumb-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.style-thumb-icon {
		width: 40px;
		height: 40px;
		display: inline-block;
		background-color: white;
		-webkit-mask-image: var(--icon-url);
		mask-image: var(--icon-url);
		-webkit-mask-size: contain;
		mask-size: contain;
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-position: center;
		mask-position: center;
	}

	.style-thumb-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.style-thumb-btn.selected .style-thumb-label {
		color: var(--color-primary);
		font-weight: var(--font-weight-semibold);
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

	.error-message {
		padding: var(--space-3) var(--space-4);
		background-color: rgba(220, 20, 60, 0.1);
		color: var(--color-error);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
	}
</style>
