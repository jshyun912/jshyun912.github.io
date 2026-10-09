import { describe, expect, it } from 'vitest';
import { homeTiles } from './home';
import { TILE_SPANS } from './presets';
import type { Tile } from './types';
import { validateTiles } from './validate';

const standard = (id: string): Tile => ({ type: 'standard', id, title: id, size: 'small' });

describe('tile presets', () => {
	it('maps every size to its column and row span', () => {
		expect(TILE_SPANS).toEqual({
			small: { columns: 1, rows: 1 },
			medium: { columns: 2, rows: 2 },
			wide: { columns: 4, rows: 2 },
			large: { columns: 4, rows: 4 }
		});
	});
});

describe('validateTiles', () => {
	it('accepts unique IDs across nested folders', () => {
		expect(() =>
			validateTiles([
				standard('first'),
				{
					type: 'folder',
					id: 'tools',
					title: '도구',
					size: 'medium',
					children: [standard('counter'), {
						type: 'folder',
						id: 'more',
						title: '더 보기',
						size: 'medium',
						children: [standard('converter')]
					}]
				}
			])
		).not.toThrow();
	});

	it('rejects a duplicate ID in a nested folder', () => {
		expect(() =>
			validateTiles([
				standard('counter'),
				{
					type: 'folder',
					id: 'tools',
					title: '도구',
					size: 'medium',
					children: [standard('counter')]
				}
			])
		).toThrow('Duplicate tile id: counter');
	});

	it('rejects an unsupported size in runtime data', () => {
		const invalid = { ...standard('bad-size'), size: 'giant' } as unknown as Tile;
		expect(() => validateTiles([invalid])).toThrow('Unsupported tile size: giant');
	});

	it('accepts the initial home tile tree', () => {
		expect(() => validateTiles(homeTiles)).not.toThrow();
	});

	it('groups the demonstration tool alongside portfolio tiles', () => {
		expect(homeTiles.map((tile) => tile.id)).toEqual(
			expect.arrayContaining(['intro', 'projects', 'tools', 'contact', 'theme'])
		);
		const tools = homeTiles.find((tile) => tile.id === 'tools');
		expect(tools?.type).toBe('folder');
		if (tools?.type === 'folder') {
			expect(tools.children).toEqual(
				expect.arrayContaining([expect.objectContaining({ id: 'text-counter', href: '/tools/text-counter/' })])
			);
		}
	});
});
