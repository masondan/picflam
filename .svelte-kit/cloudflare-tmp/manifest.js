export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icons/icon-add.svg","icons/icon-ai-slider.svg","icons/icon-ai.svg","icons/icon-align-center.svg","icons/icon-align-left.svg","icons/icon-align-right.svg","icons/icon-bold.svg","icons/icon-close.svg","icons/icon-collapse.svg","icons/icon-compare.svg","icons/icon-copy.svg","icons/icon-crop.svg","icons/icon-custom.svg","icons/icon-design.svg","icons/icon-erase.svg","icons/icon-expand.svg","icons/icon-export.svg","icons/icon-fill.svg","icons/icon-fit.svg","icons/icon-flip-horizontal.svg","icons/icon-handle.svg","icons/icon-horizontal.svg","icons/icon-layer-above.svg","icons/icon-layer-below.svg","icons/icon-lock.svg","icons/icon-no-wrap.svg","icons/icon-none.svg","icons/icon-nudge-down.svg","icons/icon-nudge-left.svg","icons/icon-nudge-right.svg","icons/icon-nudge-up.svg","icons/icon-paste.svg","icons/icon-preview.svg","icons/icon-quote-serif.svg","icons/icon-quote-slab.svg","icons/icon-redo.svg","icons/icon-reset.svg","icons/icon-resize.svg","icons/icon-restore.svg","icons/icon-rotate.svg","icons/icon-search.svg","icons/icon-square.svg","icons/icon-startagain.svg","icons/icon-undo.svg","icons/icon-unlock.svg","icons/icon-upload.svg","icons/icon-vertical.svg","icons/icon-wrap.svg","images/ai-intro-after.png","images/ai-intro-before.png","images/crop-intro.png","logos/favicon.ico","logos/favicon.png","logos/logo-picflam-gen.png","logos/logo-picflam-logotype.png","logos/logo-picflam-maskable.png","logos/logo-picflam-og.png","logos/logo-picflam-touch.png","manifest.json","robots.txt","template-previews/template-1.png","template-previews/template-2.png","template-previews/template-3.png","template-previews/template-4.png","template-previews/template-5.png"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".json":"application/json",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.C5jkbMK7.js",app:"_app/immutable/entry/app.D2oMRr-c.js",imports:["_app/immutable/entry/start.C5jkbMK7.js","_app/immutable/chunks/cvw16U2X.js","_app/immutable/chunks/lEh-PZk4.js","_app/immutable/chunks/Dka6wEB2.js","_app/immutable/entry/app.D2oMRr-c.js","_app/immutable/chunks/D6FnWS7v.js","_app/immutable/chunks/lEh-PZk4.js","_app/immutable/chunks/Dka6wEB2.js","_app/immutable/chunks/BDunHu8Z.js","_app/immutable/chunks/juJXt7hG.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/face-enhance",
				pattern: /^\/api\/face-enhance\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/face-enhance/_server.js'))
			},
			{
				id: "/api/upscale",
				pattern: /^\/api\/upscale\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/upscale/_server.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base_path = "";
