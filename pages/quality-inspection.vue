<template>
    <div class="business-page business-page--list">
        <header class="business-page__header"><div><p class="business-page__eyebrow">MES · 품질관리</p><h1 class="business-page__title">품질검사 현황</h1><p class="business-page__desc">수입·공정·출하검사 결과와 부적합 현황을 관리합니다.</p></div><AppButton variant="fill">검사 등록</AppButton></header>
        <section class="business-summary business-summary--compact"><article v-for="item in summary" :key="item.label" class="business-summary__item"><span class="business-summary__label">{{ item.label }}</span><strong class="business-summary__value">{{ item.value }}</strong></article></section>
        <section class="business-toolbar"><AppSelect v-model="type" size="sm" :options="types" placeholder="검사 구분" /><AppSelect v-model="result" size="sm" :options="results" placeholder="전체 판정" /><AppDatePicker v-model="date" size="sm" /><AppButton size="sm" variant="fill">조회</AppButton></section>
        <AppSection title="검사 목록"><div class="business-table-wrap"><table class="business-table"><thead><tr><th>검사번호</th><th>구분</th><th>품목</th><th>LOT</th><th>검사수량</th><th>불량수량</th><th>검사자</th><th>판정</th></tr></thead><tbody><tr v-for="row in rows" :key="row.no"><td>{{ row.no }}</td><td>{{ row.type }}</td><td>{{ row.item }}</td><td>{{ row.lot }}</td><td>{{ row.qty }}</td><td>{{ row.defect }}</td><td>{{ row.inspector }}</td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.result }}</span></td></tr></tbody></table></div></AppSection>
    </div>
</template>
<script setup lang="ts">
const type = ref(null); const result = ref(null); const date = ref("2026-08-14");
const types = [{ label: "수입검사", value: "incoming" }, { label: "공정검사", value: "process" }, { label: "출하검사", value: "outgoing" }];
const results = [{ label: "합격", value: "pass" }, { label: "조건부", value: "conditional" }, { label: "불합격", value: "fail" }];
const summary = [{ label: "금일 검사", value: "36건" }, { label: "합격률", value: "96.8%" }, { label: "부적합", value: "2건" }, { label: "검사 대기", value: "7건" }];
const rows = [{ no: "QI-260814-31", type: "공정검사", item: "모터 하우징 A", lot: "LOT-260814-A01", qty: "120", defect: "1", inspector: "최품질", result: "합격", state: "success" }, { no: "QI-260814-29", type: "수입검사", item: "S45C 환봉", lot: "RM-260813-S14", qty: "40", defect: "3", inspector: "정검사", result: "조건부", state: "warning" }, { no: "QI-260814-24", type: "출하검사", item: "브래킷 C", lot: "LOT-260812-C03", qty: "200", defect: "8", inspector: "최품질", result: "불합격", state: "error" }];
</script>
