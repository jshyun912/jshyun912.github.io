<script lang="ts">
	import { portfolioContent } from '$lib/portfolio/content';
</script>

{#if portfolioContent.skills.length}
	<div class="skill-icons" tabindex="-1">
		{#each portfolioContent.skills as skill}
			<img src={skill.icon} alt="" title={skill.name} />
		{/each}
	</div>
{/if}

<style>
	.skill-icons { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 0; overflow-x: auto; padding: 4px 0; }
	img { flex: none; width: clamp(20px, 4cqw, 40px); height: clamp(20px, 4cqw, 40px); object-fit: contain; filter: invert(1); }
</style>
