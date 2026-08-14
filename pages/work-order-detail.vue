<template>
    <div class="business-page business-page--detail">
        <header class="business-page__header"><div><p class="business-page__eyebrow">MES · 작업관리</p><h1 class="business-page__title">작업지시 상세</h1><p class="business-page__desc">WO-260814-01 · 모터 하우징 A</p></div><div class="business-page__actions"><AppButton>목록</AppButton><AppButton variant="fill">실적 등록</AppButton></div></header>
        <section class="business-summary"><article v-for="item in summary" :key="item.label" class="business-summary__item"><span class="business-summary__label">{{ item.label }}</span><strong class="business-summary__value">{{ item.value }}</strong></article></section>
        <div class="business-page__grid business-page__grid--2">
            <AppSection title="작업 정보"><dl class="business-detail"><div v-for="item in details" :key="item.label" class="business-detail__item"><dt>{{ item.label }}</dt><dd>{{ item.value }}</dd></div></dl></AppSection>
            <AppSection title="생산 진척"><AppProgressBar :value="68" label="진척률" show-value /><dl class="business-detail"><div class="business-detail__item"><dt>양품</dt><dd>780 EA</dd></div><div class="business-detail__item"><dt>불량</dt><dd>12 EA</dd></div><div class="business-detail__item"><dt>잔량</dt><dd>408 EA</dd></div></dl></AppSection>
        </div>
        <AppSection title="공정 실적"><div class="business-table-wrap"><table class="business-table"><thead><tr><th>순서</th><th>공정명</th><th>설비</th><th>작업자</th><th>시작</th><th>종료</th><th>상태</th></tr></thead><tbody><tr v-for="row in processes" :key="row.step"><td>{{ row.step }}</td><td>{{ row.name }}</td><td>{{ row.machine }}</td><td>{{ row.worker }}</td><td>{{ row.start }}</td><td>{{ row.end }}</td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span></td></tr></tbody></table></div></AppSection>
    </div>
</template>
<script setup lang="ts">
const summary = [{ label: "지시수량", value: "1,200 EA" }, { label: "양품수량", value: "780 EA" }, { label: "불량률", value: "1.52%" }, { label: "가동시간", value: "4h 18m" }];
const details = [{ label: "생산라인", value: "가공 1라인" }, { label: "계획일", value: "2026-08-14" }, { label: "작업조", value: "주간 A조" }, { label: "우선순위", value: "긴급" }, { label: "LOT", value: "LOT-260814-A01" }, { label: "납기일", value: "2026-08-20" }];
const processes = [{ step: 10, name: "소재 투입", machine: "CUT-01", worker: "김현장", start: "08:02", end: "08:34", status: "완료", state: "success" }, { step: 20, name: "CNC 가공", machine: "CNC-04", worker: "이기술", start: "08:40", end: "-", status: "작업중", state: "info" }, { step: 30, name: "세척", machine: "WASH-02", worker: "-", start: "-", end: "-", status: "대기", state: "gray" }];
</script>
