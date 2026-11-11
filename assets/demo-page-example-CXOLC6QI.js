var e=`<template>
    <div class="business-page">
        <header class="business-page__header">
            <div>
                <h1 class="business-page__title">작업지시 목록</h1>
                <p class="business-page__desc">조회 조건 → 목록 → 페이지 이동으로 구성한 기본 목록 화면입니다.</p>
            </div>
            <div class="business-page__actions">
                <AppButton variant="fill" tone="primary" size="sm" @click="toast.info('등록 화면으로 이동합니다.')">작업지시 등록</AppButton>
            </div>
        </header>

        <!-- 조회 조건: 입력은 size="xs"(36px) · 버튼은 size="sm"(36px) 로 높이를 맞춥니다. -->
        <AppSearchPanel :columns="4" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="작업일자" :span="2">
                <AppDatePicker v-model="filter.period" type="range-input" size="xs" />
            </AppSearchItem>
            <AppSearchItem label="라인">
                <AppSelect v-model="filter.line" :items="lines" size="xs" placeholder="전체" />
            </AppSearchItem>
            <AppSearchItem label="상태">
                <AppSelect v-model="filter.status" :items="statuses" size="xs" placeholder="전체" />
            </AppSearchItem>
        </AppSearchPanel>

        <AppSection>
            <AppDataTable
                v-model="checked"
                title="작업지시"
                caption="작업지시 목록"
                :columns="columns"
                :items="pagedRows"
                :total="rows.length"
                selectable
                show-total
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length" @click="remove">선택 삭제</AppButton>
                </template>
                <template #cell-status="{ value }">
                    <AppTag variant="soft" dot :tone="statusTone[value]" :label="value" />
                </template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="rows.length" />
        </AppSection>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
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

const toast = useToast();

// temp 데이터 - API 연동 시 이 영역만 교체 (const api = useApi(); rows.value = await api.get('/work-orders', { params: filter }))
const lines = [
    { value: 'L1', label: '1라인' },
    { value: 'L2', label: '2라인' },
];
const statuses = [
    { value: '진행', label: '진행' },
    { value: '완료', label: '완료' },
    { value: '정지', label: '정지' },
];
const allRows = [
    { id: 1, orderNo: 'WO-2611-001', line: '1라인', item: '브래킷 A형', qty: 1200, status: '진행' },
    { id: 2, orderNo: 'WO-2611-002', line: '1라인', item: '하우징 커버', qty: 800, status: '완료' },
    { id: 3, orderNo: 'WO-2611-003', line: '2라인', item: '샤프트', qty: 3000, status: '정지' },
];

const columns = [
    { key: 'orderNo', label: '작업지시', width: 140 },
    { key: 'line', label: '라인', width: 100 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right' },
    { key: 'status', label: '상태', width: 100 },
];
const statusTone = { 진행: 'info', 완료: 'success', 정지: 'danger' };

const filter = reactive({ period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null });
const rows = ref([...allRows]);
const checked = ref([]);
const page = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const pagedRows = computed(() => rows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value));

function search() {
    const lineLabel = lines.find((line) => line.value === filter.line)?.label;
    rows.value = allRows.filter((row) => (!lineLabel || row.line === lineLabel) && (!filter.status || row.status === filter.status));
    page.value = 1;
    checked.value = [];
}

function reset() {
    Object.assign(filter, { period: { start: '2026-11-01', end: '2026-11-30' }, line: null, status: null });
    search();
}

function remove() {
    rows.value = rows.value.filter((row) => !checked.value.includes(row.id));
    toast.success(\`\${checked.value.length}건을 삭제했습니다.\`);
    checked.value = [];
}
<\/script>
`;export{e as default};