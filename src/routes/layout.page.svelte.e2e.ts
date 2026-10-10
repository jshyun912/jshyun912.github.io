import { expect, test } from '@playwright/test';

const homeGrid = '.home-screen .view-pane:first-child .tile-grid';
const tileIds = ['intro', 'projects', 'tech-stack', 'email', 'github', 'blog', 'tools', 'theme'];
const landscapePositions: Record<string, [number, number, number, number]> = {
	intro: [0, 0, 4, 4],
	projects: [4, 0, 4, 2],
	'tech-stack': [4, 2, 4, 2],
	github: [8, 0, 2, 2],
	blog: [8, 2, 2, 2],
	email: [0, 4, 4, 2],
	tools: [4, 4, 4, 2],
	theme: [8, 4, 2, 2]
};

for (const [width, height] of [
	[1440, 900],
	[1280, 720],
	[844, 390],
	[667, 375],
	[568, 320],
	[390, 844],
	[800, 1280]
] as const) {
	test(`home layout fits ${width}×${height} without overlapping or clipped content`, async ({ page }) => {
		await page.setViewportSize({ width, height });
		await page.goto('/', { waitUntil: 'networkidle' });
		const grid = page.locator(homeGrid);
		await expect(grid).toBeVisible();
		await expect(grid.locator(':scope > .tile')).toHaveCount(tileIds.length);
		for (const id of tileIds) {
			await expect(grid.locator(`[data-tile-id="${id}"]`)).toBeVisible();
		}

		const layout = await grid.evaluate((element) => {
			const rectangle = (node: Element) => {
				const rect = node.getBoundingClientRect();
				return {
					left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
					width: rect.width, height: rect.height
				};
			};
			const style = getComputedStyle(element);
			const header = document.querySelector('.home-screen .site-header')!;
			return {
				grid: rectangle(element),
				header: rectangle(header),
				columns: style.gridTemplateColumns.split(' ').map(Number.parseFloat),
				rows: style.gridTemplateRows.split(' ').map(Number.parseFloat),
				columnGap: Number.parseFloat(style.columnGap),
				rowGap: Number.parseFloat(style.rowGap),
				scrollWidth: document.documentElement.scrollWidth,
				scrollHeight: document.documentElement.scrollHeight,
				tiles: Array.from(element.querySelectorAll<HTMLElement>(':scope > .tile')).map((tile) => ({
					id: tile.dataset.tileId!,
					...rectangle(tile),
					content: Array.from(tile.querySelectorAll('.tile-title, .tile-description, .action-mark, .folder-mark'))
						.map((node) => ({ name: node.getAttribute('class') ?? node.tagName, ...rectangle(node) }))
				}))
			};
		});

		expect(layout.scrollWidth, 'page must not overflow horizontally').toBeLessThanOrEqual(width);
		expect(Math.abs(layout.header.left - layout.grid.left), 'header must align with the first tile column').toBeLessThanOrEqual(1);
		expect(layout.header.bottom, 'header must stay above the tiles').toBeLessThan(layout.grid.top);

		for (const tile of layout.tiles) {
			expect(tile.left, `${tile.id} must stay inside the grid`).toBeGreaterThanOrEqual(layout.grid.left - 1);
			expect(tile.right, `${tile.id} must stay inside the grid`).toBeLessThanOrEqual(layout.grid.right + 1);
			expect(tile.top, `${tile.id} must stay inside the grid`).toBeGreaterThanOrEqual(layout.grid.top - 1);
			expect(tile.bottom, `${tile.id} must stay inside the grid`).toBeLessThanOrEqual(layout.grid.bottom + 1);
			for (const content of tile.content) {
				const label = `${tile.id} ${content.name} must fit inside its tile`;
				expect(content.left, label).toBeGreaterThanOrEqual(tile.left - 1);
				expect(content.top, label).toBeGreaterThanOrEqual(tile.top - 1);
				expect(content.right, label).toBeLessThanOrEqual(tile.right + 1);
				expect(content.bottom, label).toBeLessThanOrEqual(tile.bottom + 1);
			}
			for (let first = 0; first < tile.content.length; first++) {
				for (let second = first + 1; second < tile.content.length; second++) {
					const a = tile.content[first];
					const b = tile.content[second];
					const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
					const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
					expect(overlapWidth > 1 && overlapHeight > 1, `${tile.id}: ${a.name} must not overlap ${b.name}`).toBe(false);
				}
			}
		}

		for (let first = 0; first < layout.tiles.length; first++) {
			for (let second = first + 1; second < layout.tiles.length; second++) {
				const a = layout.tiles[first];
				const b = layout.tiles[second];
				const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
				const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
				expect(overlapWidth > 1 && overlapHeight > 1, `${a.id} must not overlap ${b.id}`).toBe(false);
			}
		}

		if (width > height) {
			expect(layout.scrollHeight, 'landscape home must fit the viewport vertically').toBeLessThanOrEqual(height);
			expect(layout.columns).toHaveLength(10);
			expect(layout.rows).toHaveLength(6);
			const unit = layout.columns[0];
			for (const track of [...layout.columns, ...layout.rows]) {
				expect(Math.abs(track - unit), 'all column and row units must be square').toBeLessThanOrEqual(0.1);
			}
			expect(Math.abs((layout.header.top + layout.grid.bottom) / 2 - height / 2), 'header and grid together must be centered vertically').toBeLessThanOrEqual(3);
			for (const tile of layout.tiles) {
				const [column, row, columnSpan, rowSpan] = landscapePositions[tile.id];
				expect(Math.abs(tile.left - layout.grid.left - column * (unit + layout.columnGap)), `${tile.id} column position`).toBeLessThanOrEqual(1);
				expect(Math.abs(tile.top - layout.grid.top - row * (unit + layout.rowGap)), `${tile.id} row position`).toBeLessThanOrEqual(1);
				expect(Math.abs(tile.width - columnSpan * unit - (columnSpan - 1) * layout.columnGap), `${tile.id} column span`).toBeLessThanOrEqual(1);
				expect(Math.abs(tile.height - rowSpan * unit - (rowSpan - 1) * layout.rowGap), `${tile.id} row span`).toBeLessThanOrEqual(1);
				expect(tile.bottom, `${tile.id} must be visible without scrolling`).toBeLessThanOrEqual(height);
			}
		} else {
			expect(layout.columns).toHaveLength(width < 720 ? 4 : 6);
			if (layout.grid.bottom > height) {
				expect(layout.scrollHeight, 'portrait content must remain reachable by scrolling').toBeGreaterThan(height);
				const finalTile = grid.locator('[data-tile-id="theme"]');
				await finalTile.scrollIntoViewIfNeeded();
				await expect(finalTile).toBeInViewport({ ratio: 1 });
			}
			if (width === 390) {
				expect(layout.scrollHeight, 'phone portrait must use natural scrolling instead of shrinking every tile').toBeGreaterThan(height);
			}
		}

		await expect(grid.locator('[data-tile-id="email"]')).toHaveAttribute('href', 'mailto:dev.hyunjaesung@gmail.com');
		await expect(grid.locator('[data-tile-id="github"]')).toHaveAttribute('href', 'https://github.com/jshyun912');
		await expect(grid.locator('[data-tile-id="blog"]')).toHaveAttribute('href', 'https://velog.io/@jshyun912/');
	});
}
