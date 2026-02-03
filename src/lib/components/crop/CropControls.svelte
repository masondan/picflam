<script>
	import ToggleButtonGroup from '$lib/components/ui/ToggleButtonGroup.svelte';
	import InputField from '$lib/components/ui/InputField.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';

	export let aspectRatio = '9:16';
	export let cropWidth = 1080;
	export let cropHeight = 1920;
	export let ratioLocked = true;
	export let scale = 100;
	export let cropPending = false;
	export let onRatioChange = (ratio) => {};
	export let onDimensionsChange = ({ width, height }) => {};
	export let onLockToggle = () => {};
	export let onFlip = () => {};
	export let onRotate = () => {};
	export let onScaleChange = (scale) => {};
	export let onApply = () => {};

	const ratioOptions = [
		{ id: '9:16', label: '9:16', icon: 'icon-vertical' },
		{ id: '1:1', label: '1:1', icon: 'icon-square' },
		{ id: '16:9', label: '16:9', icon: 'icon-horizontal' },
		{ id: 'custom', label: 'Custom', icon: 'icon-custom' }
	];

	function handleWidthChange(val) {
		const newWidth = parseInt(val) || 0;
		onDimensionsChange({ width: newWidth, height: cropHeight });
	}

	function handleHeightChange(val) {
		const newHeight = parseInt(val) || 0;
		onDimensionsChange({ width: cropWidth, height: newHeight });
	}
</script>

<div class="crop-controls">
	<ToggleButtonGroup 
		options={ratioOptions} 
		value={aspectRatio} 
		onChange={onRatioChange}
		showLabels={true}
	/>

	<div class="dimensions-row">
		<div class="dimension-input">
			<InputField 
				label="Width"
				type="number"
				value={cropWidth.toString()}
				onChange={handleWidthChange}
			/>
		</div>

		<button 
			class="icon-btn"
			on:click={onLockToggle}
			aria-label={ratioLocked ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
		>
			<img 
				src="/icons/{ratioLocked ? 'icon-lock' : 'icon-unlock'}.svg" 
				alt="" 
				class="icon-btn-img"
			/>
		</button>

		<div class="dimension-input">
			<InputField 
				label="Height"
				type="number"
				value={cropHeight.toString()}
				onChange={handleHeightChange}
			/>
		</div>

		<button 
			class="icon-btn"
			on:click={onFlip}
			aria-label="Flip horizontal"
		>
			<img src="/icons/icon-flip-horizontal.svg" alt="" class="icon-btn-img" />
		</button>

		<button 
			class="icon-btn"
			on:click={onRotate}
			aria-label="Rotate"
		>
			<img src="/icons/icon-rotate.svg" alt="" class="icon-btn-img" />
		</button>
	</div>

	<Slider 
		label="Scale"
		min={50}
		max={200}
		value={scale}
		step={1}
		showValue={true}
		onChange={onScaleChange}
	/>

	{#if cropPending}
		<div class="apply-row">
			<button class="btn-apply" on:click={onApply}>Apply</button>
		</div>
	{/if}
</div>

<style>
	.crop-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.dimensions-row {
		display: flex;
		align-items: flex-end;
		gap: var(--space-2);
	}

	.dimension-input {
		flex: 1;
		min-width: 0;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		min-width: 44px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.icon-btn:hover {
		background-color: var(--color-border-light);
	}

	.icon-btn-img {
		width: 20px;
		height: 20px;
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.apply-row {
		display: flex;
		justify-content: flex-end;
	}

	.btn-apply {
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
		cursor: pointer;
	}

	.btn-apply:hover {
		background-color: var(--color-border-light);
	}
</style>
