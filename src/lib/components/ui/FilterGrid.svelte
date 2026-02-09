<script>
	import { onMount } from 'svelte';

	export let filters = [];
	export let value = 'normal';
	export let imageUrl = '';
	export let onChange = (filter) => {};

	let scrollContainer;
	let canScrollLeft = false;
	let canScrollRight = true;
	let isDesktop = false;

	onMount(() => {
		isDesktop = window.innerWidth >= 1024;
		window.addEventListener('resize', checkViewport);
		return () => window.removeEventListener('resize', checkViewport);
	});

	function checkViewport() {
		isDesktop = window.innerWidth >= 1024;
	}

	function updateScrollButtons() {
		if (!scrollContainer) return;
		canScrollLeft = scrollContainer.scrollLeft > 0;
		canScrollRight = scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10;
	}

	function scroll(direction) {
		if (!scrollContainer) return;
		const amount = 300;
		scrollContainer.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
	}

	function shouldShowSeparator(index) {
		if (index === 0) return false;
		const currentFilter = filters[index];
		const previousFilter = filters[index - 1];
		
		// Show separator after Normal and Greyscale explicitly
		if (previousFilter?.id === 'normal' || previousFilter?.id === 'greyscale') {
			return true;
		}
		
		// Show separator between different color groups
		const currentGroup = currentFilter.group;
		const previousGroup = previousFilter.group;
		return currentGroup !== previousGroup;
	}

	$: if (scrollContainer) {
		scrollContainer.addEventListener('scroll', updateScrollButtons);
		setTimeout(updateScrollButtons, 0);
	}
</script>

<div class="filter-grid-wrapper">
	{#if isDesktop && canScrollLeft}
		<button class="scroll-btn scroll-btn-left" on:click={() => scroll('left')} aria-label="Scroll left">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}

	<div class="filter-scroll-container" bind:this={scrollContainer}>
		{#each filters as filter, index}
			{#if shouldShowSeparator(index)}
				<div class="filter-separator"></div>
			{/if}

			<button
				class="filter-button"
				class:active={value === filter.id}
				on:click={() => onChange(filter.id)}
				title={filter.label}
			>
				<div class="filter-preview">
					<img 
						src={imageUrl}
						alt={filter.label}
						class="preview-image"
						style="filter: {filter.css || 'none'};"
						loading="lazy"
					/>
					{#if filter.overlay}
						<div
							class="filter-overlay"
							style="
								background-color: {filter.overlay};
								opacity: {filter.opacity};
								mix-blend-mode: {filter.blendMode || 'multiply'};
							"
						></div>
					{/if}
				</div>
				<span class="filter-label">{filter.label}</span>
			</button>
		{/each}
	</div>

	{#if isDesktop && canScrollRight}
		<button class="scroll-btn scroll-btn-right" on:click={() => scroll('right')} aria-label="Scroll right">
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M8 4L14 10L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.filter-grid-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		position: relative;
	}

	.filter-scroll-container {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
		overflow-y: hidden;
		scroll-behavior: smooth;
		scroll-snap-type: x proximity;
		flex: 1;
		padding: var(--space-2) 0 var(--space-2) var(--space-2);
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.filter-scroll-container::-webkit-scrollbar {
		display: none;
	}

	.filter-separator {
		width: 1px;
		height: 120px;
		background: var(--color-border-light);
		flex-shrink: 0;
		margin: 0 var(--space-1);
	}

	.filter-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		flex-shrink: 0;
		scroll-snap-align: start;
		transition: opacity var(--transition-fast);
	}

	.filter-button:hover {
		opacity: 0.8;
	}

	.filter-preview {
		width: 70px;
		aspect-ratio: 3 / 4;
		border-radius: var(--radius-md);
		border: 2px solid var(--color-border);
		background: white;
		overflow: hidden;
		position: relative;
		transition: all var(--transition-fast);
	}

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.filter-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.filter-button.active .filter-preview {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-primary);
	}

	.filter-label {
		font-size: var(--font-size-xs);
		color: var(--color-text-secondary);
		text-align: center;
		line-height: 1.2;
		max-width: 70px;
		word-wrap: break-word;
		transition: color var(--transition-fast);
	}

	.filter-button.active .filter-label {
		color: var(--color-primary);
		font-weight: 500;
	}

	.scroll-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: all var(--transition-fast);
		flex-shrink: 0;
	}

	.scroll-btn:hover {
		background: var(--color-primary-light);
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.scroll-btn:active {
		background: var(--color-primary);
		color: var(--color-surface);
		border-color: var(--color-primary);
	}

	@media (max-width: 1023px) {
		.filter-grid-wrapper {
			padding: 0 var(--space-2);
		}

		.filter-scroll-container {
			padding: var(--space-2) 0;
		}
	}
</style>
