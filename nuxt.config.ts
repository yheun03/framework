import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
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
        { path: '~/components/AppSearch', pathPrefix: false },
        { path: '~/components/AppTree', pathPrefix: false },
        { path: '~/components/AppSite', pathPrefix: false },
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

    hooks: {
        // nuxt generate 후 실제로 생성된 HTML 페이지 기준으로 sitemap.xml / robots.txt 를 만듭니다.
        // (siteUrl 은 project.config.ts 를 따르므로 프로젝트마다 따로 수정할 필요가 없습니다)
        'nitro:init'(nitro) {
            nitro.hooks.hook('prerender:done', async ({ prerenderedRoutes }) => {
                const siteUrl = projectConfig.siteUrl.endsWith('/') ? projectConfig.siteUrl : `${projectConfig.siteUrl}/`;
                const today = new Date().toISOString().slice(0, 10);
                const routeUrls = prerenderedRoutes
                    .filter((route) => !route.error && route.fileName?.endsWith('.html') && !/^\/(200|404)\.html$/.test(route.fileName))
                    // route 에는 baseURL(/framework/) 이 포함되어 있어 siteUrl 기준 상대 경로로 바꿉니다.
                    .map((route) => route.route.slice(route.route.startsWith(baseURL) ? baseURL.length : 1))
                    .filter((path) => !path.startsWith('auth/'))
                    .map((path) => new URL(path.replace(/([^/])$/, '$1/'), siteUrl).toString());
                const urls = [...new Set(routeUrls)].sort();

                const sitemap = [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                    ...urls.map((url) => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`),
                    '</urlset>',
                    '',
                ].join('\n');
                const robots = ['User-agent: *', 'Allow: /', 'Disallow: /auth/', '', `Sitemap: ${siteUrl}sitemap.xml`, ''].join('\n');

                await writeFile(join(nitro.options.output.publicDir, 'sitemap.xml'), sitemap);
                await writeFile(join(nitro.options.output.publicDir, 'robots.txt'), robots);
                nitro.logger.success(`sitemap.xml (${urls.length} URLs) / robots.txt generated`);
            });
        },
    },
});
