<template>
    <div class="business-page business-page--dashboard">
        <header class="business-page__header">
            <div>
                <p class="business-page__eyebrow">MES · 설비관리</p>
                <h1 class="business-page__title">설비 모니터링</h1>
                <p class="business-page__desc">설비 가동 상태와 주요 알람을 실시간으로 확인합니다.</p>
            </div>
            <div class="business-live"><span class="business-live__dot"></span>LIVE · 14:32:08</div>
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
                :progress="machine.operation"
                :items="machine.items"
            />
        </section>
        <AppSection title="최근 설비 알람">
            <AppDataTable caption="최근 설비 알람" :columns="alarmColumns" :items="alarms" row-key="id" size="md">
                <template #cell-level="{ row }"><AppTag variant="soft" dot :tone="row.tone" :label="row.level" /></template>
            </AppDataTable>
        </AppSection>
    </div>
</template>
<script setup>
import AppDataTable from '@/components/Table/AppDataTable.vue';
import AppEquipmentCard from '@/components/AppEquipmentCard.vue';
import AppSection from '@/components/Section/AppSection.vue';
import AppTag from '@/components/AppTag.vue';

// temp 데이터 - 실제: 주기 조회(setInterval + api.get) 또는 웹소켓으로 갱신. 화면을 떠나면(onDeactivated · onUnmounted) 꼭 멈춥니다.
const summary = [
    { label: '전체 설비', value: '24대', desc: '정상 20대' },
    { label: '평균 가동률', value: '84.6%', desc: '목표 82%' },
    { label: '비가동', value: '2대', desc: '계획정지 1대' },
    { label: '금일 알람', value: '7건', desc: '미조치 1건' },
];
const machines = [
    {
        code: 'CNC-01',
        name: 'CNC 머시닝센터 1호',
        status: 'run',
        operation: 92,
        items: [
            { label: '현재 생산', value: '842 / 1,000' },
            { label: '작업자', value: '김현장' },
        ],
    },
    {
        code: 'CNC-02',
        name: 'CNC 머시닝센터 2호',
        status: 'run',
        operation: 86,
        items: [
            { label: '현재 생산', value: '714 / 800' },
            { label: '작업자', value: '이기술' },
        ],
    },
    {
        code: 'CNC-04',
        name: 'CNC 머시닝센터 4호',
        status: 'stop',
        operation: 48,
        items: [
            { label: '현재 생산', value: '386 / 1,200' },
            { label: '작업자', value: '박설비' },
        ],
    },
    {
        code: 'WASH-02',
        name: '자동 세척기 2호',
        status: 'idle',
        operation: 61,
        items: [
            { label: '현재 생산', value: '520 / 900' },
            { label: '작업자', value: '-' },
        ],
    },
];
const alarms = [
    { id: 1, time: '14:28:12', machine: 'CNC-04', message: '주축 모터 과부하', level: '긴급', tone: 'danger', action: '조치중' },
    { id: 2, time: '13:42:51', machine: 'WASH-02', message: '세척액 수위 부족', level: '주의', tone: 'warning', action: '조치완료' },
    { id: 3, time: '11:08:20', machine: 'CNC-01', message: '공구 수명 임박', level: '안내', tone: 'info', action: '확인' },
];
// temp 데이터 끝

const alarmColumns = [
    { key: 'time', label: '발생시각', width: 110 },
    { key: 'machine', label: '설비', width: 110 },
    { key: 'message', label: '알람 내용', align: 'left' },
    { key: 'level', label: '등급', width: 100 },
    { key: 'action', label: '조치상태', width: 110 },
];
</script>
