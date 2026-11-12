/**
 * 목록 화면 공통 조회 로직 (조회 조건 · 목록 · 건수 · 페이지 · 로딩)
 * ERP · MES · TMS 목록 화면은 모두 '조회 조건 → 조회 → 목록 → 페이지' 이므로 이 composable 하나로 씁니다.
 *
 * const { filter, items, total, page, pageSize, loading, search, reset, reload } = useSearchList({
 *     filter: () => ({ keyword: '', status: null }),           // 초기 조회 조건 (초기화 때 다시 호출)
 *     fetch: (params) => api.get('/work-orders', { params }),    // params = { ...filter, page, size }
 * });
 *
 * - params 의 page 는 1부터 시작합니다. (Spring Pageable 은 0부터 → API_GUIDE.md 3장)
 * - 기간(AppDatePicker range)처럼 객체인 조건은 서버 이름으로 풀어서 보냅니다.
 *     fetch: ({ period, ...params }) => api.get('/work-orders', { params: { ...params, fromDate: period?.start, toDate: period?.end } })
 * - fetch 결과
 *   - 배열이면 화면에서 페이지를 나눕니다. (퍼블리싱 temp 데이터 · 건수가 적은 코드성 목록)
 *   - { items | list | content, total | totalCount | totalElements } 면 서버 페이지로 봅니다. (페이지 이동 시 다시 조회)
 * - 오류 토스트는 useApi 가 공통으로 띄웁니다. 실패하면 목록을 비웁니다.
 * - 처음 열 때 자동 조회합니다. (immediate: false 로 끔)
 * - 상세에서 돌아와 다시 조회하려면 화면에서 onActivated(reload) (탭 화면은 KeepAlive 로 유지됨)
 */
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import { normalizeListResponse, slicePage } from '@/utils/list';

/**
 * @template {Record<string, any>} F
 * @param {object} options
 * @param {() => F} [options.filter] 초기 조회 조건을 만드는 함수 (초기화 때 다시 호출)
 * @param {(params: F & { page: number, size: number }) => Promise<any[] | { items?: any[], content?: any[], total?: number, totalElements?: number }>} options.fetch 조회 함수
 * @param {number} [options.pageSize=10] 한 페이지 건수
 * @param {boolean} [options.immediate=true] 화면을 열 때 바로 조회
 */
export function useSearchList({ filter: createFilter = () => ({}), fetch, pageSize: initialPageSize = 10, immediate = true }) {
    const filter = reactive(createFilter());
    const page = ref(1);
    const pageSize = ref(initialPageSize);
    const loading = ref(false);
    const rows = shallowRef([]);
    const total = ref(0);
    const serverPaged = ref(false);
    let requestId = 0;

    const items = computed(() => (serverPaged.value ? rows.value : slicePage(rows.value, page.value, pageSize.value)));
    let loadedPage = null; // 마지막으로 조회한 페이지 (같은 페이지를 두 번 조회하지 않도록)

    async function load() {
        const current = ++requestId;
        loadedPage = page.value;
        loading.value = true;
        try {
            const result = normalizeListResponse(await fetch({ ...filter, page: page.value, size: pageSize.value }));
            if (current !== requestId) return; // 늦게 도착한 이전 응답은 버림
            rows.value = result.items;
            total.value = result.total;
            serverPaged.value = result.paged;
        } catch {
            if (current !== requestId) return;
            rows.value = [];
            total.value = 0;
        } finally {
            if (current === requestId) loading.value = false;
        }
    }

    /** 조회 버튼 - 1페이지부터 */
    function search() {
        page.value = 1;
        return load();
    }

    /** 초기화 버튼 - 조건을 처음 값으로 돌리고 조회 */
    function reset() {
        Object.assign(filter, createFilter());
        return search();
    }

    // 서버 페이지일 때만 페이지 이동 · 건수 변경 시 다시 조회 (클라이언트 페이지는 잘라서 보여주기만 함)
    watch(pageSize, () => {
        page.value = 1;
        if (serverPaged.value) load();
    });
    watch(page, (next) => {
        if (serverPaged.value && next !== loadedPage) load();
    });

    if (immediate) load();

    return { filter, items, total, page, pageSize, loading, search, reset, reload: load };
}
