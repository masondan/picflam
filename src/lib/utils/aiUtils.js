let upscalerSession = null;
let segmentationPipeline = null;

const UPSCALER_MODEL_URL = 'https://huggingface.co/bukuroo/RealESRGAN-ONNX/resolve/main/real-esrgan-x4plus-128.onnx';
const TILE_SIZE = 128;
const TILE_OVERLAP = 16;

export async function upscaleImageCloud(imageDataUrl, scale = 4, onProgress) {
    onProgress?.('Uploading image...');

    const response = await fetch('/api/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl, scale })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || `API error: ${response.status}`);
    }

    if (result.status === 'succeeded' && result.output) {
        onProgress?.('Downloading result...');
        return await fetchImageAsDataUrl(result.output);
    }

    if (result.status === 'processing' || result.status === 'starting') {
        onProgress?.('Processing in cloud...');
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
            onProgress?.('Downloading result...');
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

async function getUpscalerSession(onProgress) {
    if (upscalerSession) return upscalerSession;

    console.log('[AI] Loading Real-ESRGAN model via ONNX Runtime...');
    onProgress?.('Downloading Real-ESRGAN model (first time only)...');

    const ort = await import('onnxruntime-web');

    ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;

    try {
        upscalerSession = await ort.InferenceSession.create(UPSCALER_MODEL_URL, {
            executionProviders: ['webgpu', 'wasm'],
            graphOptimizationLevel: 'all'
        });
        console.log('[AI] Real-ESRGAN model ready');
    } catch (e) {
        console.log('[AI] WebGPU failed, trying WASM only...', e.message);
        upscalerSession = await ort.InferenceSession.create(UPSCALER_MODEL_URL, {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all'
        });
        console.log('[AI] Real-ESRGAN model ready (WASM)');
    }

    return upscalerSession;
}

async function getSegmentationPipeline(onProgress) {
    if (segmentationPipeline) return segmentationPipeline;

    console.log('[AI] Loading RMBG background removal model...');
    onProgress?.('Downloading model (first time only)...');

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

async function createGaussianWindow(size, sigma = 1.0) {
    // Create a Gaussian window for smoother tile blending
    const window = new Float32Array(size);
    const center = (size - 1) / 2;
    let sum = 0;

    for (let i = 0; i < size; i++) {
        const x = i - center;
        // A wider sigma (e.g., 0.4) gives a wider, smoother blend.
        // The value is squared to create the bell curve.
        const exponent = -0.5 * Math.pow(x / (sigma * center), 2);
        const value = Math.exp(exponent);
        window[i] = value;
        sum += value;
    }

    // Normalize the window so that the sum of weights is 1
    for (let i = 0; i < size; i++) {
        window[i] /= sum / (size/4); // Empirically adjust normalization
    }

    return window;
}

async function runSwinIR(session, imageData, width, height, onProgress) {
    const ort = await import('onnxruntime-web');

    const outputWidth = width * 4;
    const outputHeight = height * 4;
    const outputData = new Float32Array(outputWidth * outputHeight * 3);
    const weightMap = new Float32Array(outputWidth * outputHeight);

    const tilesX = Math.ceil((width - TILE_OVERLAP) / (TILE_SIZE - TILE_OVERLAP));
    const tilesY = Math.ceil((height - TILE_OVERLAP) / (TILE_SIZE - TILE_OVERLAP));
    const totalTiles = tilesX * tilesY;
    let processedTiles = 0;

    console.log(`[AI] Processing ${totalTiles} tiles (${tilesX}x${tilesY}) with Gaussian blending...`);

    // Create Gaussian window for smoother blending
    const gaussianWindow = await createGaussianWindow(TILE_SIZE * 4, 0.4);

    for (let ty = 0; ty < tilesY; ty++) {
        for (let tx = 0; tx < tilesX; tx++) {
            // Calculate tile position more carefully to prevent overlap issues
            const tileStartX = Math.min(tx * (TILE_SIZE - TILE_OVERLAP), Math.max(0, width - TILE_SIZE));
            const tileStartY = Math.min(ty * (TILE_SIZE - TILE_OVERLAP), Math.max(0, height - TILE_SIZE));

            const tileInput = new Float32Array(3 * TILE_SIZE * TILE_SIZE);
            for (let y = 0; y < TILE_SIZE; y++) {
                for (let x = 0; x < TILE_SIZE; x++) {
                    const srcX = Math.min(tileStartX + x, width - 1);
                    const srcY = Math.min(tileStartY + y, height - 1);
                    const srcIdx = (srcY * width + srcX) * 4;
                    const dstIdx = y * TILE_SIZE + x;

                    tileInput[0 * TILE_SIZE * TILE_SIZE + dstIdx] = imageData[srcIdx] / 255.0;
                    tileInput[1 * TILE_SIZE * TILE_SIZE + dstIdx] = imageData[srcIdx + 1] / 255.0;
                    tileInput[2 * TILE_SIZE * TILE_SIZE + dstIdx] = imageData[srcIdx + 2] / 255.0;
                }
            }

            const inputTensor = new ort.Tensor('float32', tileInput, [1, 3, TILE_SIZE, TILE_SIZE]);
            const inputNames = session.inputNames || ['input'];
            const feeds = { [inputNames[0]]: inputTensor };

            const results = await session.run(feeds);
            const outputTensor = results.output || results[Object.keys(results)[0]];
            const tileOutput = outputTensor.data;

            // Apply feathered blending when stitching upscaled tiles
            const outTileSize = TILE_SIZE * 4;
            const outStartX = tileStartX * 4;
            const outStartY = tileStartY * 4;

            for (let y = 0; y < outTileSize; y++) {
                for (let x = 0; x < outTileSize; x++) {
                    const outX = outStartX + x;
                    const outY = outStartY + y;

                    if (outX >= outputWidth || outY >= outputHeight) continue;

                    // Use gaussian window to create smooth feathered blend at tile boundaries
                    const weightX = gaussianWindow[x];
                    const weightY = gaussianWindow[y];
                    const weight = weightX * weightY;

                    const srcIdx = y * outTileSize + x;
                    const dstIdx = outY * outputWidth + outX;

                    outputData[0 * outputWidth * outputHeight + dstIdx] += tileOutput[0 * outTileSize * outTileSize + srcIdx] * weight;
                    outputData[1 * outputWidth * outputHeight + dstIdx] += tileOutput[1 * outTileSize * outTileSize + srcIdx] * weight;
                    outputData[2 * outputWidth * outputHeight + dstIdx] += tileOutput[2 * outTileSize * outTileSize + srcIdx] * weight;
                    weightMap[dstIdx] += weight;
                }
            }

            processedTiles++;
            onProgress?.(`Processing tile ${processedTiles}/${totalTiles}...`);
        }
    }

    const finalOutput = new Uint8ClampedArray(outputWidth * outputHeight * 4);
    for (let i = 0; i < outputWidth * outputHeight; i++) {
        const weight = weightMap[i] || 1;
        finalOutput[i * 4] = Math.min(255, Math.max(0, Math.round((outputData[0 * outputWidth * outputHeight + i] / weight) * 255)));
        finalOutput[i * 4 + 1] = Math.min(255, Math.max(0, Math.round((outputData[1 * outputWidth * outputHeight + i] / weight) * 255)));
        finalOutput[i * 4 + 2] = Math.min(255, Math.max(0, Math.round((outputData[2 * outputWidth * outputHeight + i] / weight) * 255)));
        finalOutput[i * 4 + 3] = 255;
    }

    return { data: finalOutput, width: outputWidth, height: outputHeight };
}

export async function enhanceImage(imageDataUrl, onProgress) {
    try {
        console.log('[AI] Starting image enhancement with SwinIR...');
        onProgress?.('Loading SwinIR model...');

        const session = await getUpscalerSession(onProgress);

        const img = await dataUrlToImage(imageDataUrl);
        const originalWidth = img.width;
        const originalHeight = img.height;

        const canvas = document.createElement('canvas');
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, originalWidth, originalHeight);

        onProgress?.('Enhancing image...');

        const result = await runSwinIR(session, imageData.data, originalWidth, originalHeight, onProgress);

        // Return full 4x enhanced output - no destructive downscaling
        const outputCanvas = document.createElement('canvas');
        outputCanvas.width = result.width;
        outputCanvas.height = result.height;
        const outputCtx = outputCanvas.getContext('2d');
        const outputImageData = outputCtx.createImageData(result.width, result.height);
        outputImageData.data.set(result.data);
        outputCtx.putImageData(outputImageData, 0, 0);

        console.log('[AI] Enhancement complete: ' + originalWidth + 'x' + originalHeight + ' -> ' + result.width + 'x' + result.height);
        return outputCanvas.toDataURL('image/png');
    } catch (error) {
        console.error('[AI] Enhancement failed:', error);
        throw new Error('Image enhancement failed: ' + error.message);
    }
}

export async function upscaleImage(imageDataUrl, scale = 2, onProgress) {
    try {
        console.log(`[AI] Starting image upscaling with SwinIR (scale: ${scale}x)...`);
        onProgress?.('Loading SwinIR model...');

        const session = await getUpscalerSession(onProgress);

        const img = await dataUrlToImage(imageDataUrl);
        const originalWidth = img.width;
        const originalHeight = img.height;

        const canvas = document.createElement('canvas');
        canvas.width = originalWidth;
        canvas.height = originalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, originalWidth, originalHeight);

        onProgress?.('Upscaling image...');

        const result = await runSwinIR(session, imageData.data, originalWidth, originalHeight, onProgress);

        // SwinIR returns 4x output. If scale != 4, apply bicubic downscaling once (better quality)
        if (Math.abs(scale - 4) < 0.01) {
            // Already 4x, return as-is
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = result.width;
            outputCanvas.height = result.height;
            const outputCtx = outputCanvas.getContext('2d');
            const outputImageData = outputCtx.createImageData(result.width, result.height);
            outputImageData.data.set(result.data);
            outputCtx.putImageData(outputImageData, 0, 0);

            console.log(`[AI] SwinIR upscaling complete: ${originalWidth}x${originalHeight} -> ${result.width}x${result.height}`);
            return outputCanvas.toDataURL('image/png');
        } else {
            // Scale to requested size using canvas resampling (better than multiple downscales)
            const targetWidth = Math.round(originalWidth * scale);
            const targetHeight = Math.round(originalHeight * scale);

            // First, put 4x result into a canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = result.width;
            tempCanvas.height = result.height;
            const tempCtx = tempCanvas.getContext('2d');
            const tempImageData = tempCtx.createImageData(result.width, result.height);
            tempImageData.data.set(result.data);
            tempCtx.putImageData(tempImageData, 0, 0);

            // Then resample to target size
            const outputCanvas = document.createElement('canvas');
            outputCanvas.width = targetWidth;
            outputCanvas.height = targetHeight;
            const outputCtx = outputCanvas.getContext('2d');
            outputCtx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight);

            console.log(`[AI] SwinIR upscaling complete: ${originalWidth}x${originalHeight} -> ${targetWidth}x${targetHeight}`);
            return outputCanvas.toDataURL('image/png');
        }
    } catch (error) {
        console.error('[AI] Upscaling failed:', error);
        throw new Error('Image upscaling failed: ' + error.message);
    }
}

export async function removeBackground(imageDataUrl, onProgress) {
    try {
        console.log('[AI] Starting background removal...');

        const segmenter = await getSegmentationPipeline(onProgress);

        onProgress?.('Processing image...');

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
