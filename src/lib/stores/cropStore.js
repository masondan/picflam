import { writable, derived } from 'svelte/store';

export const FILTER_DEFINITIONS = [
	// Normal (No filter)
	{ id: 'normal', label: 'Normal', css: 'none', overlay: null, blendMode: null, opacity: 1, group: 'neutral' },
	
	// Neutral group
	{ id: 'greyscale', label: 'Greyscale', css: 'grayscale(100%)', overlay: null, blendMode: null, opacity: 1, group: 'neutral' },
	{ id: 'sepia', label: 'Sepia', css: 'sepia(80%) contrast(120%) brightness(90%) saturate(110%)', overlay: null, blendMode: null, opacity: 1, group: 'neutral' },
	{ id: 'burnt-coffee', label: 'Burnt Coffee', css: 'contrast(80%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#e3dca1', blendMode: 'multiply', opacity: 1, group: 'neutral' },
	{ id: 'baseline-special', label: 'Baseline Special', css: 'grayscale(50%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(140%) sepia(0%)', overlay: '#faaa00', blendMode: 'multiply', opacity: 1, group: 'neutral' },
	
	// Rose group
	{ id: 'rose-quartz', label: 'Rose Quartz', css: 'grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#fa00cc', blendMode: 'multiply', opacity: 0.5, group: 'rose' },
	{ id: 'rose-glass', label: 'Rose Glass', css: 'brightness(106%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#fa0000', blendMode: 'multiply', opacity: 1, group: 'rose' },
	{ id: 'red-sky', label: 'Red Sky', css: 'contrast(120%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#ab0000', blendMode: 'lighten', opacity: 0.83, group: 'rose' },
	
	// Blue group
	{ id: 'blue-lagoon', label: 'Blue Lagoon', css: 'brightness(104%) contrast(104%) grayscale(0%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(122%) sepia(0%)', overlay: '#00e1fa', blendMode: 'multiply', opacity: 0.5, group: 'blue' },
	{ id: 'baby-glass', label: 'Baby Glass', css: 'grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(140%) sepia(0%)', overlay: '#00ccfa', blendMode: 'multiply', opacity: 1, group: 'blue' },
	{ id: 'blue-haze', label: 'Blue Haze', css: 'brightness(110%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#002bff', blendMode: 'multiply', opacity: 0.76, group: 'blue' },
	
	// Yellow/Green group
	{ id: 'yellow-haze', label: 'Yellow Haze', css: 'brightness(106%) grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#ffff00', blendMode: 'multiply', opacity: 1, group: 'warm' },
	{ id: 'amazon', label: 'Amazon', css: 'grayscale(100%) hue-rotate(0deg) invert(0%) opacity(100%) saturate(100%) sepia(0%)', overlay: '#00b309', blendMode: 'multiply', opacity: 1, group: 'warm' }
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
	activeFilter: 'normal',
	filterStrength: 100,
	
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
