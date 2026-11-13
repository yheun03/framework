var e=`<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">마스터 · 디테일</h1>
                <p class="business-page__desc">왼쪽 목록에서 고르면 오른쪽에 상세와 하위 목록을 보여줍니다. (수주-품목, 배차-경유지, BOM 등)</p>
            </div>
        </header>

        <AppSearchPanel :columns="3" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="거래처">
                <AppInput v-model="filter.keyword" size="sm" placeholder="거래처명" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSectionWrapper direction="horizontal" :ratio="[2, 3]" :gap="20">
            <AppSection title="수주">
                <AppDataTable
                    caption="수주 목록 - 행을 누르면 오른쪽에 상세"
                    :columns="masterColumns"
                    :items="items"
                    :error="Boolean(error)"
                    :total="total"
                    row-key="orderNo"
                    size="md"
                    clickable
                    show-total
                    @row-click="select"
                >
                    <template #cell-orderNo="{ row, value }">
                        <strong v-if="row.orderNo === selected?.orderNo">{{ value }}</strong>
                        <template v-else>{{ value }}</template>
                    </template>
                </AppDataTable>
                <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" :show-page-size="false" />
            </AppSection>

            <AppSection :title="selected ? \`\${selected.orderNo} 상세\` : '상세'">
                <AppEmpty v-if="!selected" size="sm" title="왼쪽 목록에서 수주를 선택하세요." />
                <template v-else>
                    <dl class="business-detail">
                        <div v-for="info in detailInfo" :key="info.label" class="business-detail__item">
                            <dt>{{ info.label }}</dt>
                            <dd>{{ info.value }}</dd>
                        </div>
                    </dl>
                    <AppDataTable
                        caption="수주 품목"
                        :columns="lineColumns"
                        :items="lines"
                        row-key="itemCode"
                        size="md"
                        :empty-text="detailLoading ? '불러오는 중…' : undefined"
                    />
                </template>
            </AppSection>
        </AppSectionWrapper>
    </div>
</template>

<script setup>
import { computed, ref, shallowRef } from 'vue';
import { useSearchList } from '@/composables/useSearchList';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppEmpty from '@/components/AppEmpty.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSectionWrapper from '@/components/Section/AppSectionWrapper.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const fetchOrders = (params) => api.get('/sales-orders', { params });
// const fetchLines = (orderNo) => api.get(\`/sales-orders/\${orderNo}/lines\`);
const fetchOrders = async ({ keyword, page, size }) => {
    const rows = DEMO_SALES_ORDERS.items.filter((order) => !keyword || order.customerName.includes(keyword));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
const fetchLines = async (orderNo) => DEMO_SALES_ORDER_LINES[orderNo] ?? [];
// temp 데이터 끝

// ── 목록 · 상세 ───────────────────────────────────────────
const won = (value) => \`₩\${value.toLocaleString()}\`;
const masterColumns = [
    { key: 'orderNo', label: '수주번호', width: 130 },
    { key: 'customerName', label: '거래처', align: 'left' },
    { key: 'dueDate', label: '납기일', width: 110 },
];
const lineColumns = [
    { key: 'itemCode', label: '품목코드', width: 110 },
    { key: 'itemName', label: '품목명', align: 'left' },
    { key: 'qty', label: '수량', width: 80, align: 'right' },
    { key: 'price', label: '단가', width: 100, align: 'right', format: won },
];

const { filter, items, total, page, pageSize, loading, error, search, reset } = useSearchList({
    filter: () => ({ keyword: '' }),
    fetch: fetchOrders,
});

const selected = ref(null);
const lines = shallowRef([]);
const detailLoading = ref(false);

const detailInfo = computed(() => [
    { label: '거래처', value: selected.value.customerName },
    { label: '수주일', value: selected.value.orderDate },
    { label: '납기일', value: selected.value.dueDate },
    { label: '수주금액', value: won(selected.value.amount) },
]);

// ── 동작 ──────────────────────────────────────────────────
/** 왼쪽 행 선택 → 오른쪽 상세 + 하위 목록 조회 */
async function select(row) {
    selected.value = row;
    detailLoading.value = true;
    lines.value = [];
    try {
        const result = await fetchLines(row.orderNo);
        if (selected.value === row) lines.value = result; // 빠르게 다른 행을 누른 경우 이전 결과는 버림
    } finally {
        if (selected.value === row) detailLoading.value = false;
    }
}
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/sales-orders?keyword=한빛&page=1&size=10 → { items, total } */
const DEMO_SALES_ORDERS = {
    items: [
        {
            orderNo: 'SO-2611-001',
            customerCode: 'C-0001',
            customerName: '한빛전자',
            orderDate: '2026-11-03',
            dueDate: '2026-11-20',
            amount: 48000000,
        },
        {
            orderNo: 'SO-2611-002',
            customerCode: 'C-0002',
            customerName: '대성모터스',
            orderDate: '2026-11-05',
            dueDate: '2026-11-22',
            amount: 16400000,
        },
        { orderNo: 'SO-2611-003', customerCode: 'C-0003', customerName: '유진테크', orderDate: '2026-11-07', dueDate: '2026-11-18', amount: 9600000 },
    ],
    total: 3,
};

/** GET /api/sales-orders/{orderNo}/lines → [ ... ] (수주번호별 품목) */
const DEMO_SALES_ORDER_LINES = {
    'SO-2611-001': [
        { itemCode: 'FG-10021', itemName: '모터 하우징 A', qty: 800, price: 40000 },
        { itemCode: 'FG-10022', itemName: '하우징 커버', qty: 800, price: 20000 },
    ],
    'SO-2611-002': [{ itemCode: 'FG-10031', itemName: '샤프트 B', qty: 820, price: 20000 }],
    'SO-2611-003': [{ itemCode: 'FG-10044', itemName: '브래킷 C', qty: 2400, price: 4000 }],
};
<\/script>
`;export{e as default};