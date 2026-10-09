<script lang="ts">
	import type { ActionTile } from '$lib/tiles/types';
	import { browserStorage, toggleTheme } from '$lib/theme/theme';

	let { tile }: { tile: ActionTile } = $props();
</script>

<button
	type="button"
	class="tile action-tile"
	data-size={tile.size}
	data-color={tile.color ?? 'accent'}
	data-tile-id={tile.id}
	aria-label={tile.ariaLabel ?? tile.title}
	onclick={() => toggleTheme(document.documentElement, browserStorage())}
>
	<span class="action-mark" aria-hidden="true">◐</span>
	<span class="tile-title">{tile.title}</span>
</button>
