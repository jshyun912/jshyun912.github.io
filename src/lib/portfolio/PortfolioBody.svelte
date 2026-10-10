<script lang="ts">
	import type { PortfolioContent } from './content';

	let { content }: { content: PortfolioContent } = $props();
</script>

<div class="portfolio-body">
	<section id="about" aria-labelledby="about-title" tabindex="-1">
		<p class="section-label">01 / about</p>
		<h2 id="about-title">소개</h2>
		{#if content.profile.photo}
			<figure class="profile-photo">
				<img
					src={content.profile.photo.src}
					alt={content.profile.photo.alt}
					width={content.profile.photo.width}
					height={content.profile.photo.height}
					loading="lazy"
				/>
				<figcaption>
					<a href={content.profile.photo.href} target="_blank" rel="noopener noreferrer" aria-label={`${content.profile.photo.caption}, 영상 새 탭`}>
						{content.profile.photo.caption}
						<span aria-hidden="true">↗</span>
					</a>
				</figcaption>
			</figure>
		{/if}
		<p class="intro-line">{content.profile.headline || '한 줄 소개를 작성해 주세요.'}</p>
		<div class="reading-column">
			{#if content.profile.bio.length}
				{#each content.profile.bio as paragraph}
					<p>{paragraph}</p>
				{/each}
			{:else}
				<p class="empty-note">관심 있는 분야와 개발 경험, 앞으로 만들고 싶은 것을 소개해 주세요.</p>
			{/if}
			{#if content.profile.email}
				<a class="contact-link" href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
			{/if}
		</div>
	</section>

	<section id="skills" aria-labelledby="skills-title" tabindex="-1">
		<p class="section-label">02 / skills</p>
		<h2 id="skills-title">기술 스택</h2>
		{#if content.skills.length}
			<ul class="skill-list">
				{#each content.skills as skill}
					<li>
						<img src={skill.icon} alt="" width="48" height="48" loading="lazy" />
						<span class="skill-name">{skill.name}</span>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="reading-column empty-note">
				<p class="empty-heading">기술 스택을 작성해 주세요.</p>
				<p>사용하는 기술의 이름과 아이콘을 추가해 주세요.</p>
			</div>
		{/if}
	</section>

	<section id="projects" aria-labelledby="projects-title" tabindex="-1">
		<p class="section-label">03 / projects</p>
		<h2 id="projects-title">프로젝트</h2>
		{#if content.projects.length}
			<div class="project-list">
				{#each content.projects as project (project.id)}
					<article class="portfolio-project" aria-labelledby={`project-${project.id}`}>
						<h3 id={`project-${project.id}`}>{project.name}</h3>
						{#if project.summary}<p class="project-summary reading-column">{project.summary}</p>{/if}
						{#if project.image?.src}
							<img src={project.image.src} alt={project.image.alt} loading="lazy" />
						{/if}
						{#if project.role || project.technologies.length}
							<dl class="project-facts">
								{#if project.role}<div><dt>역할</dt><dd>{project.role}</dd></div>{/if}
								{#if project.technologies.length}<div><dt>사용 기술</dt><dd>{project.technologies.join(' / ')}</dd></div>{/if}
							</dl>
						{/if}
						<div class="reading-column">
							{#each project.details as paragraph}<p>{paragraph}</p>{/each}
						</div>
						{#if project.repositoryUrl || project.serviceUrl}
							<div class="project-links">
								{#if project.repositoryUrl}<a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} 저장소, 새 탭`}>저장소 <span aria-hidden="true">↗</span></a>{/if}
								{#if project.serviceUrl}<a href={project.serviceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} 서비스, 새 탭`}>서비스 <span aria-hidden="true">↗</span></a>{/if}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{:else}
			<div class="reading-column empty-note">
				<p class="empty-heading">프로젝트를 작성해 주세요.</p>
				<p>만든 것과 맡은 역할, 문제를 해결한 과정, 배운 점을 소개해 주세요.</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.portfolio-body { width: 100%; overflow-wrap: anywhere; }
	section { scroll-margin-top: calc(var(--portfolio-nav-height, 88px) + 24px); padding: 48px 0 64px; }
	section + section { border-top: 1px solid var(--portfolio-line); }
	section:last-child { min-height: calc(100svh - var(--portfolio-nav-height, 88px) - 24px); }
	section:focus-visible { outline: 2px solid var(--portfolio-accent); outline-offset: 6px; }
	.section-label { margin: 0 0 12px; color: var(--muted-text); font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
	h2 { margin: 0 0 32px; font-size: clamp(36px, 5vw, 64px); font-weight: 300; line-height: 1.1; letter-spacing: -0.04em; }
	h3 { margin: 0; font-weight: 300; line-height: 1.2; }
	p { margin: 0 0 20px; white-space: pre-line; }
	.reading-column { max-width: 66ch; font-size: 17px; line-height: 1.8; }
	.intro-line { max-width: 36ch; margin-bottom: 24px; font-size: clamp(22px, 3vw, 32px); font-weight: 300; line-height: 1.5; }
	.empty-note { color: var(--muted-text); }
	.empty-heading { margin-bottom: 8px; }
	a { color: var(--portfolio-accent); text-decoration: none; text-underline-offset: 5px; }
	a:hover { text-decoration: underline; }
	a:focus-visible { outline: 2px solid var(--portfolio-accent); outline-offset: 5px; }
	.contact-link { display: inline-block; margin-top: 12px; }
	.profile-photo { width: 100%; margin: 0 0 32px; }
	.profile-photo img { display: block; width: 100%; height: auto; }
	.profile-photo figcaption { margin-top: 10px; font-size: 14px; line-height: 1.6; }
	.profile-photo a { display: inline-flex; align-items: baseline; gap: 8px; }
	.skill-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 32px; margin: 0; padding: 0; list-style: none; }
	.skill-list li { display: flex; align-items: center; gap: 16px; min-width: 0; }
	.skill-list img { flex: none; width: 48px; height: 48px; object-fit: contain; }
	:global(:root[data-theme='dark']) .skill-list img { filter: invert(1); }
	.skill-name { min-width: 0; font-size: 22px; font-weight: 300; }
	dl { margin: 0; }
	dd { margin: 0; white-space: pre-line; color: var(--muted-text); font-size: 16px; line-height: 1.7; }
	.portfolio-project + .portfolio-project { margin-top: 56px; padding-top: 48px; border-top: 1px solid var(--portfolio-line); }
	.portfolio-project h3 { margin-bottom: 20px; font-size: clamp(28px, 4vw, 44px); letter-spacing: -0.035em; }
	.project-summary { color: var(--muted-text); }
	.portfolio-project img { display: block; width: 100%; max-width: 100%; height: auto; margin: 32px 0; }
	.project-facts { display: grid; gap: 16px; margin: 28px 0; max-width: 66ch; }
	.project-facts > div { display: grid; grid-template-columns: 80px minmax(0, 1fr); gap: 16px; }
	.project-facts dt { font-size: 14px; line-height: 1.9; }
	.project-links { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; font-size: 18px; }
	@media (max-width: 640px) {
		section { padding: 36px 0 48px; }
		.reading-column { font-size: 16px; }
	}
</style>
