<script>
	import { onMount } from 'svelte';

	export let color = '#000000';
	export let open = false;
	export let onColorChange = (color) => {};
	export let onClose = () => {};

	let pickerEl;

	onMount(async () => {
		await import('vanilla-colorful');
	});

	function handleColorChanged(e) {
		onColorChange(e.detail.value);
	}

	function handleBackdropClick() {
		onClose();
	}

	$: if (pickerEl && open) {
		pickerEl.color = color;
	}
</script>

{#if open}
	<div class="picker-backdrop" on:click={handleBackdropClick}>
		<div class="picker-container" on:click|stopPropagation>
			<hex-color-picker
				bind:this={pickerEl}
				color={color}
				on:color-changed={handleColorChanged}
			></hex-color-picker>
		</div>
	</div>
{/if}

<style>
	.picker-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.picker-container {
		background: white;
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	}
</style>
