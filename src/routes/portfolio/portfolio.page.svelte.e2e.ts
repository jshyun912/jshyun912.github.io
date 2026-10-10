import { expect, test } from '@playwright/test';

const sections = [
	['intro', 'about', '소개'],
	['tech-stack', 'skills', '기술 스택'],
	['projects', 'projects', '프로젝트']
] as const;

test('main tiles link to portfolio sections and browser back returns home', async ({ page }) => {
	for (const [tile, section, title] of sections) {
		await page.goto('/', { waitUntil: 'networkidle' });
		const link = page.locator(`[data-tile-id="${tile}"]`);
		await expect(link).toHaveAttribute('href', `/portfolio/#${section}`);
		await link.click();
		await expect(page).toHaveURL(`/portfolio/#${section}`);
		await expect(page.locator(`#${section}`).getByRole('heading', { name: title, exact: true })).toBeVisible();
		await expect(page.getByRole('navigation', { name: '포트폴리오 섹션' }).getByRole('link', { name: title })).toHaveAttribute('aria-current', 'location');
		await page.goBack();
		await expect(page).toHaveURL('/');
	}
});

for (const [width, height] of [[390, 844], [800, 1280], [1440, 900]] as const) {
	test(`direct section links fit ${width}×${height} and stay below the sticky menu`, async ({ page }) => {
		await page.setViewportSize({ width, height });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		for (const [, id, title] of sections) {
			await page.goto(`/portfolio/#${id}`, { waitUntil: 'networkidle' });
			const nav = page.getByRole('navigation', { name: '포트폴리오 섹션' });
			await expect(nav.getByRole('link', { name: title })).toHaveAttribute('aria-current', 'location');
			await expect.poll(async () => {
				const heading = await page.locator(`#${id} h2`).boundingBox();
				const menu = await nav.boundingBox();
				return heading!.y - (menu!.y + menu!.height);
			}).toBeGreaterThanOrEqual(0);
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
			await page.reload({ waitUntil: 'networkidle' });
			await expect(page).toHaveURL(`/portfolio/#${id}`);
			await expect(nav.getByRole('link', { name: title })).toHaveAttribute('aria-current', 'location');
		}
	});
}

test('manual scrolling updates the pivot without adding history or changing the hash', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/portfolio/', { waitUntil: 'networkidle' });
	const historyLength = await page.evaluate(() => history.length);
	await page.locator('#skills').evaluate((node) => node.scrollIntoView());
	const nav = page.getByRole('navigation', { name: '포트폴리오 섹션' });
	await expect(nav.getByRole('link', { name: '기술 스택' })).toHaveAttribute('aria-current', 'location');
	await page.locator('#projects').evaluate((node) => node.scrollIntoView());
	await expect(nav.getByRole('link', { name: '프로젝트' })).toHaveAttribute('aria-current', 'location');
	await expect(page).toHaveURL('/portfolio/');
	expect(await page.evaluate(() => history.length)).toBe(historyLength);
	await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
});

test('browser forward restores the reading position rather than returning to the original hash', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/', { waitUntil: 'networkidle' });
	await page.locator('[data-tile-id="intro"]').click();
	const nav = page.getByRole('navigation', { name: '포트폴리오 섹션' });
	await expect(nav.getByRole('link', { name: '소개' })).toHaveAttribute('aria-current', 'location');
	await page.locator('#skills').evaluate((node) => node.scrollIntoView());
	await expect(nav.getByRole('link', { name: '기술 스택' })).toHaveAttribute('aria-current', 'location');
	const readingPosition = await page.evaluate(() => scrollY);
	await page.goBack();
	await expect(page).toHaveURL('/');
	await page.goForward();
	await expect(page).toHaveURL('/portfolio/#about');
	await expect(nav.getByRole('link', { name: '기술 스택' })).toHaveAttribute('aria-current', 'location');
	expect(Math.abs(await page.evaluate(() => scrollY) - readingPosition)).toBeLessThanOrEqual(2);
});

test('portfolio honors the saved theme on direct visits and preserves it when returning home', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light' });
	await page.addInitScript(() => localStorage.setItem('metro-theme', 'dark'));
	await page.goto('/portfolio/', { waitUntil: 'networkidle' });
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.getByRole('button', { name: '주간모드 전환', exact: true }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	expect(await page.evaluate(() => localStorage.getItem('metro-theme'))).toBe('light');
	await page.getByRole('button', { name: '다크모드 전환', exact: true }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await expect(page.getByRole('link', { name: '시작 화면', exact: true })).toHaveAttribute('href', '/');
	await page.getByRole('link', { name: '시작 화면', exact: true }).click();
	await expect(page.getByRole('button', { name: '주간 모드' })).toBeVisible();
	await page.getByRole('button', { name: '주간 모드' }).click();
	await page.locator('[data-tile-id="intro"]').click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('portfolio shows the profile photo and skills, keeps the unfinished project section and supports keyboard navigation', async ({ page }) => {
	await page.goto('/portfolio/', { waitUntil: 'networkidle' });
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('jshyun912');
	await expect(page.getByRole('link', { name: 'dev.hyunjaesung@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:dev.hyunjaesung@gmail.com');
	for (const name of ['C++', 'Java', 'Python', 'Rust', 'Spring Boot', 'Prometheus', 'Grafana']) {
		await expect(page.locator('#skills').getByText(name, { exact: true })).toBeVisible();
	}
	await page.locator('#skills').scrollIntoViewIfNeeded();
	await expect.poll(() => page.locator('.skill-list img').evaluateAll((images) =>
		images.length === 7 && images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)
	)).toBe(true);
	await expect(page.locator('#projects')).toContainText('프로젝트를 작성해 주세요.');
	const photo = page.locator('#about figure img');
	await photo.scrollIntoViewIfNeeded();
	await expect(photo).toHaveAttribute('src', '/images/hello-boj-2024.jpg');
	await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(3840);
	await expect(page.getByRole('link', { name: '2024년 Hello BOJ에서, 영상 새 탭' })).toHaveAttribute('href', 'https://youtu.be/LXaIdH4GehU?si=y41NTUamWlTBqt40&t=60');
	await page.keyboard.press('Tab');
	await expect(page.getByRole('link', { name: '시작 화면', exact: true })).toBeFocused();
	await page.keyboard.press('Tab');
	await expect(page.getByRole('button', { name: /모드 전환/ })).toBeFocused();
	for (const name of ['이메일 보내기', 'GitHub, 새 탭', '블로그, 새 탭']) {
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name, exact: true })).toBeFocused();
	}
	for (const title of ['소개', '기술 스택', '프로젝트']) {
		await page.keyboard.press('Tab');
		await expect(page.getByRole('navigation', { name: '포트폴리오 섹션' }).getByRole('link', { name: title })).toBeFocused();
	}
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL('/portfolio/#projects');
});
