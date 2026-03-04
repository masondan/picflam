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

const MAX_POLLS = 30;
const POLL_INTERVAL = 2000;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

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
		const taskUUID = crypto.randomUUID();

		const response = await fetch('https://api.runware.ai/v1', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify([{
				taskType: 'imageInference',
				taskUUID,
				positivePrompt: prompt,
				model,
				width: dims.width,
				height: dims.height,
				numberResults: 1,
				outputFormat: 'PNG',
				includeCost: true,
				deliveryMethod: 'async'
			}])
		});

		if (response.status === 429) {
			return Response.json({ error: 'rateLimit' }, { status: 429 });
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			const errorMsg = errorData?.errors?.[0]?.message || `API error: ${response.status}`;

			if (errorMsg.toLowerCase().includes('content') || errorMsg.toLowerCase().includes('nsfw')) {
				return Response.json({ error: 'contentRestriction' }, { status: 400 });
			}

			return Response.json({ error: 'general', message: errorMsg }, { status: 500 });
		}

		for (let i = 0; i < MAX_POLLS; i++) {
			await sleep(POLL_INTERVAL);

			const pollResponse = await fetch('https://api.runware.ai/v1', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify([{
					taskType: 'getResponse',
					taskUUID
				}])
			});

			if (!pollResponse.ok) continue;

			const pollResult = await pollResponse.json();
			const imageData = pollResult?.data?.[0];

			if (imageData && imageData.imageURL) {
				return Response.json({
					imageUrl: imageData.imageURL,
					cost: imageData.cost || null,
					model: modelName,
					timestamp: new Date().toISOString()
				});
			}

			if (pollResult?.errors) {
				const errorMsg = pollResult.errors[0]?.message || 'Generation failed';
				if (errorMsg.toLowerCase().includes('content') || errorMsg.toLowerCase().includes('nsfw')) {
					return Response.json({ error: 'contentRestriction' }, { status: 400 });
				}
				return Response.json({ error: 'general', message: errorMsg }, { status: 500 });
			}
		}

		return Response.json({ error: 'timeout' }, { status: 504 });

	} catch (error) {
		if (error.name === 'AbortError') {
			return Response.json({ error: 'timeout' }, { status: 504 });
		}
		return Response.json({ error: 'general', message: error.message || 'Internal server error' }, { status: 500 });
	}
}
