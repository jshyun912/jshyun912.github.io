import { expect, test } from '@playwright/test';

test('text counter works from a direct URL and updates live', async ({ page }) => {
	await page.goto('/tools/text-counter');
	await expect(page.getByRole('heading', { name: '글자 수 세기' })).toBeVisible();
	const input = page.getByRole('textbox', { name: '입력 텍스트' });
	await expect(page.getByTestId('character-count')).toHaveText('0');
	await expect(page.getByTestId('word-count')).toHaveText('0');
	await expect(page.getByTestId('line-count')).toHaveText('0');
	await input.fill('hello world\nagain');
	await expect(page.getByTestId('character-count')).toHaveText('17');
	await expect(page.getByTestId('word-count')).toHaveText('3');
	await expect(page.getByTestId('line-count')).toHaveText('2');
	await page.reload();
	await expect(page.getByRole('heading', { name: '글자 수 세기' })).toBeVisible();
});

test('an unknown tool shows a styled 404 with a tools-folder link', async ({ page }) => {
	await page.goto('/tools/not-real');
	await expect(page.getByRole('heading', { name: '도구를 찾을 수 없습니다.' })).toBeVisible();
	await expect(page.getByRole('link', { name: '도구 목록으로 돌아가기' })).toHaveAttribute(
		'href',
		'/?folder=tools'
	);
});
