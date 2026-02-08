

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.B65KFiBu.js","_app/immutable/chunks/BOM9bC5J.js","_app/immutable/chunks/D7DYR7IZ.js","_app/immutable/chunks/BIzliudy.js"];
export const stylesheets = ["_app/immutable/assets/0.CuUk4E8H.css"];
export const fonts = [];
