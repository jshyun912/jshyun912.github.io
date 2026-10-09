import type { Tile } from './types';
import { validateTiles } from './validate';

export const homeTiles: Tile[] = [
	{
		type: 'standard',
		id: 'intro',
		title: 'jshyun912',
		size: 'large',
		color: 'accent',
		description: '개발자 포트폴리오입니다. 이곳에 자신을 소개하는 짧은 글을 적어 주세요.'
	},
	{
		type: 'standard',
		id: 'projects',
		title: '프로젝트',
		size: 'medium',
		color: 'blue',
		description: '작업물을 추가할 공간입니다.'
	},
	{
		type: 'folder',
		id: 'tools',
		title: '문제풀이 도구',
		size: 'wide',
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
		type: 'standard',
		id: 'contact',
		title: '연락처',
		size: 'medium',
		color: 'violet',
		description: '공개할 연락 방법을 여기에 추가해 주세요.'
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
