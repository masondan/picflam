<script>
	import ToggleButtonGroup from '$lib/components/ui/ToggleButtonGroup.svelte';

	export let canvasSize = '1/1';
	export let onSizeChange = (size) => {};

	const sizeOptions = [
		{ id: '9/16', label: '9:16', icon: 'icon-vertical' },
		{ id: '1/1', label: '1:1', icon: 'icon-square' },
		{ id: '16/9', label: '16:9', icon: 'icon-horizontal' }
	];

	function handleChange(id) {
		onSizeChange(id);
	}
</script>

<div class="size-controls">
	<ToggleButtonGroup 
		options={sizeOptions} 
		value={canvasSize} 
		onChange={handleChange}
		showLabels={true}
		centered={true}
	/>
</div>

<style>
	.size-controls {
		display: flex;
		justify-content: center;
	}
</style>
