<script>
	import Slider from '$lib/components/ui/Slider.svelte';

	export let brightness = 0;
	export let shadows = 0;
	export let contrast = 0;
	export let hdr = 0;
	export let blurBrushSize = 50;
	export let blurStrength = 50;
	export let blurSoften = 50;
	export let blurInvert = false;
	export let zoomLevel = 1;
	export let blurEnabled = false;

	export let onBrightnessChange = (val) => {};
	export let onShadowsChange = (val) => {};
	export let onContrastChange = (val) => {};
	export let onHdrChange = (val) => {};
	export let onBlurBrushSizeChange = (size) => {};
	export let onBlurStrengthChange = (val) => {};
	export let onBlurSoftenChange = (val) => {};
	export let onBlurInvertChange = (val) => {};
	export let onZoomChange = (level) => {};
	export let onNudge = (direction) => {};
	export let onResetZoom = () => {};
	export let onBlurToggle = (enabled) => {};
	export let onBrushPreviewChange = (visible) => {};
	export let onEditEnd = () => {};

	let activeEnhancement = 'brightness';
	let blurExpanded = blurEnabled;
	let activeBlurControl = 'brushSize';
	


	const enhancements = [
		{ id: 'brightness', label: 'Brightness' },
		{ id: 'shadows', label: 'Shadows' },
		{ id: 'contrast', label: 'Contrast' },
		{ id: 'hdr', label: 'HDR' }
	];

	const blurControls = [
		{ id: 'brushSize', label: 'Brush size' },
		{ id: 'strength', label: 'Strength' },
		{ id: 'soften', label: 'Soften edges' }
	];

	$: currentValue = (() => {
		switch (activeEnhancement) {
			case 'brightness': return brightness;
			case 'shadows': return shadows;
			case 'contrast': return contrast;
			case 'hdr': return hdr;
			default: return 0;
		}
	})();
	$: sliderMin = activeEnhancement === 'hdr' ? 0 : -100;
	$: sliderMax = 100;

	$: currentBlurValue = (() => {
		switch (activeBlurControl) {
			case 'brushSize': return blurBrushSize;
			case 'strength': return blurStrength;
			case 'soften': return blurSoften;
			default: return 50;
		}
	})();
	$: blurSliderMin = 1;
	$: blurSliderMax = 100;

	function handleEnhancementChange(val) {
		switch (activeEnhancement) {
			case 'brightness': onBrightnessChange(val); break;
			case 'shadows': onShadowsChange(val); break;
			case 'contrast': onContrastChange(val); break;
			case 'hdr': onHdrChange(val); break;
		}
	}

	function handleResetEnhancement() {
		handleEnhancementChange(0);
	}

	function handleBlurControlChange(val) {
		switch (activeBlurControl) {
			case 'brushSize': onBlurBrushSizeChange(val); break;
			case 'strength': onBlurStrengthChange(val); break;
			case 'soften': onBlurSoftenChange(val); break;
		}
	}

	function handleResetBlurControl() {
		handleBlurControlChange(50);
	}

	function handleBlurToggle() {
		const newState = !blurEnabled;
		onBlurToggle(newState);
		blurExpanded = newState;
	}

	function toggleBlurExpanded() {
		if (blurEnabled) {
			blurExpanded = !blurExpanded;
		}
	}

	function handleInvertToggle() {
		onBlurInvertChange(!blurInvert);
	}

	function selectEnhancement(id) {
		activeEnhancement = id;
		blurExpanded = false;
	}

	function selectBlurControl(id) {
		activeBlurControl = id;
	}

	function handleEnhancementSliderEnd() {
		onEditEnd();
	}

	function handleBrushSliderStart() {
		if (activeBlurControl === 'brushSize') {
			onBrushPreviewChange(true);
		}
	}

	function handleBrushSliderEnd() {
		onBrushPreviewChange(false);
		onEditEnd();
	}
</script>

