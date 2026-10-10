<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { applyTheme, browserStorage, readInitialTheme } from '$lib/theme/theme';

	let { children } = $props();
	onMount(() => {
		applyTheme(readInitialTheme(browserStorage(), window.matchMedia.bind(window)), document.documentElement);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
