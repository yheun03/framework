/**
 * 실행 모드별 API 주소를 돌려줍니다.
 * - 배포: nginx 컨테이너가 만든 /api-config.js 의 window.VITE_APP_MODE (dev / prd)
 * - 개발 서버: npm 스크립트의 VITE_APP_MODE
 * - localhost 접속은 항상 local(.env) 주소를 사용합니다.
 */
export function getApiUrl() {
    const mode = window.VITE_APP_MODE || import.meta.env.VITE_APP_MODE || 'local';
    const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
    const configs = ALL_ENV_CONFIGS;

    return (isLocalhost ? configs.local : (configs[mode] ?? configs.local)).VITE_API_URL;
}
