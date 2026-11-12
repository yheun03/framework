var e=`<template>
    <div class="business-page business-page--detail">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 작업관리</p>
                <h1 class="business-page__title">작업지시 상세</h1>
                <p class="business-page__desc">{{ id }} · {{ detail.item }}</p>
            </div>
            <div class="business-page__actions">
                <AppButton size="md" to="/work-orders">목록</AppButton><AppButton size="md" variant="fill">실적 등록</AppButton>
            </div>
        </header>
        <section class="business-summary">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong>
            </article>
        </section>
        <AppSectionWrapper class="business-page__section-wrapper" direction="horizontal" :ratio="[1, 1]" :gap="20">
            <AppSection title="작업 정보">
                <dl class="business-detail">
                    <div v-for="item in details" :key="item.label" class="business-detail__item">
                        <dt>{{ item.label }}</dt>
                        <dd>{{ item.value }}</dd>
                    </div>
                </dl>
            </AppSection>
            <AppSection title="생산 진척">
                <AppProgressBar :value="68" label="진척률" show-value />
                <dl class="business-detail">
                    <div v-for="item in progress" :key="item.label" class="business-detail__item">
                        <dt>{{ item.label }}</dt>
                        <dd>{{ item.value }}</dd>
                    </div>
                </dl>
            </AppSection>
        </AppSectionWrapper>
        <AppSection title="공정 실적">
            <AppDataTable caption="공정 실적" :columns="processColumns" :items="processes" row-key="step" size="md">
                <template #cell-status="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.status" /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSectionWrapper from '@/components/Section/AppSectionWrapper.vue';
import AppTag from '@/components/AppTag.vue';

// 주소 /work-orders/:id → 파일 views/work-orders/[id].vue
const route = useRoute();
const id = computed(() => route.params.id);

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 실제: detail.value = await api.get(\`/work-orders/\${id.value}\`)
const detail = { item: '모터 하우징 A' };
const summary = [
    { label: '지시수량', value: '1,200 EA' },
    { label: '양품수량', value: '780 EA' },
    { label: '불량률', value: '1.52%' },
    { label: '가동시간', value: '4h 18m' },
];
const details = [
    { label: '생산라인', value: '가공 1라인' },
    { label: '계획일', value: '2026-08-14' },
    { label: '작업조', value: '주간 A조' },
    { label: '우선순위', value: '긴급' },
    { label: 'LOT', value: 'LOT-260814-A01' },
    { label: '납기일', value: '2026-08-20' },
];
const progress = [
    { label: '양품', value: '780 EA' },
    { label: '불량', value: '12 EA' },
    { label: '잔량', value: '408 EA' },
];
const processes = [
    { step: 10, name: '소재 투입', machine: 'CUT-01', worker: '김현장', start: '08:02', end: '08:34', status: '완료', tone: 'success' },
    { step: 20, name: 'CNC 가공', machine: 'CNC-04', worker: '이기술', start: '08:40', end: '-', status: '작업중', tone: 'info' },
    { step: 30, name: '세척', machine: 'WASH-02', worker: '-', start: '-', end: '-', status: '대기', tone: 'gray' },
];
// temp 데이터 끝

// ── 목록 ──────────────────────────────────────────────────
const processColumns = [
    { key: 'step', label: '순서', width: 70 },
    { key: 'name', label: '공정명', align: 'left' },
    { key: 'machine', label: '설비', width: 110 },
    { key: 'worker', label: '작업자', width: 100 },
    { key: 'start', label: '시작', width: 90 },
    { key: 'end', label: '종료', width: 90 },
    { key: 'status', label: '상태', width: 100 },
];
<\/script>
`;export{e as default};