<script lang="ts">
	import StandardTile from './StandardTile.svelte';
	import FolderTileView from './FolderTile.svelte';
	import ActionTile from './ActionTile.svelte';
	import type { FolderTile, Tile } from '$lib/tiles/types';

	let {
		tile,
		onOpenFolder
	}: {
		tile: Tile;
		onOpenFolder: (folder: FolderTile) => void;
	} = $props();
</script>

{#if tile.type === 'standard'}
	<StandardTile {tile} />
{:else if tile.type === 'folder'}
	<FolderTileView {tile} {onOpenFolder} />
{:else}
	<ActionTile {tile} />
{/if}
