import { writable } from 'svelte/store';

/**
 * Active tab state with localStorage persistence
 * Persists across page refreshes but defaults to 'crop' on first load
 * @type {import('svelte/store').Writable<'crop' | 'ai' | 'design'>}
 */
function createActiveTabStore() {
	// Get stored tab from localStorage, or default to 'crop'
	const initialTab = typeof window !== 'undefined' 
		? localStorage.getItem('activeTab') || 'crop'
		: 'crop';
	
	const { subscribe, set, update } = writable(initialTab);
	
	return {
		subscribe,
		set: (value) => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('activeTab', value);
			}
			set(value);
		},
		update
	};
}

export const activeTab = createActiveTabStore();

/**
 * Current working image (shared across tabs)
 * @type {import('svelte/store').Writable<string | null>}
 */
export const currentImage = writable(null);

/**
 * Loading state for async operations
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isLoading = writable(false);

/**
 * Error message state
 * @type {import('svelte/store').Writable<string | null>}
 */
export const errorMessage = writable(null);
