<script lang="ts">
	import TileGrid from './TileGrid.svelte';
	import type { FolderTile } from '$lib/tiles/types';

	let {
		folder,
		onBack,
		onOpenFolder
	}: {
		folder: FolderTile;
		onBack: () => void;
		onOpenFolder: (folder: FolderTile) => void;
	} = $props();
</script>

<section class="folder-view" aria-label={folder.title}>
	<button class="back-button" type="button" onclick={onBack}>← start</button>
	<h2 class="folder-heading">{folder.title}</h2>
	{#if folder.children.length > 0}
		<TileGrid tiles={folder.children} {onOpenFolder} />
	{:else}
		<p class="empty-folder">이 폴더는 비어 있습니다.</p>
	{/if}
</section>
