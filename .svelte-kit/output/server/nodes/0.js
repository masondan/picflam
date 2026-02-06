

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.C8F7OR15.js","_app/immutable/chunks/CTT2nEcH.js","_app/immutable/chunks/Dowq9yQq.js","_app/immutable/chunks/DUHCFzxV.js"];
export const stylesheets = ["_app/immutable/assets/0.CuUk4E8H.css"];
export const fonts = [];
