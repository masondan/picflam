<script>
	import ColorSwatch from '$lib/components/ui/ColorSwatch.svelte';
	import { CANVAS_COLORS, GRADIENT_DIRECTIONS } from '$lib/stores/designStore.js';

	export let background = { type: 'solid', value: '#FFFFFF', direction: 'down', gradientColors: ['#5422b0', '#4B0082'] };
	export let onBackgroundChange = (bg) => {};

	const gradientPresets = CANVAS_COLORS.gradients.map(g => {
		const match = g.match(/#[A-Fa-f0-9]{6}/g);
		return match ? [match[0], match[1]] : ['#5422b0', '#4B0082'];
	});

	function selectSolidColor(color) {
		onBackgroundChange({ ...background, type: 'solid', value: color });
	}

	function selectGradient(index) {
		const colors = gradientPresets[index];
		const direction = GRADIENT_DIRECTIONS[background.direction] || 'to bottom';
		onBackgroundChange({
			...background,
			type: 'gradient',
			value: `linear-gradient(${direction}, ${colors[0]} 0%, ${colors[1]} 100%)`,
			gradientColors: colors
		});
	}

	function selectDirection(dir) {
		const direction = GRADIENT_DIRECTIONS[dir];
		const colors = background.gradientColors || ['#5422b0', '#4B0082'];
		onBackgroundChange({
			...background,
			direction: dir,
			value: `linear-gradient(${direction}, ${colors[0]} 0%, ${colors[1]} 100%)`
		});
	}

	function handleCustomSolidColor(color) {
		onBackgroundChange({ ...background, type: 'solid', value: color });
	}

	function handleGradientColorChange(index, color) {
		const colors = [...(background.gradientColors || ['#5422b0', '#4B0082'])];
		colors[index] = color;
		const direction = GRADIENT_DIRECTIONS[background.direction] || 'to bottom';
		onBackgroundChange({
			...background,
			type: 'gradient',
			value: `linear-gradient(${direction}, ${colors[0]} 0%, ${colors[1]} 100%)`,
			gradientColors: colors
		});
	}

	$: currentGradientValue = background.type === 'gradient' 
		? `linear-gradient(${GRADIENT_DIRECTIONS[background.direction] || 'to bottom'}, ${background.gradientColors?.[0] || '#5422b0'} 0%, ${background.gradientColors?.[1] || '#4B0082'} 100%)`
		: `linear-gradient(to bottom, ${gradientPresets[0][0]} 0%, ${gradientPresets[0][1]} 100%)`;
</script>

<div class="background-controls">
	<div class="section">
		<div class="color-row">
			<ColorSwatch 
				colors={CANVAS_COLORS.solids}
				value={background.type === 'solid' ? background.value : ''}
				onChange={selectSolidColor}
				showRainbow={true}
			/>
		</div>
	</div>

	<div class="section">
		<div class="gradient-row">
			{#each gradientPresets as colors, index}
				{@const isActive = background.type === 'gradient' && 
					background.gradientColors?.[0] === colors[0] && 
					background.gradientColors?.[1] === colors[1]}
				<button 
					class="gradient-swatch"
					class:active={isActive}
					style="background: linear-gradient(135deg, {colors[0]} 0%, {colors[1]} 100%); border-color: {colors[0]}; {isActive ? `box-shadow: inset 0 0 0 2px white;` : ''}"
					on:click={() => selectGradient(index)}
					aria-label="Select gradient"
				></button>
			{/each}
		</div>
	</div>

	<div class="section">
		<div class="gradient-preview-row">
			<button 
				class="gradient-endpoint"
				style="background-color: {background.gradientColors?.[0] || '#5422b0'};"
				on:click={() => {
					const input = document.createElement('input');
					input.type = 'color';
					input.value = background.gradientColors?.[0] || '#5422b0';
					input.addEventListener('input', (e) => handleGradientColorChange(0, e.target.value));
					input.click();
				}}
				aria-label="Edit start color"
			></button>
			
			<div 
				class="gradient-preview"
				style="background: {currentGradientValue};"
			></div>
			
			<button 
				class="gradient-endpoint"
				style="background-color: {background.gradientColors?.[1] || '#4B0082'};"
				on:click={() => {
					const input = document.createElement('input');
					input.type = 'color';
					input.value = background.gradientColors?.[1] || '#4B0082';
					input.addEventListener('input', (e) => handleGradientColorChange(1, e.target.value));
					input.click();
				}}
				aria-label="Edit end color"
			></button>
		</div>
	</div>

	<div class="section">
		<div class="direction-row" class:inactive={background.type !== 'gradient'}>
				<button 
					class="direction-btn"
					class:active={background.direction === 'up'}
					on:click={() => selectDirection('up')}
					aria-label="Gradient direction up"
				>
					<img src="/icons/icon-nudge-up.svg" alt="" class="direction-icon" />
				</button>
				<button 
					class="direction-btn"
					class:active={background.direction === 'down'}
					on:click={() => selectDirection('down')}
					aria-label="Gradient direction down"
				>
					<img src="/icons/icon-nudge-down.svg" alt="" class="direction-icon" />
				</button>
				<button 
					class="direction-btn"
					class:active={background.direction === 'left'}
					on:click={() => selectDirection('left')}
					aria-label="Gradient direction left"
				>
					<img src="/icons/icon-nudge-left.svg" alt="" class="direction-icon" />
				</button>
				<button 
					class="direction-btn"
					class:active={background.direction === 'right'}
					on:click={() => selectDirection('right')}
					aria-label="Gradient direction right"
				>
					<img src="/icons/icon-nudge-right.svg" alt="" class="direction-icon" />
				</button>
			</div>
		</div>
</div>

<style>
	.background-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.color-row,
	.gradient-row,
	.gradient-preview-row {
		display: flex;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		max-width: 280px;
	}

	.gradient-swatch {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-full);
		border: 3px solid transparent;
		cursor: pointer;
		transition: all var(--transition-fast);
		padding: 0;
		box-sizing: border-box;
		overflow: hidden;
	}

	.gradient-swatch:hover {
		transform: scale(1.1);
	}

	.gradient-swatch.active {
		border-color: white;
	}

	.gradient-preview-row {
		align-items: center;
	}

	.gradient-endpoint {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-full);
		border: 2px solid #555555;
		cursor: pointer;
		transition: all var(--transition-fast);
		flex-shrink: 0;
		overflow: hidden;
		padding: 0;
		background-clip: padding-box;
	}

	.gradient-endpoint:hover {
		transform: scale(1.1);
	}

	.gradient-preview {
		flex: 1 0 0;
		height: 36px;
		border-radius: 18px;
		min-width: 0;
	}

	.direction-row {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
	}

	.direction-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: 1px solid #777777;
		background: transparent;
		cursor: pointer;
		transition: all var(--transition-fast);
		border-radius: var(--radius-md);
	}

	.direction-btn:hover {
		transform: scale(1.1);
	}

	.direction-icon {
		width: 24px;
		height: 24px;
		filter: brightness(0) saturate(100%) invert(46%) sepia(0%) saturate(0%) brightness(102%) contrast(88%);
	}

	.direction-btn.active {
		border-color: var(--color-primary);
	}

	.direction-btn.active .direction-icon {
		filter: brightness(0) saturate(100%) invert(18%) sepia(75%) saturate(1500%) hue-rotate(255deg) brightness(95%) contrast(102%);
	}

	.direction-row.inactive {
		pointer-events: none;
	}

	.direction-row.inactive .direction-btn {
		border-color: #cccccc;
	}

	.direction-row.inactive .direction-icon {
		filter: brightness(0) saturate(100%) invert(54%) sepia(0%) saturate(0%) brightness(98%) contrast(88%);
	}
</style>
