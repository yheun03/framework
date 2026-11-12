<template>
    <!--
        선택 팝업 본문 (품목 찾기) - useModal().pick(이 컴포넌트) 로 엽니다.
        - 행을 누르거나 Enter → emit('select', 행) → 팝업이 닫히고 pick() 이 그 행을 돌려줍니다.
        - 실제 프로젝트에서 여러 화면이 쓰는 찾기 팝업은 components/projects/{key}/Picker{대상}.vue 에 둡니다.
    -->
    <div class="page-demo-item-picker">
        <AppSearchPanel :columns="2" :loading="loading" @search="search" @reset="reset">
            <AppSearchItem label="품목">
                <AppInput v-model="filter.keyword" size="sm" placeholder="품목코드 · 품목명" @keydown.enter="search" />
            </AppSearchItem>
        </AppSearchPanel>
        <AppDataTable
            caption="품목 목록"
            :columns="columns"
            :items="items"
            :total="total"
            size="sm"
            height="320"
            clickable
            @row-click="emit('select', $event)"
        />
        <AppPagination v-model:page="page" v-model:page-size="pageSize" :total="total" :show-page-size="false" />
    </div>
</template>

<script setup>
import { useSearchList } from '@/composables/useSearchList';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppInput from '@/components/AppInput.vue';
import AppPagination from '@/components/AppPagination.vue';
import AppSearchItem from '@/components/AppSearch/AppSearchItem.vue';
import AppSearchPanel from '@/components/AppSearch/AppSearchPanel.vue';

const props = defineProps({
    /** 팝업을 열 때 미리 넣을 검색어 */
    keyword: { type: String, default: '' },
});
const emit = defineEmits(['select']);

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// const api = useApi();
// const fetchItems = (params) => api.get('/items', { params });
const tempItems = Array.from({ length: 24 }, (_, index) => ({
    code: `FG-${String(10001 + index)}`,
    name: ['모터 하우징', '샤프트', '브래킷', '하우징 커버'][index % 4] + ` ${String.fromCharCode(65 + (index % 6))}형`,
    spec: `AL6061 / ${100 + index * 2}mm`,
    unit: 'EA',
}));
const fetchItems = async ({ keyword, page, size }) => {
    const rows = tempItems.filter((item) => !keyword || `${item.code} ${item.name}`.includes(keyword));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

const columns = [
    { key: 'code', label: '품목코드', width: 120 },
    { key: 'name', label: '품목명', align: 'left' },
    { key: 'spec', label: '규격', align: 'left' },
    { key: 'unit', label: '단위', width: 70 },
];

const { filter, items, total, page, pageSize, loading, search, reset } = useSearchList({
    filter: () => ({ keyword: props.keyword }),
    fetch: fetchItems,
});
</script>

<style scoped lang="scss">
.page-demo-item-picker {
    display: grid;
    gap: 12px;
}
</style>
