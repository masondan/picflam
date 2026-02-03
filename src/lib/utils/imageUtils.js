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
