

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.DSd7S0Hl.js","_app/immutable/chunks/J2XMMgAP.js","_app/immutable/chunks/BzM7qxc2.js","_app/immutable/chunks/BqSbb9ct.js"];
export const stylesheets = ["_app/immutable/assets/0.TsHd5jz0.css"];
export const fonts = [];
