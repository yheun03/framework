/**
 * 목록 화면 공통 조회 (조회 조건 · 목록 · 건수 · 페이지 · 정렬 · 로딩 · 오류)
 *
 * const { filter, items, total, page, pageSize, sort, loading, error, search, reset, reload, fetchAllRows } = useSearchList({
 *     filter: () => ({ keyword: '', status: null }),    // 초기 조회 조건 (초기화 때 다시 호출)
 *     fetch: (params) => api.get('/work-orders', { params }),   // params = { ...조회 조건, page, size, sort? } → { items, total }
 * });
 *
 * - page 는 1부터 시작합니다. 페이지 · 건수 · 정렬을 바꾸면 다시 조회합니다.
 * - 조회 조건은 '조회' 버튼(search)을 누른 시점의 값만 씁니다. 입력만 바꾸고 페이지를 넘기면 이전 조건으로 조회합니다.
 * - 정렬: AppDataTable 에 v-model:sort="sort" → params.sort = 'dueDate,asc' (Spring Pageable 과 같은 모양)
 * - 응답이 늦게 와도 마지막 요청의 결과만 화면에 넣습니다. (빠르게 여러 번 조회해도 이전 결과가 덮어쓰지 않음)
 * - fetch 는 { items, total } 을 돌려줍니다. 서버 응답 모양이 다르면 API 함수에서 맞춥니다. (API_GUIDE.md 3장)
 * - 실패하면 목록을 비우고 error 에 오류를 넣습니다. (오류 토스트는 apiClient) → AppDataTable :error="Boolean(error)"
 * - 화면을 열 때 한 번 조회합니다. 탭을 오갈 때마다 다시 조회하려면 화면에서 onActivated(reload)
 * - 엑셀 다운로드처럼 조회 조건 전체가 필요하면 fetchAllRows() (page 1 · size 최대 건수로 한 번 더 조회)
 */
import { reactive, ref, shallowRef, watch } from 'vue';

// 조회 버튼을 누른 시점의 조건을 따로 보관 (입력 중인 filter 와 분리). 조건 값은 문자열 · 숫자 · 날짜 범위 객체 정도라 JSON 복사로 충분합니다.
const snapshot = (value) => JSON.parse(JSON.stringify(value));

/**
 * @param {Object} options
 * @param {Function} [options.filter] 초기 조회 조건 객체를 돌려주는 함수
 * @param {Function} options.fetch 조회 함수 - (조회 조건 + page · size · sort) → Promise<{ items, total }>
 * @param {number} [options.pageSize=10] 한 페이지 건수
 * @param {Object} [options.sort] 처음 정렬 { key, order: 'asc' | 'desc' }
 * @returns {Object} { filter, items, total, page, pageSize, sort, loading, error, search, reset, reload, fetchAllRows }
 */
export function useSearchList({ filter: createFilter = () => ({}), fetch, pageSize: initialPageSize = 10, sort: initialSort = null }) {
    const filter = reactive(createFilter());
    const items = shallowRef([]);
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(initialPageSize);
    const sort = ref(initialSort);
    const loading = ref(false);
    const error = shallowRef(null);

    let applied = snapshot(filter);
    let lastRequest = 0;

    async function load() {
        const request = ++lastRequest;
        loading.value = true;
        error.value = null;

        const params = { ...applied, page: page.value, size: pageSize.value };
        if (sort.value?.key) params.sort = `${sort.value.key},${sort.value.order ?? 'asc'}`;

        try {
            const result = await fetch(params);
            if (request !== lastRequest) return; // 더 나중에 보낸 요청이 있으면 이 결과는 버림
            items.value = result.items;
            total.value = result.total;
        } catch (caught) {
            if (request !== lastRequest) return;
            items.value = [];
            total.value = 0;
            error.value = caught;
        } finally {
            if (request === lastRequest) loading.value = false;
        }
    }

    /** 1페이지부터 다시 조회 (이미 1페이지면 바로, 아니면 아래 watch(page) 가 조회) */
    function firstPage() {
        if (page.value === 1) load();
        else page.value = 1;
    }

    /** 조회 버튼 - 지금 입력한 조건을 확정하고 1페이지부터 */
    function search() {
        applied = snapshot(filter);
        firstPage();
    }

    /** 초기화 버튼 - 조건을 처음 값으로 돌리고 조회 */
    function reset() {
        Object.assign(filter, createFilter());
        search();
    }

    /**
     * 확정된 조회 조건 · 정렬로 전체 행을 받습니다. (엑셀 다운로드용)
     * @param {number} [max=10000] 최대 건수 - 서버에도 같은 상한을 둡니다.
     * @returns {Promise} 행 배열
     */
    async function fetchAllRows(max = 10000) {
        const params = { ...applied, page: 1, size: max };
        if (sort.value?.key) params.sort = `${sort.value.key},${sort.value.order ?? 'asc'}`;
        const result = await fetch(params);
        return result.items;
    }

    watch(page, load);
    watch(pageSize, firstPage);
    watch(sort, firstPage);
    load();

    return { filter, items, total, page, pageSize, sort, loading, error, search, reset, reload: load, fetchAllRows };
}
