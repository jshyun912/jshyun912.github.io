import { expect, test } from '@playwright/test';

test('home shows portfolio tiles and switches theme persistently', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByRole('heading', { name: 'start' })).toBeVisible();
	await expect(page.getByText('jshyun912', { exact: true })).toBeVisible();
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeVisible();
	await page.getByRole('button', { name: '라이트 모드와 다크 모드 전환' }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('keyboard can reach and activate tile actions', async ({ page }) => {
	await page.goto('/');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: '라이트 모드와 다크 모드 전환' })).toBeFocused();
	const before = await page.locator('html').getAttribute('data-theme');
	await page.keyboard.press('Enter');
	await expect(page.locator('html')).not.toHaveAttribute('data-theme', before ?? '');
});

test('tools folder opens its tile list and returns to start', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: '문제풀이 도구' }).click();
	await expect(page.getByRole('heading', { name: '문제풀이 도구' })).toBeVisible();
	await expect(page.getByRole('link', { name: '글자 수 세기' })).toBeVisible();
	await page.getByRole('button', { name: '← start' }).click();
	await expect(page.getByRole('button', { name: '문제풀이 도구' })).toBeVisible();
});

for (const [width, columns] of [[390, 4], [800, 6], [1280, 8]] as const) {
	test(`uses ${columns} columns at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.goto('/');
		const grid = page.locator('.tile-grid');
		await expect(grid).toBeVisible();
		const actual = await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
		expect(actual).toBe(columns);
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
	});
}
