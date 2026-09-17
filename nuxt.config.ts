import { fileURLToPath } from 'node:url';
import { projectConfig } from './project.config';

const baseURL = process.env.NUXT_APP_BASE_URL || projectConfig.baseURL;

function resolvePublicUrl(path: string): string {
    const normalizedPath = path.replace(/^\//, '');
    const normalizedBase = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;

    return new URL(`${normalizedBase}${normalizedPath}`, projectConfig.siteUrl).toString();
}

export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: { appManifest: false },
    features: { inlineStyles: false },

    app: {
        // 환경변수가 있으면 프로젝트 설정보다 우선합니다.
        baseURL,
        head: {
            title: projectConfig.seo.title,
            htmlAttrs: { lang: projectConfig.locale },
            meta: [
                { name: 'description', content: projectConfig.seo.description },
                { name: 'keywords', content: projectConfig.seo.keywords.join(', ') },
                { name: 'theme-color', content: projectConfig.themeColor },
                { property: 'og:type', content: 'website' },
                { property: 'og:locale', content: projectConfig.locale },
                { property: 'og:site_name', content: projectConfig.serviceName },
                { property: 'og:title', content: projectConfig.seo.title },
                { property: 'og:description', content: projectConfig.seo.description },
                { property: 'og:image', content: resolvePublicUrl(projectConfig.seo.ogImage) },
                { property: 'og:image:alt', content: projectConfig.seo.ogImageAlt },
                { name: 'twitter:card', content: projectConfig.seo.twitterCard },
                { name: 'twitter:title', content: projectConfig.seo.title },
                { name: 'twitter:description', content: projectConfig.seo.description },
                { name: 'twitter:image', content: resolvePublicUrl(projectConfig.seo.ogImage) },
            ],
            link: [{ rel: 'icon', href: `${baseURL}${projectConfig.favicon}` }],
        },
    },

    modules: ['@pinia/nuxt'],
    css: [
        // AG Grid 테마 CSS는 전역 link 로드로 고정 (dev 인라인 주입 최소화)
        'ag-grid-community/styles/ag-theme-quartz.css',
        '@flaticon/flaticon-uicons/css/regular/rounded.css',
        '@flaticon/flaticon-uicons/css/solid/rounded.css',
        'flatpickr/dist/flatpickr.css',
        'nouislider/dist/nouislider.css',
        '~/assets/scss/main.scss',
        `~/assets/scss/projects/${projectConfig.key}/index.scss`,
    ],

    components: [
        { path: '~/components/Table', pathPrefix: false },
        { path: '~/components/Section', pathPrefix: false },
        { path: '~/components/Layout', pathPrefix: false },
        { path: '~/components/Modal', pathPrefix: false },
        { path: '~/components/AppButton', pathPrefix: false },
        { path: '~/components/AppGrid', pathPrefix: false },
        { path: '~/components/AppProgress', pathPrefix: false },
        { path: '~/components/AppUpload', pathPrefix: false },
        { path: '~/components/PageDemo', pathPrefix: false },
        { path: `~/components/projects/${projectConfig.key}`, pathPrefix: false },
        // components 루트 단일 컴포넌트만 자동 등록
        { path: '~/components', pathPrefix: true, pattern: '*.vue' },
    ],

    // 플러그인 실행 순서를 명확히 하기 위해 명시 로딩
    plugins: [
        '~/plugins/preferences.client',
        '~/plugins/axios',
        '~/plugins/ag-grid.client',
        '~/plugins/route-tabs.client',
        '~/plugins/removeViteDuplicateStyles.client',
    ],

    vite: {
        resolve: {
            alias: {
                '@project-theme': fileURLToPath(new URL(`./assets/scss/projects/${projectConfig.key}/_theme.scss`, import.meta.url)),
            },
        },
        build: {
            cssCodeSplit: false,
        },
        server: {
            watch: {
                usePolling: true,
                interval: 250,
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    loadPaths: ['assets/scss'],
                    additionalData: `@use "abstract/index" as *;`,
                },
            },
        },
    },

    // macOS 등에서 fs watcher 한도(EMFILE) 이슈 완화
    watchers: {
        chokidar: {
            usePolling: true,
            interval: 250,
        },
    },

    runtimeConfig: {
        public: {
            apiBase: '/api',
            project: projectConfig,
        },
    },

    // GitHub Pages 배포 대응
    nitro: {
        preset: 'static',
    },
});
