<script>
	export let label = '';
	export let min = 0;
	export let max = 100;
	export let value = 50;
	export let step = 1;
	export let showValue = false;
	export let onChange = (val) => {};
	export let onInteractionStart = () => {};
	export let onInteractionEnd = () => {};
	
	function handleInput(e) {
		const newValue = Number(e.target.value);
		onChange(newValue);
	}
	
	function handleStart() {
		onInteractionStart();
	}
	
	function handleEnd() {
		onInteractionEnd();
	}
</script>

<div class="slider-container">
	{#if label}
		<div class="slider-header">
			<span class="slider-label">{label}</span>
			{#if showValue}
				<span class="slider-value">{value}</span>
			{/if}
		</div>
	{/if}
	<input 
		type="range" 
		class="slider"
		{min}
		{max}
		{step}
		{value}
		on:input={handleInput}
		on:mousedown={handleStart}
		on:touchstart={handleStart}
		on:mouseup={handleEnd}
		on:touchend={handleEnd}
	/>
</div>

<style>
	.slider-container {
		width: 100%;
	}
	
	.slider-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}
	
	.slider-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
	}
	
	.slider-value {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
	
	.slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--color-border);
		appearance: none;
		cursor: pointer;
	}
	
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-text-secondary);
		cursor: pointer;
		transition: transform var(--transition-fast);
	}
	
	.slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}
	
	.slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-text-secondary);
		border: none;
		cursor: pointer;
	}
</style>
