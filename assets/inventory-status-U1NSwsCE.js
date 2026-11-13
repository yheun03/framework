var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP · 재고관리</p>
                <h1 class="business-page__title">재고 현황</h1>
                <p class="business-page__desc">창고별 현재고와 안전재고를 비교합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">재고 조정</AppButton></div>
        </header>

        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="품목" :span="2">
                <AppInput v-model="filter.keyword" size="sm" placeholder="품목코드 또는 품목명" />
            </AppSearchItem>
            <AppSearchItem label="창고">
                <AppSelect v-model="filter.warehouse" :items="warehouses" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="부족 재고">
                <AppChoice v-model="filter.onlyShortage" size="sm" label="부족 재고만" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable
                title="재고 품목"
                caption="재고 품목 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                :total="total"
                row-key="itemCode"
                show-total
            >
                <template #toolbar>
                    <AppButton size="xs" :loading="exporting" @click="exportExcel">엑셀 다운로드</AppButton>
                </template>
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('STOCK_STATUS', row.status)" :label="row.statusName"
                /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useAppGridExcelExport } from '@/composables/useAppGridExcelExport';
import { useSearchList } from '@/composables/useSearchList';
import { useToast } from '@/composables/useToast';
import { codeTone } from '@/constants/codeTone';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppChoice from '@/components/AppChoice.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const warehouses = useCodes('WAREHOUSE'); // import { useCodes } from '@/composables/useCodes'
// const fetchInventories = (params) => api.get('/inventories', { params });
const warehouses = ref(DEMO_WAREHOUSE_CODES);
const fetchInventories = async ({ keyword, warehouse, onlyShortage, page, size }) => {
    const rows = DEMO_INVENTORIES.items.filter(
        (row) =>
            (!keyword || \`\${row.itemCode} \${row.itemName}\`.includes(keyword)) &&
            (!warehouse || row.warehouse === warehouse) &&
            (!onlyShortage || row.status === 'shortage'),
    );
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const withUnit = (value, row) => \`\${value.toLocaleString()} \${row.unit}\`;
const columns = [
    { key: 'itemCode', label: '품목코드', width: 120 },
    { key: 'itemName', label: '품목명', align: 'left' },
    { key: 'warehouseName', label: '창고', width: 120 },
    { key: 'stock', label: '현재고', width: 110, align: 'right', format: withUnit },
    { key: 'available', label: '가용재고', width: 110, align: 'right', format: withUnit },
    { key: 'safety', label: '안전재고', width: 110, align: 'right', format: withUnit },
    { key: 'status', label: '재고상태', width: 100 },
];

const { filter, items, total, page, pageSize, loading, error, search, reset, fetchAllRows } = useSearchList({
    filter: () => ({ keyword: '', warehouse: null, onlyShortage: false }),
    fetch: fetchInventories,
});

// ── 동작 ──────────────────────────────────────────────────
const { exportRows } = useAppGridExcelExport();
const exporting = ref(false);

/** 엑셀 다운로드 - 현재 페이지가 아니라 확정된 조회 조건의 전체 행 (표에 보이는 컬럼 순서, 상태는 이름으로) */
async function exportExcel() {
    exporting.value = true;
    try {
        const rows = await fetchAllRows();
        const excelColumns = columns.map((column) => ({ field: column.key === 'status' ? 'statusName' : column.key, headerName: column.label }));
        await exportRows({ name: '재고현황', columns: excelColumns, rows });
        toast.success(\`\${rows.length.toLocaleString()}건을 내려받았습니다.\`);
    } finally {
        exporting.value = false;
    }
}
<\/script>

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

/** GET /api/inventories?keyword=FG&warehouse=raw&onlyShortage=true&page=1&size=10 → { items, total } */
const DEMO_INVENTORIES = {
    items: [
        {
            itemCode: 'RM-AL-001',
            itemName: '알루미늄 봉재',
            warehouse: 'raw',
            warehouseName: '원자재 창고',
            stock: 2840,
            available: 2120,
            safety: 1500,
            unit: 'kg',
            status: 'normal',
            statusName: '정상',
        },
        {
            itemCode: 'RM-ST-014',
            itemName: 'S45C 환봉',
            warehouse: 'raw',
            warehouseName: '원자재 창고',
            stock: 680,
            available: 420,
            safety: 800,
            unit: 'kg',
            status: 'shortage',
            statusName: '부족',
        },
        {
            itemCode: 'FG-10021',
            itemName: '모터 하우징 A',
            warehouse: 'finished',
            warehouseName: '완제품 창고',
            stock: 1240,
            available: 440,
            safety: 300,
            unit: 'EA',
            status: 'normal',
            statusName: '정상',
        },
    ],
    total: 3,
};
<\/script>
`;export{e as default};