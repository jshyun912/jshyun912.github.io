import type { Tile } from './types';
import { validateTiles } from './validate';
import SkillTileContent from '$lib/components/SkillTileContent.svelte';

export const homeTiles: Tile[] = [
	{
		type: 'standard',
		id: 'intro',
		title: 'jshyun912',
		size: 'large',
		color: 'accent',
		description: '개발자 포트폴리오입니다. 이곳에 자신을 소개하는 짧은 글을 적어 주세요.',
		href: '/portfolio/#about'
	},
	{
		type: 'standard',
		id: 'projects',
		title: '프로젝트',
		size: 'wide',
		color: 'blue',
		description: '작업물을 추가할 공간입니다.',
		href: '/portfolio/#projects'
	},
	{
		type: 'standard',
		id: 'tech-stack',
		contentComponent: SkillTileContent,
		title: '기술 스택',
		size: 'wide',
		color: 'slate',
		href: '/portfolio/#skills'
	},
	{
		type: 'standard',
		id: 'email',
		title: 'dev.hyunjaesung@gmail.com',
		size: 'wide',
		color: 'violet',
		href: 'mailto:dev.hyunjaesung@gmail.com'
	},
	{
		type: 'standard',
		id: 'github',
		title: 'GitHub',
		size: 'medium',
		color: 'slate',
		href: 'https://github.com/jshyun912',
		external: true
	},
	{
		type: 'standard',
		id: 'blog',
		title: '블로그 이동',
		size: 'medium',
		color: 'blue',
		href: 'https://velog.io/@jshyun912/',
		external: true
	},
	{
		type: 'folder',
		id: 'tools',
		title: '문제풀이 도구',
		size: 'medium',
		color: 'teal',
		children: [
			{
				type: 'standard',
				id: 'text-counter',
				title: '글자 수 세기',
				size: 'medium',
				color: 'accent',
				href: '/tools/text-counter/',
				description: '글자, 단어, 줄 수를 확인합니다.'
			}
		]
	},
	{
		type: 'action',
		id: 'theme',
		title: '테마',
		size: 'small',
		color: 'slate',
		ariaLabel: '라이트 모드와 다크 모드 전환',
		action: 'toggle-theme'
	}
];

validateTiles(homeTiles);
