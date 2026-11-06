<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Status -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Status"
                    description="설비 상태별 램프입니다. 정지(stop)는 깜빡임, 미연결(off)은 램프와 진행 막대를 비활성으로 표시합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>status</b> : run(가동) / idle(대기) / stop(정지) / check(점검) / off(미연결)</li>
                        <li><b>progress · progressLabel</b> : 대표 지표(%) · <b>items</b> : 하단 지표 (label, value)</li>
                    </ul>

                    <div class="demo-equipment-grid">
                        <AppEquipmentCard
                            v-for="equipment in equipments"
                            :key="equipment.code"
                            :title="equipment.title"
                            :code="equipment.code"
                            :status="equipment.status"
                            :progress="equipment.progress"
                            :items="equipment.items"
                            :active="selected === equipment.code"
                        >
                            <template #actions>
                                <AppButton size="sm" width="full" :active="selected === equipment.code" @click="selected = equipment.code">
                                    {{ selected === equipment.code ? '선택됨' : '상세 보기' }}
                                </AppButton>
                            </template>
                        </AppEquipmentCard>
                    </div>
                    <p class="page-demo-output">active : {{ selected }}</p>
                </PageDemoSection>
            </div>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppEquipmentCard from '@/components/AppEquipmentCard.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title, description } = useDemoI18n('equipmentCard');

// temp 데이터 - API 연동 시 이 영역만 교체
const equipments = [
    {
        title: 'CNC 가공기 #1',
        code: 'EQ-CNC-001',
        status: 'run',
        progress: 92,
        items: [
            { label: '생산', value: '1,240' },
            { label: '불량', value: 3 },
            { label: '온도', value: '42℃' },
        ],
    },
    {
        title: '사출 성형기 #2',
        code: 'EQ-INJ-002',
        status: 'idle',
        progress: 61,
        items: [
            { label: '생산', value: 820 },
            { label: '불량', value: 0 },
            { label: '온도', value: '180℃' },
        ],
    },
    {
        title: '프레스 #3',
        code: 'EQ-PRS-003',
        status: 'stop',
        progress: 18,
        items: [
            { label: '알람', value: 'E-204' },
            { label: '정지', value: '00:42' },
        ],
    },
    {
        title: '도장 라인 #4',
        code: 'EQ-PNT-004',
        status: 'check',
        progress: 0,
        items: [{ label: '점검 종료', value: '15:30' }],
    },
    {
        title: '포장기 #5',
        code: 'EQ-PKG-005',
        status: 'off',
        progress: 0,
        items: [],
    },
];

const selected = ref('EQ-CNC-001');
</script>

<style scoped lang="scss">
.demo-equipment-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
}
</style>
