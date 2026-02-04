<script>
	import Slider from '$lib/components/ui/Slider.svelte';

	/**
	 * Reusable brush editor component for painting operations (blur, erase/restore)
	 * Handles control selection, sliders with reset buttons, zoom, and nudge
	 */

	export let controls = [];
	export let activeControl = null;
	export let controlValues = {};
	export let zoomLevel = 1;
	export let onControlChange = (controlId, val) => {};
	export let onControlReset = (controlId) => {};
	export let onZoomChange = (level) => {};
	export let onResetZoom = () => {};
	export let onNudge = (direction) => {};
	export let sliderMin = 1;
	export let sliderMax = 100;

	$: currentValue = activeControl ? controlValues[activeControl] || 50 : 50;

	function selectControl(id) {
		activeControl = id;
	}

	function handleControlChange(val) {
		if (activeControl) {
			onControlChange(activeControl, val);
		}
	}

	function handleReset() {
		if (activeControl) {
			onControlReset(activeControl);
		}
	}
</script>

<div class="brush-editor">
	<!-- Control selection buttons -->
	{#if controls.length > 0}
		<div class="control-row">
			{#each controls as item}
				<button
					class="control-btn"
					class:active={activeControl === item.id}
					on:click={() => selectControl(item.id)}
				>
					{item.label}
				</button>
			{/each}
			<!-- Slot for additional controls (invert checkbox, erase/restore toggle, etc) -->
			<div class="control-extras">
				<slot name="extras" />
			</div>
		</div>
	{/if}

	<!-- Active control slider with reset -->
	{#if activeControl}
		<div class="slider-row">
			<div class="slider-track">
				<Slider
					min={sliderMin}
					max={sliderMax}
					value={currentValue}
					step={1}
					onChange={handleControlChange}
				/>
			</div>
			<button class="reset-btn" on:click={handleReset} aria-label="Reset">
				<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
			</button>
		</div>
	{/if}

	<!-- Zoom controls -->
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

	<!-- Nudge controls -->
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

	<!-- Slot for additional content (action buttons, etc) -->
	<slot />
</div>

<style>
	.brush-editor {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.control-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.control-btn {
		background: none;
		border: none;
		padding: var(--space-1) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: color var(--transition-fast);
		white-space: nowrap;
	}

	.control-btn.active {
		color: var(--color-primary);
		font-weight: var(--font-weight-medium);
	}

	.control-btn:hover:not(.active) {
		color: var(--color-text-primary);
	}

	.control-extras {
		margin-left: auto;
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
