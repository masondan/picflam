<script>
	import ImportArea from '$lib/components/ui/ImportArea.svelte';
	import ActionBar from '$lib/components/ui/ActionBar.svelte';
	import SubMenuTabs from '$lib/components/ui/SubMenuTabs.svelte';
	import ConfirmModal from '$lib/components/ui/ConfirmModal.svelte';
	import AlertModal from '$lib/components/ui/AlertModal.svelte';
	import CropCanvas from './CropCanvas.svelte';
	import CropControls from './CropControls.svelte';
	import EditControls from './EditControls.svelte';
	import FilterControls from './FilterControls.svelte';
	import { cropState, activeSubMenu, hasImage, resetCropState, FILTER_DEFINITIONS } from '$lib/stores/cropStore.js';
	
	const undoState = cropState.undoState;
	import { copyImageToClipboard, downloadImage, getImageDimensions, applyCrop, flipImage, rotateImage, renderFinalImage } from '$lib/utils/imageUtils.js';
	
	const subMenuTabs = [
		{ id: 'crop', label: 'Crop' },
		{ id: 'edit', label: 'Edit' },
		{ id: 'filter', label: 'Filter' }
	];
	
	let modalType = null;
	let pendingAction = null;
	let modalAction = null;
	
	$: cropWidth = Math.round($cropState.imageWidth * $cropState.cropBox.width / 100);
	$: cropHeight = Math.round($cropState.imageHeight * $cropState.cropBox.height / 100);
	
	async function handleImageImport(dataUrl) {
		const dims = await getImageDimensions(dataUrl);
		cropState.set({
			...$cropState,
			originalImage: dataUrl,
			currentImage: dataUrl,
			imageWidth: dims.width,
			imageHeight: dims.height,
			width: dims.width,
			height: dims.height,
			cropBox: { x: 0, y: 0, width: 100, height: 100 },
			isCropping: true,
			cropPending: false,
			aspectRatio: 'custom',
			ratioLocked: false
		});
		cropState.setBaseState();
		activeSubMenu.set('crop');
	}
	
	function handleSubMenuChange(tab) {
		if ($cropState.cropPending && $activeSubMenu === 'crop' && tab !== 'crop') {
			pendingAction = () => {
				activeSubMenu.set(tab);
				cropState.silentUpdate(state => ({ ...state, isCropping: false }));
			};
			modalType = 'save';
			return;
		}
		
		if (tab === 'crop') {
			cropState.silentUpdate(state => ({
				...state,
				isCropping: true
			}));
		} else {
			cropState.silentUpdate(state => ({
				...state,
				isCropping: false
			}));
		}
		
		activeSubMenu.set($activeSubMenu === tab ? 'none' : tab);
	}
	
	async function getFinalImage() {
		const finalImage = await renderFinalImage(
			$cropState.currentImage,
			editFilterCss,
			$cropState.blurMask
		);
		return finalImage;
	}
	
	async function handleCopy() {
		if ($cropState.cropPending) {
			modalType = 'alert';
			modalAction = 'copy';
			return;
		}
		if ($cropState.currentImage) {
			const finalImage = await getFinalImage();
			await copyImageToClipboard(finalImage);
		}
	}
	
	async function handleExport() {
		if ($cropState.cropPending) {
			modalType = 'alert';
			modalAction = 'download';
			return;
		}
		if ($cropState.currentImage) {
			const finalImage = await getFinalImage();
			downloadImage(finalImage, 'picflam-export.png');
		}
	}
	
	function handleStartAgain() {
		modalType = 'startAgain';
	}
	
	function handleUndo() {
		cropState.undo();
	}
	
	function handleRedo() {
		cropState.redo();
	}
	
	async function handleSaveConfirm() {
		modalType = null;
		await applyPendingCrop();
		if (pendingAction) {
			await pendingAction();
			pendingAction = null;
		}
	}
	
	function handleSaveCancel() {
		modalType = null;
		pendingAction = null;
	}
	
	function handleStartAgainConfirm() {
		modalType = null;
		resetCropState();
	}
	
	function handleStartAgainCancel() {
		modalType = null;
	}

	function handleAlertClose() {
		modalType = null;
		modalAction = null;
	}
	
	async function applyPendingCrop() {
		const state = $cropState;
		if (!state.currentImage || !state.cropPending) return;
		
		const croppedImage = await applyCrop(
			state.currentImage,
			state.cropBox,
			state.imageWidth,
			state.imageHeight
		);
		
		const dims = await getImageDimensions(croppedImage);
		
		cropState.set({
			...state,
			currentImage: croppedImage,
			imageWidth: dims.width,
			imageHeight: dims.height,
			width: dims.width,
			height: dims.height,
			cropBox: { x: 0, y: 0, width: 100, height: 100 },
			cropPending: false
		});
	}
	
	function handleRatioChange(ratio) {
		if (ratio === 'custom') {
			cropState.silentUpdate(state => ({
				...state,
				aspectRatio: 'custom',
				cropBox: { x: 0, y: 0, width: 100, height: 100 },
				ratioLocked: false,
				cropPending: false
			}));
			return;
		}
		
		const aspectRatios = {
			'9:16': 9 / 16,
			'1:1': 1,
			'16:9': 16 / 9
		};
		
		const targetRatio = aspectRatios[ratio];
		const imageRatio = $cropState.imageWidth / $cropState.imageHeight;
		let newCropBox;
		
		if (ratio === '9:16') {
			const cropHeight = 100;
			const cropWidth = (targetRatio / imageRatio) * 100;
			if (cropWidth <= 100) {
				newCropBox = { x: (100 - cropWidth) / 2, y: 0, width: cropWidth, height: cropHeight };
			} else {
				const adjustedHeight = (imageRatio / targetRatio) * 100;
				newCropBox = { x: 0, y: (100 - adjustedHeight) / 2, width: 100, height: adjustedHeight };
			}
		} else if (ratio === '16:9') {
			const cropWidth = 100;
			const cropHeight = (imageRatio / targetRatio) * 100;
			if (cropHeight <= 100) {
				newCropBox = { x: 0, y: (100 - cropHeight) / 2, width: cropWidth, height: cropHeight };
			} else {
				const adjustedWidth = (targetRatio / imageRatio) * 100;
				newCropBox = { x: (100 - adjustedWidth) / 2, y: 0, width: adjustedWidth, height: 100 };
			}
		} else if (ratio === '1:1') {
			if (imageRatio > 1) {
				const cropWidth = 100 / imageRatio;
				newCropBox = { x: (100 - cropWidth) / 2, y: 0, width: cropWidth, height: 100 };
			} else {
				const cropHeight = 100 * imageRatio;
				newCropBox = { x: 0, y: (100 - cropHeight) / 2, width: 100, height: cropHeight };
			}
		}
		
		cropState.silentUpdate(state => ({
			...state,
			aspectRatio: ratio,
			cropBox: newCropBox,
			cropPending: true,
			isCropping: true,
			ratioLocked: true
		}));
	}
	
	function handleDimensionsChange({ width: newWidth, height: newHeight }) {
		const maxWidth = $cropState.imageWidth;
		const maxHeight = $cropState.imageHeight;
		
		const clampedWidth = Math.min(Math.max(1, newWidth), maxWidth);
		const clampedHeight = Math.min(Math.max(1, newHeight), maxHeight);
		
		const widthPercent = (clampedWidth / maxWidth) * 100;
		const heightPercent = (clampedHeight / maxHeight) * 100;
		
		let newCropBox;
		
		if ($cropState.ratioLocked) {
			const currentRatio = cropWidth / cropHeight;
			if (newWidth !== cropWidth) {
				const adjustedHeight = clampedWidth / currentRatio;
				const adjustedHeightPercent = (adjustedHeight / maxHeight) * 100;
				newCropBox = {
					x: (100 - widthPercent) / 2,
					y: (100 - Math.min(100, adjustedHeightPercent)) / 2,
					width: widthPercent,
					height: Math.min(100, adjustedHeightPercent)
				};
			} else {
				const adjustedWidth = clampedHeight * currentRatio;
				const adjustedWidthPercent = (adjustedWidth / maxWidth) * 100;
				newCropBox = {
					x: (100 - Math.min(100, adjustedWidthPercent)) / 2,
					y: (100 - heightPercent) / 2,
					width: Math.min(100, adjustedWidthPercent),
					height: heightPercent
				};
			}
		} else {
			newCropBox = {
				x: (100 - widthPercent) / 2,
				y: (100 - heightPercent) / 2,
				width: widthPercent,
				height: heightPercent
			};
		}
		
		cropState.silentUpdate(state => ({
			...state,
			cropBox: newCropBox,
			cropPending: true
		}));
	}
	
	function handleLockToggle() {
		cropState.silentUpdate(state => ({
			...state,
			ratioLocked: !state.ratioLocked
		}));
	}
	
	async function handleFlip() {
		const flipped = await flipImage($cropState.currentImage, true);
		cropState.set({
			...$cropState,
			currentImage: flipped
		});
	}
	
	async function handleRotate() {
		const rotated = await rotateImage($cropState.currentImage, 90);
		const dims = await getImageDimensions(rotated);
		cropState.set({
			...$cropState,
			currentImage: rotated,
			imageWidth: dims.width,
			imageHeight: dims.height,
			cropBox: { x: 0, y: 0, width: 100, height: 100 },
			cropPending: false
		});
	}
	
	function handleScaleChange(scale) {
		cropState.silentUpdate(state => ({
			...state,
			scale: scale / 100
		}));
	}
	
	function handleCropChange(e) {
		const newCropBox = e.detail.cropBox;
		
		if ($cropState.ratioLocked && $cropState.aspectRatio !== 'custom') {
			const aspectRatios = {
				'9:16': 9 / 16,
				'1:1': 1,
				'16:9': 16 / 9
			};
			const targetRatio = aspectRatios[$cropState.aspectRatio];
			const imageRatio = $cropState.imageWidth / $cropState.imageHeight;
			
			const currentCropRatio = (newCropBox.width * $cropState.imageWidth) / (newCropBox.height * $cropState.imageHeight);
			
			if (Math.abs(currentCropRatio - targetRatio) > 0.01) {
				const cropWidthPx = (newCropBox.width / 100) * $cropState.imageWidth;
				const constrainedHeightPx = cropWidthPx / targetRatio;
				const constrainedHeightPercent = (constrainedHeightPx / $cropState.imageHeight) * 100;
				
				newCropBox.height = Math.min(100, constrainedHeightPercent);
				if (newCropBox.y + newCropBox.height > 100) {
					newCropBox.y = 100 - newCropBox.height;
				}
			}
		}
		
		cropState.silentUpdate(state => ({
			...state,
			cropBox: newCropBox,
			cropPending: true
		}));
	}
	
	function handleApplyCrop() {
		applyPendingCrop();
	}
	
	let editStateBeforeChange = null;
	
	function captureEditState() {
		if (editStateBeforeChange === null) {
			editStateBeforeChange = { ...$cropState };
		}
	}
	
	function commitEditChange() {
		if (editStateBeforeChange !== null) {
			cropState.set($cropState);
			editStateBeforeChange = null;
		}
	}
	
	function handleBrightnessChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, brightness: val }));
	}
	
	function handleShadowsChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, shadows: val }));
	}
	
	function handleContrastChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, contrast: val }));
	}
	
	function handleHdrChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, hdr: val }));
	}
	
	function handleBlurToggle(enabled) {
		cropState.set({ ...$cropState, blurEnabled: enabled });
	}
	
	function handleBlurBrushSizeChange(size) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, blurBrushSize: size }));
	}
	
	function handleBlurStrengthChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, blurStrength: val }));
	}
	
	function handleBlurSoftenChange(val) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, blurSoften: val }));
	}
	
	function handleBlurInvertChange(val) {
		cropState.set({ ...$cropState, blurInvert: val });
	}
	
	function handleBrushPreviewChange(visible) {
		cropState.silentUpdate(state => ({ ...state, showBrushPreview: visible }));
	}
	
	function handleEditEnd() {
		commitEditChange();
	}
	
	let blurStrokeTimeout = null;
	let blurStrokePoints = [];
	let blurMaskBeforeStroke = null;
	
	function handleBlurPaint(e) {
		const point = e.detail.point;
		
		if (blurMaskBeforeStroke === null) {
			blurMaskBeforeStroke = $cropState.blurMask ? [...$cropState.blurMask] : [];
		}
		
		blurStrokePoints.push(point);
		
		cropState.silentUpdate(state => ({
			...state,
			blurMask: [...(state.blurMask || []), point]
		}));
		
		if (blurStrokeTimeout) {
			clearTimeout(blurStrokeTimeout);
		}
		
		blurStrokeTimeout = setTimeout(() => {
			if (blurStrokePoints.length > 0) {
				const finalMask = [...blurMaskBeforeStroke, ...blurStrokePoints];
				cropState.set({
					...$cropState,
					blurMask: finalMask
				});
				blurStrokePoints = [];
				blurMaskBeforeStroke = null;
			}
			blurStrokeTimeout = null;
		}, 300);
	}
	
	function handleZoomChange(level) {
		cropState.silentUpdate(state => ({ ...state, zoomLevel: level }));
	}
	
	function handleNudge(direction) {
		const nudgeAmount = 20;
		cropState.silentUpdate(state => {
			let { zoomOffsetX, zoomOffsetY } = state;
			switch (direction) {
				case 'up': zoomOffsetY -= nudgeAmount; break;
				case 'down': zoomOffsetY += nudgeAmount; break;
				case 'left': zoomOffsetX -= nudgeAmount; break;
				case 'right': zoomOffsetX += nudgeAmount; break;
			}
			return { ...state, zoomOffsetX, zoomOffsetY };
		});
	}
	
	function handleResetZoom() {
		cropState.silentUpdate(state => ({
			...state,
			zoomLevel: 1,
			zoomOffsetX: 0,
			zoomOffsetY: 0
		}));
	}
	
	function handleFilterChange(filterId) {
		cropState.silentUpdate(state => ({ ...state, activeFilter: filterId }));
	}
	
	function handleStrengthChange(value) {
		captureEditState();
		cropState.silentUpdate(state => ({ ...state, filterStrength: value }));
	}
	
	function handleFilterReset() {
		cropState.set({ ...$cropState, activeFilter: 'normal', filterStrength: 100 });
	}
	
	$: editOnlyFilterCss = (() => {
		let filters = [];
		
		if ($cropState.brightness !== 0) {
			filters.push(`brightness(${1 + $cropState.brightness / 100})`);
		}
		if ($cropState.contrast !== 0) {
			filters.push(`contrast(${1 + $cropState.contrast / 100})`);
		}
		if ($cropState.shadows !== 0) {
			const shadowAdjust = 1 + ($cropState.shadows / 200);
			filters.push(`brightness(${shadowAdjust})`);
		}
		if ($cropState.hdr !== 0) {
			const saturation = 1 + ($cropState.hdr / 100) * 0.3;
			const contrast = 1 + ($cropState.hdr / 100) * 0.2;
			filters.push(`saturate(${saturation}) contrast(${contrast})`);
		}
		
		return filters.length > 0 ? filters.join(' ') : 'none';
	})();

	$: editFilterCss = (() => {
		let filters = [editOnlyFilterCss];
		
		if ($cropState.activeFilter !== 'normal') {
			const filterDef = FILTER_DEFINITIONS.find(f => f.id === $cropState.activeFilter);
			if (filterDef && filterDef.css !== 'none') {
				filters.push(filterDef.css);
			}
		}
		
		return filters.filter(f => f !== 'none').join(' ') || 'none';
	})();
