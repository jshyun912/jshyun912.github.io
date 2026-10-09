import { get, writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;
type MediaMatcher = (query: string) => { matches: boolean };

export const theme = writable<Theme>('light');

export function browserStorage(): Storage | undefined {
	try {
		return localStorage;
	} catch {
		return undefined;
	}
}

export function readInitialTheme(storage: ThemeStorage | undefined, matchMedia: MediaMatcher): Theme {
	try {
		const saved = storage?.getItem('metro-theme');
		if (saved === 'light' || saved === 'dark') return saved;
	} catch {
		// Browser storage can be unavailable; the system theme remains usable.
	}
	return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(next: Theme, root: HTMLElement, storage?: ThemeStorage): void {
	root.dataset.theme = next;
	theme.set(next);
	if (storage) {
		try {
			storage.setItem('metro-theme', next);
		} catch {
			// Keep the chosen theme for the current visit even if persistence is unavailable.
		}
	}
}

export function toggleTheme(root: HTMLElement, storage?: ThemeStorage): Theme {
	const next = get(theme) === 'dark' ? 'light' : 'dark';
	applyTheme(next, root, storage);
	return next;
}
