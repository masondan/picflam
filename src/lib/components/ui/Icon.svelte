<script>
	/** @type {string} */
	export let name;
	
	/** @type {number} */
	export let size = 24;
</script>

<svg
	class="icon"
	width={size}
	height={size}
	aria-hidden="true"
>
	<use href="/icons/icon-{name}.svg#icon" />
</svg>

<style>
	.icon {
		display: inline-block;
		vertical-align: middle;
		fill: currentColor;
	}
</style>
