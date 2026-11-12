/**
 * 화면에서 API 를 부를 때 씁니다. (services/api/apiClient.js)
 *
 * const api = useApi();
 *
 * const result = await api.get('/work-orders', { params: { page: 1, size: 10 } });   // 조회
 * const order = await api.get(`/work-orders/${id}`);                                 // 상세
 * await api.post('/work-orders', form);                                              // 등록
 * await api.put(`/work-orders/${id}`, form);                                         // 수정
 * await api.patch(`/work-orders/${id}`, { status: 'done' });                         // 일부 수정
 * await api.delete('/work-orders', { data: ids });                                   // 삭제
 *
 * - 응답이 { data } 로 감싸져 있으면 data 만 돌려줍니다.
 * - 오류는 서버 message 로 오류 토스트를 띄우고 reject 합니다. 화면에서 직접 처리하려면 { toast: false }
 *     try { await api.post('/work-orders', form, { toast: false }); } catch (error) { hint.value = error.message; }
 * - 로그인 토큰 첨부 · 401 → 로그인 화면 · 빈 조회 조건 제거는 공통으로 처리합니다.
 * - 파일 다운로드처럼 원본 응답(headers)이 필요하면 api.raw.get(url, { responseType: 'blob' })
 */
import apiClient from '@/services/api/apiClient';

export function useApi() {
    return apiClient;
}
