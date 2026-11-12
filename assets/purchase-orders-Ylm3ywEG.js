var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP · 구매관리</p>
                <h1 class="business-page__title">발주 관리</h1>
                <p class="business-page__desc">구매 발주와 입고 예정 현황을 관리합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">발주서 작성</AppButton></div>
        </header>
        <section class="business-summary business-summary--compact">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong>
            </article>
        </section>

        <AppSearchPanel :columns="3" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="검색어" :span="2">
                <AppInput v-model="filter.keyword" size="sm" placeholder="발주번호, 공급사" />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statusOptions" size="sm" placeholder="전체" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable title="발주 목록" caption="발주 목록" :columns="columns" :items="items" :total="total" row-key="no" show-total>
                <template #cell-progress="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { useSearchList } from '@/composables/useSearchList';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// temp 데이터 - 실제: fetch: (params) => api.get('/purchase-orders', { params })
const statusOptions = [
    { label: '부분입고', value: 'partial' },
    { label: '입고지연', value: 'delayed' },
    { label: '입고완료', value: 'done' },
];
const summary = [
    { label: '이번 달 발주', value: '₩420,800,000' },
    { label: '입고 예정', value: '18건' },
    { label: '지연 발주', value: '3건' },
];
const tempRows = [
    {
        no: 'PO-260814-04',
        vendor: '대한소재',
        orderDate: '2026-08-14',
        dueDate: '2026-08-19',
        amount: 72000000,
        progress: 40,
        state: 'partial',
        status: '부분입고',
        tone: 'info',
    },
    {
        no: 'PO-260813-11',
        vendor: '세진금속',
        orderDate: '2026-08-13',
        dueDate: '2026-08-17',
        amount: 38500000,
        progress: 10,
        state: 'delayed',
        status: '입고지연',
        tone: 'warning',
    },
    {
        no: 'PO-260812-07',
        vendor: '미래패킹',
        orderDate: '2026-08-12',
        dueDate: '2026-08-16',
        amount: 12400000,
        progress: 100,
        state: 'done',
        status: '입고완료',
        tone: 'success',
    },
];
const fetchPurchaseOrders = async ({ keyword, status }) =>
    tempRows.filter((row) => (!keyword || \`\${row.no} \${row.vendor}\`.includes(keyword)) && (!status || row.state === status));
// temp 데이터 끝

const columns = [
    { key: 'no', label: '발주번호', width: 140 },
    { key: 'vendor', label: '공급사', align: 'left' },
    { key: 'orderDate', label: '발주일', width: 110 },
    { key: 'dueDate', label: '입고예정일', width: 110 },
    { key: 'amount', label: '발주금액', width: 140, align: 'right', format: (value) => \`₩\${value.toLocaleString()}\` },
    { key: 'progress', label: '입고율', width: 170 },
    { key: 'status', label: '상태', width: 110 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null }),
    fetch: fetchPurchaseOrders,
});
<\/script>
`;export{e as default};