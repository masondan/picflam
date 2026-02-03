import { writable } from 'svelte/store';

/**
 * Active tab state
 * @type {import('svelte/store').Writable<'crop' | 'ai' | 'design'>}
 */
export const activeTab = writable('crop');

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
