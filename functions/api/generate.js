const MODELS = {
	fast: 'runware:400@3',
	better: 'runware:400@1'
};

const MODEL_NAMES = {
	fast: 'Flux Klein 9B',
	better: 'Flux.2 Dev'
};

const DIMENSIONS = {
	'1:1': { width: 1024, height: 1024 },
	'16:9': { width: 1344, height: 768 },
	'9:16': { width: 768, height: 1344 }
};

export async function onRequestPost(context) {
	const apiKey = context.env.RUNWARE_API_KEY;
	if (!apiKey) {
		return Response.json({ error: 'general', message: 'Runware API key not configured' }, { status: 500 });
	}

	try {
		const { prompt, quality, aspectRatio } = await context.request.json();

		if (!prompt || prompt.length < 10 || prompt.length > 2000) {
			return Response.json({ error: 'general', message: 'Prompt must be 10-2000 characters' }, { status: 400 });
		}

		const model = MODELS[quality] || MODELS.fast;
		const modelName = MODEL_NAMES[quality] || MODEL_NAMES.fast;
		const dims = DIMENSIONS[aspectRatio] || DIMENSIONS['1:1'];

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 30000);

		const response = await fetch('https://api.runware.ai/v1', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify([{
				taskType: 'imageInference',
				taskUUID: crypto.randomUUID(),
				positivePrompt: prompt,
				model: model,
				width: dims.width,
				height: dims.height,
				numberResults: 1,
				outputFormat: 'PNG',
				includeCost: true
			}]),
			signal: controller.signal
		});

		clearTimeout(timeout);

		if (response.status === 429) {
			return Response.json({ error: 'rateLimit' }, { status: 429 });
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMsg = errorData?.errors?.[0]?.message || `API error: ${response.status}`;

			if (errorMsg.toLowerCase().includes('content') || errorMsg.toLowerCase().includes('nsfw')) {
				return Response.json({ error: 'contentRestriction' }, { status: 400 });
			}

			return Response.json({ error: 'general', message: errorMsg }, { status: response.status });
		}

		const result = await response.json();
		const imageData = result?.data?.[0];

		if (!imageData || !imageData.imageURL) {
			return Response.json({ error: 'general', message: 'No image returned from API' }, { status: 500 });
		}

		return Response.json({
			imageUrl: imageData.imageURL,
			cost: imageData.cost || null,
			model: modelName,
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		if (error.name === 'AbortError') {
			return Response.json({ error: 'timeout' }, { status: 504 });
		}
		return Response.json({ error: 'general', message: error.message || 'Internal server error' }, { status: 500 });
	}
}
