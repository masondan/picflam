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
		centered={true}
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

	<div class="scale-controls">
		<span class="scale-label">Scale</span>
		<div class="slider-track">
			<Slider
				min={50}
				max={200}
				value={scale}
				step={1}
				onChange={onScaleChange}
			/>
		</div>
		<button class="reset-btn" on:click={() => onScaleChange(100)} aria-label="Reset scale to 100%">
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>
</div>

<style>
	.crop-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		margin-top: var(--space-2);
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

	.scale-controls {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.scale-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		flex-shrink: 0;
		min-width: 65px;
		padding-top: 2px;
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
		flex-shrink: 0;
		padding: 0;
		padding-top: 2px;
	}

	.reset-btn:hover {
		opacity: 1;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		min-width: 38px;
		border: 1px solid #555555;
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
		filter: brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

</style>
