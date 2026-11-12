<template>
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
            <AppDataTable title="재고 품목" caption="재고 품목 목록" :columns="columns" :items="items" :total="total" row-key="code" show-total>
                <template #toolbar>
                    <AppButton size="xs" @click="exportExcel">엑셀 다운로드</AppButton>
                </template>
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { useSearchList } from '@/composables/useSearchList';
import { useToast } from '@/composables/useToast';
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
// const api = useApi();
// const fetchInventories = (params) => api.get('/inventories', { params });
const warehouses = [
    { label: '원자재 창고', value: 'raw' },
    { label: '반제품 창고', value: 'wip' },
    { label: '완제품 창고', value: 'finished' },
];
const tempRows = [
    {
        code: 'RM-AL-001',
        name: '알루미늄 봉재',
        warehouse: 'raw',
        warehouseName: '원자재 창고',
        stock: 2840,
        available: 2120,
        safety: 1500,
        unit: 'kg',
    },
    { code: 'RM-ST-014', name: 'S45C 환봉', warehouse: 'raw', warehouseName: '원자재 창고', stock: 680, available: 420, safety: 800, unit: 'kg' },
    {
        code: 'FG-10021',
        name: '모터 하우징 A',
        warehouse: 'finished',
        warehouseName: '완제품 창고',
        stock: 1240,
        available: 440,
        safety: 300,
        unit: 'EA',
    },
].map((row) => ({ ...row, ...(row.available < row.safety ? { status: '부족', tone: 'warning' } : { status: '정상', tone: 'success' }) }));
const fetchInventories = async ({ keyword, warehouse, onlyShortage, page, size }) => {
    const rows = tempRows.filter(
        (row) =>
            (!keyword || `${row.code} ${row.name}`.includes(keyword)) &&
            (!warehouse || row.warehouse === warehouse) &&
            (!onlyShortage || row.status === '부족'),
    );
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const withUnit = (value, row) => `${value.toLocaleString()} ${row.unit}`;
const columns = [
    { key: 'code', label: '품목코드', width: 120 },
    { key: 'name', label: '품목명', align: 'left' },
    { key: 'warehouseName', label: '창고', width: 120 },
    { key: 'stock', label: '현재고', width: 110, align: 'right', format: withUnit },
    { key: 'available', label: '가용재고', width: 110, align: 'right', format: withUnit },
    { key: 'safety', label: '안전재고', width: 110, align: 'right', format: withUnit },
    { key: 'status', label: '재고상태', width: 100 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ keyword: '', warehouse: null, onlyShortage: false }),
    fetch: fetchInventories,
});

function exportExcel() {
    toast.info('엑셀 다운로드는 AppGrid 의 다운로드 기능(AppGridDownload)을 사용합니다.');
}
</script>
