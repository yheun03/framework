var e=`<template>
    <div class="business-page business-page--dashboard">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">ERP</p>
                <h1 class="business-page__title">경영 현황 대시보드</h1>
                <p class="business-page__desc">매출, 발주, 재고 현황을 한눈에 확인합니다.</p>
            </div>
            <div class="business-page__tools"><AppDatePicker v-model="baseDate" size="lg" /></div>
        </header>

        <section class="business-summary">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span>
                <strong class="business-summary__value">{{ item.value }}</strong>
                <span class="business-summary__change" :class="\`business-summary__change--\${item.state}\`">{{ item.change }}</span>
            </article>
        </section>

        <AppSectionWrapper class="business-page__section-wrapper" direction="horizontal" :ratio="[1, 1]" :gap="20">
            <AppSection title="월 매출 달성률" :description="\`목표 \${toEok(monthly.target)}\`">
                <AppProgressBar :value="monthly.achievementRate" label="현재 매출" show-value />
                <div class="business-kpi">
                    <strong>{{ toEok(monthly.actual) }}</strong
                    ><span>전월 대비 {{ signed(monthly.prevMonthChangeRate) }}%</span>
                </div>
            </AppSection>
            <AppSection title="재고 회전 현황" description="카테고리별 적정 재고 비율">
                <div v-for="item in inventory" :key="item.category" class="business-progress-row">
                    <span>{{ item.categoryName }}</span
                    ><AppProgressBar :value="item.rate" show-value />
                </div>
            </AppSection>
        </AppSectionWrapper>

        <AppSection title="최근 수주 현황">
            <AppDataTable
                caption="최근 수주 - 행을 누르면 수주 상세"
                :columns="orderColumns"
                :items="orders"
                row-key="orderNo"
                size="md"
                clickable
                @row-click="(row) => router.push(\`/sales-orders/\${row.orderNo}\`)"
            >
                <template #cell-status="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('SO_STATUS', row.status)" :label="row.statusName"
                /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>

<script setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { codeTone } from '@/constants/codeTone';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import AppProgressBar from '@/components/AppProgress/AppProgressBar.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppSectionWrapper from '@/components/Section/AppSectionWrapper.vue';
import AppTag from '@/components/AppTag.vue';

const router = useRouter();

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// const api = useApi();
// const fetchDashboard = (baseDate) => api.get('/dashboard/erp', { params: { baseDate } });
const fetchDashboard = async () => DEMO_ERP_DASHBOARD;
// temp 데이터 끝

// ── 화면 값 ───────────────────────────────────────────────
const won = (value) => \`₩\${value.toLocaleString()}\`;
const toEok = (value) => \`\${Math.round(value / 10000000) / 10}억\`; // 940,000,000 → '9.4억'
const signed = (rate) => \`\${rate > 0 ? '+' : ''}\${rate}\`;

const baseDate = ref('2026-08-14');
const data = shallowRef(null);

const summary = computed(() => {
    const s = data.value?.summary;
    if (!s) return [];
    return [
        {
            label: '금일 매출',
            value: won(s.todaySales),
            change: \`\${signed(s.todaySalesChangeRate)}%\`,
            state: s.todaySalesChangeRate >= 0 ? 'success' : 'danger',
        },
        { label: '수주 잔액', value: won(s.orderBacklogAmount), change: \`\${s.orderBacklogCount}건\`, state: 'info' },
        {
            label: '발주 예정',
            value: won(s.plannedPurchaseAmount),
            change: \`\${s.delayedPurchaseCount}건 지연\`,
            state: s.delayedPurchaseCount ? 'warning' : 'success',
        },
        { label: '재고 자산', value: won(s.inventoryAmount), change: \`\${signed(s.inventoryChangeRate)}%\`, state: 'success' },
    ];
});
const monthly = computed(() => data.value?.monthlySales ?? { target: 0, actual: 0, achievementRate: 0, prevMonthChangeRate: 0 });
const inventory = computed(() => data.value?.inventoryTurnover ?? []);
const orders = computed(() => data.value?.recentOrders ?? []);
const orderColumns = [
    { key: 'orderNo', label: '수주번호', width: 140 },
    { key: 'customerName', label: '거래처', align: 'left' },
    { key: 'dueDate', label: '납기일', width: 120 },
    { key: 'amount', label: '금액', width: 150, align: 'right', format: won },
    { key: 'status', label: '상태', width: 110 },
];

// 기준일을 바꾸면 다시 조회
watch(baseDate, async (date) => (data.value = await fetchDashboard(date)), { immediate: true });
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/dashboard/erp?baseDate=2026-08-14 → 요약 · 월 매출 · 재고 회전 · 최근 수주 (금액은 원 단위 숫자) */
const DEMO_ERP_DASHBOARD = {
    summary: {
        todaySales: 128400000,
        todaySalesChangeRate: 12.4,
        orderBacklogAmount: 842000000,
        orderBacklogCount: 24,
        plannedPurchaseAmount: 96500000,
        delayedPurchaseCount: 7,
        inventoryAmount: 1240000000,
        inventoryChangeRate: -2.1,
    },
    monthlySales: { target: 1200000000, actual: 940000000, achievementRate: 78, prevMonthChangeRate: 8.2 },
    inventoryTurnover: [
        { category: 'raw', categoryName: '원자재', rate: 72 },
        { category: 'wip', categoryName: '반제품', rate: 58 },
        { category: 'finished', categoryName: '완제품', rate: 84 },
    ],
    recentOrders: [
        { orderNo: 'SO-260814-01', customerName: '한빛전자', dueDate: '2026-08-20', amount: 48000000, status: 'working', statusName: '생산중' },
        { orderNo: 'SO-260814-02', customerName: '대성모터스', dueDate: '2026-08-22', amount: 32500000, status: 'confirmed', statusName: '확정' },
        { orderNo: 'SO-260813-08', customerName: '유진테크', dueDate: '2026-08-18', amount: 19800000, status: 'warning', statusName: '납기주의' },
    ],
};
<\/script>
`;export{e as default};