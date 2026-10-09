<script lang="ts">
	let value = $state('');
	let characters = $derived(value.length);
	let words = $derived(value.trim() === '' ? 0 : value.trim().split(/\s+/u).length);
	let lines = $derived(value === '' ? 0 : value.split(/\r?\n/u).length);
</script>

<svelte:head>
	<title>글자 수 세기 · jshyun912</title>
	<meta name="description" content="입력한 글의 글자, 단어, 줄 수를 바로 확인합니다." />
</svelte:head>

<main class="site-shell tool-page">
	<a class="back-button" href="/?folder=tools">← 도구 목록</a>
	<p class="site-kicker">문제풀이 도구</p>
	<h1 class="tool-heading">글자 수 세기</h1>
	<p class="site-subtitle">입력한 글의 길이를 바로 확인합니다.</p>

	<div class="counter-stats" aria-live="polite">
		<div class="metric-tile" role="group" aria-label="글자 수">
			<span class="metric-value" data-testid="character-count">{characters}</span>
			<span class="metric-label">글자</span>
		</div>
		<div class="metric-tile" role="group" aria-label="단어 수">
			<span class="metric-value" data-testid="word-count">{words}</span>
			<span class="metric-label">단어</span>
		</div>
		<div class="metric-tile" role="group" aria-label="줄 수">
			<span class="metric-value" data-testid="line-count">{lines}</span>
			<span class="metric-label">줄</span>
		</div>
	</div>

	<label class="input-label" for="counter-input">입력 텍스트</label>
	<textarea id="counter-input" class="counter-input" bind:value spellcheck="false" placeholder="여기에 텍스트를 입력하세요"></textarea>
</main>
