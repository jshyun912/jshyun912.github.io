import { writable } from 'svelte/store';
import type { FolderTile, Tile } from '$lib/tiles/types';

export function createFolderNavigation() {
	const activeFolder = writable<FolderTile | null>(null);
	return {
		activeFolder: { subscribe: activeFolder.subscribe },
		open(folder: FolderTile) { activeFolder.set(folder); },
		close() { activeFolder.set(null); }
	};
}

export function findFolder(tiles: Tile[], id: string): FolderTile | null {
	for (const tile of tiles) {
		if (tile.type !== 'folder') continue;
		if (tile.id === id) return tile;
		const child = findFolder(tile.children, id);
		if (child) return child;
	}
	return null;
}
