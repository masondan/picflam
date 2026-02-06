import { writable, derived } from 'svelte/store';

const CANVAS_COLORS = {
	solids: ['#FFFFFF', '#000000', '#007C1F', '#00679D', '#B20715'],
	gradients: [
		'linear-gradient(135deg, #5422b0 0%, #4B0082 100%)',
		'linear-gradient(135deg, #15509B 0%, #20244F 100%)',
		'linear-gradient(135deg, #A8076B 0%, #62045F 100%)',
		'linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%)',
		'linear-gradient(135deg, #0A8F9D 0%, #202B54 100%)',
		'linear-gradient(135deg, #D17A29 0%, #41363C 100%)'
	]
};

const FONTS = ['Inter', 'Roboto Slab', 'Saira Condensed', 'Lora', 'Playfair Display', 'Special Elite'];

const GRADIENT_DIRECTIONS = {
	up: 'to top',
	down: 'to bottom',
	left: 'to left',
	right: 'to right'
};

const initialSlideState = {
	canvasSize: '1/1',
	background: { type: 'solid', value: '#FFFFFF', direction: 'down', gradientColors: ['#5422b0', '#4B0082'] },
	text1: '',
	text1Font: 'Inter',
	text1Size: 4,
	text1YPosition: 5,
	text1LineSpacing: 3,
	text1Color: '#000000',
	text1HighlightColor: 'transparent',
	text1IsBold: true,
	text1Align: 'center',
	text1QuoteStyle: 'none',
	text1QuoteSize: 5,
	text2: '',
	text2Font: 'Inter',
	text2Size: 2,
	text2YPosition: 8,
	text2LineSpacing: 3,
	text2Color: '#000000',
	text2LabelColor: 'transparent',
	text2IsBold: false,
	text2Align: 'center',
	overlay: null,
	overlaySize: 50,
	overlayOpacity: 100,
	overlayX: 50,
	overlayY: 50,
	overlayMask: 'none',
	overlayLayer: 'above',
	overlayBorderWidth: 0,
	overlayBorderColor: '#FFFFFF',
	overlayNaturalWidth: 0,
	overlayNaturalHeight: 0,
	overlayZoom: 100,
	overlayImageOffsetX: 0,
	overlayImageOffsetY: 0
};

function createHistoryStore(initialState) {
	const history = [JSON.parse(JSON.stringify(initialState))];
	let currentIndex = 0;
	
	const { subscribe, set, update } = writable(initialState);
	
	return {
		subscribe,
		set: (value) => {
			history.splice(currentIndex + 1);
			history.push(JSON.parse(JSON.stringify(value)));
			currentIndex = history.length - 1;
			set(value);
		},
		update: (fn) => {
			update(state => {
				const newState = fn(state);
				history.splice(currentIndex + 1);
				history.push(JSON.parse(JSON.stringify(newState)));
				currentIndex = history.length - 1;
				return newState;
			});
		},
		undo: () => {
			if (currentIndex > 0) {
				currentIndex--;
				set(JSON.parse(JSON.stringify(history[currentIndex])));
				return true;
			}
			return false;
		},
		redo: () => {
			if (currentIndex < history.length - 1) {
				currentIndex++;
				set(JSON.parse(JSON.stringify(history[currentIndex])));
				return true;
			}
			return false;
		},
		canUndo: () => currentIndex > 0,
		canRedo: () => currentIndex < history.length - 1,
		reset: () => {
			const fresh = JSON.parse(JSON.stringify(initialState));
			history.length = 0;
			history.push(fresh);
			currentIndex = 0;
			set(fresh);
		}
	};
}

export const slideState = createHistoryStore(initialSlideState);

export const showTemplatePicker = writable(true);

export const activeDesignMenu = writable('none');

export const hasDesignContent = derived(slideState, $state => 
	$state.text1 || $state.text2 || $state.overlay || $state.background.value !== '#FFFFFF'
);

export { CANVAS_COLORS, FONTS, GRADIENT_DIRECTIONS };

export function resetDesignState() {
	slideState.reset();
	showTemplatePicker.set(true);
	activeDesignMenu.set('none');
}
