<script>
	import Slider from '$lib/components/ui/Slider.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	export let brightness = 0;
	export let shadows = 0;
	export let contrast = 0;
	export let hdr = 0;
	export let blurBrushSize = 50;
	export let zoomLevel = 1;

	export let onBrightnessChange = (val) => {};
	export let onShadowsChange = (val) => {};
	export let onContrastChange = (val) => {};
	export let onHdrChange = (val) => {};
	export let onBlurBrushSizeChange = (size) => {};
	export let onZoomChange = (level) => {};
	export let onNudge = (direction) => {};
	export let onResetZoom = () => {};
</script>

<div class="edit-controls">
	<div class="section">
		<Slider
			label="Brightness"
			min={-100}
			max={100}
			value={brightness}
			showValue={true}
			onChange={onBrightnessChange}
		/>
	</div>

	<div class="section">
		<Slider
			label="Shadows"
			min={-100}
			max={100}
			value={shadows}
			showValue={true}
			onChange={onShadowsChange}
		/>
	</div>

	<div class="section">
		<Slider
			label="Contrast"
			min={-100}
			max={100}
			value={contrast}
			showValue={true}
			onChange={onContrastChange}
		/>
	</div>

	<div class="section">
		<Slider
			label="HDR"
			min={0}
			max={100}
			value={hdr}
			showValue={true}
			onChange={onHdrChange}
		/>
	</div>

	<div class="section">
		<h3 class="section-header">Blur Brush</h3>
		<Slider
			label="Size"
			min={10}
			max={100}
			value={blurBrushSize}
			showValue={true}
			onChange={onBlurBrushSizeChange}
		/>
	</div>

	<div class="section">
		<h3 class="section-header">Zoom</h3>
		<Slider
			label="Zoom In"
			min={1}
			max={3}
			step={0.1}
			value={zoomLevel}
			showValue={true}
			onChange={onZoomChange}
		/>
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
		<Button variant="secondary" fullWidth on:click={onResetZoom}>
			Reset
		</Button>
	</div>
</div>

<style>
	.edit-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.section-header {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		margin: 0;
	}

	.nudge-row {
		display: flex;
		gap: var(--space-2);
		justify-content: center;
	}

	.nudge-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
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
		width: 20px;
		height: 20px;
	}
</style>
