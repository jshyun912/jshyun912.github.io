import type { TileSize } from './types';

export const TILE_SPANS = {
	small: { columns: 1, rows: 1 },
	medium: { columns: 2, rows: 2 },
	wide: { columns: 4, rows: 2 },
	large: { columns: 4, rows: 4 }
} as const satisfies Record<TileSize, { columns: number; rows: number }>;
