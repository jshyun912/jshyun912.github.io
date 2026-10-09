<script lang="ts">
	import type { ActionTile } from '$lib/tiles/types';
	import { browserStorage, theme, toggleTheme } from '$lib/theme/theme';

	let { tile }: { tile: ActionTile } = $props();
	const label = $derived($theme === 'dark' ? '주간 모드' : '다크 모드');
</script>

<button
	type="button"
	class="tile action-tile"
	data-size={tile.size}
	data-color={tile.color ?? 'accent'}
	data-tile-id={tile.id}
	aria-label={label}
	onclick={() => toggleTheme(document.documentElement, browserStorage())}
>
	<svg class="action-mark" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		{#if $theme === 'dark'}
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
		{:else}
			<path d="M20.9 13.2A9 9 0 0 1 10.8 3.1a9 9 0 1 0 10.1 10.1Z" />
		{/if}
	</svg>
	<span class="tile-title">{label}</span>
</button>
