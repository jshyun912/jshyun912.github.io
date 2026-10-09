import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import FolderView from './FolderView.svelte';

describe('FolderView', () => {
	it('shows an empty state and a working back control', async () => {
		const onBack = vi.fn();
		render(FolderView, {
			folder: { type: 'folder', id: 'empty', title: '빈 폴더', size: 'medium', children: [] },
			onBack,
			onOpenFolder: vi.fn()
		});
		await expect.element(page.getByText('이 폴더는 비어 있습니다.')).toBeInTheDocument();
		await page.getByRole('button', { name: '← start' }).click();
		expect(onBack).toHaveBeenCalledOnce();
	});
});
