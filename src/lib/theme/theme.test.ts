import { describe, expect, it } from 'vitest';
import { applyTheme, readInitialTheme, toggleTheme } from './theme';

function storage(initial?: string) {
	const values = new Map<string, string>();
	if (initial !== undefined) values.set('metro-theme', initial);
	return {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => void values.set(key, value)
	};
}

const media = (dark: boolean) => (query: string) => ({
	matches: query === '(prefers-color-scheme: dark)' && dark
});

describe('theme', () => {
	it('uses an explicit saved choice over the system preference', () => {
		expect(readInitialTheme(storage('light'), media(true))).toBe('light');
		expect(readInitialTheme(storage('dark'), media(false))).toBe('dark');
	});

	it('follows the system preference without a saved choice', () => {
		expect(readInitialTheme(storage(), media(true))).toBe('dark');
		expect(readInitialTheme(storage(), media(false))).toBe('light');
	});

	it('ignores an invalid saved value', () => {
		expect(readInitialTheme(storage('sepia'), media(true))).toBe('dark');
	});

	it('still uses and toggles the theme when storage is unavailable', () => {
		const root = { dataset: {} } as HTMLElement;
		expect(readInitialTheme(undefined, media(true))).toBe('dark');
		applyTheme('dark', root);
		expect(toggleTheme(root, undefined)).toBe('light');
		expect(root.dataset.theme).toBe('light');
	});

	it('applies and persists a user toggle', () => {
		const saved = storage();
		const root = { dataset: {} } as HTMLElement;
		applyTheme('dark', root);
		expect(root.dataset.theme).toBe('dark');
		expect(toggleTheme(root, saved)).toBe('light');
		expect(root.dataset.theme).toBe('light');
		expect(saved.getItem('metro-theme')).toBe('light');
	});
});
