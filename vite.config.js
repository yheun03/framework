import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { projectConfig } from './src/project.config.js';

// 실행 모드별 환경값 (.env = local, .env.dev, .env.prd, .env.pub)
// 배포 이미지는 하나로 빌드하고, 컨테이너가 만든 /api-config.js 의 모드로 주소를 고릅니다. (src/utils/common.js)
const ENV_FILES = { local: '.env', dev: '.env.dev', prd: '.env.prd', pub: '.env.pub' };
const ALL_ENV_CONFIGS = Object.fromEntries(Object.entries(ENV_FILES).map(([mode, file]) => [mode, dotenv.parse(fs.readFileSync(file))]));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // GitHub Pages 처럼 하위 경로에 배포할 때만 VITE_BASE_URL 지정 (기본 '/')
        base: env.VITE_BASE_URL || '/',
        plugins: [vue()],
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
            port: 80,
            proxy: {
                // 개발 서버에서 '/server/...' 요청을 백엔드로 전달 (CORS 회피)
                '/server': {
                    target: ALL_ENV_CONFIGS.local.VITE_API_URL || 'http://localhost:8080',
                    changeOrigin: true,
                    rewrite: (url) => url.replace(/^\/server/, ''),
                },
            },
        },
        define: {
            ALL_ENV_CONFIGS: JSON.stringify(ALL_ENV_CONFIGS),
        },
    };
});
