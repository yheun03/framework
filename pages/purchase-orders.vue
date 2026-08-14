<template>
    <div class="business-page business-page--list">
        <header class="business-page__header"><div><p class="business-page__eyebrow">ERP · 구매관리</p><h1 class="business-page__title">발주 관리</h1><p class="business-page__desc">구매 발주와 입고 예정 현황을 관리합니다.</p></div><div class="business-page__actions"><AppButton size="md" variant="fill">발주서 작성</AppButton></div></header>
        <section class="business-summary business-summary--compact"><article v-for="item in summary" :key="item.label" class="business-summary__item"><span class="business-summary__label">{{ item.label }}</span><strong class="business-summary__value">{{ item.value }}</strong></article></section>
        <section class="business-toolbar"><AppInput v-model="keyword" class="business-toolbar__field business-toolbar__field--wide" size="sm" placeholder="발주번호, 공급사 검색" /><AppSelect v-model="status" class="business-toolbar__field" size="sm" :options="statusOptions" placeholder="전체 상태" /><div class="business-toolbar__actions"><AppButton size="md" variant="fill">조회</AppButton></div></section>
        <AppSection title="발주 목록"><div class="business-table-wrap"><table class="business-table"><thead><tr><th>발주번호</th><th>공급사</th><th>발주일</th><th>입고예정일</th><th>발주금액</th><th>입고율</th><th>상태</th></tr></thead><tbody><tr v-for="row in rows" :key="row.no"><td>{{ row.no }}</td><td>{{ row.vendor }}</td><td>{{ row.orderDate }}</td><td>{{ row.dueDate }}</td><td>{{ row.amount }}</td><td class="business-table__progress"><AppProgressBar :value="row.progress" show-value /></td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span></td></tr></tbody></table></div></AppSection>
    </div>
</template>
<script setup lang="ts">
const keyword = ref(""); const status = ref(null);
const statusOptions = [{ label: "승인대기", value: "waiting" }, { label: "발주완료", value: "ordered" }, { label: "입고완료", value: "done" }];
const summary = [{ label: "이번 달 발주", value: "₩420,800,000" }, { label: "입고 예정", value: "18건" }, { label: "지연 발주", value: "3건" }];
const rows = [{ no: "PO-260814-04", vendor: "대한소재", orderDate: "2026-08-14", dueDate: "2026-08-19", amount: "₩72,000,000", progress: 40, status: "부분입고", state: "info" }, { no: "PO-260813-11", vendor: "세진금속", orderDate: "2026-08-13", dueDate: "2026-08-17", amount: "₩38,500,000", progress: 10, status: "입고지연", state: "warning" }, { no: "PO-260812-07", vendor: "미래패킹", orderDate: "2026-08-12", dueDate: "2026-08-16", amount: "₩12,400,000", progress: 100, status: "입고완료", state: "success" }];
</script>
