import type { Tile } from './types';
import { TILE_SPANS } from './presets';

export function validateTiles(tiles: Tile[]): void {
	const ids = new Set<string>();

	function visit(items: Tile[]): void {
		for (const tile of items) {
			if (!Object.hasOwn(TILE_SPANS, tile.size)) {
				throw new Error(`Unsupported tile size: ${tile.size}`);
			}
			if (ids.has(tile.id)) {
				throw new Error(`Duplicate tile id: ${tile.id}`);
			}
			ids.add(tile.id);
			if (tile.type === 'folder') visit(tile.children);
		}
	}

	visit(tiles);
}
