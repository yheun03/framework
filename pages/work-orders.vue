<template>
    <div class="business-page business-page--list">
        <header class="business-page__header"><div><p class="business-page__eyebrow">MES · 작업관리</p><h1 class="business-page__title">작업지시 목록</h1><p class="business-page__desc">현장 작업지시 진행 상태와 실적을 조회합니다.</p></div><div class="business-page__actions"><AppButton size="md" variant="fill">작업지시 발행</AppButton></div></header>
        <section class="business-toolbar"><AppInput v-model="keyword" class="business-toolbar__field business-toolbar__field--wide" size="sm" placeholder="작업지시 또는 품목 검색" /><AppSelect v-model="status" class="business-toolbar__field" size="sm" :options="statuses" placeholder="전체 상태" /><AppDatePicker v-model="workDate" class="business-toolbar__field" size="sm" /><div class="business-toolbar__actions"><AppButton size="sm" variant="fill">조회</AppButton></div></section>
        <AppSection title="작업지시 42건"><div class="business-table-wrap"><table class="business-table"><thead><tr><th>작업지시</th><th>라인</th><th>품목</th><th>지시수량</th><th>양품수량</th><th>진척률</th><th>상태</th></tr></thead><tbody><tr v-for="row in rows" :key="row.no"><td><NuxtLink :to="`/work-order-detail?id=${row.no}`" class="business-link">{{ row.no }}</NuxtLink></td><td>{{ row.line }}</td><td>{{ row.item }}</td><td>{{ row.plan }}</td><td>{{ row.good }}</td><td class="business-table__progress"><AppProgressBar :value="row.progress" show-value /></td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span></td></tr></tbody></table></div><AppPagination v-model:page="page" v-model:page-size="pageSize" :total="42" /></AppSection>
    </div>
</template>
<script setup lang="ts">
const keyword = ref(""); const status = ref(null); const workDate = ref("2026-08-14"); const page = ref(1); const pageSize = ref(10);
const statuses = [{ label: "대기", value: "waiting" }, { label: "작업중", value: "working" }, { label: "완료", value: "done" }];
const rows = [{ no: "WO-260814-01", line: "가공 1라인", item: "모터 하우징 A", plan: "1,200", good: "780", progress: 68, status: "작업중", state: "info" }, { no: "WO-260814-02", line: "가공 2라인", item: "샤프트 B", plan: "800", good: "800", progress: 100, status: "완료", state: "success" }, { no: "WO-260814-05", line: "조립 라인", item: "모터 ASSY", plan: "600", good: "0", progress: 0, status: "대기", state: "gray" }];
</script>
