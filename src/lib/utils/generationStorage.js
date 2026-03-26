const STORAGE_KEY_COUNT = 'picflam_gen_count';
const STORAGE_KEY_MONTH = 'picflam_gen_month';
const STORAGE_KEY_RECENT = 'picflam_gen_recent';
const MAX_RECENT = 10;
const MONTHLY_LIMIT = 50;

function getCurrentMonth() {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
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
 * Add image to recent with source metadata
 * @param {Object} entry - Image entry
 * @param {string} entry.imageUrl - Image URL
 * @param {string} entry.prompt - Generation prompt
 * @param {string} entry.model - Model used
 * @param {string} entry.id - Unique ID
 * @param {'ai' | 'crop' | 'design'} source - Source of the image
 * @param {Object} sourceData - Source-specific metadata (prompt, style, etc.)
 */
export function addToRecentImages(entry, source = 'ai', sourceData = {}) {
	const recent = getRecentImages();
	const enrichedEntry = {
		...entry,
		source,
		sourceData,
		timestamp: Date.now()
	};
	recent.unshift(enrichedEntry);
	if (recent.length > MAX_RECENT) recent.pop();
	localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recent));
	return recent;
}

export function removeRecentImages(ids) {
	const recent = getRecentImages().filter(img => !ids.includes(img.id));
	localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(recent));
	return recent;
}

export function clearAllRecent() {
	localStorage.setItem(STORAGE_KEY_RECENT, '[]');
	return [];
}

export { MONTHLY_LIMIT };
