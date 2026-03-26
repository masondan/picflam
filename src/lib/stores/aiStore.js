import { writable, derived } from 'svelte/store';
import { getGenerationCount, getStoredMonth } from '$lib/utils/generationStorage.js';
import { saveAiState, loadAiState, clearAiState } from '$lib/utils/aiStateStorage.js';

const initialAiState = {
	originalImage: null,
	currentImage: null,
	processedImage: null,
	isProcessing: false,
	processingType: null,
	upscaleFactor: 1,
	showComparison: false,
	comparisonPosition: 50
};

function createStore() {
	const { subscribe, set, update } = writable(initialAiState);

	function persistAfterUpdate(updater) {
		update(state => {
			const newState = updater(state);
			if (newState.currentImage && !newState.isProcessing) {
				saveAiState(newState);
			}
			return newState;
		});
	}
	
	return {
		subscribe,
		setImage: (imageData) => persistAfterUpdate(state => ({
			...state,
			originalImage: imageData,
			currentImage: imageData,
			processedImage: null
		})),
		startProcessing: (type) => update(state => ({
			...state,
			isProcessing: true,
			processingType: type,
			showComparison: false
		})),
		promoteCurrentToOriginal: () => persistAfterUpdate(state => ({
			...state,
			originalImage: state.currentImage,
			processedImage: null,
			showComparison: false
		})),
		finishProcessing: (result) => persistAfterUpdate(state => ({
			...state,
			isProcessing: false,
			processingType: null,
			processedImage: result,
			currentImage: result,
			showComparison: true
		})),
		cancelProcessing: () => update(state => ({
			...state,
			isProcessing: false,
			processingType: null
		})),
		setUpscaleFactor: (factor) => update(state => ({
			...state,
			upscaleFactor: factor
		})),
		setComparisonPosition: (position) => update(state => ({
			...state,
			comparisonPosition: position
		})),
		reset: () => {
			clearAiState();
			set(initialAiState);
		},
		restoreFromStorage: async () => {
			const saved = await loadAiState();
			if (saved) {
				update(state => ({
					...state,
					originalImage: saved.originalImage,
					currentImage: saved.currentImage,
					processedImage: saved.processedImage,
					showComparison: saved.showComparison
				}));
			}
		}
	};
}

export const aiState = createStore();

export const activeAiMenu = writable('background');

export const hasAiImage = derived(aiState, $state => $state.currentImage !== null);

const initialImageGen = {
	prompt: '',
	quality: 'fast',
	aspectRatio: '1:1',
	referenceImage: null,
	generatedImage: null,
	loading: false,
	error: null,
	generationsThisMonth: typeof window !== 'undefined' ? getGenerationCount() : 0
};

export const imageGen = writable(initialImageGen);

export function resetImageGen() {
	imageGen.update(state => ({
		...state,
		prompt: '',
		referenceImage: null,
		generatedImage: null,
		error: null,
		loading: false
	}));
}
