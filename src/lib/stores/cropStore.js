import { writable, derived } from 'svelte/store';

export const FILTER_DEFINITIONS = [
	{ id: 'original', label: 'Original', css: 'none' },
	{ id: 'greyscale', label: 'Greyscale', css: 'grayscale(100%)' },
	{ id: 'sepia', label: 'Sepia', css: 'sepia(100%)' },
	{ id: 'sunset', label: 'Sunset', css: 'sepia(30%) saturate(140%) brightness(110%) hue-rotate(-10deg)' },
	{ id: 'azure', label: 'Azure', css: 'saturate(120%) brightness(105%) hue-rotate(180deg)' },
	{ id: 'teal', label: 'Teal', css: 'saturate(130%) hue-rotate(140deg)' }
];

function createHistoryStore(initialState) {
	const history = [initialState];
	let currentIndex = 0;
	let baseIndex = 0;
	
	const undoState = writable({ canUndo: false, canRedo: false });
	const { subscribe, set, update } = writable(initialState);
	
	function updateUndoState() {
		undoState.set({
			canUndo: currentIndex > baseIndex,
			canRedo: currentIndex < history.length - 1
		});
	}
	
	return {
		subscribe,
		undoState,
		set: (value) => {
			history.splice(currentIndex + 1);
			history.push(value);
			currentIndex = history.length - 1;
			set(value);
			updateUndoState();
		},
		update: (fn) => {
			update(currentValue => {
				const newValue = fn(currentValue);
				history.splice(currentIndex + 1);
				history.push(newValue);
				currentIndex = history.length - 1;
				updateUndoState();
				return newValue;
			});
		},
		silentUpdate: (fn) => {
			update(fn);
		},
		setBaseState: () => {
			baseIndex = currentIndex;
			updateUndoState();
		},
		undo: () => {
			if (currentIndex > baseIndex) {
				currentIndex--;
				set(history[currentIndex]);
				updateUndoState();
			}
		},
		redo: () => {
			if (currentIndex < history.length - 1) {
				currentIndex++;
				set(history[currentIndex]);
				updateUndoState();
			}
		},
		canUndo: () => currentIndex > baseIndex,
		canRedo: () => currentIndex < history.length - 1,
		reset: () => {
			history.length = 0;
			history.push(initialState);
			currentIndex = 0;
			baseIndex = 0;
			set(initialState);
			updateUndoState();
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
	activeFilter: 'original',
	filterStrength: 50,
	
	cropBox: { x: 0, y: 0, width: 0, height: 0 },
	isCropping: false,
	cropPending: false,
	imageWidth: 0,
	imageHeight: 0,
	
	blurEnabled: false,
	blurBrushSize: 50,
	blurStrength: 50,
	blurSoften: 50,
	blurInvert: false,
	blurMask: null,
	showBrushPreview: false,
	zoomLevel: 1,
	zoomOffsetX: 0,
	zoomOffsetY: 0
};

export const cropState = createHistoryStore(initialCropState);

export const activeSubMenu = writable('none');

export const hasImage = derived(cropState, $state => $state.currentImage !== null);

export function resetCropState() {
	cropState.reset();
	activeSubMenu.set('none');
}

export function updateCropBox(updates) {
	cropState.silentUpdate(state => ({
		...state,
		cropBox: { ...state.cropBox, ...updates },
		cropPending: true
	}));
}

export function commitCrop() {
	let result = null;
	cropState.update(state => {
		if (!state.currentImage || !state.cropPending) return state;
		
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		
		return new Promise((resolve) => {
			img.onload = () => {
				const scaleX = img.naturalWidth / state.imageWidth;
				const scaleY = img.naturalHeight / state.imageHeight;
				
				const sx = state.cropBox.x * scaleX;
				const sy = state.cropBox.y * scaleY;
				const sw = state.cropBox.width * scaleX;
				const sh = state.cropBox.height * scaleY;
				
				canvas.width = sw;
				canvas.height = sh;
				
				ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
				
				result = canvas.toDataURL('image/png');
				resolve({
					...state,
					currentImage: result,
					imageWidth: sw,
					imageHeight: sh,
					cropBox: { x: 0, y: 0, width: sw, height: sh },
					isCropping: false,
					cropPending: false
				});
			};
			img.src = state.currentImage;
		});
	});
	return result;
}

export async function commitCropAsync() {
	return new Promise((resolve) => {
		let currentState;
		const unsubscribe = cropState.subscribe(s => { currentState = s; });
		unsubscribe();
		
		if (!currentState.currentImage || !currentState.cropPending) {
			resolve(null);
			return;
		}
		
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		
		img.onload = () => {
			const scaleX = img.naturalWidth / currentState.imageWidth;
			const scaleY = img.naturalHeight / currentState.imageHeight;
			
			const sx = currentState.cropBox.x * scaleX;
			const sy = currentState.cropBox.y * scaleY;
			const sw = currentState.cropBox.width * scaleX;
			const sh = currentState.cropBox.height * scaleY;
			
			canvas.width = sw;
			canvas.height = sh;
			
			ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
			
			const result = canvas.toDataURL('image/png');
			
			cropState.update(state => ({
				...state,
				currentImage: result,
				imageWidth: sw,
				imageHeight: sh,
				cropBox: { x: 0, y: 0, width: sw, height: sh },
				isCropping: false,
				cropPending: false
			}));
			
			resolve(result);
		};
		img.src = currentState.currentImage;
	});
}

export function applyFilter(imageDataUrl, filterCss, strength = 100) {
	return new Promise((resolve) => {
		if (filterCss === 'none' || !filterCss) {
			resolve(imageDataUrl);
			return;
		}
		
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const img = new Image();
		
		img.onload = () => {
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			
			const adjustedFilter = strength < 100 
				? filterCss.replace(/(\d+)%/g, (match, p1) => `${Math.round(parseInt(p1) * strength / 100)}%`)
				: filterCss;
			
			ctx.filter = adjustedFilter;
			ctx.drawImage(img, 0, 0);
			
			resolve(canvas.toDataURL('image/png'));
		};
		img.src = imageDataUrl;
	});
}
