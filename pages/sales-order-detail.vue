<template>
    <div class="business-page business-page--detail">
        <header class="business-page__header"><div><p class="business-page__eyebrow">ERP · 영업관리</p><h1 class="business-page__title">수주 상세</h1><p class="business-page__desc">SO-260814-01 · 한빛전자</p></div><div class="business-page__actions"><AppButton size="md">목록</AppButton><AppButton size="md" variant="fill">저장</AppButton></div></header>
        <AppSection title="기본 정보">
            <div class="business-form-grid"><AppInput v-model="form.orderNo" label="수주번호" readonly /><AppSelect v-model="form.customer" label="거래처" :options="customers" /><AppDatePicker v-model="form.orderDate" label="수주일" /><AppDatePicker v-model="form.dueDate" label="납기일" /><AppInput v-model="form.manager" label="담당자" /><AppSelect v-model="form.status" label="상태" :options="statuses" /></div>
        </AppSection>
        <AppSection title="수주 품목">
            <div class="business-table-wrap"><table class="business-table"><thead><tr><th>품목코드</th><th>품목명</th><th>규격</th><th>수량</th><th>단가</th><th>공급가액</th></tr></thead><tbody><tr v-for="item in items" :key="item.code"><td>{{ item.code }}</td><td>{{ item.name }}</td><td>{{ item.spec }}</td><td>{{ item.qty }}</td><td>{{ item.price }}</td><td>{{ item.total }}</td></tr></tbody><tfoot><tr><th colspan="5">합계</th><td>₩48,000,000</td></tr></tfoot></table></div>
        </AppSection>
        <AppSection title="메모"><AppTextarea v-model="form.memo" :rows="5" placeholder="수주 관련 전달사항을 입력하세요." /></AppSection>
    </div>
</template>
<script setup lang="ts">
const customers = [{ label: "한빛전자", value: "hanbit" }, { label: "대성모터스", value: "daesung" }];
const statuses = [{ label: "확정", value: "confirmed" }, { label: "생산중", value: "working" }, { label: "완료", value: "done" }];
const form = reactive({ orderNo: "SO-260814-01", customer: "hanbit", orderDate: "2026-08-14", dueDate: "2026-08-20", manager: "김영업", status: "working", memo: "포장 라벨에 고객사 LOT 번호 표기" });
const items = [{ code: "FG-10021", name: "모터 하우징 A", spec: "AL6061 / 120mm", qty: "800", price: "₩40,000", total: "₩32,000,000" }, { code: "FG-10022", name: "하우징 커버", spec: "AL6061 / 118mm", qty: "800", price: "₩20,000", total: "₩16,000,000" }];
</script>
