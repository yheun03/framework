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
            :error="Boolean(error)"
            :total="total"
            row-key="code"
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
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const fetchItems = (params) => api.get('/items', { params });
const fetchItems = async ({ keyword, page, size }) => {
    const rows = DEMO_ITEMS.items.filter((item) => !keyword || `${item.code} ${item.name}`.includes(keyword));
    return { items: rows.slice((page - 1) * size, page * size), total: rows.length }; // 서버라면 서버가 잘라서 줌
};
// temp 데이터 끝

const columns = [
    { key: 'code', label: '품목코드', width: 120 },
    { key: 'name', label: '품목명', align: 'left' },
    { key: 'spec', label: '규격', align: 'left' },
    { key: 'unit', label: '단위', width: 70 },
];

const { filter, items, total, page, pageSize, loading, error, search, reset } = useSearchList({
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

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/items?keyword=하우징&page=1&size=10 → { items, total } (품목 찾기 팝업) */
const DEMO_ITEMS = {
    items: [
        { code: 'FG-10001', name: '모터 하우징 A형', spec: 'AL6061 / 100mm', unit: 'EA' },
        { code: 'FG-10002', name: '샤프트 B형', spec: 'S45C / Ø20 × 102mm', unit: 'EA' },
        { code: 'FG-10003', name: '브래킷 C형', spec: 'SPCC / t2.0', unit: 'EA' },
        { code: 'FG-10004', name: '하우징 커버 D형', spec: 'AL6061 / 106mm', unit: 'EA' },
        { code: 'FG-10005', name: '모터 하우징 E형', spec: 'AL6061 / 108mm', unit: 'EA' },
        { code: 'FG-10006', name: '샤프트 F형', spec: 'S45C / Ø22 × 110mm', unit: 'EA' },
        { code: 'FG-10007', name: '브래킷 A형', spec: 'SPCC / t1.6', unit: 'EA' },
        { code: 'FG-10008', name: '하우징 커버 B형', spec: 'AL6061 / 114mm', unit: 'EA' },
        { code: 'FG-10009', name: '모터 하우징 C형', spec: 'AL6061 / 116mm', unit: 'EA' },
        { code: 'FG-10010', name: '샤프트 D형', spec: 'S45C / Ø25 × 118mm', unit: 'EA' },
        { code: 'FG-10011', name: '브래킷 E형', spec: 'SPCC / t2.3', unit: 'EA' },
        { code: 'FG-10012', name: '하우징 커버 F형', spec: 'AL6061 / 122mm', unit: 'EA' },
        { code: 'RM-AL-001', name: '알루미늄 봉재', spec: 'AL6061 / Ø60', unit: 'KG' },
        { code: 'RM-ST-014', name: 'S45C 환봉', spec: 'S45C / Ø30', unit: 'KG' },
        { code: 'PK-BOX-01', name: '포장 박스 (소)', spec: '300 × 200 × 150', unit: 'EA' },
    ],
    total: 15,
};
</script>
