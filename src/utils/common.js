/**
 * 실행 모드(local · dev · prd · pub)별 환경값(.env*)을 고릅니다.
 *
 * 모드 결정 순서
 * 1. 개발 서버: npm 스크립트의 VITE_APP_MODE (npm run dev · prd · pub)
 * 2. 배포: nginx 컨테이너가 만든 /api-config.js 의 window.VITE_APP_MODE (docker-compose 의 MODE = dev / prd)
 * 3. 없으면 local
 * - 배포 이미지는 모드 없이 한 번만 빌드합니다. (npm run build) 빌드에 VITE_APP_MODE 를 넣으면 그 모드로 고정됩니다.
 * - API 주소는 localhost 접속이면 모드와 관계없이 항상 local(.env) 값을 씁니다.
 */

/** 순수 함수 (테스트용) - 실제 화면에서는 아래 getAppMode · getApiUrl · getAppTitle 을 씁니다. */
export function resolveAppMode({ configs, buildMode, runtimeMode }) {
    const mode = buildMode || runtimeMode;
    return configs[mode] ? mode : 'local';
}

export function resolveApiUrl({ configs, mode, hostname }) {
    const isLocalhost = ['localhost', '127.0.0.1'].includes(hostname);
    return configs[isLocalhost ? 'local' : mode].VITE_API_URL;
}

export function getAppMode() {
    return resolveAppMode({ configs: ALL_ENV_CONFIGS, buildMode: import.meta.env.VITE_APP_MODE, runtimeMode: window.VITE_APP_MODE });
}

/** 실행 모드의 API 주소 (.env* 의 VITE_API_URL) */
export function getApiUrl() {
    return resolveApiUrl({ configs: ALL_ENV_CONFIGS, mode: getAppMode(), hostname: location.hostname });
}

/** 실행 모드의 기본 문서 제목 (.env* 의 VITE_TITLE) - 메뉴에 없는 화면에서 씁니다. */
export function getAppTitle() {
    return ALL_ENV_CONFIGS[getAppMode()].VITE_TITLE || document.title;
}

/**
 * 조회 조건에서 빈 값(null · undefined · '' · 빈 배열)을 뺍니다. (apiClient 가 모든 GET params 에 적용)
 * - '전체' 선택(null)을 보내지 않아야 서버가 '조건 없음'으로 처리합니다. (Spring 은 line= 를 '' 로 받음)
 * - false · 0 은 값이므로 그대로 보냅니다.
 * @param {Record<string, any>} params
 * @returns {Record<string, any>}
 */
export function omitEmptyParams(params) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) => value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && !value.length),
        ),
    );
}
