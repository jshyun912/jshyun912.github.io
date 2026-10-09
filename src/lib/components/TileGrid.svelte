<script lang="ts">
	import TileRenderer from './TileRenderer.svelte';
	import type { FolderTile, Tile } from '$lib/tiles/types';

	let {
		tiles,
		onOpenFolder
	}: {
		tiles: Tile[];
		onOpenFolder: (folder: FolderTile) => void;
	} = $props();
</script>

<div class="tile-grid" aria-label="타일 목록">
	{#each tiles as tile (tile.id)}
		<TileRenderer {tile} {onOpenFolder} />
	{/each}
</div>
