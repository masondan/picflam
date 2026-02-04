<script>
	import { onMount } from 'svelte';
	
	export let beforeImage = '';
	export let afterImage = '';
	export let position = 50;
	export let onChange = () => {};
	
	let container;
	let isDragging = false;
	
	onMount(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('touchmove', handleTouchMove, { passive: false });
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('touchend', handleMouseUp);
		
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('touchmove', handleTouchMove);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('touchend', handleMouseUp);
		};
	});
	
	function handleMouseDown() {
		isDragging = true;
	}
	
	function handleTouchStart(e) {
		if (e.touches.length === 1) {
			isDragging = true;
		}
	}
	
	function handleMouseMove(e) {
		if (!isDragging || !container) return;
		updatePosition(e.clientX);
	}
	
	function handleTouchMove(e) {
		if (!isDragging || !container || e.touches.length !== 1) return;
		e.preventDefault();
		updatePosition(e.touches[0].clientX);
	}
	
	function handleMouseUp() {
		isDragging = false;
	}
	
	function updatePosition(clientX) {
		const rect = container.getBoundingClientRect();
		const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
		position = newPosition;
		onChange(newPosition);
	}
	
	function handleContainerClick(e) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
		position = Math.max(0, Math.min(100, newPosition));
		onChange(position);
	}
</script>

<div 
	class="before-after-container" 
	bind:this={container}
	on:click={handleContainerClick}
	role="slider"
	aria-label="Before and after comparison"
	tabindex="0"
>
	<div class="before-image">
		<img src={beforeImage} alt="Before" />
	</div>
	
	<div class="after-image" style="clip-path: inset(0 {100 - position}% 0 0)">
		<img src={afterImage} alt="After" />
	</div>
	
	<div 
		class="slider-handle"
		style="left: {position}%"
		on:mousedown={handleMouseDown}
		on:touchstart={handleTouchStart}
		role="presentation"
	>
		<div class="slider-line"></div>
		<div class="slider-thumb">
			<img src="/icons/icon-ai-slider.svg" alt="" class="slider-icon" />
		</div>
	</div>
</div>

<style>
	.before-after-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		cursor: col-resize;
		user-select: none;
		-webkit-user-select: none;
	}
	
	.before-image {
		width: 100%;
		height: auto;
	}
	
	.before-image img {
		display: block;
		width: 100%;
		height: auto;
	}
	
	.after-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-image: 
			linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
			linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
		background-size: 16px 16px;
		background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
		background-color: #ffffff;
	}
	
	.after-image img {
		display: block;
		width: 100%;
		height: auto;
	}
	
	.slider-handle {
		position: absolute;
		top: 0;
		width: 4px;
		height: 100%;
		transform: translateX(-50%);
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.slider-line {
		position: absolute;
		width: 4px;
		height: 100%;
		background-color: var(--color-primary);
		left: -2px;
	}
	
	.slider-thumb {
		position: absolute;
		width: 48px;
		height: 48px;
		background-color: var(--color-primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		left: -24px;
		top: 50%;
		transform: translateY(-50%);
	}
	
	.slider-icon {
		width: 20px;
		height: 20px;
		filter: brightness(0) invert(1);
		pointer-events: none;
	}
</style>
