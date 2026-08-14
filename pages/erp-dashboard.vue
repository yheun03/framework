<template>
    <div class="business-page business-page--dashboard">
        <header class="business-page__header">
            <div><p class="business-page__eyebrow">ERP</p><h1 class="business-page__title">경영 현황 대시보드</h1><p class="business-page__desc">매출, 발주, 재고 현황을 한눈에 확인합니다.</p></div>
            <div class="business-page__tools"><AppDatePicker v-model="baseDate" size="md" /></div>
        </header>

        <section class="business-summary">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span>
                <strong class="business-summary__value">{{ item.value }}</strong>
                <span class="business-summary__change" :class="`business-summary__change--${item.state}`">{{ item.change }}</span>
            </article>
        </section>

        <div class="business-page__grid business-page__grid--2">
            <AppSection title="월 매출 달성률" description="목표 12억 원">
                <AppProgressBar :value="78" label="현재 매출" show-value />
                <div class="business-kpi"><strong>9.4억</strong><span>전월 대비 +8.2%</span></div>
            </AppSection>
            <AppSection title="재고 회전 현황" description="카테고리별 적정 재고 비율">
                <div v-for="item in inventory" :key="item.label" class="business-progress-row">
                    <span>{{ item.label }}</span><AppProgressBar :value="item.value" show-value />
                </div>
            </AppSection>
        </div>

        <AppSection title="최근 수주 현황">
            <div class="business-table-wrap"><table class="business-table"><thead><tr><th>수주번호</th><th>거래처</th><th>납기일</th><th>금액</th><th>상태</th></tr></thead><tbody><tr v-for="row in orders" :key="row.no"><td><NuxtLink :to="`/sales-order-detail?id=${row.no}`" class="business-link">{{ row.no }}</NuxtLink></td><td>{{ row.customer }}</td><td>{{ row.date }}</td><td>{{ row.amount }}</td><td><span class="business-status" :class="`business-status--${row.state}`">{{ row.status }}</span></td></tr></tbody></table></div>
        </AppSection>
    </div>
</template>

<script setup lang="ts">
const baseDate = ref("2026-08-14");
const summary = [
    { label: "금일 매출", value: "₩128,400,000", change: "+12.4%", state: "success" },
    { label: "수주 잔액", value: "₩842,000,000", change: "24건", state: "info" },
    { label: "발주 예정", value: "₩96,500,000", change: "7건 지연", state: "warning" },
    { label: "재고 자산", value: "₩1,240,000,000", change: "-2.1%", state: "success" },
];
const inventory = [{ label: "원자재", value: 72 }, { label: "반제품", value: 58 }, { label: "완제품", value: 84 }];
const orders = [
    { no: "SO-260814-01", customer: "한빛전자", date: "2026-08-20", amount: "₩48,000,000", status: "생산중", state: "info" },
    { no: "SO-260814-02", customer: "대성모터스", date: "2026-08-22", amount: "₩32,500,000", status: "확정", state: "success" },
    { no: "SO-260813-08", customer: "유진테크", date: "2026-08-18", amount: "₩19,800,000", status: "납기주의", state: "warning" },
];
</script>