<div class="edit-controls">
	<div class="enhancement-row">
		{#each enhancements as item}
			<button 
				class="enhancement-btn"
				class:active={activeEnhancement === item.id}
				on:click={() => selectEnhancement(item.id)}
			>
				{item.label}
			</button>
		{/each}
	</div>

	<div class="slider-row">
		<div class="slider-track">
			<Slider
				min={sliderMin}
				max={sliderMax}
				value={currentValue}
				step={1}
				onChange={handleEnhancementChange}
				onInteractionEnd={handleEnhancementSliderEnd}
			/>
		</div>
		<button class="reset-btn" on:click={handleResetEnhancement} aria-label="Reset">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>

	<div class="blur-section">
		<div class="blur-header">
			<button 
				class="chevron-btn" 
				on:click={toggleBlurExpanded}
				disabled={!blurEnabled}
				aria-label={blurExpanded ? 'Collapse' : 'Expand'}
			>
				<img 
					src="/icons/{blurExpanded ? 'icon-collapse' : 'icon-expand'}.svg" 
					alt="" 
					class="chevron-icon"
					class:disabled={!blurEnabled}
				/>
			</button>
			<span class="blur-label">Blur</span>
			<button 
				class="toggle-switch"
				class:active={blurEnabled}
				on:click={handleBlurToggle}
				aria-label={blurEnabled ? 'Disable blur' : 'Enable blur'}
			>
				<span class="toggle-thumb"></span>
			</button>
		</div>

		{#if blurExpanded && blurEnabled}
			<div class="blur-controls">
				<div class="blur-control-row">
					{#each blurControls as item}
						<button 
							class="blur-control-btn"
							class:active={activeBlurControl === item.id}
							on:click={() => selectBlurControl(item.id)}
						>
							{item.label}
						</button>
					{/each}
					<label class="invert-checkbox">
						<input 
							type="checkbox" 
							checked={blurInvert}
							on:change={handleInvertToggle}
						/>
						<span class="checkbox-label">Invert</span>
					</label>
				</div>

				<div class="slider-row">
					<div class="slider-track">
						<Slider
							min={blurSliderMin}
							max={blurSliderMax}
							value={currentBlurValue}
							step={1}
							onChange={handleBlurControlChange}
							onInteractionStart={handleBrushSliderStart}
							onInteractionEnd={handleBrushSliderEnd}
						/>
					</div>
					<button class="reset-btn" on:click={handleResetBlurControl} aria-label="Reset">
						<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
					</button>
				</div>

				<div class="zoom-row">
					<span class="zoom-label">Zoom in</span>
					<div class="zoom-slider-row">
						<div class="slider-track">
							<Slider
								min={1}
								max={3}
								step={0.1}
								value={zoomLevel}
								onChange={onZoomChange}
							/>
						</div>
						<button class="reset-btn" on:click={onResetZoom} aria-label="Reset zoom">
							<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
						</button>
					</div>
				</div>

				<div class="nudge-row">
					<button class="nudge-btn" on:click={() => onNudge('up')} aria-label="Nudge up">
						<img src="/icons/icon-nudge-up.svg" alt="" />
					</button>
					<button class="nudge-btn" on:click={() => onNudge('down')} aria-label="Nudge down">
						<img src="/icons/icon-nudge-down.svg" alt="" />
					</button>
					<button class="nudge-btn" on:click={() => onNudge('left')} aria-label="Nudge left">
						<img src="/icons/icon-nudge-left.svg" alt="" />
					</button>
					<button class="nudge-btn" on:click={() => onNudge('right')} aria-label="Nudge right">
						<img src="/icons/icon-nudge-right.svg" alt="" />
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.edit-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.enhancement-row {
		display: flex;
		gap: var(--space-4);
	}

	.enhancement-btn {
		background: none;
		border: none;
		padding: var(--space-1) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color var(--transition-fast);
	}

	.enhancement-btn.active {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
	}

	.enhancement-btn:hover:not(.active) {
		color: var(--color-text-primary);
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.slider-track {
		flex: 1;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: none;
		border: none;
		cursor: pointer;
		opacity: 0.6;
		transition: opacity var(--transition-fast);
	}

	.reset-btn:hover {
		opacity: 1;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
	}

	.blur-section {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.blur-header {
		display: flex;
		align-items: center;
		padding: var(--space-3);
		gap: var(--space-2);
	}

	.chevron-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		background: none;
		border: none;
		cursor: pointer;
	}

	.chevron-btn:disabled {
		cursor: default;
	}

	.chevron-icon {
		width: 16px;
		height: 16px;
	}

	.chevron-icon.disabled {
		opacity: 0.4;
	}

	.blur-label {
		flex: 1;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.toggle-switch {
		position: relative;
		width: 44px;
		height: 24px;
		background-color: var(--color-border);
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.toggle-switch.active {
		background-color: var(--color-primary);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background-color: white;
		border-radius: var(--radius-full);
		transition: transform var(--transition-fast);
	}

	.toggle-switch.active .toggle-thumb {
		transform: translateX(20px);
	}

	.blur-controls {
		padding: 0 var(--space-3) var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		border-top: 1px solid var(--color-border-light);
	}

	.blur-control-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-top: var(--space-2);
	}

	.blur-control-btn {
		background: none;
		border: none;
		padding: var(--space-1) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color var(--transition-fast);
		white-space: nowrap;
	}

	.blur-control-btn.active {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
	}

	.blur-control-btn:hover:not(.active) {
		color: var(--color-text-primary);
	}

	.invert-checkbox {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		margin-left: auto;
	}

	.invert-checkbox input {
		width: 18px;
		height: 18px;
		accent-color: var(--color-primary);
		cursor: pointer;
	}

	.checkbox-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.zoom-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.zoom-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}

	.zoom-slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.nudge-row {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		padding-top: var(--space-2);
	}

	.nudge-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		cursor: pointer;
		transition: background-color var(--transition-fast);
	}

	.nudge-btn:hover {
		background-color: var(--color-border-light);
	}

	.nudge-btn img {
		width: 16px;
		height: 16px;
	}
</style>
