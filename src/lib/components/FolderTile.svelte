<script lang="ts">
	import type { FolderTile } from '$lib/tiles/types';

	let {
		tile,
		onOpenFolder
	}: {
		tile: FolderTile;
		onOpenFolder: (folder: FolderTile) => void;
	} = $props();
</script>

<button
	type="button"
	class="tile folder-tile"
	data-size={tile.size}
	data-color={tile.color ?? 'accent'}
	data-tile-id={tile.id}
	aria-label={tile.ariaLabel ?? tile.title}
	onclick={() => onOpenFolder(tile)}
>
	<span class="folder-mark" aria-hidden="true">▦</span>
	<span class="tile-title">{tile.title}</span>
</button>
