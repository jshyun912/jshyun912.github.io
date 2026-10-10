<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import PortfolioBody from '$lib/portfolio/PortfolioBody.svelte';
	import { portfolioContent } from '$lib/portfolio/content';
	import { browserStorage, theme, toggleTheme } from '$lib/theme/theme';

	const themeLabel = $derived($theme === 'dark' ? '주간모드 전환' : '다크모드 전환');

	const sections = [
		{ id: 'about', label: '소개' },
		{ id: 'skills', label: '기술 스택' },
		{ id: 'projects', label: '프로젝트' }
	];
	let activeSection = $state('about');
	let main: HTMLElement;
	let menu: HTMLElement;
	let anchorFrame = 0;
	// Align initial hash targets after hydration; preserve native navigation restoration.
	afterNavigate(({ to, type }) => {
		cancelAnimationFrame(anchorFrame);
		if (type !== 'enter') return;
		const id = to?.url.hash.slice(1);
		if (id && sections.some((section) => section.id === id)) {
			anchorFrame = requestAnimationFrame(() => {
				document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
			});
		}
	});

	onMount(() => {
		let frame = 0;
		let menuHeight = menu.getBoundingClientRect().height + 44;
		const updateSection = () => {
			frame = 0;
			let next = 'about';
			for (const section of sections) {
				const target = document.getElementById(section.id);
				if (target && target.getBoundingClientRect().top <= menuHeight + 25) next = section.id;
			}
			activeSection = next;
			// Keep the selected pivot visible without scrolling the document or rewriting its URL.
			const link = menu.querySelector<HTMLAnchorElement>(`a[href="#${next}"]`);
			if (link) {
				if (link.offsetLeft < menu.scrollLeft) menu.scrollLeft = link.offsetLeft;
				else if (link.offsetLeft + link.offsetWidth > menu.scrollLeft + menu.clientWidth) {
					menu.scrollLeft = link.offsetLeft + link.offsetWidth - menu.clientWidth;
				}
			}
		};
		const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(updateSection); };
		const observer = new ResizeObserver(() => {
			menuHeight = menu.getBoundingClientRect().height + 44;
			main.style.setProperty('--portfolio-nav-height', `${menuHeight}px`);
			scheduleUpdate();
		});
		main.style.setProperty('--portfolio-nav-height', `${menuHeight}px`);
		observer.observe(menu);
		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		window.addEventListener('hashchange', scheduleUpdate);
		scheduleUpdate();
		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			cancelAnimationFrame(anchorFrame);
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			window.removeEventListener('hashchange', scheduleUpdate);
		};
	});
</script>

<svelte:head>
	<title>{portfolioContent.profile.displayName} · 포트폴리오 소개</title>
	<meta name="description" content={portfolioContent.profile.headline || `${portfolioContent.profile.displayName}의 소개, 기술 스택, 프로젝트를 모은 포트폴리오`} />
</svelte:head>

