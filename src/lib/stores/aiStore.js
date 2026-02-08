import { writable, derived } from 'svelte/store';

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
	
	return {
		subscribe,
		setImage: (imageData) => update(state => ({
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
		promoteCurrentToOriginal: () => update(state => ({
			...state,
			originalImage: state.currentImage,
			processedImage: null,
			showComparison: false
		})),
		finishProcessing: (result) => update(state => ({
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
		reset: () => set(initialAiState)
	};
}

export const aiState = createStore();

export const activeAiMenu = writable('enhance');

export const hasAiImage = derived(aiState, $state => $state.currentImage !== null);
