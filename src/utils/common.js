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

/**
 * API 주소 (실행 모드의 .env* VITE_API_URL)
 * - 백엔드 API 는 모두 /api 아래에 있습니다. (예: GET /api/work-orders) → API_GUIDE.md 1장
 * - local: http://localhost:8080/api (직접 호출) · dev · prd · pub: /api (Vite 프록시 · nginx 가 /api 그대로 전달)
 */
export function getApiUrl() {
    return ALL_ENV_CONFIGS[getAppMode()].VITE_API_URL;
}

/** 기본 문서 제목 (.env* 의 VITE_TITLE) - 메뉴에 없는 화면에서 씁니다. */
export function getAppTitle() {
    return ALL_ENV_CONFIGS[getAppMode()].VITE_TITLE || document.title;
}
