<template>
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
            <AppDataTable
                title="검사 목록"
                caption="품질검사 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                :total="total"
                row-key="inspectionNo"
                show-total
            >
                <template #cell-result="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('QI_RESULT', row.result)" :label="row.resultName"
                /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
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
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const types = useCodes('QI_TYPE'); // import { useCodes } from '@/composables/useCodes'
// const results = useCodes('QI_RESULT'); // import { useCodes } from '@/composables/useCodes'
// const fetchSummary = (date) => api.get('/quality-inspections/summary', { params: { date } });
// const fetchInspections = (params) => api.get('/quality-inspections', { params });
const types = ref(DEMO_CODES.QI_TYPE);
const results = ref(DEMO_CODES.QI_RESULT);
const fetchSummary = async () => DEMO_INSPECTION_SUMMARY;
const fetchInspections = async ({ type, result, page, size }) => {
    const rows = DEMO_INSPECTIONS.items.filter((row) => (!type || row.type === type) && (!result || row.result === result));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'inspectionNo', label: '검사번호', width: 140 },
    { key: 'typeName', label: '구분', width: 100 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'lotNo', label: 'LOT', width: 150 },
    { key: 'qty', label: '검사수량', width: 100, align: 'right' },
    { key: 'defectQty', label: '불량수량', width: 100, align: 'right' },
    { key: 'inspectorName', label: '검사자', width: 100 },
    { key: 'result', label: '판정', width: 100 },
];

const { filter, items, total, page, pageSize, loading, error, search, reset } = useSearchList({
    filter: () => ({ type: null, result: null, date: '2026-08-14' }),
    fetch: fetchInspections,
});

// 상단 요약 - 서버 값(숫자)에 단위를 붙여 보여 줍니다.
const summary = shallowRef([]);
fetchSummary(filter.date).then((data) => {
    summary.value = [
        { label: '금일 검사', value: `${data.todayCount}건` },
        { label: '합격률', value: `${data.passRate}%` },
        { label: '부적합', value: `${data.failCount}건` },
        { label: '검사 대기', value: `${data.waitingCount}건` },
    ];
});
</script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/QI_TYPE · GET /api/codes/QI_RESULT (공통코드: [{ value, label }]) */
const DEMO_CODES = {
    QI_TYPE: [
        { value: 'incoming', label: '수입검사' },
        { value: 'process', label: '공정검사' },
        { value: 'outgoing', label: '출하검사' },
    ],
    QI_RESULT: [
        { value: 'pass', label: '합격' },
        { value: 'conditional', label: '조건부' },
        { value: 'fail', label: '불합격' },
    ],
};

/** GET /api/quality-inspections/summary?date=2026-08-14 → 상단 요약 */
const DEMO_INSPECTION_SUMMARY = { todayCount: 36, passRate: 96.8, failCount: 2, waitingCount: 7 };

/** GET /api/quality-inspections?type=process&result=pass&date=2026-08-14&page=1&size=10 → { items, total } */
const DEMO_INSPECTIONS = {
    items: [
        {
            inspectionNo: 'QI-260814-31',
            type: 'process',
            typeName: '공정검사',
            itemCode: 'FG-10021',
            itemName: '모터 하우징 A',
            lotNo: 'LOT-260814-A01',
            qty: 120,
            defectQty: 1,
            inspectorName: '최품질',
            result: 'pass',
            resultName: '합격',
        },
        {
            inspectionNo: 'QI-260814-29',
            type: 'incoming',
            typeName: '수입검사',
            itemCode: 'RM-ST-014',
            itemName: 'S45C 환봉',
            lotNo: 'RM-260813-S14',
            qty: 40,
            defectQty: 3,
            inspectorName: '정검사',
            result: 'conditional',
            resultName: '조건부',
        },
        {
            inspectionNo: 'QI-260814-24',
            type: 'outgoing',
            typeName: '출하검사',
            itemCode: 'FG-10044',
            itemName: '브래킷 C',
            lotNo: 'LOT-260812-C03',
            qty: 200,
            defectQty: 8,
            inspectorName: '최품질',
            result: 'fail',
            resultName: '불합격',
        },
    ],
    total: 3,
};
</script>
