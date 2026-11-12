var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 생산관리</p>
                <h1 class="business-page__title">생산계획</h1>
                <p class="business-page__desc">수주와 설비 부하를 기준으로 일별 생산계획을 편성합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">계획 등록</AppButton></div>
        </header>

        <AppSearchPanel :columns="3" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="계획일">
                <AppDatePicker v-model="filter.planDate" size="sm" />
            </AppSearchItem>
            <AppSearchItem label="라인">
                <AppSelect v-model="filter.line" :items="lines" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="근무조">
                <AppSelect v-model="filter.shift" :items="shifts" size="sm" placeholder="전체" />
            </AppSearchItem>
        </AppSearchPanel>

        <section class="business-summary business-summary--compact">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong>
            </article>
        </section>

        <AppSection>
            <AppDataTable
                :title="\`\${filter.planDate} 생산계획\`"
                caption="생산계획 목록"
                :columns="columns"
                :items="items"
                :total="total"
                row-key="order"
                show-total
            >
                <template #cell-load="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>
<script setup>
import { useSearchList } from '@/composables/useSearchList';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// temp 데이터 - 실제: fetch: (params) => api.get('/production-plans', { params })
const lines = [
    { label: '가공 1라인', value: 'line-1' },
    { label: '가공 2라인', value: 'line-2' },
    { label: '조립 라인', value: 'assembly' },
];
const shifts = [
    { label: '주간 A조', value: 'a' },
    { label: '야간 B조', value: 'b' },
];
const summary = [
    { label: '계획 수량', value: '8,400 EA' },
    { label: '계획 공수', value: '186 h' },
    { label: '평균 부하율', value: '82%' },
    { label: '미배정', value: '2건' },
];
const tempRows = [
    {
        lineCode: 'line-1',
        line: '가공 1라인',
        order: 'WO-260814-01',
        item: '모터 하우징 A',
        qty: '1,200 EA',
        time: '08:00 ~ 14:00',
        load: 86,
        status: '확정',
        tone: 'success',
    },
    {
        lineCode: 'line-2',
        line: '가공 2라인',
        order: 'WO-260814-02',
        item: '샤프트 B',
        qty: '800 EA',
        time: '08:00 ~ 12:30',
        load: 72,
        status: '확정',
        tone: 'success',
    },
    {
        lineCode: 'assembly',
        line: '조립 라인',
        order: 'WO-260814-05',
        item: '모터 ASSY',
        qty: '600 SET',
        time: '13:00 ~ 20:00',
        load: 94,
        status: '부하주의',
        tone: 'warning',
    },
];
const fetchPlans = async ({ line }) => tempRows.filter((row) => !line || row.lineCode === line);
// temp 데이터 끝

const columns = [
    { key: 'line', label: '라인', width: 120 },
    { key: 'order', label: '작업지시', width: 140 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'qty', label: '계획수량', width: 110, align: 'right' },
    { key: 'time', label: '계획시간', width: 140 },
    { key: 'load', label: '부하율', width: 170 },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, loading, search, reset } = useSearchList({
    filter: () => ({ planDate: '2026-08-14', line: null, shift: null }),
    fetch: fetchPlans,
    pageSize: 100,
});
<\/script>
`;export{e as default};