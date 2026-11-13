var e=`<template>
    <div class="business-page business-page--detail">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 작업관리</p>
                <h1 class="business-page__title">작업지시 상세</h1>
                <p class="business-page__desc">{{ id }} · {{ order?.itemName }}</p>
            </div>
            <div class="business-page__actions">
                <AppButton size="md" to="/work-orders">목록</AppButton><AppButton size="md" variant="fill">실적 등록</AppButton>
            </div>
        </header>
        <template v-if="order">
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
                    <AppProgressBar :value="order.progress" label="진척률" show-value />
                    <dl class="business-detail">
                        <div v-for="item in progress" :key="item.label" class="business-detail__item">
                            <dt>{{ item.label }}</dt>
                            <dd>{{ item.value }}</dd>
                        </div>
                    </dl>
                </AppSection>
            </AppSectionWrapper>
            <AppSection title="공정 실적">
                <AppDataTable caption="공정 실적" :columns="processColumns" :items="order.processes" row-key="seq" size="md">
                    <template #cell-status="{ row }"
                        ><AppTag variant="soft" dot :tone="codeTone('WO_STATUS', row.status)" :label="row.statusName"
                    /></template>
                </AppDataTable>
            </AppSection>
        </template>
    </div>
</template>

<script setup>
import { computed, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { codeTone } from '@/constants/codeTone';
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
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const fetchWorkOrder = (orderNo) => api.get(\`/work-orders/\${orderNo}\`);
const fetchWorkOrder = async (orderNo) => ({ ...structuredClone(DEMO_WORK_ORDER), orderNo });
// temp 데이터 끝

// ── 상세 ──────────────────────────────────────────────────
const order = shallowRef(null);

const withUnit = (value) => \`\${value.toLocaleString()} \${order.value.unit}\`;
const toHourMinute = (minutes) => \`\${Math.floor(minutes / 60)}h \${minutes % 60}m\`;
const toTime = (dateTime) => dateTime?.slice(11, 16) ?? '-'; // 'YYYY-MM-DD HH:mm:ss' → 'HH:mm'

const summary = computed(() => [
    { label: '지시수량', value: withUnit(order.value.planQty) },
    { label: '양품수량', value: withUnit(order.value.goodQty) },
    { label: '불량률', value: \`\${order.value.defectRate}%\` },
    { label: '가동시간', value: toHourMinute(order.value.runMinutes) },
]);
const details = computed(() => [
    { label: '생산라인', value: order.value.lineName },
    { label: '계획일', value: order.value.planDate },
    { label: '작업조', value: order.value.shiftName },
    { label: '우선순위', value: order.value.priorityName },
    { label: 'LOT', value: order.value.lotNo },
    { label: '납기일', value: order.value.dueDate },
]);
const progress = computed(() => [
    { label: '양품', value: withUnit(order.value.goodQty) },
    { label: '불량', value: withUnit(order.value.defectQty) },
    { label: '잔량', value: withUnit(order.value.planQty - order.value.goodQty - order.value.defectQty) },
]);
const processColumns = [
    { key: 'seq', label: '순서', width: 70 },
    { key: 'processName', label: '공정명', align: 'left' },
    { key: 'machineCode', label: '설비', width: 110 },
    { key: 'workerName', label: '작업자', width: 100, format: (value) => value ?? '-' },
    { key: 'startAt', label: '시작', width: 90, format: toTime },
    { key: 'endAt', label: '종료', width: 90, format: toTime },
    { key: 'status', label: '상태', width: 100 },
];

/** 주소의 id 로 작업지시를 불러옵니다. */
async function load() {
    order.value = await fetchWorkOrder(id.value);
}
load();
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/work-orders/{orderNo} → 작업지시 1건 + 공정 실적(processes) */
const DEMO_WORK_ORDER = {
    orderNo: 'WO-260814-01',
    itemCode: 'FG-10021',
    itemName: '모터 하우징 A',
    unit: 'EA',
    line: 'line-1',
    lineName: '가공 1라인',
    planDate: '2026-08-14',
    dueDate: '2026-08-20',
    shift: 'a',
    shiftName: '주간 A조',
    priority: 'urgent',
    priorityName: '긴급',
    lotNo: 'LOT-260814-A01',
    planQty: 1200,
    goodQty: 780,
    defectQty: 12,
    defectRate: 1.52,
    runMinutes: 258,
    progress: 68,
    status: 'working',
    statusName: '작업중',
    processes: [
        {
            seq: 10,
            processName: '소재 투입',
            machineCode: 'CUT-01',
            workerName: '김현장',
            startAt: '2026-08-14 08:02:00',
            endAt: '2026-08-14 08:34:00',
            status: 'done',
            statusName: '완료',
        },
        {
            seq: 20,
            processName: 'CNC 가공',
            machineCode: 'CNC-04',
            workerName: '이기술',
            startAt: '2026-08-14 08:40:00',
            endAt: null,
            status: 'working',
            statusName: '작업중',
        },
        { seq: 30, processName: '세척', machineCode: 'WASH-02', workerName: null, startAt: null, endAt: null, status: 'waiting', statusName: '대기' },
    ],
};
<\/script>
`;export{e as default};