</script>

<div class="crop-tab">
	{#if !$hasImage}
		<ImportArea 
			title="Crop, edit and add"
			subtitle="filters to photos"
			hint="Import, drag or paste an image"
			onImageImport={handleImageImport}
		/>
	{:else}
		<ActionBar 
			canUndo={$undoState.canUndo}
			canRedo={$undoState.canRedo}
			onUndo={handleUndo}
			onRedo={handleRedo}
			onStartAgain={handleStartAgain}
			onCopy={handleCopy}
			onExport={handleExport}
		/>
		
		<CropCanvas
			imageSrc={$cropState.currentImage}
			cropBox={$cropState.cropBox}
			isCropping={$cropState.isCropping}
			scale={$activeSubMenu === 'edit' ? $cropState.zoomLevel : $cropState.scale}
			offsetX={$activeSubMenu === 'edit' ? $cropState.zoomOffsetX : $cropState.offsetX}
			offsetY={$activeSubMenu === 'edit' ? $cropState.zoomOffsetY : $cropState.offsetY}
			imageWidth={$cropState.imageWidth}
			imageHeight={$cropState.imageHeight}
			editFilters={editFilterCss}
			editOnlyFilters={editOnlyFilterCss}
			filterDefinition={FILTER_DEFINITIONS.find(f => f.id === $cropState.activeFilter)}
			filterStrength={$cropState.filterStrength}
			blurEnabled={$cropState.blurEnabled}
			blurBrushSize={$cropState.blurBrushSize}
			blurStrength={$cropState.blurStrength}
			blurSoften={$cropState.blurSoften}
			blurInvert={$cropState.blurInvert}
			blurMask={$cropState.blurMask || []}
			showBrushPreview={$cropState.showBrushPreview}
			on:cropChange={handleCropChange}
			on:blurPaint={handleBlurPaint}
		/>
		
		<SubMenuTabs 
			tabs={subMenuTabs}
			activeTab={$activeSubMenu}
			onTabChange={handleSubMenuChange}
		/>
		
		{#if $activeSubMenu === 'crop'}
			<CropControls
				aspectRatio={$cropState.aspectRatio}
				cropWidth={cropWidth}
				cropHeight={cropHeight}
				ratioLocked={$cropState.ratioLocked}
				scale={Math.round($cropState.scale * 100)}
				cropPending={$cropState.cropPending}
				onRatioChange={handleRatioChange}
				onDimensionsChange={handleDimensionsChange}
				onLockToggle={handleLockToggle}
				onFlip={handleFlip}
				onRotate={handleRotate}
				onScaleChange={handleScaleChange}
				onApply={handleApplyCrop}
			/>
		{:else if $activeSubMenu === 'edit'}
			<div class="controls-panel">
				<EditControls
					brightness={$cropState.brightness}
					shadows={$cropState.shadows}
					contrast={$cropState.contrast}
					hdr={$cropState.hdr}
					blurEnabled={$cropState.blurEnabled}
					blurBrushSize={$cropState.blurBrushSize}
					blurStrength={$cropState.blurStrength}
					blurSoften={$cropState.blurSoften}
					blurInvert={$cropState.blurInvert}
					zoomLevel={$cropState.zoomLevel}
					onBrightnessChange={handleBrightnessChange}
					onShadowsChange={handleShadowsChange}
					onContrastChange={handleContrastChange}
					onHdrChange={handleHdrChange}
					onBlurToggle={handleBlurToggle}
					onBlurBrushSizeChange={handleBlurBrushSizeChange}
					onBlurStrengthChange={handleBlurStrengthChange}
					onBlurSoftenChange={handleBlurSoftenChange}
					onBlurInvertChange={handleBlurInvertChange}
					onZoomChange={handleZoomChange}
					onNudge={handleNudge}
					onResetZoom={handleResetZoom}
					onBrushPreviewChange={handleBrushPreviewChange}
					onEditEnd={handleEditEnd}
				/>
			</div>
		{:else if $activeSubMenu === 'filter'}
			<div class="controls-panel">
				<FilterControls
					imageUrl={$cropState.currentImage}
					activeFilter={$cropState.activeFilter}
					filterStrength={$cropState.filterStrength}
					onFilterChange={handleFilterChange}
					onStrengthChange={handleStrengthChange}
					onReset={handleFilterReset}
				/>
			</div>
		{/if}
	{/if}
	
	{#if modalType === 'save'}
		<ConfirmModal
			message="<span class='modal-message-first'>Apply changes?</span><br /><span class='modal-message-second'>Before downloading</span>"
			confirmText="Yes"
			cancelText="Cancel"
			onConfirm={handleSaveConfirm}
			onCancel={handleSaveCancel}
		/>
	{/if}
	
	{#if modalType === 'startAgain'}
		<ConfirmModal
			message="<span class='modal-message-first'>Start again?</span><br /><span class='modal-message-second'>Your changes will be lost.</span>"
			confirmText="Yes"
			cancelText="Cancel"
			onConfirm={handleStartAgainConfirm}
			onCancel={handleStartAgainCancel}
		/>
	{/if}

	{#if modalType === 'alert' && modalAction === 'download'}
		<AlertModal
			message="<span class='modal-message-first'>Apply changes</span><br /><span class='modal-message-second'>before downloading</span>"
			actionText="Got it"
			onAction={handleAlertClose}
		/>
	{/if}

	{#if modalType === 'alert' && modalAction === 'copy'}
		<AlertModal
			message="<span class='modal-message-first'>Apply changes</span><br /><span class='modal-message-second'>before copying</span>"
			actionText="Got it"
			onAction={handleAlertClose}
		/>
	{/if}
</div>

<style>
	.crop-tab {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.controls-panel {
		padding: var(--space-4) 0;
	}
	
	:global(.crop-canvas) {
		margin-top: var(--space-3);
	}
</style>
