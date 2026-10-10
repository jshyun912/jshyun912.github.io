export type PortfolioSkill = {
	name: string;
	icon: string;
};

export type PortfolioProject = {
	id: string;
	name: string;
	summary: string;
	role: string;
	technologies: string[];
	details: string[];
	image?: { src: string; alt: string };
	repositoryUrl?: string;
	serviceUrl?: string;
};

export type PortfolioContent = {
	profile: {
		displayName: string;
		headline: string;
		bio: string[];
		email: string;
		githubUrl?: string;
		blogUrl?: string;
		photo?: {
			src: string;
			alt: string;
			width: number;
			height: number;
			caption: string;
			href: string;
		};
	};
	skills: PortfolioSkill[];
	projects: PortfolioProject[];
};

// 이 파일에서 포트폴리오 내용을 작성합니다. bio와 details의 각 문자열은 한 문단입니다.
// 기술 아이콘은 static/images/skills/에 넣고 이름과 공개 경로를 등록합니다.
// skills 예시: { name: 'TypeScript', icon: '/images/skills/typescript.svg' }
// projects 예시:
// {
//   id: 'project-slug', name: '프로젝트 이름', summary: '해결하려던 문제와 결과',
//   role: '내가 맡은 역할', technologies: ['사용 기술'], details: ['구현 내용', '배운 점'],
//   image: { src: '/images/project.webp', alt: '프로젝트 화면 설명' },
//   repositoryUrl: '실제 저장소 주소', serviceUrl: '실제 서비스 주소'
// }
// 이미지 파일은 static/images/ 아래에 넣습니다. 없는 이미지·링크 필드는 생략합니다.
export const portfolioContent: PortfolioContent = {
	profile: {
		displayName: 'jshyun912',
		headline: '',
		bio: [],
		email: 'dev.hyunjaesung@gmail.com',
		githubUrl: 'https://github.com/jshyun912',
		blogUrl: 'https://velog.io/@jshyun912/',
		photo: {
			src: '/images/hello-boj-2024.jpg',
			alt: '2024년 Hello BOJ에서 노트북으로 문제를 풀고 있는 jshyun912',
			width: 3840,
			height: 1896,
			caption: '2024년 Hello BOJ에서',
			href: 'https://youtu.be/LXaIdH4GehU?si=y41NTUamWlTBqt40&t=60'
		}
	},
	skills: [
		{ name: 'C++', icon: '/images/skills/cpp.svg' },
		{ name: 'Java', icon: '/images/skills/JAVA.svg' },
		{ name: 'Python', icon: '/images/skills/Python.svg' },
		{ name: 'Rust', icon: '/images/skills/Rust.svg' },
		{ name: 'Spring Boot', icon: '/images/skills/Spring Boot.svg' },
		{ name: 'Prometheus', icon: '/images/skills/Prometheus.svg' },
		{ name: 'Grafana', icon: '/images/skills/Grafana.svg' }
	],
	projects: []
};