<main class="portfolio-page" bind:this={main}>
	<div class="portfolio-topbar">
		<a class="portfolio-back" href="/" aria-label="시작 화면"><span aria-hidden="true">←</span> 시작 화면</a>
		<button class="theme-toggle" type="button" onclick={() => toggleTheme(document.documentElement, browserStorage())}>
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				{#if $theme === 'dark'}
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
				{:else}
					<path d="M20.9 13.2A9 9 0 0 1 10.8 3.1a9 9 0 1 0 10.1 10.1Z" />
				{/if}
			</svg>
			<span>{themeLabel}</span>
		</button>
	</div>
	<header class="portfolio-header">
		<p class="portfolio-kicker">{portfolioContent.profile.displayName} / portfolio</p>
		<h1>{portfolioContent.profile.displayName}</h1>
		<div class="profile-links" role="group" aria-label="연락처 및 외부 링크">
			{#if portfolioContent.profile.email}
				<a href={`mailto:${portfolioContent.profile.email}`} aria-label="이메일 보내기" title="이메일 보내기">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="3" y="5" width="18" height="14" rx="1" />
						<path d="m3 6 9 7 9-7" />
					</svg>
				</a>
			{/if}
			{#if portfolioContent.profile.githubUrl}
				<a href={portfolioContent.profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub, 새 탭" title="GitHub">
					<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.628-5.479 5.925.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
					</svg>
				</a>
			{/if}
			{#if portfolioContent.profile.blogUrl}
				<a href={portfolioContent.profile.blogUrl} target="_blank" rel="noopener noreferrer" aria-label="블로그, 새 탭" title="블로그">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<rect x="3" y="3" width="18" height="18" rx="1" />
						<path d="M3 8h18M6 5.5h.01M9 5.5h.01M7 15l5-4 5 4M9 13.5V19h6v-5.5" />
					</svg>
				</a>
			{/if}
		</div>
	</header>
	<nav class="portfolio-pivot" aria-label="포트폴리오 섹션" bind:this={menu}>
		{#each sections as section}
			<a href={`#${section.id}`} aria-current={activeSection === section.id ? 'location' : undefined}>{section.label}</a>
		{/each}
	</nav>
	<PortfolioBody content={portfolioContent} />
</main>

<style>
	:global(html:has(.portfolio-page)) { scroll-behavior: smooth; }
	.portfolio-page {
		--portfolio-nav-height: calc(clamp(24px, 3vw, 36px) * 1.25 + 85px);
		--portfolio-accent: #0066b3;
		--portfolio-line: #cbd0d7;
		width: min(1120px, calc(100% - 80px));
		margin: 0 auto;
		padding: 40px 0 0;
		overflow-wrap: anywhere;
	}
	:global(:root[data-theme='dark']) .portfolio-page { --portfolio-accent: #62b8ff; --portfolio-line: #2c333d; }
	.portfolio-topbar { position: sticky; top: 0; z-index: 6; display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 44px; background: var(--page-bg); }
	.theme-toggle { display: inline-flex; align-items: center; gap: 10px; min-height: 44px; padding: 8px 0 8px 8px; border: 0; background: transparent; color: var(--page-text); font: inherit; font-size: 14px; cursor: pointer; }
	.theme-toggle svg { flex: none; }
	.theme-toggle:hover { color: var(--portfolio-accent); }
	.theme-toggle:focus-visible { outline: 2px solid var(--portfolio-accent); outline-offset: 3px; }
	.portfolio-back { display: inline-flex; align-items: center; gap: 12px; padding: 8px 0; color: var(--muted-text); font-size: 14px; text-decoration: none; }
	.portfolio-back span { color: var(--page-text); font-size: 28px; font-weight: 300; line-height: 1; }
	.portfolio-back:hover { color: var(--portfolio-accent); }
	.portfolio-back:focus-visible,
	.portfolio-pivot a:focus-visible { outline: 2px solid var(--portfolio-accent); outline-offset: -2px; }
	.portfolio-header { margin: 48px 0 28px; }
	.profile-links { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 24px; }
	.profile-links a { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; color: var(--page-text); }
	.profile-links svg { width: 30px; height: 30px; }
	.profile-links a:hover { color: var(--portfolio-accent); }
	.profile-links a:focus-visible { outline: 2px solid var(--portfolio-accent); outline-offset: 3px; }
	.portfolio-kicker { margin: 0 0 12px; color: var(--muted-text); font-size: 12px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
	h1 { margin: 0; font-size: clamp(72px, 8vw, 112px); font-weight: 300; letter-spacing: -0.065em; line-height: 1.1; }
	.portfolio-pivot { position: sticky; top: 44px; z-index: 5; display: flex; gap: 32px; overflow-x: auto; background: var(--page-bg); padding: 16px 0; border-bottom: 1px solid var(--portfolio-line); }
	.portfolio-pivot a { flex: none; padding: 4px 0; color: var(--muted-text); font-size: clamp(24px, 3vw, 36px); font-weight: 300; line-height: 1.25; text-decoration: none; white-space: nowrap; }
	.portfolio-pivot a[aria-current], .portfolio-pivot a:hover { color: var(--portfolio-accent); }
	@media (max-width: 640px) {
		.portfolio-page { --portfolio-nav-height: 107px; width: calc(100% - 40px); padding-top: 20px; }
		.portfolio-header { margin: 32px 0 24px; }
		h1 { font-size: clamp(40px, 10vw, 64px); }
		.portfolio-pivot { gap: 24px; padding: 12px 0; }
	}
	@media (prefers-reduced-motion: reduce) {
		:global(html:has(.portfolio-page)) { scroll-behavior: auto; }
	}
</style>
