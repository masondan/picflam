const RMBG_VERSION = 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';

export async function onRequestPost(context) {
	const apiKey = context.env.REPLICATE_API_KEY;
	if (!apiKey) {
		return Response.json({ error: 'Replicate API key not configured' }, { status: 500 });
	}

	try {
		const { image } = await context.request.json();

		if (!image) {
			return Response.json({ error: 'No image provided' }, { status: 400 });
		}

		const response = await fetch('https://api.replicate.com/v1/predictions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
				'Prefer': 'wait'
			},
			body: JSON.stringify({
				version: RMBG_VERSION,
				input: {
					image
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return Response.json({ error: errorData.detail || `API error: ${response.status}` }, { status: response.status });
		}

		const result = await response.json();

		if (result.status === 'failed') {
			return Response.json({ error: result.error || 'Background removal failed' }, { status: 500 });
		}

		if (result.status === 'succeeded' && result.output) {
			return Response.json({ output: result.output, status: 'succeeded' });
		}

		if (result.status === 'processing' || result.status === 'starting') {
			return Response.json({
				status: result.status,
				pollUrl: result.urls?.get
			});
		}

		return Response.json({ error: 'Unexpected response from Replicate' }, { status: 500 });
	} catch (error) {
		return Response.json({ error: error.message || 'Internal server error' }, { status: 500 });
	}
}

export async function onRequestGet(context) {
	const apiKey = context.env.REPLICATE_API_KEY;
	if (!apiKey) {
		return Response.json({ error: 'Replicate API key not configured' }, { status: 500 });
	}

	const url = new URL(context.request.url);
	const pollUrl = url.searchParams.get('pollUrl');
	if (!pollUrl) {
		return Response.json({ error: 'No poll URL provided' }, { status: 400 });
	}

	try {
		const response = await fetch(pollUrl, {
			headers: { 'Authorization': `Bearer ${apiKey}` }
		});

		if (!response.ok) {
			return Response.json({ error: `Polling error: ${response.status}` }, { status: response.status });
		}

		const result = await response.json();

		if (result.status === 'succeeded' && result.output) {
			return Response.json({ output: result.output, status: 'succeeded' });
		}

		if (result.status === 'failed') {
			return Response.json({ error: result.error || 'Background removal failed' }, { status: 500 });
		}

		return Response.json({ status: result.status });
	} catch (error) {
		return Response.json({ error: error.message || 'Polling failed' }, { status: 500 });
	}
}
