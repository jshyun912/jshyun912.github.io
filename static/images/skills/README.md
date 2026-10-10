이 폴더에 기술 아이콘(SVG, PNG, WebP 등)을 넣습니다.

`src/lib/portfolio/content.ts`의 `skills`에 이름과 경로를 등록합니다.

```ts
skills: [
  { name: 'TypeScript', icon: '/images/skills/typescript.svg' }
]
```

위 항목은 작성 예시입니다. 실제 아이콘 파일과 사용 기술을 등록하세요.
등록된 아이콘은 메인 기술 스택 타일과 포트폴리오 페이지에서 함께 표시됩니다.
