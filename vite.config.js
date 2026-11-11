import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { projectConfig } from './src/project.config.js';

// 기업별 폴더 확인 (project.config.js 의 key 와 폴더명이 다르면 빌드 전에 알려줍니다)
const projectThemeDir = path.resolve(import.meta.dirname, `./src/assets/styles/projects/${projectConfig.key}`);
if (!fs.existsSync(path.join(projectThemeDir, '_theme.scss'))) {
    throw new Error(
        `[project.config] key '${projectConfig.key}' 의 테마 폴더가 없습니다: src/assets/styles/projects/${projectConfig.key}/_theme.scss\n` +
            `새 프로젝트는 npm run init-project -- ${projectConfig.key} "회사명" "서비스명" 으로 폴더를 만드세요.`,
    );
}

// 브랜드 대표색은 _theme.scss 의 $primary 한 곳에서만 정합니다. (index.html theme-color · 테마 설정 화면 기본값)
const projectPrimaryColor =
    fs.readFileSync(path.join(projectThemeDir, '_theme.scss'), 'utf8').match(/^\$primary:\s*(#[0-9a-fA-F]{3,8})/m)?.[1] ?? '#000000';

// index.html 의 %PROJECT_*% 를 project.config.js 값으로 바꿉니다.
function projectHtmlPlugin() {
    const values = {
        PROJECT_KEY: projectConfig.key,
        PROJECT_DESCRIPTION: projectConfig.description ?? '',
        PROJECT_THEME_COLOR: projectPrimaryColor,
    };
    return {
        name: 'project-html',
        transformIndexHtml: (html) => html.replace(/%(PROJECT_[A-Z_]+)%/g, (match, key) => values[key] ?? match),
    };
}

// 실행 모드별 환경값 (.env = local, .env.dev, .env.prd, .env.pub)
// 배포 이미지는 하나로 빌드하고, 컨테이너가 만든 /api-config.js 의 모드로 주소를 고릅니다. (src/utils/common.js)
const ENV_FILES = { local: '.env', dev: '.env.dev', prd: '.env.prd', pub: '.env.pub' };
const ALL_ENV_CONFIGS = Object.fromEntries(Object.entries(ENV_FILES).map(([mode, file]) => [mode, dotenv.parse(fs.readFileSync(file))]));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // GitHub Pages 처럼 하위 경로에 배포할 때만 VITE_BASE_URL 지정 (기본 '/')
        base: env.VITE_BASE_URL || '/',
        plugins: [vue(), projectHtmlPlugin()],
        resolve: {
            alias: {
                '@': path.resolve(import.meta.dirname, './src'),
                // 기업별 테마 (src/assets/styles/projects/{key})
                '@project-theme': path.resolve(import.meta.dirname, `./src/assets/styles/projects/${projectConfig.key}/_theme.scss`),
                '@project-theme-entry': path.resolve(import.meta.dirname, `./src/assets/styles/projects/${projectConfig.key}/index.scss`),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    loadPaths: [path.resolve(import.meta.dirname, './src/assets/styles')],
                    additionalData: `@use "abstract/index" as *;`,
                },
            },
        },
        server: {
            // 1024 미만 포트는 Linux · WSL 에서 관리자 권한이 필요하므로 Vite 기본 포트를 씁니다.
            port: 5173,
            proxy: {
                // 개발 서버의 /api 요청을 로컬 백엔드로 그대로 전달합니다. (운영 nginx.conf 의 /api/ 프록시와 같은 동작)
                // - npm run pub · dev 처럼 VITE_API_URL=/api 인 모드에서 API 를 호출할 수 있습니다.
                // '^/api/' 정규식: /api-config.js 같은 정적 파일은 프록시하지 않습니다.
                '^/api/': {
                    target: env.VITE_PROXY_TARGET || 'http://localhost:8080',
                    changeOrigin: true,
                },
                // (선택) CORS 회피용: .env 의 VITE_API_URL 을 /server 로 바꾸면 '/server' 를 떼고 로컬 백엔드로 전달합니다.
                '/server': {
                    target: ALL_ENV_CONFIGS.local.VITE_API_URL || 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (url) => url.replace(/^\/server/, ''),
                },
            },
        },
        build: {
            // 큰 조각은 AG Grid(그리드를 쓰는 화면, 약 1MB)와 마크다운 에디터(워크스페이스)뿐이며, 해당 화면에서만 불러옵니다.
            // 첫 화면 공통 조각(index)은 약 180kB 입니다.
            chunkSizeWarningLimit: 1100,
        },
        define: {
            ALL_ENV_CONFIGS: JSON.stringify(ALL_ENV_CONFIGS),
            PROJECT_PRIMARY_COLOR: JSON.stringify(projectPrimaryColor),
        },
    };
});
