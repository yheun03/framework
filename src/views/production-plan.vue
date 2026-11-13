<template>
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
                :title="`${filter.planDate} 생산계획`"
                caption="생산계획 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                :total="total"
                row-key="orderNo"
                show-total
            >
                <template #cell-load="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('PLAN_STATUS', row.status)" :label="row.statusName"
                /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>
<script setup>
import { ref, shallowRef } from 'vue';
import { useSearchList } from '@/composables/useSearchList';
import { codeTone } from '@/constants/codeTone';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const lines = useCodes('LINE'); // import { useCodes } from '@/composables/useCodes'
// const shifts = useCodes('SHIFT'); // import { useCodes } from '@/composables/useCodes'
// const fetchSummary = (planDate) => api.get('/production-plans/summary', { params: { planDate } });
// const fetchPlans = (params) => api.get('/production-plans', { params });
const lines = ref(DEMO_CODES.LINE);
const shifts = ref(DEMO_CODES.SHIFT);
const fetchSummary = async () => DEMO_PLAN_SUMMARY;
const fetchPlans = async ({ line, shift, page, size }) => {
    const rows = DEMO_PLANS.items.filter((row) => (!line || row.line === line) && (!shift || row.shift === shift));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'lineName', label: '라인', width: 120 },
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'qty', label: '계획수량', width: 110, align: 'right', format: (value, row) => `${value.toLocaleString()} ${row.unit}` },
    { key: 'startTime', label: '계획시간', width: 140, format: (value, row) => `${value} ~ ${row.endTime}` },
    { key: 'load', label: '부하율', width: 170 },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, loading, error, search, reset } = useSearchList({
    filter: () => ({ planDate: '2026-08-14', line: null, shift: null }),
    fetch: fetchPlans,
    pageSize: 100,
});

// 상단 요약 - 서버 값(숫자)에 단위를 붙여 보여 줍니다.
const summary = shallowRef([]);
fetchSummary(filter.planDate).then((data) => {
    summary.value = [
        { label: '계획 수량', value: `${data.planQty.toLocaleString()} EA` },
        { label: '계획 공수', value: `${data.planHours} h` },
        { label: '평균 부하율', value: `${data.avgLoad}%` },
        { label: '미배정', value: `${data.unassignedCount}건` },
    ];
});
</script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/LINE · GET /api/codes/SHIFT (공통코드: [{ value, label }]) */
const DEMO_CODES = {
    LINE: [
        { value: 'line-1', label: '가공 1라인' },
        { value: 'line-2', label: '가공 2라인' },
        { value: 'assembly', label: '조립 라인' },
    ],
    SHIFT: [
        { value: 'a', label: '주간 A조' },
        { value: 'b', label: '야간 B조' },
    ],
};

/** GET /api/production-plans/summary?planDate=2026-08-14 → 상단 요약 */
const DEMO_PLAN_SUMMARY = { planQty: 8400, planHours: 186, avgLoad: 82, unassignedCount: 2 };

/** GET /api/production-plans?planDate=2026-08-14&line=line-1&shift=a&page=1&size=100 → { items, total } */
const DEMO_PLANS = {
    items: [
        {
            line: 'line-1',
            lineName: '가공 1라인',
            shift: 'a',
            orderNo: 'WO-260814-01',
            itemCode: 'FG-10021',
            itemName: '모터 하우징 A',
            qty: 1200,
            unit: 'EA',
            startTime: '08:00',
            endTime: '14:00',
            load: 86,
            status: 'confirmed',
            statusName: '확정',
        },
        {
            line: 'line-2',
            lineName: '가공 2라인',
            shift: 'a',
            orderNo: 'WO-260814-02',
            itemCode: 'FG-10031',
            itemName: '샤프트 B',
            qty: 800,
            unit: 'EA',
            startTime: '08:00',
            endTime: '12:30',
            load: 72,
            status: 'confirmed',
            statusName: '확정',
        },
        {
            line: 'assembly',
            lineName: '조립 라인',
            shift: 'b',
            orderNo: 'WO-260814-05',
            itemCode: 'FG-20001',
            itemName: '모터 ASSY',
            qty: 600,
            unit: 'SET',
            startTime: '13:00',
            endTime: '20:00',
            load: 94,
            status: 'overload',
            statusName: '부하주의',
        },
    ],
    total: 3,
};
</script>
