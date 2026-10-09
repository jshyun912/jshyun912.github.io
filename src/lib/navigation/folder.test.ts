import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { createFolderNavigation, findFolder } from './folder';
import type { FolderTile, Tile } from '$lib/tiles/types';

const tools: FolderTile = {
	type: 'folder', id: 'tools', title: '도구', size: 'wide', children: []
};

describe('folder navigation', () => {
	it('starts at home and opens then closes a folder', () => {
		const navigation = createFolderNavigation();
		expect(get(navigation.activeFolder)).toBeNull();
		navigation.open(tools);
		expect(get(navigation.activeFolder)).toBe(tools);
		navigation.close();
		expect(get(navigation.activeFolder)).toBeNull();
	});

	it('allows an empty folder', () => {
		const navigation = createFolderNavigation();
		expect(() => navigation.open(tools)).not.toThrow();
		expect(get(navigation.activeFolder)?.children).toEqual([]);
	});

	it('finds a nested folder by ID', () => {
		const nested: FolderTile = { type: 'folder', id: 'nested', title: '더 보기', size: 'medium', children: [] };
		const tree: Tile[] = [{ ...tools, children: [nested] }];
		expect(findFolder(tree, 'nested')).toBe(nested);
		expect(findFolder(tree, 'unknown')).toBeNull();
	});
});
