var e=`<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">재고 실사 입력</h1>
                <p class="business-page__desc">
                    수천 행 · 셀 편집 · 엑셀이 필요한 목록입니다. 서버가 페이지 단위로 주고(AppPagination), 고친 행만 모아서 저장합니다.
                </p>
            </div>
            <div class="business-page__actions">
                <AppButton size="sm" :loading="exporting" @click="exportExcel">엑셀 다운로드</AppButton>
                <AppButton size="sm" variant="fill" tone="primary" :disabled="!changedCount" :loading="saving" @click="save">
                    변경 저장{{ changedCount ? \` (\${changedCount})\` : '' }}
                </AppButton>
            </div>
        </header>

        <AppSearchPanel :columns="3" :loading="loading" @search="confirmLeave(search)" @reset="confirmLeave(reset)">
            <AppSearchItem label="품목">
                <AppInput v-model="filter.keyword" size="sm" placeholder="품목코드 또는 품목명" />
            </AppSearchItem>
            <AppSearchItem label="창고">
                <AppSelect v-model="filter.warehouse" :items="warehouses" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="차이">
                <AppChoice v-model="filter.onlyDiff" size="sm" label="차이 있는 품목만" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <!--
                - 행은 서버가 정렬 · 페이지를 나눠서 줍니다. 헤더를 누르면 sort 만 바꾸고(comparator 0) 서버가 다시 정렬합니다.
                - 실사수량 · 비고는 셀을 두 번 누르거나 Enter 로 편집합니다. 고친 행은 노란 배경으로 표시됩니다.
            -->
            <AppGrid
                grid-id="stock-count"
                :row-data="items"
                :column-defs="columnDefs"
                :get-row-id="(params) => params.data.itemCode"
                :row-class-rules="{ 'is-changed': (params) => changed.has(params.data.itemCode) }"
                :loading="loading"
                height="480px"
                @grid-ready="gridApi = $event.api"
                @cell-value-changed="markChanged"
                @sort-changed="applySort"
            />
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" :page-size-options="[50, 100, 200]" ellipsis />
        </AppSection>
    </div>
</template>

<script setup>
import { computed, ref, shallowRef } from 'vue';
import { useAppGridExcelExport } from '@/composables/useAppGridExcelExport';
import { useModal } from '@/composables/useModal';
import { useSearchList } from '@/composables/useSearchList';
import { useToast } from '@/composables/useToast';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppChoice from '@/components/AppChoice.vue';
import AppGrid from '@/components/AppGrid/AppGrid.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';

const modal = useModal();
const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const warehouses = useCodes('WAREHOUSE'); // import { useCodes } from '@/composables/useCodes'
// const fetchStockCounts = (params) => api.get('/stock-counts', { params });
// const saveStockCounts = (rows) => api.put('/stock-counts', rows);
const warehouses = ref(DEMO_WAREHOUSE_CODES);
const tempRows = DEMO_STOCK_COUNTS.items.map((row) => ({ ...row }));
const fetchStockCounts = async ({ keyword, warehouse, onlyDiff, page, size, sort }) => {
    const [sortKey, sortOrder] = sort?.split(',') ?? []; // 서버라면 서버가 정렬
    const rows = tempRows
        .filter(
            (row) =>
                (!keyword || \`\${row.itemCode} \${row.itemName}\`.includes(keyword)) &&
                (!warehouse || row.warehouse === warehouse) &&
                (!onlyDiff || row.countQty !== row.bookQty),
        )
        .sort((a, b) => (sortKey ? (a[sortKey] > b[sortKey] ? 1 : -1) * (sortOrder === 'desc' ? -1 : 1) : 0));
    await new Promise((resolve) => setTimeout(resolve, 150)); // 네트워크 지연 흉내
    return { items: rows.slice((page - 1) * size, page * size).map((row) => ({ ...row })), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
const saveStockCounts = async (rows) => {
    for (const row of rows) Object.assign(tempRows.find((temp) => temp.itemCode === row.itemCode) ?? {}, row);
    await new Promise((resolve) => setTimeout(resolve, 300));
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const NO_CLIENT_SORT = () => 0; // 서버 정렬 - 그리드가 행 순서를 바꾸지 않음
const number = (params) => (params.value ?? 0).toLocaleString();
const columnDefs = [
    { field: 'itemCode', headerName: '품목코드', width: 130, sortable: true, comparator: NO_CLIENT_SORT },
    { field: 'itemName', headerName: '품목명', flex: 1, minWidth: 160, sortable: true, comparator: NO_CLIENT_SORT },
    { field: 'warehouseName', headerName: '창고', width: 120 },
    { field: 'unit', headerName: '단위', width: 80, cellAlign: 'center' },
    { field: 'bookQty', headerName: '장부수량', width: 120, cellAlign: 'right', valueFormatter: number },
    {
        field: 'countQty',
        headerName: '실사수량 ✎',
        width: 130,
        cellAlign: 'right',
        editable: true,
        cellEditor: 'agNumberCellEditor',
        cellEditorParams: { min: 0, precision: 0 },
        valueFormatter: number,
    },
    {
        colId: 'diffQty',
        headerName: '차이',
        width: 110,
        cellAlign: 'right',
        valueGetter: (params) => params.data.countQty - params.data.bookQty,
        valueFormatter: (params) => (params.value > 0 ? \`+\${params.value.toLocaleString()}\` : params.value.toLocaleString()),
        cellClassRules: { 'is-minus': (params) => params.value < 0, 'is-plus': (params) => params.value > 0 },
    },
    { field: 'memo', headerName: '비고 ✎', width: 200, editable: true },
];

const { filter, items, total, page, pageSize, sort, loading, search, reset, reload, fetchAllRows } = useSearchList({
    filter: () => ({ keyword: '', warehouse: null, onlyDiff: false }),
    fetch: fetchStockCounts,
    pageSize: 50,
});

// ── 변경 추적 · 동작 ──────────────────────────────────────
const gridApi = shallowRef(null);
const changed = ref(new Map()); // itemCode → 고친 행
const changedCount = computed(() => changed.value.size);
const saving = ref(false);
const exporting = ref(false);
const { exportRows } = useAppGridExcelExport();

/** 셀 편집 → 고친 행으로 기록 (같은 행은 한 번만) */
function markChanged({ data, node }) {
    changed.value = new Map(changed.value).set(data.itemCode, { ...data });
    gridApi.value?.redrawRows({ rowNodes: [node] }); // 행 배경(is-changed) 갱신
}

/** 헤더 정렬 → useSearchList 의 sort 로 (서버가 정렬해서 다시 줌) */
function applySort({ api }) {
    const column = api.getColumnState().find((state) => state.sort);
    sort.value = column ? { key: column.colId, order: column.sort } : null;
}

/** 저장하지 않은 변경이 있으면 묻고 진행 (조회 · 초기화 전) */
async function confirmLeave(next) {
    if (changedCount.value && !(await modal.confirm(\`저장하지 않은 \${changedCount.value}건이 있습니다. 버리고 조회할까요?\`))) return;
    changed.value = new Map();
    next();
}

/** 변경 저장 - 고친 행만 보냄 (PUT /api/stock-counts) */
async function save() {
    saving.value = true;
    try {
        await saveStockCounts([...changed.value.values()].map(({ itemCode, countQty, memo }) => ({ itemCode, countQty, memo })));
        toast.success(\`\${changedCount.value}건을 저장했습니다.\`);
        changed.value = new Map();
        reload();
    } finally {
        saving.value = false;
    }
}

/** 엑셀 - 확정된 조회 조건 · 정렬의 전체 행 */
async function exportExcel() {
    exporting.value = true;
    try {
        const rows = (await fetchAllRows()).map((row) => ({ ...row, diffQty: row.countQty - row.bookQty }));
        await exportRows({
            name: '재고실사',
            columns: columnDefs.map((col) => ({ field: col.field ?? col.colId, headerName: col.headerName.replace(' ✎', '') })),
            rows,
        });
    } finally {
        exporting.value = false;
    }
}
<\/script>

<style scoped lang="scss">
:deep(.ag-row.is-changed) {
    background-color: var(--theme-status-warning-alpha);
}

:deep(.ag-cell.is-minus) {
    color: var(--theme-status-error-text);
}

:deep(.ag-cell.is-plus) {
    color: var(--theme-status-info-text);
}
</style>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/WAREHOUSE (공통코드: [{ value, label }]) */
const DEMO_WAREHOUSE_CODES = [
    { value: 'raw', label: '원자재 창고' },
    { value: 'wip', label: '반제품 창고' },
    { value: 'finished', label: '완제품 창고' },
];

/**
 * GET /api/stock-counts?keyword=&warehouse=raw&onlyDiff=true&page=1&size=50&sort=itemCode,asc → { items, total }
 * 행 1건 예) { itemCode: 'RM-0001', itemName: '알루미늄 봉재 1', warehouse: 'raw', warehouseName: '원자재 창고', unit: 'kg', bookQty: 1200, countQty: 1200, memo: '' }
 * PUT /api/stock-counts 요청 본문: 고친 행만 [{ itemCode, countQty, memo }]
 * (대용량 확인용으로 1,000행을 만들어 둡니다)
 */
const DEMO_WAREHOUSES = [
    { warehouse: 'raw', warehouseName: '원자재 창고', prefix: 'RM', names: ['알루미늄 봉재', 'S45C 환봉', 'SPCC 강판'], unit: 'kg' },
    { warehouse: 'wip', warehouseName: '반제품 창고', prefix: 'WP', names: ['가공 하우징', '연삭 샤프트', '도장 브래킷'], unit: 'EA' },
    { warehouse: 'finished', warehouseName: '완제품 창고', prefix: 'FG', names: ['모터 하우징', '모터 ASSY', '하우징 커버'], unit: 'EA' },
];
const DEMO_STOCK_COUNTS = {
    items: Array.from({ length: 1000 }, (_, index) => {
        const group = DEMO_WAREHOUSES[index % 3];
        const bookQty = 100 + ((index * 37) % 1900);
        return {
            itemCode: \`\${group.prefix}-\${String(index + 1).padStart(4, '0')}\`,
            itemName: \`\${group.names[index % 3]} \${index + 1}\`,
            warehouse: group.warehouse,
            warehouseName: group.warehouseName,
            unit: group.unit,
            bookQty,
            countQty: index % 7 === 0 ? bookQty - (index % 11) : bookQty,
            memo: '',
        };
    }),
    total: 1000,
};
<\/script>
`;export{e as default};