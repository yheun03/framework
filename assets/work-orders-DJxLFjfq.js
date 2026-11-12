var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 작업관리</p>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">현장 작업지시 진행 상태와 실적을 조회합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">작업지시 발행</AppButton></div>
        </header>

        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="검색어" :span="2">
                <AppInput v-model="filter.keyword" size="sm" placeholder="작업지시 또는 품목" />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statuses" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="작업일">
                <AppDatePicker v-model="filter.workDate" size="sm" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable
                title="작업지시"
                caption="작업지시 목록 - 행을 누르면 상세"
                :columns="columns"
                :items="items"
                :total="total"
                row-key="no"
                clickable
                show-total
                @row-click="(row) => router.push(\`/work-orders/\${row.no}\`)"
            >
                <template #cell-progress="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { useSearchList } from '@/composables/useSearchList';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

const router = useRouter();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 실제: fetch: (params) => api.get('/work-orders', { params })
const statuses = [
    { label: '대기', value: 'waiting' },
    { label: '작업중', value: 'working' },
    { label: '완료', value: 'done' },
];
const tempRows = [
    {
        no: 'WO-260814-01',
        line: '가공 1라인',
        item: '모터 하우징 A',
        plan: 1200,
        good: 780,
        progress: 68,
        state: 'working',
        status: '작업중',
        tone: 'info',
    },
    { no: 'WO-260814-02', line: '가공 2라인', item: '샤프트 B', plan: 800, good: 800, progress: 100, state: 'done', status: '완료', tone: 'success' },
    { no: 'WO-260814-05', line: '조립 라인', item: '모터 ASSY', plan: 600, good: 0, progress: 0, state: 'waiting', status: '대기', tone: 'gray' },
];
const fetchWorkOrders = async ({ keyword, status }) =>
    tempRows.filter((row) => (!keyword || \`\${row.no} \${row.item}\`.includes(keyword)) && (!status || row.state === status));
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'no', label: '작업지시', width: 140 },
    { key: 'line', label: '라인', width: 110 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'plan', label: '지시수량', width: 100, align: 'right' },
    { key: 'good', label: '양품수량', width: 100, align: 'right' },
    { key: 'progress', label: '진척률', width: 180 },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null, workDate: '2026-08-14' }),
    fetch: fetchWorkOrders,
});
<\/script>
`;export{e as default};