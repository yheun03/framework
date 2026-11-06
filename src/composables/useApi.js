import apiClient from '@/services/api/apiClient';

/**
 * 화면 / composable 에서 API 를 호출할 때 사용합니다.
 *
 * const api = useApi();
 * const rows = await api.get('/orders', { params: { page: 1 } });
 */
export function useApi() {
    return apiClient;
}
