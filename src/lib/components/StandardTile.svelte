<script lang="ts">
	import type { StandardTile } from '$lib/tiles/types';

	let { tile }: { tile: StandardTile } = $props();
</script>

{#snippet content()}
	{#if tile.contentComponent}
		{@const Content = tile.contentComponent}
		<Content />
	{:else if tile.description}
		<span class="tile-description">{tile.description}</span>
	{/if}
	<span class="tile-title">{tile.title}{#if tile.external}<span aria-hidden="true"> ↗</span>{/if}</span>
{/snippet}

{#if tile.href}
	<a
		class="tile standard-tile"
		data-size={tile.size}
		data-color={tile.color ?? 'accent'}
		data-tile-id={tile.id}
		href={tile.href}
		target={tile.external ? '_blank' : undefined}
		rel={tile.external ? 'noopener noreferrer' : undefined}
		aria-label={tile.ariaLabel ?? (tile.external ? `${tile.title}, 외부 링크` : undefined)}
	>
		{@render content()}
	</a>
{:else}
	<article
		class="tile standard-tile"
		data-size={tile.size}
		data-color={tile.color ?? 'accent'}
		data-tile-id={tile.id}
		aria-label={tile.ariaLabel ?? undefined}
	>
		{@render content()}
	</article>
{/if}
