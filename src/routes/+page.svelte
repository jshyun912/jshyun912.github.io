<script lang="ts">
	import { onMount, tick } from 'svelte';
	import FolderView from '$lib/components/FolderView.svelte';
	import TileGrid from '$lib/components/TileGrid.svelte';
	import { applyTheme, browserStorage, readInitialTheme } from '$lib/theme/theme';
	import { homeTiles } from '$lib/tiles/home';
	import { createFolderNavigation, findFolder } from '$lib/navigation/folder';
	import type { FolderTile } from '$lib/tiles/types';

	const navigation = createFolderNavigation();
	const activeFolder = navigation.activeFolder;
	let displayedFolder: FolderTile | null = $state(null);

	function focusVisibleTile(id: string | undefined): boolean {
		if (!id) return false;
		const tile = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-tile-id]'))
			.find((button) => button.dataset.tileId === id && !button.closest('[inert]'));
		tile?.focus();
		return tile !== undefined;
	}

	async function syncFromUrl(restoreFocus = false) {
		const previousId = displayedFolder?.id;
		const id = new URL(window.location.href).searchParams.get('folder');
		const folder = id ? findFolder(homeTiles, id) : null;
		if (folder) {
			displayedFolder = folder;
			navigation.open(folder);
		} else {
			navigation.close();
		}
		if (restoreFocus) {
			await tick();
			if (folder) {
				if (!focusVisibleTile(previousId)) {
					document.querySelector<HTMLButtonElement>('.folder-view .back-button')?.focus();
				}
			} else {
				focusVisibleTile(previousId);
			}
		}
	}

	async function openFolder(folder: FolderTile) {
		displayedFolder = folder;
		const url = new URL(window.location.href);
		url.searchParams.set('folder', folder.id);
		window.history.pushState({ ...window.history.state, metroFolder: true }, '', url);
		navigation.open(folder);
		await tick();
		document.querySelector<HTMLButtonElement>('.folder-view .back-button')?.focus();
	}

	async function closeFolder() {
		const previousId = displayedFolder?.id;
		if (window.history.state?.metroFolder) {
			window.history.back();
			return;
		}
		const url = new URL(window.location.href);
		url.searchParams.delete('folder');
		window.history.replaceState(window.history.state, '', url);
		navigation.close();
		await tick();
		focusVisibleTile(previousId);
	}

	onMount(() => {
		applyTheme(
			readInitialTheme(browserStorage(), window.matchMedia.bind(window)),
			document.documentElement
		);
		syncFromUrl();
		const handlePopState = () => { void syncFromUrl(true); };
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});
</script>

<svelte:head>
	<title>jshyun912 · 포트폴리오</title>
	<meta name="description" content="포트폴리오와 문제풀이 도구를 모은 메트로 스타일 시작 화면" />
</svelte:head>

<main class="site-shell" class:home-screen={!$activeFolder}>
	<header class="site-header">
		<p class="site-kicker">jshyun912 / portfolio</p>
		<h1>환영합니다!</h1>
	</header>

	<div class="view-viewport">
		<div class="view-track" data-active={$activeFolder ? 'folder' : 'home'}>
			<div class="view-pane" inert={$activeFolder !== null} aria-hidden={$activeFolder !== null}>
				<TileGrid tiles={homeTiles} onOpenFolder={openFolder} />
			</div>
			<div class="view-pane" inert={$activeFolder === null} aria-hidden={$activeFolder === null}>
				{#if displayedFolder}
					<FolderView folder={displayedFolder} onBack={closeFolder} onOpenFolder={openFolder} />
				{/if}
			</div>
		</div>
	</div>
</main>
