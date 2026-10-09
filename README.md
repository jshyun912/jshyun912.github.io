# jshyun912.github.io

SvelteKit으로 만든 메트로 스타일 포트폴리오와 문제풀이 도구 모음입니다. GitHub Pages에서 정적 사이트로 배포됩니다.

## 로컬 개발

Node.js 24와 npm을 사용합니다. 이 컴퓨터에서 NVM으로 설치했다면 새 셸에서 `source ~/.nvm/nvm.sh`를 먼저 실행하세요.

```bash
npm ci
npm run dev
```

개발 서버 주소는 터미널에 표시됩니다. 프로덕션 결과를 미리 보려면 `npm run build` 후 `npm run preview`를 실행하세요.

## 검사

```bash
npm run check
npm run test:unit
npx playwright install chromium
npm run test:e2e
npm run build
```

Playwright 브라우저가 아직 설치되지 않았다면 `npx playwright install chromium`을 한 번 실행해야 합니다. 정적 빌드 결과는 `build/`에 생성됩니다.

## 콘텐츠 수정

홈 타일은 [`src/lib/tiles/home.ts`](src/lib/tiles/home.ts)에 있습니다. 자기소개·프로젝트·연락처 문구는 현재 편집 위치를 보여주는 예시이므로 본인의 내용으로 바꾸세요. 실제 이력과 연락처는 임의로 넣지 않았습니다.

타일은 `standard`, `folder`, `action` 중 하나이며 크기는 `small`(1×1), `medium`(2×2), `wide`(4×2), `large`(4×4) 중에서 고릅니다. 같은 `id`를 두 번 쓰거나 지원하지 않는 크기를 넣으면 검증 오류가 납니다. 폴더의 `children`에 도구 타일을 추가할 수 있습니다.

새 도구를 추가할 때는 `src/routes/tools/<slug>/+page.svelte`를 만들고, `home.ts`의 도구 폴더에 `href: '/tools/<slug>/'`인 타일을 추가하세요. 끝의 `/`는 GitHub Pages에서 해당 도구의 `index.html`을 직접 제공하기 위한 경로 형식입니다.

홈에서 폴더를 열면 `?folder=<id>`가 주소에 붙습니다. 이 주소로 도구 목록 화면을 공유할 수 있고 브라우저 뒤로·앞으로 가기도 작동합니다.

## GitHub Pages 배포

`.github/workflows/deploy.yml`이 `main` 브랜치 푸시 또는 수동 실행 시 검사, 테스트, 정적 빌드 후 `build/`를 배포합니다. GitHub 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정하세요.

이 저장소는 사용자 사이트 저장소인 `jshyun912.github.io`를 기준으로 루트 경로(`/`)에 배포하도록 구성했습니다. 다른 이름의 프로젝트 저장소로 옮길 경우 SvelteKit의 `paths.base` 설정이 필요합니다.
