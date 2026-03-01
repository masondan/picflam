<script>
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
		<span class="row-label">Quote size</span>
		<div class="slider-wrapper">
			<input 
				type="range"
				class="inline-slider"
				min={1}
				max={10}
				value={quoteSize}
				on:input={(e) => quoteStyle !== 'none' && onChange('text1QuoteSize', Number(e.target.value))}
				disabled={quoteStyle === 'none'}
			/>
		</div>
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

	.row-label {
		font-size: var(--font-size-sm);
		font-weight: 500;
		color: #1f1f1f;
		white-space: nowrap;
	}

	.slider-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
	}

	.inline-slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: var(--color-border);
		appearance: none;
		cursor: pointer;
	}

	.inline-slider::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		cursor: pointer;
		transition: transform var(--transition-fast);
	}

	.inline-slider::-webkit-slider-thumb:hover {
		transform: scale(1.15);
	}

	.inline-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: var(--radius-full);
		background: var(--color-primary);
		border: none;
		cursor: pointer;
	}

	.inline-slider:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-bottom: 0;
	}

	.slider-row.disabled {
		opacity: 0.4;
		pointer-events: none;
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
	}

	.reset-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.reset-icon {
		width: 20px;
		height: 20px;
		opacity: 0.5;
	}

	.reset-btn:hover:not(:disabled) .reset-icon {
		opacity: 1;
	}
</style>
