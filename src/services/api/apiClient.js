/**
 * 공통 API 클라이언트 (axios)
 * - 주소는 실행 모드(VITE_APP_MODE)에 맞는 .env 의 VITE_API_URL 을 사용합니다.
 * - 응답이 { data } 로 감싸져 오면 data 만 꺼내서 돌려줍니다.
 * - 로그인 토큰이 있으면 Authorization: Bearer 를 붙입니다. (store/auth.js)
 * - 오류
 *   - 401: 로그아웃 후 로그인 화면으로 이동 (project.config.js auth.enabled 일 때)
 *   - 그 외: 서버 메시지(message · error)로 오류 토스트를 띄우고 reject 합니다.
 *   - 토스트 없이 화면에서 직접 처리하려면 요청 옵션에 { toast: false }
 *     예) await api.get('/orders', { params, toast: false })
 * - 조회 조건(params)의 빈 값(null · '' · 빈 배열)은 보내지 않습니다. (전체 = 조건 없음)
 * - 화면에서는 useApi() 로 사용합니다. (composables/useApi.js) 서버와의 약속은 API_GUIDE.md
 */
import axios from 'axios';
import i18n from '@/i18n';
import { projectConfig } from '@/project.config';
import { getApiUrl, omitEmptyParams } from '@/utils/common';

const axiosClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
    timeout: 30000,
});

// 토큰 · 401 · 오류 표시는 앱 시작 시 services/api/setupApi.js 가 연결합니다. (store · router 와 순환 참조 방지)
const handlers = {
    getToken: () => null,
    onUnauthorized: () => {},
    onError: () => {},
};

export function setApiHandlers(next) {
    Object.assign(handlers, next);
}

axiosClient.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.global.locale.value;
    if (config.params) config.params = omitEmptyParams(config.params);
    if (!(config.data instanceof FormData)) config.headers['Content-Type'] = 'application/json';

    const token = handlers.getToken();
    if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

/** 서버 응답에서 사람이 읽을 오류 문구를 꺼냅니다. */
export function getErrorMessage(error) {
    const body = error?.response?.data;
    if (typeof body === 'string' && body.trim() && !body.trim().startsWith('<')) return body;
    if (body?.message) return body.message;
    if (body?.error && typeof body.error === 'string') return body.error;
    if (error?.code === 'ECONNABORTED') return '응답이 늦어 요청을 중단했습니다. 잠시 후 다시 시도해 주세요.';
    if (!error?.response) return '서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.';
    return `요청을 처리하지 못했습니다. (${error.response.status})`;
}

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (axios.isCancel(error)) return Promise.reject(error);

        const status = error?.response?.status;
        const config = error?.config ?? {};
        error.message = getErrorMessage(error);

        if (status === 401 && projectConfig.auth?.enabled) {
            await handlers.onUnauthorized(error);
            return Promise.reject(error);
        }

        if (config.toast !== false) handlers.onError(error);
        return Promise.reject(error);
    },
);

function unwrap(response) {
    const body = response?.data;
    return body && typeof body === 'object' && !(body instanceof Blob) && 'data' in body ? body.data : body;
}

/**
 * 화면에서 쓰는 API 함수 - 모두 응답 본문(또는 { data } 의 data)을 돌려주는 Promise 입니다.
 * config 는 axios 옵션 + { toast: false } (오류 토스트 끄기)
 */
const apiClient = {
    /** @type {(url: string, config?: import('axios').AxiosRequestConfig & { toast?: boolean }) => Promise<any>} */
    get: (url, config) => axiosClient.get(url, config).then(unwrap),
    post: (url, body, config) => axiosClient.post(url, body, config).then(unwrap),
    put: (url, body, config) => axiosClient.put(url, body, config).then(unwrap),
    patch: (url, body, config) => axiosClient.patch(url, body, config).then(unwrap),
    delete: (url, config) => axiosClient.delete(url, config).then(unwrap),
    /** 파일 다운로드 등 원본 응답(headers 포함)이 필요할 때 */
    raw: axiosClient,
};

export default apiClient;
