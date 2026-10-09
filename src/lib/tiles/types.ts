import type { Component } from 'svelte';

export type TileSize = 'small' | 'medium' | 'wide' | 'large';
export type TileColor = 'accent' | 'blue' | 'teal' | 'violet' | 'slate';

export type BaseTile = {
	id: string;
	title: string;
	size: TileSize;
	color?: TileColor;
	icon?: string;
	ariaLabel?: string;
};

export type StandardTile = BaseTile & {
	type: 'standard';
	description?: string;
	href?: string;
	external?: boolean;
	contentComponent?: Component;
};

export type FolderTile = BaseTile & {
	type: 'folder';
	children: Tile[];
};

export type ActionTile = BaseTile & {
	type: 'action';
	action: 'toggle-theme';
};

export type Tile = StandardTile | FolderTile | ActionTile;
