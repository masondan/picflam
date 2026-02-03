export function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

export async function getImageDimensions(dataUrl) {
	const img = await loadImage(dataUrl);
	return { width: img.naturalWidth, height: img.naturalHeight };
}

export function resizeImage(dataUrl, maxDimension = 2048) {
	return new Promise(async (resolve) => {
		const img = await loadImage(dataUrl);
		const { naturalWidth, naturalHeight } = img;
		
		if (naturalWidth <= maxDimension && naturalHeight <= maxDimension) {
			resolve(dataUrl);
			return;
		}
		
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		
		let newWidth, newHeight;
		if (naturalWidth > naturalHeight) {
			newWidth = maxDimension;
			newHeight = (naturalHeight / naturalWidth) * maxDimension;
		} else {
			newHeight = maxDimension;
			newWidth = (naturalWidth / naturalHeight) * maxDimension;
		}
		
		canvas.width = newWidth;
		canvas.height = newHeight;
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		
		resolve(canvas.toDataURL('image/jpeg', 0.92));
	});
}

export async function pasteImageFromClipboard() {
	try {
		const clipboardItems = await navigator.clipboard.read();
		for (const item of clipboardItems) {
			for (const type of item.types) {
				if (type.startsWith('image/')) {
					const blob = await item.getType(type);
					return await fileToDataUrl(blob);
				}
			}
		}
		return null;
	} catch (err) {
		console.error('Failed to paste from clipboard:', err);
		return null;
	}
}

export async function copyImageToClipboard(dataUrl) {
	try {
		const response = await fetch(dataUrl);
		const blob = await response.blob();
		await navigator.clipboard.write([
			new ClipboardItem({ [blob.type]: blob })
		]);
		return true;
	} catch (err) {
		console.error('Failed to copy to clipboard:', err);
		return false;
	}
}

export function downloadImage(dataUrl, filename = 'picflam-export.png') {
	const link = document.createElement('a');
	link.href = dataUrl;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export function hexToRgba(hex, alpha = 1) {
	if (!hex || hex === 'transparent') return 'transparent';
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function applyCrop(dataUrl, cropBox, imageWidth, imageHeight) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const sx = (cropBox.x / 100) * imageWidth;
	const sy = (cropBox.y / 100) * imageHeight;
	const sw = (cropBox.width / 100) * imageWidth;
	const sh = (cropBox.height / 100) * imageHeight;

	canvas.width = sw;
	canvas.height = sh;
	ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

	return canvas.toDataURL('image/png');
}

export async function applyImageEdits(dataUrl, edits) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	const brightness = 1 + (edits.brightness || 0) / 100;
	const contrast = 1 + (edits.contrast || 0) / 100;

	ctx.filter = `brightness(${brightness}) contrast(${contrast})`;
	ctx.drawImage(img, 0, 0);

	if (edits.shadows !== 0 || edits.hdr !== 0) {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		const shadowsAdj = (edits.shadows || 0) / 100;
		const hdrAdj = (edits.hdr || 0) / 100;

		for (let i = 0; i < data.length; i += 4) {
			let r = data[i];
			let g = data[i + 1];
			let b = data[i + 2];

			const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
			const shadowFactor = Math.pow(1 - luminance, 2);
			const shadowBoost = 1 + shadowsAdj * shadowFactor * 0.5;

			r = Math.min(255, r * shadowBoost);
			g = Math.min(255, g * shadowBoost);
			b = Math.min(255, b * shadowBoost);

			if (hdrAdj > 0) {
				const avg = (r + g + b) / 3;
				const clarity = 1 + hdrAdj * 0.3;
				r = Math.min(255, Math.max(0, avg + (r - avg) * clarity));
				g = Math.min(255, Math.max(0, avg + (g - avg) * clarity));
				b = Math.min(255, Math.max(0, avg + (b - avg) * clarity));
			}

			data[i] = r;
			data[i + 1] = g;
			data[i + 2] = b;
		}

		ctx.putImageData(imageData, 0, 0);
	}

	return canvas.toDataURL('image/png');
}

export async function applyBlur(dataUrl, blurMask) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;
	ctx.drawImage(img, 0, 0);

	if (!blurMask || blurMask.length === 0) {
		return canvas.toDataURL('image/png');
	}

	const blurCanvas = document.createElement('canvas');
	const blurCtx = blurCanvas.getContext('2d');
	blurCanvas.width = canvas.width;
	blurCanvas.height = canvas.height;
	blurCtx.filter = 'blur(15px)';
	blurCtx.drawImage(img, 0, 0);

	const maskCanvas = document.createElement('canvas');
	const maskCtx = maskCanvas.getContext('2d');
	maskCanvas.width = canvas.width;
	maskCanvas.height = canvas.height;

	maskCtx.fillStyle = 'black';
	maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

	maskCtx.fillStyle = 'white';
	for (const point of blurMask) {
		maskCtx.beginPath();
		maskCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
		maskCtx.fill();
	}

	const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const blurredData = blurCtx.getImageData(0, 0, canvas.width, canvas.height);
	const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < originalData.data.length; i += 4) {
		const maskValue = maskData.data[i] / 255;
		originalData.data[i] = originalData.data[i] * (1 - maskValue) + blurredData.data[i] * maskValue;
		originalData.data[i + 1] = originalData.data[i + 1] * (1 - maskValue) + blurredData.data[i + 1] * maskValue;
		originalData.data[i + 2] = originalData.data[i + 2] * (1 - maskValue) + blurredData.data[i + 2] * maskValue;
	}

	ctx.putImageData(originalData, 0, 0);
	return canvas.toDataURL('image/png');
}

export async function rotateImage(dataUrl, degrees) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	const isRightAngle = degrees === 90 || degrees === 270;
	canvas.width = isRightAngle ? img.naturalHeight : img.naturalWidth;
	canvas.height = isRightAngle ? img.naturalWidth : img.naturalHeight;

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((degrees * Math.PI) / 180);
	ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

	return canvas.toDataURL('image/png');
}

export async function flipImage(dataUrl, horizontal) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	if (horizontal) {
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
	} else {
		ctx.translate(0, canvas.height);
		ctx.scale(1, -1);
	}

	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL('image/png');
}

export async function applyFilter(dataUrl, filterCss, strength) {
	const img = await loadImage(dataUrl);
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	ctx.drawImage(img, 0, 0);
	const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	ctx.filter = filterCss;
	ctx.drawImage(img, 0, 0);
	const filteredData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	const blendRatio = strength / 50;
	const originalWeight = Math.max(0, 1 - blendRatio);
	const filteredWeight = Math.min(2, blendRatio);

	for (let i = 0; i < originalData.data.length; i += 4) {
		originalData.data[i] = Math.min(255, Math.max(0, originalData.data[i] * originalWeight + filteredData.data[i] * filteredWeight));
		originalData.data[i + 1] = Math.min(255, Math.max(0, originalData.data[i + 1] * originalWeight + filteredData.data[i + 1] * filteredWeight));
		originalData.data[i + 2] = Math.min(255, Math.max(0, originalData.data[i + 2] * originalWeight + filteredData.data[i + 2] * filteredWeight));
	}

	ctx.putImageData(originalData, 0, 0);
	return canvas.toDataURL('image/png');
}
