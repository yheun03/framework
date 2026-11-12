/**
 * 공통코드(선택 목록) 불러오기 - 라인 · 상태 · 창고처럼 AppSelect 의 items 로 쓰는 코드 목록
 *
 * const { items: lines } = useCodes('LINE', { temp: [{ value: 'L1', label: '1라인' }] });
 * <AppSelect v-model="filter.line" :items="lines" />
 *
 * - project.config.js 의 codeUrl 이 비어 있으면 temp 목록을 씁니다. (퍼블리싱 단계 · 화면 코드는 그대로)
 * - codeUrl 이 있으면 서버에서 받습니다. 예) codeUrl: '/codes/{group}' → GET /codes/LINE
 *   응답 행은 { value, label } 또는 { code, name } (API_GUIDE.md 5장)
 * - 같은 그룹은 한 번만 요청하고 모든 화면이 함께 씁니다. (새로고침 전까지 캐시)
 */
import { shallowRef } from 'vue';
import { projectConfig } from '@/project.config';
import apiClient from '@/services/api/apiClient';

/** 그룹별 요청 Promise 캐시 - 여러 화면이 동시에 열어도 요청은 1번 */
const cache = new Map();

const toItem = (row) => ({ value: row.value ?? row.code, label: row.label ?? row.name ?? String(row.value ?? row.code) });

/**
 * @param {string} group 코드 그룹 (예: 'LINE')
 * @param {{ temp?: Array<{ value: any, label: string }> }} [options] temp: 서버 연동 전 쓸 목록
 * @returns {{ items: import('vue').ShallowRef<Array<{ value: any, label: string }>> }}
 */
export function useCodes(group, { temp = [] } = {}) {
    const items = shallowRef(temp);
    if (!projectConfig.codeUrl) return { items };

    if (!cache.has(group)) {
        const url = projectConfig.codeUrl.replace('{group}', encodeURIComponent(group));
        cache.set(
            group,
            apiClient.get(url).then(
                (rows) => rows.map(toItem),
                (error) => {
                    cache.delete(group); // 실패하면 다음 화면에서 다시 시도
                    throw error;
                },
            ),
        );
    }
    cache
        .get(group)
        .then((list) => (items.value = list))
        .catch(() => {}); // 오류 토스트는 apiClient 가 띄웁니다.

    return { items };
}
