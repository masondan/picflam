<script>
	import '$lib/styles/global.css';
	import { onMount } from 'svelte';

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.has('reset')) {
			localStorage.setItem('picflam_gen_count', '0');
			window.history.replaceState({}, '', window.location.pathname);
		}
	});
</script>

<div class="app">
	<slot />
</div>
