let segmentationPipeline = null;

export async function upscaleImageCloud(imageDataUrl, scale = 4, onProgress) {
    onProgress?.('Invoking AI ...');

    const response = await fetch('/api/face-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl, scale, faceEnhance: 0.5 })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || `API error: ${response.status}`);
    }

    if (result.status === 'succeeded' && result.output) {
        onProgress?.('Final checks ...');
        return await fetchImageAsDataUrl(result.output);
    }

    if (result.status === 'processing' || result.status === 'starting') {
        onProgress?.('Processing with CodeFormer...');
        return await pollForResult(result.pollUrl, onProgress);
    }

    throw new Error('Unexpected response');
}

async function pollForResult(pollUrl, onProgress, maxAttempts = 60) {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(r => setTimeout(r, 2000));
        
        const response = await fetch(`/api/upscale?pollUrl=${encodeURIComponent(pollUrl)}`);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || `Polling error: ${response.status}`);
        }
        
        if (result.status === 'succeeded' && result.output) {
            onProgress?.('Final checks ...');
            return await fetchImageAsDataUrl(result.output);
        }
        
        if (result.status === 'failed') {
            throw new Error(result.error || 'Upscaling failed');
        }
        
        onProgress?.(`Processing in cloud (${(i + 1) * 2}s)...`);
    }
    
    throw new Error('Timeout waiting for result');
}

async function fetchImageAsDataUrl(url) {
    const imageResponse = await fetch(url);
    const blob = await imageResponse.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getSegmentationPipeline(onProgress) {
    if (segmentationPipeline) return segmentationPipeline;

    console.log('[AI] Loading RMBG background removal model...');

    const { pipeline, env } = await import('@huggingface/transformers');

    env.allowLocalModels = false;

    try {
        segmentationPipeline = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
            device: 'webgpu',
            dtype: 'fp32'
        });
        console.log('[AI] RMBG model ready (WebGPU)');
    } catch (e) {
        console.log('[AI] WebGPU not available, falling back to WASM...', e.message);
        segmentationPipeline = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
            dtype: 'q8'
        });
        console.log('[AI] RMBG model ready (WASM)');
    }

    return segmentationPipeline;
}



export async function removeBackground(imageDataUrl, onProgress) {
    try {
        console.log('[AI] Starting background removal...');
        onProgress?.('Starting engine ...');

        const segmenter = await getSegmentationPipeline(onProgress);

        onProgress?.('Processing ...');

        const result = await segmenter(imageDataUrl);
        console.log('[AI] Segmentation result:', result);

        if (!result || result.length === 0) {
            throw new Error('No segmentation result returned');
        }

        const segment = result[0];
        console.log('[AI] Segment keys:', Object.keys(segment));

        if (segment.mask && segment.mask.toDataURL) {
            console.log('[AI] Background removal complete (RawImage mask)');
            return await applyMaskToImage(imageDataUrl, segment.mask);
        }

        if (segment.mask && segment.mask.data) {
            console.log('[AI] Background removal complete (data mask)');
            return await applyMaskToImage(imageDataUrl, segment.mask);
        }

        if (typeof segment === 'string' && segment.startsWith('data:')) {
            console.log('[AI] Background removal complete (direct output)');
            return segment;
        }

        console.log('[AI] Segment structure:', JSON.stringify(segment, null, 2).substring(0, 500));
        throw new Error('Unexpected segmentation result format');
    } catch (error) {
        console.error('[AI] Background removal failed:', error);
        throw new Error('Background removal failed: ' + error.message);
    }
}

async function applyMaskToImage(originalDataUrl, mask) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                let maskData, maskWidth, maskHeight;

                if (mask.toDataURL) {
                    const maskCanvas = document.createElement('canvas');
                    maskCanvas.width = mask.width;
                    maskCanvas.height = mask.height;
                    const maskCtx = maskCanvas.getContext('2d');

                    const maskImg = new Image();
                    maskImg.onload = () => {
                        maskCtx.drawImage(maskImg, 0, 0);
                        const maskImageData = maskCtx.getImageData(0, 0, mask.width, mask.height);

                        applyMaskData(pixels, maskImageData.data, canvas.width, canvas.height, mask.width, mask.height, true);

                        ctx.putImageData(imageData, 0, 0);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    maskImg.onerror = reject;
                    maskImg.src = mask.toDataURL();
                    return;
                } else {
                    maskData = mask.data;
                    maskWidth = mask.width;
                    maskHeight = mask.height;
                }

                const isRGBA = maskData.length === maskWidth * maskHeight * 4;
                applyMaskData(pixels, maskData, canvas.width, canvas.height, maskWidth, maskHeight, isRGBA);

                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = reject;
        img.src = originalDataUrl;
    });
}

function applyMaskData(pixels, maskData, imgWidth, imgHeight, maskWidth, maskHeight, isRGBA) {
    const scaleX = maskWidth / imgWidth;
    const scaleY = maskHeight / imgHeight;

    for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth; x++) {
            const maskX = Math.floor(x * scaleX);
            const maskY = Math.floor(y * scaleY);

            let alpha;
            if (isRGBA) {
                const maskIndex = (maskY * maskWidth + maskX) * 4;
                alpha = maskData[maskIndex];
            } else {
                const maskIndex = maskY * maskWidth + maskX;
                alpha = maskData[maskIndex] || 0;
            }

            const pixelIndex = (y * imgWidth + x) * 4;
            pixels[pixelIndex + 3] = alpha;
        }
    }
}

export function dataUrlToImage(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

export async function getImageDimensions(dataUrl) {
	const img = await dataUrlToImage(dataUrl);
	return { width: img.width, height: img.height };
}


