/**
 * 공통코드 (선택 목록 · 상태 이름) - GET /api/codes/{그룹} → [{ value, label }]
 *
 * const statuses = useCodes('WO_STATUS');          // 처음엔 빈 목록, 응답이 오면 채워짐
 * <AppSelect v-model="filter.status" :items="statuses" placeholder="전체" />
 *
 * - 같은 그룹은 앱을 연 동안 한 번만 부릅니다. (여러 화면 · 탭이 같은 목록을 함께 씀)
 * - 실패하면 다음에 다시 부를 수 있게 기억을 지웁니다. (오류 토스트는 apiClient)
 * - 로그아웃 · 언어 변경 등으로 새로 받아야 하면 clearCodes()
 * - 코드 값 → 표시 색은 constants/codeTone.js 의 codeTone(그룹, 값)
 */
import { shallowRef } from 'vue';
import apiClient from '@/services/api/apiClient';

const cache = new Map();

/**
 * @param {string} group 코드 그룹 (예: 'WO_STATUS')
 * @returns {Object} shallowRef([{ value, label }]) - 읽기 전용으로 씁니다.
 */
export function useCodes(group) {
    if (!cache.has(group)) {
        const list = shallowRef([]);
        cache.set(group, list);
        apiClient
            .get(`/codes/${group}`)
            .then((codes) => (list.value = codes ?? []))
            .catch(() => cache.delete(group));
    }
    return cache.get(group);
}

/** 받아 둔 공통코드를 모두 지웁니다. (다음 useCodes 때 다시 조회) */
export function clearCodes() {
    cache.clear();
}
