
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/face-enhance" | "/api/upscale";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/face-enhance": Record<string, never>;
			"/api/upscale": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/face-enhance" | "/api/face-enhance/" | "/api/upscale" | "/api/upscale/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/icons/icon-add.svg" | "/icons/icon-ai-slider.svg" | "/icons/icon-ai.svg" | "/icons/icon-align-center.svg" | "/icons/icon-align-left.svg" | "/icons/icon-align-right.svg" | "/icons/icon-bold.svg" | "/icons/icon-close.svg" | "/icons/icon-collapse.svg" | "/icons/icon-compare.svg" | "/icons/icon-copy.svg" | "/icons/icon-crop.svg" | "/icons/icon-custom.svg" | "/icons/icon-design.svg" | "/icons/icon-erase.svg" | "/icons/icon-expand.svg" | "/icons/icon-export.svg" | "/icons/icon-fill.svg" | "/icons/icon-fit.svg" | "/icons/icon-flip-horizontal.svg" | "/icons/icon-handle.svg" | "/icons/icon-horizontal.svg" | "/icons/icon-layer-above.svg" | "/icons/icon-layer-below.svg" | "/icons/icon-lock.svg" | "/icons/icon-no-wrap.svg" | "/icons/icon-none.svg" | "/icons/icon-nudge-down.svg" | "/icons/icon-nudge-left.svg" | "/icons/icon-nudge-right.svg" | "/icons/icon-nudge-up.svg" | "/icons/icon-quote-serif.svg" | "/icons/icon-quote-slab.svg" | "/icons/icon-redo.svg" | "/icons/icon-reset.svg" | "/icons/icon-resize.svg" | "/icons/icon-restore.svg" | "/icons/icon-rotate.svg" | "/icons/icon-search.svg" | "/icons/icon-square.svg" | "/icons/icon-startagain.svg" | "/icons/icon-undo.svg" | "/icons/icon-unlock.svg" | "/icons/icon-upload.svg" | "/icons/icon-vertical.svg" | "/icons/icon-wrap.svg" | "/logos/logo-picflam-gen.png" | "/logos/logo-picflam-logotype.png" | "/logos/logo-picflam-maskable.png" | "/logos/logo-picflam-touch.png" | "/manifest.json" | string & {};
	}
}