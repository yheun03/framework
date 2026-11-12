var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 품질관리</p>
                <h1 class="business-page__title">품질검사 현황</h1>
                <p class="business-page__desc">수입·공정·출하검사 결과와 부적합 현황을 관리합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">검사 등록</AppButton></div>
        </header>
        <section class="business-summary business-summary--compact">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong>
            </article>
        </section>

        <AppSearchPanel :columns="3" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="검사 구분">
                <AppSelect v-model="filter.type" :items="types" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="판정">
                <AppSelect v-model="filter.result" :items="results" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="검사일">
                <AppDatePicker v-model="filter.date" size="sm" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable title="검사 목록" caption="품질검사 목록" :columns="columns" :items="items" :total="total" row-key="no" show-total>
                <template #cell-result="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.resultName" /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { useSearchList } from '@/composables/useSearchList';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// const api = useApi();
// const fetchInspections = (params) => api.get('/quality-inspections', { params });
const types = [
    { label: '수입검사', value: 'incoming' },
    { label: '공정검사', value: 'process' },
    { label: '출하검사', value: 'outgoing' },
];
const results = [
    { label: '합격', value: 'pass' },
    { label: '조건부', value: 'conditional' },
    { label: '불합격', value: 'fail' },
];
const summary = [
    { label: '금일 검사', value: '36건' },
    { label: '합격률', value: '96.8%' },
    { label: '부적합', value: '2건' },
    { label: '검사 대기', value: '7건' },
];
const tempRows = [
    {
        no: 'QI-260814-31',
        type: 'process',
        typeName: '공정검사',
        item: '모터 하우징 A',
        lot: 'LOT-260814-A01',
        qty: 120,
        defect: 1,
        inspector: '최품질',
        result: 'pass',
        resultName: '합격',
        tone: 'success',
    },
    {
        no: 'QI-260814-29',
        type: 'incoming',
        typeName: '수입검사',
        item: 'S45C 환봉',
        lot: 'RM-260813-S14',
        qty: 40,
        defect: 3,
        inspector: '정검사',
        result: 'conditional',
        resultName: '조건부',
        tone: 'warning',
    },
    {
        no: 'QI-260814-24',
        type: 'outgoing',
        typeName: '출하검사',
        item: '브래킷 C',
        lot: 'LOT-260812-C03',
        qty: 200,
        defect: 8,
        inspector: '최품질',
        result: 'fail',
        resultName: '불합격',
        tone: 'danger',
    },
];
const fetchInspections = async ({ type, result, page, size }) => {
    const rows = tempRows.filter((row) => (!type || row.type === type) && (!result || row.result === result));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'no', label: '검사번호', width: 140 },
    { key: 'typeName', label: '구분', width: 100 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'lot', label: 'LOT', width: 150 },
    { key: 'qty', label: '검사수량', width: 100, align: 'right' },
    { key: 'defect', label: '불량수량', width: 100, align: 'right' },
    { key: 'inspector', label: '검사자', width: 100 },
    { key: 'result', label: '판정', width: 100 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ type: null, result: null, date: '2026-08-14' }),
    fetch: fetchInspections,
});
<\/script>
`;export{e as default};