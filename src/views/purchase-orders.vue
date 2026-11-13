<template>
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
            <AppDataTable
                title="발주 목록"
                caption="발주 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                :total="total"
                row-key="orderNo"
                show-total
            >
                <template #cell-progress="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('PO_STATUS', row.status)" :label="row.statusName"
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
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const statusOptions = useCodes('PO_STATUS'); // import { useCodes } from '@/composables/useCodes'
// const fetchSummary = () => api.get('/purchase-orders/summary');
// const fetchPurchaseOrders = (params) => api.get('/purchase-orders', { params });
const statusOptions = ref(DEMO_STATUS_CODES);
const fetchSummary = async () => DEMO_PURCHASE_SUMMARY;
const fetchPurchaseOrders = async ({ keyword, status, page, size }) => {
    const rows = DEMO_PURCHASE_ORDERS.items.filter(
        (row) => (!keyword || `${row.orderNo} ${row.vendorName}`.includes(keyword)) && (!status || row.status === status),
    );
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'orderNo', label: '발주번호', width: 140 },
    { key: 'vendorName', label: '공급사', align: 'left' },
    { key: 'orderDate', label: '발주일', width: 110 },
    { key: 'dueDate', label: '입고예정일', width: 110 },
    { key: 'amount', label: '발주금액', width: 140, align: 'right', format: (value) => `₩${value.toLocaleString()}` },
    { key: 'progress', label: '입고율', width: 170 },
    { key: 'status', label: '상태', width: 110 },
];

// 상단 요약 - 서버 값(숫자)에 단위 · 쉼표를 붙여 보여 줍니다.
const summary = shallowRef([]);
fetchSummary().then((data) => {
    summary.value = [
        { label: '이번 달 발주', value: `₩${data.monthAmount.toLocaleString()}` },
        { label: '입고 예정', value: `${data.expectedCount}건` },
        { label: '지연 발주', value: `${data.delayedCount}건` },
    ];
});

const { filter, items, total, page, pageSize, loading, error, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null }),
    fetch: fetchPurchaseOrders,
});
</script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/PO_STATUS (공통코드: [{ value, label }]) */
const DEMO_STATUS_CODES = [
    { value: 'partial', label: '부분입고' },
    { value: 'delayed', label: '입고지연' },
    { value: 'done', label: '입고완료' },
];

/** GET /api/purchase-orders/summary → 상단 요약 */
const DEMO_PURCHASE_SUMMARY = { monthAmount: 420800000, expectedCount: 18, delayedCount: 3 };

/** GET /api/purchase-orders?keyword=대한&status=partial&page=1&size=10 → { items, total } */
const DEMO_PURCHASE_ORDERS = {
    items: [
        {
            orderNo: 'PO-260814-04',
            vendorCode: 'V-0101',
            vendorName: '대한소재',
            orderDate: '2026-08-14',
            dueDate: '2026-08-19',
            amount: 72000000,
            progress: 40,
            status: 'partial',
            statusName: '부분입고',
        },
        {
            orderNo: 'PO-260813-11',
            vendorCode: 'V-0102',
            vendorName: '세진금속',
            orderDate: '2026-08-13',
            dueDate: '2026-08-17',
            amount: 38500000,
            progress: 10,
            status: 'delayed',
            statusName: '입고지연',
        },
        {
            orderNo: 'PO-260812-07',
            vendorCode: 'V-0103',
            vendorName: '미래패킹',
            orderDate: '2026-08-12',
            dueDate: '2026-08-16',
            amount: 12400000,
            progress: 100,
            status: 'done',
            statusName: '입고완료',
        },
    ],
    total: 3,
};
</script>
