var e=`<template>
    <div class="business-page business-page--list">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 작업관리</p>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">현장 작업지시 진행 상태와 실적을 조회합니다.</p>
            </div>
            <!-- 권한이 있는 사용자에게만 (auth.enabled: false 면 항상 보임) -->
            <div class="business-page__actions"><AppButton v-if="auth.can('WO.WRITE')" size="md" variant="fill">작업지시 발행</AppButton></div>
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
                :error="Boolean(error)"
                :total="total"
                row-key="orderNo"
                clickable
                show-total
                @row-click="(row) => router.push(\`/work-orders/\${row.orderNo}\`)"
            >
                <template #cell-progress="{ value }"><AppProgressBar :value="value" show-value /></template>
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName"
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
import { useAuthStore } from '@/store/auth';
import { codeTone } from '@/constants/codeTone';
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
const auth = useAuthStore();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const statuses = useCodes('WO_STATUS'); // import { useCodes } from '@/composables/useCodes'
// const fetchWorkOrders = (params) => api.get('/work-orders', { params });
const statuses = ref(DEMO_STATUS_CODES);
const fetchWorkOrders = async ({ keyword, status, page, size }) => {
    const rows = DEMO_WORK_ORDERS.items.filter(
        (row) => (!keyword || \`\${row.orderNo} \${row.itemName}\`.includes(keyword)) && (!status || row.status === status),
    );
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'lineName', label: '라인', width: 110 },
    { key: 'itemName', label: '품목', align: 'left' },
    { key: 'planQty', label: '지시수량', width: 100, align: 'right' },
    { key: 'goodQty', label: '양품수량', width: 100, align: 'right' },
    { key: 'progress', label: '진척률', width: 180 },
    { key: 'status', label: '상태', width: 100 },
];

const { filter, items, total, page, pageSize, loading, error, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null, workDate: '2026-08-14' }),
    fetch: fetchWorkOrders,
});
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/codes/WO_STATUS (공통코드: [{ value, label }]) */
const DEMO_STATUS_CODES = [
    { value: 'waiting', label: '대기' },
    { value: 'working', label: '작업중' },
    { value: 'done', label: '완료' },
];

/** GET /api/work-orders?keyword=하우징&status=working&workDate=2026-08-14&page=1&size=10 → { items, total } */
const DEMO_WORK_ORDERS = {
    items: [
        {
            orderNo: 'WO-260814-01',
            line: 'line-1',
            lineName: '가공 1라인',
            itemCode: 'FG-10021',
            itemName: '모터 하우징 A',
            planQty: 1200,
            goodQty: 780,
            progress: 68,
            status: 'working',
            statusName: '작업중',
        },
        {
            orderNo: 'WO-260814-02',
            line: 'line-2',
            lineName: '가공 2라인',
            itemCode: 'FG-10031',
            itemName: '샤프트 B',
            planQty: 800,
            goodQty: 800,
            progress: 100,
            status: 'done',
            statusName: '완료',
        },
        {
            orderNo: 'WO-260814-05',
            line: 'assembly',
            lineName: '조립 라인',
            itemCode: 'FG-20001',
            itemName: '모터 ASSY',
            planQty: 600,
            goodQty: 0,
            progress: 0,
            status: 'waiting',
            statusName: '대기',
        },
    ],
    total: 3,
};
<\/script>
`;export{e as default};