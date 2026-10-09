<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>오류 {page.status} · jshyun912</title>
</svelte:head>

<main class="site-shell error-page">
	<p class="site-kicker">{page.status} / error</p>
	<h1 class="tool-heading">{page.error?.message ?? '페이지를 찾을 수 없습니다.'}</h1>
	<p class="site-subtitle">주소를 확인하거나 도구 목록으로 돌아가세요.</p>
	<a class="error-link" href="/?folder=tools">도구 목록으로 돌아가기</a>
</main>
