<template>
    <div class="business-page business-page--list">
        <header class="business-page__header"><div><p class="business-page__eyebrow">ERP · 재고관리</p><h1 class="business-page__title">재고 현황</h1><p class="business-page__desc">창고별 현재고와 안전재고를 비교합니다.</p></div><div class="business-page__actions"><AppButton size="md">엑셀 다운로드</AppButton><AppButton size="md" variant="fill">재고 조정</AppButton></div></header>
        <section class="business-toolbar"><AppInput v-model="keyword" class="business-toolbar__field business-toolbar__field--wide" size="sm" placeholder="품목코드 또는 품목명" /><AppSelect v-model="warehouse" class="business-toolbar__field" size="sm" :options="warehouses" placeholder="전체 창고" /><AppChoice v-model="onlyShortage" class="business-toolbar__choice" size="sm" label="부족 재고만" /><div class="business-toolbar__actions"><AppButton size="sm" variant="fill">조회</AppButton></div></section>
        <AppSection title="재고 품목 2,418건"><div class="business-table-wrap"><table class="business-table"><thead><tr><th>품목코드</th><th>품목명</th><th>창고</th><th>현재고</th><th>가용재고</th><th>안전재고</th><th>재고상태</th></tr></thead><tbody><tr v-for="row in rows" :key="row.code"><td>{{ row.code }}</td><td>{{ row.name }}</td><td>{{ row.warehouse }}</td><td>{{ row.stock }}</td><td>{{ row.available }}</td><td>{{ row.safety }}</td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span></td></tr></tbody></table></div><AppPagination v-model:page="page" v-model:page-size="pageSize" :total="2418" /></AppSection>
    </div>
</template>
<script setup lang="ts">
const keyword = ref(""); const warehouse = ref(null); const onlyShortage = ref(false); const page = ref(1); const pageSize = ref(10);
const warehouses = [{ label: "원자재 창고", value: "raw" }, { label: "반제품 창고", value: "wip" }, { label: "완제품 창고", value: "finished" }];
const rows = [{ code: "RM-AL-001", name: "알루미늄 봉재", warehouse: "원자재 창고", stock: "2,840 kg", available: "2,120 kg", safety: "1,500 kg", status: "정상", state: "success" }, { code: "RM-ST-014", name: "S45C 환봉", warehouse: "원자재 창고", stock: "680 kg", available: "420 kg", safety: "800 kg", status: "부족", state: "warning" }, { code: "FG-10021", name: "모터 하우징 A", warehouse: "완제품 창고", stock: "1,240 EA", available: "440 EA", safety: "300 EA", status: "정상", state: "success" }];
</script>
