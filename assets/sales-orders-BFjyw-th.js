var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP · 영업관리</p>
                <h1 class="business-page__title">수주 목록</h1>
                <p class="business-page__desc">거래처별 수주와 납기 상태를 관리합니다.</p>
            </div>
            <div class="business-page__actions"><AppButton size="md" variant="fill">신규 수주 등록</AppButton></div>
        </header>

        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="검색어" :span="2">
                <AppInput v-model="filter.keyword" size="sm" placeholder="수주번호 또는 거래처" clearable />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statusOptions" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="수주일">
                <AppDatePicker v-model="filter.orderDate" size="sm" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable
                v-model="checked"
                title="수주"
                caption="수주 목록 - 납기 임박 순, 행을 누르면 상세"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                v-model:sort="sort"
                :total="total"
                row-key="orderNo"
                selectable
                clickable
                show-total
                @row-click="(row) => router.push(\`/sales-orders/\${row.orderNo}\`)"
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length">선택 출하지시</AppButton>
                </template>
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('SO_STATUS', row.status)" :label="row.statusName"
                /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchList } from '@/composables/useSearchList';
import { codeTone } from '@/constants/codeTone';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTag from '@/components/AppTag.vue';

const router = useRouter();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const statusOptions = useCodes('SO_STATUS'); // import { useCodes } from '@/composables/useCodes'
// const fetchSalesOrders = (params) => api.get('/sales-orders', { params });
const statusOptions = ref(DEMO_STATUS_CODES);
const fetchSalesOrders = async ({ keyword, status, page, size, sort }) => {
    const [sortKey, sortOrder] = sort?.split(',') ?? []; // 'dueDate,asc' - 서버라면 서버가 정렬
    const rows = DEMO_SALES_ORDERS.items
        .filter((row) => (!keyword || \`\${row.orderNo} \${row.customerName}\`.includes(keyword)) && (!status || row.status === status))
        .sort((a, b) => (sortKey ? (a[sortKey] > b[sortKey] ? 1 : -1) * (sortOrder === 'desc' ? -1 : 1) : 0));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'orderNo', label: '수주번호', width: 140 },
    { key: 'customerName', label: '거래처', width: 130 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right' },
    { key: 'dueDate', label: '납기일', width: 120, sortable: true },
    { key: 'managerName', label: '담당자', width: 100 },
    { key: 'status', label: '상태', width: 110 },
];

const { filter, items, total, page, pageSize, sort, loading, error, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null, orderDate: '2026-08-14' }),
    fetch: fetchSalesOrders,
    sort: { key: 'dueDate', order: 'asc' }, // 납기 임박 순 → params.sort = 'dueDate,asc'
});
const checked = ref([]);
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/SO_STATUS (공통코드: [{ value, label }]) */
const DEMO_STATUS_CODES = [
    { value: 'confirmed', label: '확정' },
    { value: 'working', label: '생산중' },
    { value: 'warning', label: '납기주의' },
];

/** GET /api/sales-orders?keyword=한빛&status=working&orderDate=2026-08-14&page=1&size=10 → { items, total } (납기일 순) */
const DEMO_SALES_ORDERS = {
    items: [
        {
            orderNo: 'SO-260813-08',
            customerCode: 'C-0003',
            customerName: '유진테크',
            itemCode: 'FG-10044',
            itemName: '브래킷 C',
            qty: 2400,
            orderDate: '2026-08-13',
            dueDate: '2026-08-18',
            managerName: '박납기',
            status: 'warning',
            statusName: '납기주의',
        },
        {
            orderNo: 'SO-260814-01',
            customerCode: 'C-0001',
            customerName: '한빛전자',
            itemCode: 'FG-10021',
            itemName: '모터 하우징 A',
            qty: 1200,
            orderDate: '2026-08-14',
            dueDate: '2026-08-20',
            managerName: '김영업',
            status: 'working',
            statusName: '생산중',
        },
        {
            orderNo: 'SO-260814-02',
            customerCode: 'C-0002',
            customerName: '대성모터스',
            itemCode: 'FG-10031',
            itemName: '샤프트 B',
            qty: 800,
            orderDate: '2026-08-14',
            dueDate: '2026-08-22',
            managerName: '이수주',
            status: 'confirmed',
            statusName: '확정',
        },
    ],
    total: 3,
};
<\/script>
`;export{e as default};