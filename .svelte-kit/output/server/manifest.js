export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["icons/icon-add.svg","icons/icon-ai-slider.svg","icons/icon-ai.svg","icons/icon-align-center.svg","icons/icon-align-left.svg","icons/icon-align-right.svg","icons/icon-bold.svg","icons/icon-close.svg","icons/icon-compare.svg","icons/icon-copy.svg","icons/icon-crop.svg","icons/icon-custom.svg","icons/icon-design.svg","icons/icon-erase.svg","icons/icon-export.svg","icons/icon-flip-horizontal.svg","icons/icon-horizontal.svg","icons/icon-lock.svg","icons/icon-no-wrap.svg","icons/icon-none.svg","icons/icon-nudge-down.svg","icons/icon-nudge-left.svg","icons/icon-nudge-right.svg","icons/icon-nudge-up.svg","icons/icon-redo.svg","icons/icon-restore.svg","icons/icon-rotate.svg","icons/icon-square.svg","icons/icon-startagain.svg","icons/icon-undo.svg","icons/icon-unlock.svg","icons/icon-upload.svg","icons/icon-vertical.svg","icons/icon-wrap.svg","logos/logo-picflam-gen.png","logos/logo-picflam-logotype.png","logos/logo-picflam-maskable.png","logos/logo-picflam-touch.png","manifest.json"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.0eWeZXU7.js",app:"_app/immutable/entry/app.Ce42mZvJ.js",imports:["_app/immutable/entry/start.0eWeZXU7.js","_app/immutable/chunks/Dao0mXox.js","_app/immutable/chunks/BzM7qxc2.js","_app/immutable/chunks/Fgk67qUn.js","_app/immutable/chunks/CK813S4p.js","_app/immutable/entry/app.Ce42mZvJ.js","_app/immutable/chunks/BzM7qxc2.js","_app/immutable/chunks/sBeDOaB9.js","_app/immutable/chunks/J2XMMgAP.js","_app/immutable/chunks/CK813S4p.js","_app/immutable/chunks/BEBdknVw.js","_app/immutable/chunks/Fgk67qUn.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
