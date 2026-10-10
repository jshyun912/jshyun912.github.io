import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PortfolioBody from './PortfolioBody.svelte';
import type { PortfolioContent } from './content';

const skillIcon = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3C/svg%3E';

function fixture(): PortfolioContent {
	return {
		profile: { displayName: '작성 예시', headline: '소개 한 줄', bio: ['소개 첫 문단', '소개 두 번째 문단'], email: '' },
		skills: [
			{ name: '기술 A', icon: skillIcon },
			{ name: '기술 B', icon: skillIcon },
			{ name: '기술 C', icon: skillIcon }
		],
		projects: [{ id: 'example', name: '작성 예시 프로젝트', summary: '해결한 문제', role: '담당 역할', technologies: ['기술 A', '기술 B'], details: ['구현 내용', '배운 점'] }]
	};
}

describe('PortfolioBody', () => {
	it('keeps all anchor destinations and honest editing guidance in the empty template', async () => {
		const content = fixture();
		content.skills = [];
		content.projects = [];
		content.profile.bio = [];
		content.profile.headline = '';
		const result = await render(PortfolioBody, { content });
		await expect.element(page.getByRole('heading', { name: '소개', exact: true })).toBeInTheDocument();
		await expect.element(page.getByText('기술 스택을 작성해 주세요.')).toBeInTheDocument();
		await expect.element(page.getByText('프로젝트를 작성해 주세요.')).toBeInTheDocument();
		expect(Array.from(result.container.querySelectorAll('section'), (node) => node.id)).toEqual(['about', 'skills', 'projects']);
		expect(result.container.querySelector('img')).toBeNull();
		expect(result.container.querySelector('.project-links')).toBeNull();
	});

	it('renders skill names and icons and project details without absent project media or links', async () => {
		const result = await render(PortfolioBody, { content: fixture() });
		await expect.element(page.getByRole('heading', { name: '작성 예시 프로젝트' })).toBeInTheDocument();
		await expect.element(page.getByText('소개 두 번째 문단')).toBeInTheDocument();
		await expect.element(page.getByText('기술 A / 기술 B')).toBeInTheDocument();
		await expect.element(page.getByText('담당 역할')).toBeInTheDocument();
		await expect.element(page.getByText('배운 점')).toBeInTheDocument();
		const skills = result.container.querySelectorAll('.skill-list li');
		expect(Array.from(skills, (skill) => skill.textContent?.trim())).toEqual(['기술 A', '기술 B', '기술 C']);
		for (const skill of skills) expect(skill.querySelector('img')?.getAttribute('src')).toBe(skillIcon);
		expect(result.container.querySelector('.portfolio-project img')).toBeNull();
		expect(result.container.querySelector('.project-links')).toBeNull();
	});

	it('renders only supplied project media and external links with accessible labels', async () => {
		const content = fixture();
		content.projects[0].image = { src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="100"%3E%3C/svg%3E', alt: '예시 프로젝트 화면' };
		content.projects[0].repositoryUrl = 'https://example.com/repository';
		content.projects[0].serviceUrl = 'https://example.com/demo';
		await render(PortfolioBody, { content });
		await expect.element(page.getByRole('img', { name: '예시 프로젝트 화면' })).toBeInTheDocument();
		const repository = page.getByRole('link', { name: '작성 예시 프로젝트 저장소, 새 탭' });
		await expect.element(repository).toHaveAttribute('href', 'https://example.com/repository');
		await expect.element(repository).toHaveAttribute('rel', 'noopener noreferrer');
		await expect.element(page.getByRole('link', { name: '작성 예시 프로젝트 서비스, 새 탭' })).toHaveAttribute('target', '_blank');
	});

	it('wraps long names and body text within a narrow reading column', async () => {
		const content = fixture();
		content.profile.bio = ['긴 본문 '.repeat(120)];
		content.skills[0].name = 'LongTechnologyName'.repeat(30);
		content.projects[0].name = 'LongProjectName'.repeat(30);
		content.projects[0].summary = '긴 프로젝트 소개 '.repeat(100);
		const result = await render(PortfolioBody, { content });
		result.container.style.width = '320px';
		await expect.element(page.getByRole('heading', { name: content.projects[0].name })).toBeInTheDocument();
		expect(result.container.scrollWidth).toBeLessThanOrEqual(321);
		const body = result.container.querySelector('.portfolio-body')!.getBoundingClientRect();
		for (const element of result.container.querySelectorAll('h3, dt, dd, .skill-name, .reading-column')) {
			const box = element.getBoundingClientRect();
			expect(box.right).toBeLessThanOrEqual(body.right + 1);
		}
	});
});
