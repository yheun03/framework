<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">조회 조건 → 목록 → 페이지 이동으로 구성한 기본 목록 화면입니다.</p>
            </div>
            <div class="business-page__actions">
                <AppButton variant="fill" tone="primary" size="sm" to="/demos/demo-page-form">작업지시 등록</AppButton>
            </div>
        </header>

        <!-- 조회 조건: 입력 · 버튼 모두 size="sm"(36px) - 같은 이름 = 같은 높이 -->
        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="작업일자" :span="2">
                <AppDatePicker v-model="filter.period" type="range-input" size="sm" />
            </AppSearchItem>
            <AppSearchItem label="라인">
                <AppSelect v-model="filter.line" :items="lines" size="sm" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statuses" size="sm" placeholder="전체" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <!-- v-model:sort: 헤더(수량)를 누르면 서버 정렬(sort=qty,asc)로 다시 조회 · 행을 누르면 상세로 (실제 화면: router.push(`/work-orders/${row.id}`) → views/work-orders/[id].vue) -->
            <AppDataTable
                v-model="checked"
                title="작업지시"
                caption="작업지시 목록"
                :columns="columns"
                :items="items"
                :error="Boolean(error)"
                v-model:sort="sort"
                :total="total"
                selectable
                clickable
                show-total
                @row-click="openDetail"
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length" @click="remove">선택 삭제</AppButton>
                </template>
                <template #cell-status="{ row }">
                    <AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName" />
                </template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '@/composables/useModal';
import { useSearchList } from '@/composables/useSearchList';
import { useToast } from '@/composables/useToast';
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

const modal = useModal();
const toast = useToast();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const lines = useCodes('LINE'); // import { useCodes } from '@/composables/useCodes'
// const fetchWorkOrders = ({ period, ...params }) => api.get('/work-orders', { params: { ...params, fromDate: period.start, toDate: period.end } });
// const deleteWorkOrders = (ids) => api.delete('/work-orders', { data: ids });
const lines = ref(DEMO_CODES.LINE);
const statuses = ref(DEMO_CODES.WO_STATUS);
let tempRows = DEMO_WORK_ORDERS.items;
const fetchWorkOrders = async ({ line, status, page, size, sort }) => {
    const [sortKey, sortOrder] = sort?.split(',') ?? []; // 'qty,desc' - 서버라면 서버가 정렬
    const rows = tempRows
        .filter((row) => (!line || row.line === line) && (!status || row.status === status))
        .sort((a, b) => (sortKey ? (a[sortKey] > b[sortKey] ? 1 : -1) * (sortOrder === 'desc' ? -1 : 1) : 0));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
const deleteWorkOrders = async (ids) => (tempRows = tempRows.filter((row) => !ids.includes(row.id)));
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'lineName', label: '라인', width: 100 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right', sortable: true },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, page, pageSize, sort, loading, error, search, reset, reload } = useSearchList({
    filter: () => ({ period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null }),
    fetch: fetchWorkOrders,
});
const checked = ref([]);

// ── 동작 ──────────────────────────────────────────────────
/** 행 클릭 → 상세 (실제: router.push(`/work-orders/${row.id}`)) */
function openDetail(row) {
    toast.info(`${row.orderNo} 상세로 이동합니다.`);
}

/** 선택 삭제 → 확인 → 삭제 → 다시 조회 */
async function remove() {
    if (!(await modal.confirm(`선택한 ${checked.value.length}건을 삭제할까요?`))) return;
    await deleteWorkOrders(checked.value);
    toast.success(`${checked.value.length}건을 삭제했습니다.`);
    checked.value = [];
    reload();
}
</script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/LINE · GET /api/codes/WO_STATUS (공통코드: [{ value, label }]) */
const DEMO_CODES = {
    LINE: [
        { value: 'L1', label: '1라인' },
        { value: 'L2', label: '2라인' },
    ],
    WO_STATUS: [
        { value: 'working', label: '진행' },
        { value: 'done', label: '완료' },
        { value: 'stopped', label: '정지' },
    ],
};

/** GET /api/work-orders?fromDate=2026-11-01&toDate=2026-11-30&line=L1&status=working&page=1&size=10 → { items, total } */
const DEMO_WORK_ORDERS = {
    items: [
        {
            id: 1,
            orderNo: 'WO-2611-001',
            line: 'L1',
            lineName: '1라인',
            itemCode: 'FG-10011',
            itemName: '브래킷 A형',
            qty: 1200,
            status: 'working',
            statusName: '진행',
        },
        {
            id: 2,
            orderNo: 'WO-2611-002',
            line: 'L1',
            lineName: '1라인',
            itemCode: 'FG-10022',
            itemName: '하우징 커버',
            qty: 800,
            status: 'done',
            statusName: '완료',
        },
        {
            id: 3,
            orderNo: 'WO-2611-003',
            line: 'L2',
            lineName: '2라인',
            itemCode: 'FG-10031',
            itemName: '샤프트',
            qty: 3000,
            status: 'stopped',
            statusName: '정지',
        },
    ],
    total: 3,
};
</script>
