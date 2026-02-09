<script>
	import { onMount } from 'svelte';

	export let onClose = () => {};
	export let onImageSelect = (imageUrl) => {};

	const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

	let searchQuery = '';
	let results = [];
	let loading = true;
	let isLoadingMore = false;
	let error = null;
	let nextPageUrl = null;
	let searchInputEl;
	const defaultSearchTerm = 'Wallpaper';

	async function fetchImages(query) {
		loading = true;
		error = null;
		const searchTerm = query || defaultSearchTerm;
		const baseUrl = searchTerm
			? `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=15`
			: 'https://api.pexels.com/v1/curated?per_page=15';

		try {
			const response = await fetch(baseUrl, {
				headers: {
					Authorization: PEXELS_API_KEY,
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error('Pexels API key is invalid.');
				}
				throw new Error(`Failed to fetch from Pexels: ${response.status}`);
			}

			const data = await response.json();
			results = data.photos || [];
			nextPageUrl = data.next_page || null;
		} catch (err) {
			console.error('Fetch error:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function loadMore() {
		if (!nextPageUrl) return;
		isLoadingMore = true;
		error = null;

		try {
			console.log('Loading more from:', nextPageUrl);
			const response = await fetch(nextPageUrl, {
				headers: {
					Authorization: PEXELS_API_KEY,
					Accept: 'application/json'
				}
			});

			console.log('Load more response status:', response.status);
			if (!response.ok) {
				const errorText = await response.text();
				console.error('Load more error response:', errorText);
				throw new Error(`Failed to fetch next page from Pexels: ${response.status}`);
			}

			const data = await response.json();
			console.log('Load more success! Received', data.photos?.length || 0, 'additional photos');
			results = [...results, ...(data.photos || [])];
			nextPageUrl = data.next_page || null;
		} catch (err) {
			console.error('Load more error:', err);
			error = err.message;
		} finally {
			isLoadingMore = false;
		}
	}

	function handleSearch(e) {
		e.preventDefault();
		if (searchQuery.trim()) {
			fetchImages(searchQuery);
		}
	}

	function handleImageSelect(photo) {
		const imageUrl = photo.src.large2x || photo.src.large;
		
		const img = new Image();
		img.onload = () => {
			const dataUrl = imageUrl;
			onImageSelect(dataUrl);
			onClose();
		};
		img.src = imageUrl;
	}

	onMount(() => {
		fetchImages('');
		setTimeout(() => {
			searchInputEl?.focus();
		}, 100);
	});
</script>

<div class="pexels-overlay" on:click={onClose}>
	<div class="pexels-drawer" on:click|stopPropagation>
		<div class="drawer-header">
			<button class="close-btn" on:click={onClose} aria-label="Close search">
				<img src="/icons/icon-close.svg" alt="" class="close-icon" />
			</button>
		</div>
		<div class="search-container">
			<form class="search-form" on:submit={handleSearch}>
				<input
					bind:this={searchInputEl}
					type="text"
					bind:value={searchQuery}
					placeholder="Search for images"
					class="search-input"
				/>
				<button type="submit" class="search-btn" aria-label="Search">
					<img src="/icons/icon-search.svg" alt="" class="search-icon" />
				</button>
			</form>
		</div>

		<div class="drawer-body">
			{#if loading}
				<div class="loading">Loading images...</div>
			{:else if error}
				<div class="error">{error}</div>
			{:else if results.length === 0}
				<div class="empty">No images found</div>
			{:else}
				<div class="image-grid">
					{#each results as photo, i (i)}
						<button
							class="image-item"
							on:click={() => handleImageSelect(photo)}
							aria-label={photo.alt || 'Image'}
						>
							<img src={photo.src.medium} alt={photo.alt || ''} />
						</button>
					{/each}
				</div>

				{#if nextPageUrl && !isLoadingMore}
					<button class="load-more-btn" on:click={loadMore}>Load More</button>
				{/if}

				{#if isLoadingMore}
					<div class="loading-more">Loading more...</div>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	.pexels-overlay {
		position: fixed;
		inset: 0;
		background-color: white;
		z-index: 100;
		display: flex;
		flex-direction: column;
	}

	.pexels-drawer {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: var(--app-max-width);
		bottom: 0;
		background-color: var(--color-surface);
		display: flex;
		flex-direction: column;
		animation: slideDown 0.3s ease-out;
	}

	@media (min-width: 481px) {
		.pexels-drawer {
			box-shadow: var(--shadow-lg);
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.drawer-header {
		display: flex;
		align-items: flex-start;
		padding: var(--space-4);
		flex-shrink: 0;
	}

	.close-btn {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-fast);
	}

	.close-btn:hover {
		background-color: var(--color-border-light);
	}

	.close-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) brightness(95%) contrast(90%);
	}

	.search-container {
		padding: 0 var(--space-4) var(--space-4);
		flex-shrink: 0;
	}

	.search-form {
		display: flex;
		align-items: center;
		background-color: var(--color-surface);
		border: 1px solid #777777;
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-3);
		gap: var(--space-2);
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		outline: none;
		padding: var(--space-2) 0;
		font-size: var(--font-size-base);
		color: var(--color-text-primary);
	}

	.search-input::placeholder {
		color: var(--color-text-muted);
	}

	.search-btn {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: background-color var(--transition-fast);
	}

	.search-btn:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.search-icon {
		width: 18px;
		height: 18px;
		filter: brightness(0) saturate(100%) invert(18%) sepia(75%) saturate(1500%) hue-rotate(255deg) brightness(95%) contrast(102%);
	}

	.drawer-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.image-item {
		aspect-ratio: 1 / 1;
		border: none;
		border-radius: var(--radius-md);
		overflow: hidden;
		cursor: pointer;
		background: transparent;
		padding: 0;
		transition: transform var(--transition-fast);
	}

	.image-item:hover {
		transform: scale(0.98);
	}

	.image-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.load-more-btn {
		align-self: center;
		padding: var(--space-3);
		background: transparent;
		color: var(--color-primary);
		border: none;
		border-radius: 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		cursor: pointer;
		transition: color var(--transition-fast);
		margin-top: auto;
		text-decoration: none;
	}

	.load-more-btn:hover {
		color: #4a1a96;
	}

	.loading,
	.error,
	.empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--color-text-inverse);
		font-size: var(--font-size-base);
		text-align: center;
	}

	.error {
		color: var(--color-error);
	}

	.loading-more {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-text-secondary);
		font-size: var(--font-size-sm);
	}
</style>
