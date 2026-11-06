/**
 * 공통 API 클라이언트 (axios)
 * - 주소는 실행 모드(VITE_APP_MODE)에 맞는 .env 의 VITE_API_URL 을 사용합니다.
 * - 응답이 { data } 로 감싸져 오면 data 만 꺼내서 돌려줍니다.
 */
import axios from 'axios';
import i18n from '@/i18n';
import { getApiUrl } from '@/utils/common';

const axiosClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true,
    timeout: 30000,
});

axiosClient.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.global.locale.value;
    if (!(config.data instanceof FormData)) config.headers['Content-Type'] = 'application/json';
    return config;
});

function unwrap(response) {
    const body = response?.data;
    return body && typeof body === 'object' && !(body instanceof Blob) && 'data' in body ? body.data : body;
}

const apiClient = {
    get: (url, config) => axiosClient.get(url, config).then(unwrap),
    post: (url, body, config) => axiosClient.post(url, body, config).then(unwrap),
    put: (url, body, config) => axiosClient.put(url, body, config).then(unwrap),
    patch: (url, body, config) => axiosClient.patch(url, body, config).then(unwrap),
    delete: (url, config) => axiosClient.delete(url, config).then(unwrap),
};

export default apiClient;
