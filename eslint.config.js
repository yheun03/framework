/**
 * ESLint (npm run lint) - 코드 실수와 규칙 위반을 자동으로 찾습니다.
 * - 포맷(들여쓰기 · 따옴표)은 Prettier 가 맡으므로 여기서는 검사하지 않습니다.
 * - 규칙: DEVELOPMENT_GUIDE.md (console 금지, 사용하지 않는 변수 금지 등)
 */
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
    { ignores: ['dist/**', 'node_modules/**', 'public/**', 'test-results/**', 'playwright-report/**'] },
    js.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.{js,mjs,vue}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                // vite.config.js define 으로 넣는 빌드 상수
                ALL_ENV_CONFIGS: 'readonly',
                PROJECT_PRIMARY_COLOR: 'readonly',
            },
        },
        rules: {
            'no-console': 'error',
            'no-debugger': 'error',
            // _ 로 시작하는 이름은 '일부러 쓰지 않음' (예: 구조 분해로 속성 빼기)
            'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
            // views/ 파일명이 곧 주소(kebab-case)이므로 컴포넌트 이름 규칙은 끕니다.
            'vue/multi-word-component-names': 'off',
            // JavaScript 전용: <script lang="ts"> 등 다른 언어 블록 금지 (lang 생략 = JS)
            'vue/block-lang': ['error', { script: { allowNoLang: true } }],
        },
    },
    {
        // 화면 맨 아래 <script> 의 '데모 데이터'(서버 JSON 응답 예시)는 Vue 가 빌드할 때 <script setup> 보다 먼저 실행합니다.
        // ESLint 는 파일 순서대로 읽어 '아래에서 선언 = 안 씀' 으로 잘못 알리므로 .vue 에서만 끕니다. (DEVELOPMENT_GUIDE 4장)
        files: ['src/**/*.vue'],
        rules: { 'no-useless-assignment': 'off' },
    },
    {
        // 노드에서 실행하는 설정 · 스크립트 · 테스트
        files: ['vite.config.js', 'eslint.config.js', 'playwright.config.js', 'scripts/**/*.mjs', 'tests/**/*.js'],
        languageOptions: { globals: { ...globals.node } },
        rules: { 'no-console': 'off' },
    },
];
