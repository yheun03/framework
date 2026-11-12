/**
 * 목록 화면 공통 조회 (조회 조건 · 목록 · 건수 · 페이지 · 로딩)
 *
 * const { filter, items, total, page, pageSize, loading, search, reset, reload } = useSearchList({
 *     filter: () => ({ keyword: '', status: null }),    // 초기 조회 조건 (초기화 때 다시 호출)
 *     fetch: (params) => api.get('/work-orders', { params }),   // params = { ...filter, page, size } → { items, total }
 * });
 *
 * - page 는 1부터 시작합니다. 페이지 · 건수를 바꾸면 다시 조회합니다.
 * - fetch 는 { items, total } 을 돌려줍니다. 서버 응답 모양이 다르면 API 함수에서 맞춥니다. (API_GUIDE.md 3장)
 * - 화면을 열 때 한 번 조회합니다. 오류 토스트는 apiClient 가 띄우고, 실패하면 목록을 비웁니다.
 * - 탭을 오갈 때마다 다시 조회하려면 화면에서 onActivated(reload)
 */
import { reactive, ref, shallowRef, watch } from 'vue';

/**
 * @param {Object} options
 * @param {Function} [options.filter] 초기 조회 조건 객체를 돌려주는 함수
 * @param {Function} options.fetch 조회 함수 - (조회 조건 + page · size) → Promise<{ items, total }>
 * @param {number} [options.pageSize=10] 한 페이지 건수
 * @returns {Object} { filter, items, total, page, pageSize, loading, search, reset, reload }
 */
export function useSearchList({ filter: createFilter = () => ({}), fetch, pageSize: initialPageSize = 10 }) {
    const filter = reactive(createFilter());
    const items = shallowRef([]);
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(initialPageSize);
    const loading = ref(false);

    async function load() {
        loading.value = true;
        try {
            const result = await fetch({ ...filter, page: page.value, size: pageSize.value });
            items.value = result.items;
            total.value = result.total;
        } catch {
            items.value = [];
            total.value = 0;
        } finally {
            loading.value = false;
        }
    }

    /** 조회 버튼 - 1페이지부터 (이미 1페이지면 바로 조회, 아니면 아래 watch 가 조회) */
    function search() {
        if (page.value === 1) load();
        else page.value = 1;
    }

    /** 초기화 버튼 - 조건을 처음 값으로 돌리고 조회 */
    function reset() {
        Object.assign(filter, createFilter());
        search();
    }

    watch(page, load);
    watch(pageSize, search);
    load();

    return { filter, items, total, page, pageSize, loading, search, reset, reload: load };
}
