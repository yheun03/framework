<template>
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
                :total="total"
                row-key="no"
                selectable
                clickable
                show-total
                @row-click="(row) => router.push(`/sales-orders/${row.no}`)"
            >
                <template #toolbar>
                    <AppButton size="xs" :disabled="!checked.length">선택 출하지시</AppButton>
                </template>
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
            <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
        </AppSection>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchList } from '@/composables/useSearchList';
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
// const api = useApi();
// const fetchSalesOrders = (params) => api.get('/sales-orders', { params });
const statusOptions = [
    { label: '확정', value: 'confirmed' },
    { label: '생산중', value: 'working' },
    { label: '납기주의', value: 'warning' },
];
const tempRows = [
    {
        no: 'SO-260814-01',
        customer: '한빛전자',
        item: '모터 하우징 A',
        qty: 1200,
        date: '2026-08-20',
        manager: '김영업',
        state: 'working',
        status: '생산중',
        tone: 'info',
    },
    {
        no: 'SO-260814-02',
        customer: '대성모터스',
        item: '샤프트 B',
        qty: 800,
        date: '2026-08-22',
        manager: '이수주',
        state: 'confirmed',
        status: '확정',
        tone: 'success',
    },
    {
        no: 'SO-260813-08',
        customer: '유진테크',
        item: '브래킷 C',
        qty: 2400,
        date: '2026-08-18',
        manager: '박납기',
        state: 'warning',
        status: '납기주의',
        tone: 'warning',
    },
];
const fetchSalesOrders = async ({ keyword, status, page, size }) => {
    const rows = tempRows
        .filter((row) => (!keyword || `${row.no} ${row.customer}`.includes(keyword)) && (!status || row.state === status))
        .sort((a, b) => a.date.localeCompare(b.date));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const columns = [
    { key: 'no', label: '수주번호', width: 140 },
    { key: 'customer', label: '거래처', width: 130 },
    { key: 'item', label: '품목', align: 'left' },
    { key: 'qty', label: '수량', width: 100, align: 'right' },
    { key: 'date', label: '납기일', width: 120, sortable: true },
    { key: 'manager', label: '담당자', width: 100 },
    { key: 'status', label: '상태', width: 110 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ keyword: '', status: null, orderDate: '2026-08-14' }),
    fetch: fetchSalesOrders,
});
const checked = ref([]);
</script>
