const MODELS = {
	fast: 'runware:400@3',
	better: 'runware:400@1'
};

const MODEL_NAMES = {
	fast: 'Flux Klein 9B',
	better: 'Flux.2 Dev'
};

const REFERENCE_MODEL = 'runware:400@1';
const REFERENCE_MODEL_NAME = 'Flux.2 Dev (Reference)';

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
		const { prompt, quality, aspectRatio, referenceImage } = await context.request.json();

		if (!prompt || prompt.length < 10 || prompt.length > 3000) {
			return Response.json({ error: 'general', message: 'Prompt must be 10-3000 characters' }, { status: 400 });
		}

		const dims = DIMENSIONS[aspectRatio] || DIMENSIONS['1:1'];
		const taskUUID = crypto.randomUUID();

		let taskPayload;
		let modelName;

		if (referenceImage) {
			taskPayload = {
				taskType: 'imageInference',
				taskUUID,
				model: REFERENCE_MODEL,
				positivePrompt: prompt,
				width: dims.width,
				height: dims.height,
				numberResults: 1,
				outputFormat: 'PNG',
				CFGScale: 3.5,
				scheduler: 'FlowMatchEulerDiscreteScheduler',
				includeCost: true,
				deliveryMethod: 'async',
				inputs: {
					referenceImages: [referenceImage]
				},
				acceleration: 'high'
			};
			modelName = REFERENCE_MODEL_NAME;
		} else {
			const model = MODELS[quality] || MODELS.fast;
			taskPayload = {
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
			};
			modelName = MODEL_NAMES[quality] || MODEL_NAMES.fast;
		}

		const response = await fetch('https://api.runware.ai/v1', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify([taskPayload])
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
