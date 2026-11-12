var e=`<template>
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
            <!-- 행을 누르면 상세로 (실제 화면: router.push(\`/work-orders/\${row.id}\`) → views/work-orders/[id].vue) -->
            <AppDataTable
                v-model="checked"
                title="작업지시"
                caption="작업지시 목록"
                :columns="columns"
                :items="items"
                :total="total"
                selectable
                clickable
                show-total
                @row-click="openDetail"
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length" @click="remove">선택 삭제</AppButton>
                </template>
                <template #cell-status="{ value }">
                    <AppTag variant="soft" dot :tone="statusTone[value]" :label="value" />
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

// temp 데이터 - API 연동 시 이 영역만 교체
//   const api = useApi();
//   fetch: (params) => api.get('/work-orders', { params })   → 서버가 { items, total } 를 주면 페이지 이동 시 자동 재조회
const lines = [
    { value: 'L1', label: '1라인' },
    { value: 'L2', label: '2라인' },
];
const statuses = [
    { value: '진행', label: '진행' },
    { value: '완료', label: '완료' },
    { value: '정지', label: '정지' },
];
let tempRows = [
    { id: 1, orderNo: 'WO-2611-001', line: 'L1', lineName: '1라인', item: '브래킷 A형', qty: 1200, status: '진행' },
    { id: 2, orderNo: 'WO-2611-002', line: 'L1', lineName: '1라인', item: '하우징 커버', qty: 800, status: '완료' },
    { id: 3, orderNo: 'WO-2611-003', line: 'L2', lineName: '2라인', item: '샤프트', qty: 3000, status: '정지' },
];
const fetchWorkOrders = async ({ line, status }) => tempRows.filter((row) => (!line || row.line === line) && (!status || row.status === status));
// temp 데이터 끝

const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'lineName', label: '라인', width: 100 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right' },
    { key: 'status', label: '상태', width: 100 },
];
const statusTone = { 진행: 'info', 완료: 'success', 정지: 'danger' };

const { filter, items, total, page, pageSize, loading, search, reset, reload } = useSearchList({
    filter: () => ({ period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null }),
    fetch: fetchWorkOrders,
});
const checked = ref([]);

function openDetail(row) {
    toast.info(\`\${row.orderNo} 상세로 이동합니다.\`);
}

async function remove() {
    if (!(await modal.confirm(\`선택한 \${checked.value.length}건을 삭제할까요?\`))) return;
    tempRows = tempRows.filter((row) => !checked.value.includes(row.id)); // 실제: await api.delete('/work-orders', { data: checked.value })
    toast.success(\`\${checked.value.length}건을 삭제했습니다.\`);
    checked.value = [];
    reload();
}
<\/script>
`;export{e as default};