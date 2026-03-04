import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

function cloudflareDevProxy() {
	return {
		name: 'cloudflare-dev-proxy',
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				if (!req.url?.startsWith('/api/')) return next();

				const env = loadEnv('', process.cwd(), '');
				const segments = req.url.replace(/\?.*$/, '').split('/').filter(Boolean);
				const funcName = segments[1];
				const funcPath = path.resolve(process.cwd(), `functions/api/${funcName}.js`);

				let mod;
				try {
					const fileUrl = `file://${funcPath}?t=${Date.now()}`;
					mod = await import(fileUrl);
				} catch {
					return next();
				}

				const method = req.method?.toUpperCase();
				const handler = method === 'POST' ? mod.onRequestPost
					: method === 'GET' ? mod.onRequestGet
					: null;

				if (!handler) return next();

				let body = '';
				for await (const chunk of req) body += chunk;

				const protocol = req.headers['x-forwarded-proto'] || 'http';
				const host = req.headers.host || 'localhost';
				const fullUrl = `${protocol}://${host}${req.url}`;

				const request = new Request(fullUrl, {
					method,
					headers: req.headers,
					...(method === 'POST' && body ? { body } : {})
				});

				try {
					const response = await handler({ request, env });
					res.statusCode = response.status;
					response.headers.forEach((value, key) => res.setHeader(key, value));
					const responseBody = await response.text();
					res.end(responseBody);
				} catch (err) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify({ error: 'general', message: err.message }));
				}
			});
		}
	};
}

export default defineConfig({
	plugins: [cloudflareDevProxy(), sveltekit()],
	server: {
		port: 5173,
		host: true,
		headers: {
			'Cross-Origin-Opener-Policy': 'same-origin',
			'Cross-Origin-Embedder-Policy': 'require-corp'
		}
	},
	build: {
		target: 'esnext'
	},
	optimizeDeps: {
		exclude: ['@huggingface/transformers', 'onnxruntime-web']
	}
});
