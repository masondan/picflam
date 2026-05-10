const STORAGE_KEY_COUNT = 'picflam_gen_count';
const STORAGE_KEY_MONTH = 'picflam_gen_month';
const STORAGE_KEY_RECENT = 'picflam_gen_recent';
const DB_NAME = 'picflam-images';
const STORE_NAME = 'recent-images';
const MAX_RECENT = 10;
const MONTHLY_LIMIT = 50;

function getCurrentMonth() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export function getStoredMonth() {
	if (typeof window === 'undefined') return '';
	return localStorage.getItem(STORAGE_KEY_MONTH) || '';
}

export function getGenerationCount() {
	if (typeof window === 'undefined') return 0;
	const storedMonth = getStoredMonth();
	if (storedMonth !== getCurrentMonth()) {
		localStorage.setItem(STORAGE_KEY_COUNT, '0');
		localStorage.setItem(STORAGE_KEY_MONTH, getCurrentMonth());
		return 0;
	}
	return parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10);
}

export function incrementGeneration() {
	const count = getGenerationCount() + 1;
	localStorage.setItem(STORAGE_KEY_COUNT, String(count));
	localStorage.setItem(STORAGE_KEY_MONTH, getCurrentMonth());
	return count;
}

export function isLimitReached() {
	return getGenerationCount() >= MONTHLY_LIMIT;
}

export function getRecentImages() {
	if (typeof window === 'undefined') return [];
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY_RECENT) || '[]');
	} catch {
		return [];
	}
}

/**
 * Get image data from IndexedDB
 * @param {string} id
 */
export async function getRecentImageData(id) {
	if (typeof window === 'undefined') return null;
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readonly');
		const request = tx.objectStore(STORE_NAME).get(id);
		const result = await new Promise((resolve) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => resolve(null);
		});
		db.close();
		return result?.imageUrl || null;
	} catch (e) {
		console.warn('[Generation Storage] Failed to get image data:', e);
		return null;
	}
}

/**
 * Add image to recent with source metadata
 * @param {Object} entry
 * @param {string} entry.id
 * @param {string} entry.imageUrl
 * @param {string} [entry.prompt]
 * @param {string} [entry.model]
 * @param {string} source
 * @param {Object} sourceData
 */
export async function addToRecentImages(entry, source = 'ai', sourceData = {}) {
	if (typeof window === 'undefined') return [];
	
	try {
		// Get current metadata
		const recent = getRecentImages();
		
		// Create metadata entry (without imageUrl)
		const metadataEntry = {
			id: entry.id,
			source,
			sourceData,
			timestamp: Date.now(),
			prompt: entry.prompt,
			model: entry.model
		};
		
		// Add metadata to front
		recent.unshift(metadataEntry);
		
		// Keep only MAX_RECENT items, removing oldest
		const idsToKeep = recent.slice(0, MAX_RECENT).map(img => img.id);
		if (recent.length > MAX_RECENT) {
			recent.splice(MAX_RECENT);
		}
		
		// Save metadata to localStorage
		localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recent));
		
		// Save image data to IndexedDB
		try {
			const db = await openDB();
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const store = tx.objectStore(STORE_NAME);
			
			// Add new image
			store.put({
				id: entry.id,
				imageUrl: entry.imageUrl,
				timestamp: Date.now()
			});
			
			// Delete old images not in the keep list
			const deleteRequest = store.getAll();
			await new Promise((resolve) => {
				deleteRequest.onsuccess = () => {
					const allImages = deleteRequest.result;
					allImages.forEach(img => {
						if (!idsToKeep.includes(img.id)) {
							store.delete(img.id);
						}
					});
					resolve(true);
				};
				deleteRequest.onerror = () => resolve(false);
			});
			
			await new Promise((resolve) => {
				tx.oncomplete = () => resolve(true);
				tx.onerror = () => resolve(false);
			});
			db.close();
		} catch (e) {
			console.warn('[Generation Storage] Failed to save image to IndexedDB:', e);
		}
		
		return recent;
	} catch (e) {
		console.warn('[Generation Storage] Failed to add image:', e);
		return getRecentImages();
	}
}

/**
 * Remove recent images by IDs
 * @param {string[]} ids
 */
export async function removeRecentImages(ids) {
	if (typeof window === 'undefined') return [];
	
	try {
		const recent = getRecentImages().filter(img => !ids.includes(img.id));
		localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recent));
		
		// Remove from IndexedDB
		try {
			const db = await openDB();
			const tx = db.transaction(STORE_NAME, 'readwrite');
			const store = tx.objectStore(STORE_NAME);
			ids.forEach(id => store.delete(id));
			await new Promise((resolve) => {
				tx.oncomplete = () => resolve(true);
				tx.onerror = () => resolve(false);
			});
			db.close();
		} catch (e) {
			console.warn('[Generation Storage] Failed to remove from IndexedDB:', e);
		}
		
		return recent;
	} catch (e) {
		console.warn('[Generation Storage] Failed to remove images:', e);
		return getRecentImages();
	}
}

/**
 * Clear all recent images
 */
export async function clearAllRecent() {
	if (typeof window === 'undefined') return [];
	
	try {
		localStorage.setItem(STORAGE_KEY_RECENT, '[]');
		
		// Clear IndexedDB
		try {
			const db = await openDB();
			const tx = db.transaction(STORE_NAME, 'readwrite');
			tx.objectStore(STORE_NAME).clear();
			await new Promise((resolve) => {
				tx.oncomplete = () => resolve(true);
				tx.onerror = () => resolve(false);
			});
			db.close();
		} catch (e) {
			console.warn('[Generation Storage] Failed to clear IndexedDB:', e);
		}
		
		return [];
	} catch (e) {
		console.warn('[Generation Storage] Failed to clear all:', e);
		return [];
	}
}

export { MONTHLY_LIMIT };
