<script>
	import Slider from '$lib/components/ui/Slider.svelte';

	export let quoteStyle = 'none';
	export let quoteSize = 5;
	export let onChange = (key, value) => {};

	const QUOTE_STYLES = [
		{ id: 'none', icon: '/icons/icon-none.svg', label: 'No quote' },
		{ id: 'serif', icon: '/icons/icon-quote-serif.svg', label: 'Serif quote' },
		{ id: 'slab', icon: '/icons/icon-quote-slab.svg', label: 'Slab quote' }
	];

	const DEFAULTS = {
		quoteSize: 5
	};

	function selectStyle(style) {
		onChange('text1QuoteStyle', style);
	}

	function resetSlider(key) {
		onChange(key === 'quoteSize' ? 'text1QuoteSize' : key, DEFAULTS[key]);
	}
</script>

<div class="quote-controls">
	<div class="style-row">
		{#each QUOTE_STYLES as style}
			<button
				class="style-btn"
				class:active={quoteStyle === style.id}
				class:is-none={style.id === 'none'}
				on:click={() => selectStyle(style.id)}
				aria-label={style.label}
			>
				<img src={style.icon} alt="" class="style-icon" />
			</button>
		{/each}
	</div>

	<div class="slider-row" class:disabled={quoteStyle === 'none'}>
		<Slider 
			label="Size"
			min={1}
			max={10}
			value={quoteSize}
			onChange={(val) => quoteStyle !== 'none' && onChange('text1QuoteSize', val)}
		/>
		<button class="reset-btn" on:click={() => resetSlider('quoteSize')} aria-label="Reset size" disabled={quoteStyle === 'none'}>
			<img src="/icons/icon-reset.svg" alt="" class="reset-icon" />
		</button>
	</div>
</div>

<style>
	.quote-controls {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.style-row {
		display: flex;
		gap: var(--space-2);
	}

	.style-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border: 1px solid #555555;
		border-radius: var(--radius-md);
		background: var(--color-surface);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.style-btn:hover:not(.active) {
		border-color: #555555;
	}

	.style-btn.active {
		border-color: var(--color-primary);
		background: var(--color-primary-light);
	}

	.style-icon {
		width: 20px;
		height: 20px;
	}

	.slider-row {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
		padding-bottom: var(--space-1);
	}

	.slider-row.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	.slider-row :global(.slider-container) {
		flex: 1;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		flex-shrink: 0;
		margin-bottom: -6px;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover .reset-icon {
		opacity: 1;
	}
</style>
