import apiClient from '@/services/api/apiClient';

/**
 * 화면 / composable 에서 API 를 호출할 때 사용합니다.
 *
 * const api = useApi();
 * const rows = await api.get('/orders', { params: { page: 1 } });   // { data } 응답은 data 만 돌려줌
 * await api.post('/orders', form);
 *
 * - 오류는 공통으로 오류 토스트를 띄우고 reject 합니다. 화면에서 직접 처리하려면 { toast: false }
 *     try { await api.post('/orders', form, { toast: false }); } catch (error) { state.value = 'error'; hint.value = error.message; }
 * - 401 은 로그인 화면으로 이동합니다. (project.config.js auth.enabled 일 때)
 * - 원본 응답(headers · 파일 다운로드)이 필요하면 api.raw.get(url, { responseType: 'blob' })
 */
export function useApi() {
    return apiClient;
}
