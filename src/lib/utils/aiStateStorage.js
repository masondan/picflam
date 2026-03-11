const DB_NAME = 'picflam-ai';
const STORE_NAME = 'state';
const KEY = 'aiState';

function openDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => {
			request.result.createObjectStore(STORE_NAME);
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function saveAiState(state) {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put({
			originalImage: state.originalImage,
			currentImage: state.currentImage,
			processedImage: state.processedImage,
			showComparison: state.showComparison,
			timestamp: Date.now()
		}, KEY);
		await new Promise((resolve, reject) => {
			tx.oncomplete = resolve;
			tx.onerror = reject;
		});
		db.close();
	} catch (e) {
		console.warn('[AI Storage] Failed to save state:', e);
	}
}

export async function loadAiState() {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readonly');
		const request = tx.objectStore(STORE_NAME).get(KEY);
		const result = await new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = reject;
		});
		db.close();

		if (!result || !result.currentImage) return null;

		const age = Date.now() - (result.timestamp || 0);
		if (age > 30 * 60 * 1000) return null;

		return result;
	} catch (e) {
		console.warn('[AI Storage] Failed to load state:', e);
		return null;
	}
}

export async function clearAiState() {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).delete(KEY);
		await new Promise((resolve, reject) => {
			tx.oncomplete = resolve;
			tx.onerror = reject;
		});
		db.close();
	} catch (e) {
		console.warn('[AI Storage] Failed to clear state:', e);
	}
}
