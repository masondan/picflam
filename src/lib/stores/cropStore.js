import { writable, derived } from 'svelte/store';

function createHistoryStore(initialState) {
	const history = [initialState];
	let currentIndex = 0;
	
	const { subscribe, set, update } = writable(initialState);
	
	return {
		subscribe,
		set: (value) => {
			history.splice(currentIndex + 1);
			history.push(value);
			currentIndex = history.length - 1;
			set(value);
		},
		undo: () => {
			if (currentIndex > 0) {
				currentIndex--;
				set(history[currentIndex]);
			}
		},
		redo: () => {
			if (currentIndex < history.length - 1) {
				currentIndex++;
				set(history[currentIndex]);
			}
		},
		canUndo: () => currentIndex > 0,
		canRedo: () => currentIndex < history.length - 1,
		reset: () => {
			history.length = 0;
			history.push(initialState);
			currentIndex = 0;
			set(initialState);
		}
	};
}

const initialCropState = {
	originalImage: null,
	currentImage: null,
	aspectRatio: 'custom',
	width: 0,
	height: 0,
	ratioLocked: false,
	scale: 1,
	offsetX: 0,
	offsetY: 0,
	brightness: 0,
	contrast: 0,
	shadows: 0,
	hdr: 0,
	blurBrushSize: 20,
	activeFilter: 'original',
	filterStrength: 50
};

export const cropState = createHistoryStore(initialCropState);

export const activeSubMenu = writable('none');

export const hasImage = derived(cropState, $state => $state.currentImage !== null);

export function resetCropState() {
	cropState.reset();
	activeSubMenu.set('none');
}
