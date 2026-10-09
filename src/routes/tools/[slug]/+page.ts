import { error } from '@sveltejs/kit';

export const prerender = false;

export function load() {
	error(404, '도구를 찾을 수 없습니다.');
}
