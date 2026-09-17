import type { ProjectConfig } from './types/project';

/**
 * 기업별 프로젝트를 시작할 때 가장 먼저 수정하는 설정입니다.
 *
 * key는 아래 기업 전용 폴더명과 반드시 같아야 합니다.
 * - components/projects/{key}
 * - assets/scss/projects/{key}
 * - public/images/projects/{key}
 */
export const projectConfig = {
    key: 'framework',
    companyName: 'Jonsoft',
    serviceName: 'Framework',
    locale: 'ko',
    baseURL: '/framework/',
    siteUrl: 'https://yheun03.github.io/framework/',
    favicon: 'images/projects/framework/favicon.svg',
    themeColor: '#2f6bff',
    seo: {
        title: 'Framework',
        titleTemplate: '%s | Framework',
        description: 'Nuxt 3 기반의 Jonsoft 웹 퍼블리싱/프론트엔드 공통 프레임워크입니다.',
        keywords: ['Jonsoft', 'Nuxt', 'Vue', 'Framework'],
        ogImage: 'images/projects/framework/og-image.svg',
        ogImageAlt: 'Jonsoft Framework',
        twitterCard: 'summary_large_image',
    },
} satisfies ProjectConfig;
