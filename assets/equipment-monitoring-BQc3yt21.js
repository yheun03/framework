var e=`<template>
    <div class="business-page business-page--dashboard">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 설비관리</p>
                <h1 class="business-page__title">설비 모니터링</h1>
                <p class="business-page__desc">설비 가동 상태와 주요 알람을 실시간으로 확인합니다.</p>
            </div>
            <div class="business-live"><span class="business-live__dot"></span>LIVE · {{ updatedTime }}</div>
        </header>
        <section class="business-summary">
            <article v-for="item in summary" :key="item.label" class="business-summary__item">
                <span class="business-summary__label">{{ item.label }}</span
                ><strong class="business-summary__value">{{ item.value }}</strong
                ><span class="business-summary__change">{{ item.desc }}</span>
            </article>
        </section>
        <section class="equipment-grid" aria-label="설비 상태">
            <AppEquipmentCard
                v-for="machine in machines"
                :key="machine.code"
                :title="machine.name"
                :code="machine.code"
                :status="machine.status"
                :progress="machine.operationRate"
                :items="machine.items"
            />
        </section>
        <AppSection title="최근 설비 알람">
            <AppDataTable caption="최근 설비 알람" :columns="alarmColumns" :items="alarms" row-key="id" size="md">
                <template #cell-level="{ row }"
                    ><AppTag variant="soft" dot :tone="codeTone('ALARM_LEVEL', row.level)" :label="row.levelName"
                /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>
<script setup>
import { computed, shallowRef } from 'vue';
import { codeTone } from '@/constants/codeTone';
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppEquipmentCard from '@/components/AppEquipmentCard.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppTag from '@/components/AppTag.vue';

// ── temp 데이터 (API 연동 시 이 영역만 교체) ──────────────
// 응답 모양은 파일 맨 아래 '데모 데이터' 블록 = 서버 JSON 응답 예시입니다.
// 실제: 주기 조회(setInterval + api.get) 또는 웹소켓으로 갱신. 화면을 떠나면(onDeactivated · onUnmounted) 꼭 멈춥니다.
// const api = useApi();
// const fetchMonitoring = () => api.get('/equipments/monitoring');
const fetchMonitoring = async () => DEMO_MONITORING;
// temp 데이터 끝

// ── 화면 값 ───────────────────────────────────────────────
const data = shallowRef(null);

const updatedTime = computed(() => data.value?.updatedAt.slice(11, 19) ?? '--:--:--'); // 'YYYY-MM-DD HH:mm:ss' → 'HH:mm:ss'
const summary = computed(() => {
    const s = data.value?.summary;
    if (!s) return [];
    return [
        { label: '전체 설비', value: \`\${s.totalCount}대\`, desc: \`정상 \${s.normalCount}대\` },
        { label: '평균 가동률', value: \`\${s.avgOperationRate}%\`, desc: \`목표 \${s.targetOperationRate}%\` },
        { label: '비가동', value: \`\${s.downCount}대\`, desc: \`계획정지 \${s.plannedStopCount}대\` },
        { label: '금일 알람', value: \`\${s.todayAlarmCount}건\`, desc: \`미조치 \${s.openAlarmCount}건\` },
    ];
});
const machines = computed(() =>
    (data.value?.machines ?? []).map((machine) => ({
        ...machine,
        items: [
            { label: '현재 생산', value: \`\${machine.producedQty.toLocaleString()} / \${machine.planQty.toLocaleString()}\` },
            { label: '작업자', value: machine.workerName ?? '-' },
        ],
    })),
);
const alarms = computed(() => data.value?.alarms ?? []);
const alarmColumns = [
    { key: 'occurredAt', label: '발생시각', width: 110, format: (value) => value.slice(11, 19) },
    { key: 'machineCode', label: '설비', width: 110 },
    { key: 'message', label: '알람 내용', align: 'left' },
    { key: 'level', label: '등급', width: 100 },
    { key: 'actionStatusName', label: '조치상태', width: 110 },
];

fetchMonitoring().then((result) => (data.value = result));
<\/script>

<script>
// ── 데모 데이터 = 서버 JSON 응답 예시 ─────────────────────
// - 백엔드: 아래 모양 그대로 JSON 으로 응답합니다. (키 이름 · 코드 값 · 숫자는 숫자로) → API_GUIDE.md
// - 프론트: API 를 연결하면 위 temp 영역을 api 호출로 바꾸고 이 블록을 지웁니다.

/** GET /api/equipments/monitoring → 요약(summary) + 설비 상태(machines) + 최근 알람(alarms) */
const DEMO_MONITORING = {
    updatedAt: '2026-08-14 14:32:08',
    summary: {
        totalCount: 24,
        normalCount: 20,
        avgOperationRate: 84.6,
        targetOperationRate: 82,
        downCount: 2,
        plannedStopCount: 1,
        todayAlarmCount: 7,
        openAlarmCount: 1,
    },
    machines: [
        { code: 'CNC-01', name: 'CNC 머시닝센터 1호', status: 'run', operationRate: 92, producedQty: 842, planQty: 1000, workerName: '김현장' },
        { code: 'CNC-02', name: 'CNC 머시닝센터 2호', status: 'run', operationRate: 86, producedQty: 714, planQty: 800, workerName: '이기술' },
        { code: 'CNC-04', name: 'CNC 머시닝센터 4호', status: 'stop', operationRate: 48, producedQty: 386, planQty: 1200, workerName: '박설비' },
        { code: 'WASH-02', name: '자동 세척기 2호', status: 'idle', operationRate: 61, producedQty: 520, planQty: 900, workerName: null },
    ],
    alarms: [
        {
            id: 1,
            occurredAt: '2026-08-14 14:28:12',
            machineCode: 'CNC-04',
            message: '주축 모터 과부하',
            level: 'critical',
            levelName: '긴급',
            actionStatus: 'in-progress',
            actionStatusName: '조치중',
        },
        {
            id: 2,
            occurredAt: '2026-08-14 13:42:51',
            machineCode: 'WASH-02',
            message: '세척액 수위 부족',
            level: 'warning',
            levelName: '주의',
            actionStatus: 'done',
            actionStatusName: '조치완료',
        },
        {
            id: 3,
            occurredAt: '2026-08-14 11:08:20',
            machineCode: 'CNC-01',
            message: '공구 수명 임박',
            level: 'notice',
            levelName: '안내',
            actionStatus: 'checked',
            actionStatusName: '확인',
        },
    ],
};
<\/script>
`;export{e as default};