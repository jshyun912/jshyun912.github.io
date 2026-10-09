# 메트로 스타일 포트폴리오 설계

## 목적

GitHub Pages에서 자기소개·포트폴리오와 알고리즘 문제풀이용 웹 도구를 함께 제공한다. SvelteKit과 Windows Phone 8.1에서 영감을 받은 메트로 UI를 사용하며, 새 항목은 마크업을 반복하지 않고 타일 데이터 객체를 추가하는 방식으로 확장한다.

## 기술 기반

- SvelteKit과 `adapter-static`으로 GitHub Pages에 정적 배포한다.
- 각 도구는 `/tools/[slug]` 고정 주소를 가져 새로고침, 북마크, 공유가 가능하다.
- 타일 데이터, 렌더링 컴포넌트, 탐색·테마 상태를 분리한다.
- TypeScript로 타일 데이터와 검증 로직을 작성한다.
- 초기 버전에는 서버, CMS, 인증, 분석 기능을 두지 않는다.

## 정보 구조

- 홈 전체를 메트로 타일 그리드로 구성한다.
- 큰 자기소개 타일에 이름, 역할, 짧은 소개를 표시하고 사진은 선택적으로 넣는다.
- 포트폴리오, 경력, 연락처, 외부 링크는 일반 타일로 제공한다.
- 문제풀이 도구는 폴더 타일 안에 묶는다.
- 폴더를 열면 홈은 왼쪽으로 나가고 도구 목록은 오른쪽에서 들어온다.
- 개별 도구는 고정 주소로 이동한다.
- 브라우저 뒤로 가기와 화면의 뒤로 가기는 같은 결과를 낸다.

## 권장 구조

```text
src/
├── lib/
│   ├── components/
│   │   ├── TileGrid.svelte
│   │   ├── TileRenderer.svelte
│   │   ├── StandardTile.svelte
│   │   ├── FolderTile.svelte
│   │   └── ActionTile.svelte
│   ├── tiles/
│   │   ├── types.ts
│   │   ├── presets.ts
│   │   └── home.ts
│   └── stores/
│       ├── navigation.ts
│       └── theme.ts
└── routes/
    ├── +page.svelte
    └── tools/[slug]/+page.svelte
```

`TileGrid`는 반응형 배치, `TileRenderer`는 타입에 맞는 컴포넌트 선택, 각 타일 컴포넌트는 표현과 활성화 동작, 스토어는 탐색과 테마 상태를 담당한다.

## 타일 모델

```ts
type TileSize = 'small' | 'medium' | 'wide' | 'large';

type BaseTile = {
  id: string;
  title: string;
  size: TileSize;
  color?: TileColor;
  icon?: string;
  ariaLabel?: string;
};

type StandardTile = BaseTile & {
  type: 'standard';
  description?: string;
  href?: string;
  contentComponent?: Component;
};

type FolderTile = BaseTile & {
  type: 'folder';
  children: Tile[];
};

type ActionTile = BaseTile & {
  type: 'action';
  action: 'toggle-theme';
};

type Tile = StandardTile | FolderTile | ActionTile;
```

대부분의 타일은 데이터만으로 표현한다. `contentComponent`는 자기소개처럼 특별한 타일에만 사용한다. 타일 ID는 트리 전체에서 고유해야 하며 외부 링크 여부는 명시적인 속성으로 표현한다.

## 크기와 반응형 그리드

| 프리셋 | 크기 |
| --- | --- |
| `small` | 1 × 1 |
| `medium` | 2 × 2 |
| `wide` | 4 × 2 |
| `large` | 4 × 4 |

- 모바일: 4열
- 태블릿: 6열
- 데스크톱: 최대 8열
- 콘텐츠 최대 너비: 1152px

콘텐츠가 많아지면 세로로 스크롤하고, 남은 공간에 들어가지 않는 타일은 다음 행으로 이동한다.

## 시각 언어

- 둥근 모서리와 그림자가 없는 평면 사각 타일을 사용한다.
- 타일 간격은 좁고 일정하게 유지한다.
- 큰 제목과 강한 정보 위계를 사용한다.
- 일반 타일의 제목과 아이콘은 왼쪽 아래에 배치한다.
- 기본 강조색은 시안 블루이며 의미별 색상은 디자인 토큰으로 제한한다.
- 역사적 UI의 완전한 복제보다 현대적인 가독성과 반응형 사용성을 우선한다.

## 테마

- 첫 방문에는 `prefers-color-scheme`으로 운영체제 설정을 따른다.
- 작은 액션 타일로 라이트와 다크를 전환한다.
- 선택은 `localStorage`에 저장하며 이후 방문에서 시스템 설정보다 우선한다.
- CSS 표시 전에 초기 테마를 적용해 화면 깜박임을 방지한다.
- 배경, 글자, 강조, 포커스, 타일 색상을 CSS 사용자 정의 속성으로 관리한다.
- 다크 모드는 짙은 배경·밝은 글자·시안 강조색, 라이트 모드는 밝은 회색 배경·어두운 글자·진한 블루 강조색을 사용한다.

## 움직임과 접근성

- 타일 활성화 시 짧은 눌림 반응을 제공한다.
- 폴더 이동은 좌우 슬라이드, 도구 이동은 절제된 확대 효과를 사용한다.
- 모든 상호작용 타일에 키보드 포커스와 의미 있는 레이블을 제공한다.
- `prefers-reduced-motion`에서는 큰 움직임을 짧은 페이드 또는 즉시 전환으로 바꾼다.
- 작은 타일도 충분한 입력 영역과 색상 대비를 유지한다.

## 오류와 빈 상태

- 알 수 없는 도구 주소에는 목록으로 돌아가는 메트로 스타일 404 화면을 표시한다.
- 아이콘이나 선택 콘텐츠가 없으면 제목만 표시한다.
- 빈 폴더에는 빈 상태 메시지와 뒤로 가기를 제공한다.
- 개발 중에는 지원하지 않는 크기와 중복 ID를 검증한다.
- 외부 링크는 데이터와 UI에서 명확히 구분한다.

## 검증

- TypeScript·Svelte 타입 검사
- 타일 검증과 크기 프리셋 단위 테스트
- 그리드, 폴더 탐색, 테마 전환 컴포넌트 테스트
- Playwright 주요 흐름 테스트
- 4·6·8열, 직접 접근과 뒤로 가기, 테마 복원, 키보드 조작, 모션 감소, 잘못된 도구 주소 확인

## 초기 범위

첫 버전에는 재사용 가능한 셸, 예시 포트폴리오 콘텐츠, 도구 폴더, 간단한 시범 도구 하나를 포함한다. CMS, 서버 API, 인증, 분석, 편집 가능한 레이아웃은 제외한다.
