# 메트로 스타일 포트폴리오 구현 계획

> **작업 에이전트 필수 지침:** 이 계획을 작업별로 실행할 때 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`를 사용한다. 진행 상태는 체크박스로 관리한다.

**목표:** 반응형 Windows Phone 스타일 타일 홈, 애니메이션 도구 폴더, 영구 저장되는 라이트·다크 테마를 갖춘 정적 SvelteKit 포트폴리오를 만든다.

**구조:** 타입이 지정된 타일 데이터 트리를 작은 Svelte 컴포넌트들이 렌더링한다. CSS 사용자 정의 속성으로 테마를 구성하고, Svelte 스토어로 폴더 탐색을 관리하며, SvelteKit이 GitHub Pages용 도구 경로를 미리 렌더링한다.

**기술:** SvelteKit, Svelte 5, TypeScript, CSS Grid, Vitest, Testing Library, Playwright, `@sveltejs/adapter-static`

**설계 문서:** `docs/superpowers/specs/2026-09-26-metro-portfolio-design.md`

## 공통 제약

- `@sveltejs/adapter-static`을 사용해 완전한 정적 사이트로 배포한다.
- 모바일 4열, 태블릿 6열, 데스크톱 최대 8열과 최대 너비 1152px을 적용한다.
- `small`(1×1), `medium`(2×2), `wide`(4×2), `large`(4×4) 프리셋만 지원한다.
- 첫 방문은 시스템 테마를 따르고, 사용자가 선택한 라이트·다크 값은 `localStorage`에 저장한다.
- 모션 감소, 키보드 탐색, 명확한 포커스, 접근 가능한 색상 대비를 지원한다.
- CMS, 서버 API, 인증, 분석, 편집 가능한 레이아웃은 추가하지 않는다.

## 중점 검토 항목

- 저장된 테마 값이 잘못되면 오류 없이 시스템 설정으로 돌아가야 한다.
- 중첩된 폴더 안에서도 중복 타일 ID를 찾아 개발 중 오류를 내야 한다.
- 빈 폴더에는 빈 상태와 정상 동작하는 뒤로 가기가 보여야 한다.
- 존재하지 않는 도구 주소에는 빈 화면 대신 메트로 스타일 404가 보여야 한다.
- 키보드로 모든 일반·폴더·액션 타일에 접근하고 실행할 수 있어야 한다.

---

### 작업 1: 정적 SvelteKit 기반 구성

**생성 파일:** `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/app.d.ts`, `src/app.css`, `src/routes/+layout.ts`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `tests/smoke.spec.ts`, `playwright.config.ts`

**결과:** 이후 작업이 사용할 정적 SvelteKit 셸과 단위·E2E 테스트 명령을 제공한다.

- [x] `npx sv create . --template minimal --types ts --no-add-ons --install npm`으로 프로젝트를 만든다. 기존 `docs/`와 `AGENTS.md`는 보존한다.
- [x] Vitest 브라우저 모드와 Playwright 의존성을 설치한다. (`jsdom`/Testing Library 대신 브라우저 컴포넌트 테스트를 사용한다.)
- [x] `test:unit`을 `vitest run`, `test:e2e`를 `playwright test`로 등록한다. Playwright는 프로덕션 미리보기 서버를 사용한다.
- [x] `adapter-static`에 `404.html` 폴백을 설정하고 `+layout.ts`에 아래 설정을 추가한다.

```ts
export const prerender = true;
export const ssr = true;
```

- [x] 홈에서 `start` 제목을 찾는 Playwright 테스트를 먼저 작성하고 실패를 확인한다.
- [x] `+page.svelte`에 `<h1>start</h1>`를 렌더링하고 전역 CSS를 연결한다.
- [x] `npm run check`, `npm run build`, `npm run test:e2e`가 모두 성공하는지 확인한다.

### 작업 2: 재사용 가능한 타일 데이터 정의

**생성 파일:** `src/lib/tiles/types.ts`, `presets.ts`, `validate.ts`, `home.ts`, `validate.test.ts`

**결과:** `Tile`, `TileSize`, `TILE_SPANS`, `validateTiles(tiles: Tile[]): void`, `homeTiles: Tile[]`를 제공한다.

- [x] 네 크기의 정확한 span, 중첩된 고유 ID 허용, 중첩된 중복 ID 거부를 검사하는 실패 테스트를 작성한다.
- [x] 설계 문서의 `BaseTile`, `StandardTile`, `FolderTile`, `ActionTile` 판별 유니온을 구현한다. `StandardTile`에는 `external?: boolean`을 추가한다.
- [x] 아래 프리셋을 구현한다.

```ts
export const TILE_SPANS = {
  small: { columns: 1, rows: 1 },
  medium: { columns: 2, rows: 2 },
  wide: { columns: 4, rows: 2 },
  large: { columns: 4, rows: 4 }
} as const;
```

- [x] 하나의 `Set<string>`으로 전체 폴더 트리를 순회하고 중복 시 `Duplicate tile id: <id>` 오류를 내는 `validateTiles`를 구현한다.
- [x] 큰 자기소개, 프로젝트, 도구 폴더, 연락처, 테마 액션 타일을 `homeTiles`에 추가한다. 도구 폴더에는 `text-counter`를 넣으며 실제 이력이나 연락처를 임의로 만들지 않는다.
- [x] `npm run test:unit -- src/lib/tiles/validate.test.ts && npm run check`가 성공하는지 확인한다.

### 작업 3: 반응형 타일 UI와 테마 구현

**생성 파일:** `src/lib/components/TileGrid.svelte`, `TileRenderer.svelte`, `StandardTile.svelte`, `FolderTile.svelte`, `ActionTile.svelte`, `src/lib/theme/theme.ts`, `theme.test.ts`

**수정 파일:** `src/app.html`, `src/app.css`, `src/routes/+page.svelte`, `tests/smoke.spec.ts`

**결과:** `TileGrid`와 `readInitialTheme`, `applyTheme`, `toggleTheme`을 제공한다.

- [x] 저장된 라이트·다크 값, 저장값 없음, 잘못된 저장값, 토글 후 저장, 루트 `data-theme` 변경을 검사하는 실패 테스트를 작성한다.
- [x] `'light' | 'dark'` writable 스토어를 구현한다. 테스트할 수 있도록 저장소와 `matchMedia` 어댑터를 주입한다.
- [x] `app.html`의 인라인 스크립트가 유효한 저장값을 우선 적용하고, 없으면 시스템 설정으로 `data-theme`을 지정하게 한다.
- [x] 홈 E2E 테스트에 자기소개·도구 타일, 테마 전환과 새로고침 후 유지, Tab·Enter 조작을 추가한다.
- [x] 링크는 `<a>`, 폴더와 액션은 `<button>`, 비상호작용 콘텐츠는 `<article>`로 렌더링한다.
- [x] 기본 4열, 720px 이상 6열, 1080px 이상 8열, 최대 너비 1152px을 적용한다.
- [x] 라이트·다크 토큰, 사각 타일, 좁은 간격, 왼쪽 아래 레이블, `:focus-visible`, 눌림 효과, 모션 감소 CSS를 구현한다.
- [x] `npm run test:unit -- --run`, `npm run check`, `npm run build`, `npx playwright test`가 성공하는지 확인한다.

### 작업 4: 폴더 탐색과 전환 구현

**생성 파일:** `src/lib/navigation/folder.ts`, `folder.test.ts`, `src/lib/components/FolderView.svelte`, `FolderView.svelte.test.ts`, `src/routes/folder.page.svelte.e2e.ts`

**수정 파일:** `src/routes/+page.svelte`, `src/app.css`

**결과:** `createFolderNavigation()`의 `open(folder)`, `close()`, `activeFolder`와 빈 상태를 지원하는 `FolderView`를 제공한다.

- [x] 초기값 `null`, 폴더 열기, 닫기, 빈 폴더 열기를 검사하는 실패 테스트를 작성한다.
- [x] `FolderTile | null` writable 스토어와 폴더 제목, 뒤로 가기, 중첩 `TileGrid`를 구현한다.
- [x] 자식이 없으면 `이 폴더는 비어 있습니다.`를 표시한다.
- [x] 열 때 `?folder=<id>`를 `history.pushState`로 추가하고, 닫을 때 제거한다. `popstate`에서도 같은 상태를 복원한다.
- [x] 도구 폴더 열기, `text-counter` 확인, 화면 버튼으로 닫기, 브라우저 뒤로 닫기를 E2E 테스트한다.
- [x] 홈과 폴더를 overflow가 숨겨진 뷰포트에 놓고 좌우 전환을 적용한다. 모션 감소 환경에서는 전환을 제거한다.
- [x] `npm run test:unit`, `npm run check`, `npm run test:e2e`가 성공하는지 확인한다.

### 작업 5: 첫 도구, 404, GitHub Pages 배포 추가

**생성 파일:** `src/routes/tools/text-counter/+page.svelte`, `src/routes/tools/[slug]/+page.ts`, `src/routes/tools/[slug]/+page.svelte`, `src/routes/+error.svelte`, `static/.nojekyll`, `.github/workflows/deploy.yml`, `src/routes/tools/tools.page.svelte.e2e.ts`

**수정 파일:** `README.md`

**결과:** 공유 가능한 글자 수 세기 도구, 알 수 없는 도구 처리, GitHub Pages 배포를 제공한다.

- [x] `/tools/text-counter` 직접 접근, 빈 입력의 0 값, `hello world\nagain`의 글자·단어·줄 수, `/tools/not-real`의 404와 돌아가기 링크를 검사하는 실패 테스트를 작성한다.
- [x] 레이블이 있는 `<textarea>`와 다음 계산식을 사용해 도구를 구현한다.

```ts
const characters = value.length;
const words = value.trim() === '' ? 0 : value.trim().split(/\s+/u).length;
const lines = value === '' ? 0 : value.split(/\r?\n/u).length;
```

- [x] 알 수 없는 slug에는 `error(404, '도구를 찾을 수 없습니다.')`를 발생시키고, 오류 화면에 `/?folder=tools` 링크를 제공한다.
- [x] `main` 푸시와 수동 실행에서 Node 24 설정, `npm ci`, 타입 검사, 단위 테스트, 빌드, `build/` 업로드, Pages 배포를 수행하는 워크플로를 작성한다.
- [x] README에 설치, 개발 서버, 검사·테스트·빌드 명령, `home.ts` 편집법, 타일·도구 추가법, GitHub Actions 배포 설정을 기록한다.
- [x] `npm run check`, `npm run test:unit`, `npm run build`, `npm run test:e2e` 전체 검증을 실행한다.
- [x] 390px, 800px, 1280px에서 각각 4·6·8열, 가로 넘침 없음, 포커스, 두 테마, 폴더 전환, 모션 감소 동작을 확인한다.

## Git 커밋 처리

현재 Git 작성자 정보가 없으므로 구현과 검증을 우선 진행한다. 사용자가 별도로 요청하기 전까지 전역 Git 설정을 변경하거나 커밋을 만들지 않는다.
