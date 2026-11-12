/**
 * 실행 모드(local · dev · prd · pub)와 그 모드의 .env* 값
 *
 * 모드 결정 순서
 * 1. 개발 서버: npm 스크립트의 VITE_APP_MODE (npm run serve · dev · prd · pub)
 * 2. 배포: nginx 컨테이너가 만든 /api-config.js 의 window.VITE_APP_MODE (docker-compose 의 MODE)
 * 3. 없으면 local
 * 배포 이미지는 모드 없이 한 번만 빌드합니다. (npm run build)
 */
export function getAppMode() {
    const mode = import.meta.env.VITE_APP_MODE || window.VITE_APP_MODE;
    return ALL_ENV_CONFIGS[mode] ? mode : 'local';
}

/** API 주소 (.env* 의 VITE_API_URL) - localhost 로 접속하면 모드와 관계없이 항상 local(.env) 값 */
export function getApiUrl() {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(location.hostname);
    return ALL_ENV_CONFIGS[isLocalhost ? 'local' : getAppMode()].VITE_API_URL;
}

/** 기본 문서 제목 (.env* 의 VITE_TITLE) - 메뉴에 없는 화면에서 씁니다. */
export function getAppTitle() {
    return ALL_ENV_CONFIGS[getAppMode()].VITE_TITLE || document.title;
}
