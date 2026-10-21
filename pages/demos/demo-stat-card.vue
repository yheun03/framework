<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Basic -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Basic"
                    description="대시보드 KPI 카드입니다. 숫자 value 는 천 단위 콤마가 자동 적용됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>title</b> : 지표명</li>
                        <li><b>value</b> : 값 (number | string)</li>
                        <li><b>unit</b> : 단위</li>
                        <li><b>#icon</b> : 우측 상단 아이콘 슬롯</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard v-for="kpi in kpiCards" :key="kpi.card.title" v-bind="kpi.card">
                            <template #icon><component :is="kpi.icon" /></template>
                        </AppStatCard>
                    </div>
                </PageDemoSection>

                <!-- Diff / Reverse -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Diff / Reverse"
                    description="전일 대비 등 증감입니다. 화살표는 실제 증감 방향, 색상은 좋아짐(초록)/나빠짐(빨강)을 뜻합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>diff</b> : 증감 값 (+/-)</li>
                        <li><b>diffUnit</b> : 증감 단위 (%, %p, EA)</li>
                        <li><b>reverse</b> : 감소가 좋은 지표 (불량률, 비가동 시간) - 색상 반전</li>
                        <li><b>description</b> : 증감 옆 설명</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard title="생산량 (증가 = 좋음)" :value="12840" unit="EA" :diff="640" diff-unit="EA" description="전일 대비" />
                        <AppStatCard
                            title="불량률 (감소 = 좋음)"
                            :value="0.42"
                            :precision="2"
                            unit="%"
                            :diff="-0.08"
                            diff-unit="%p"
                            reverse
                            description="전일 대비"
                        />
                        <AppStatCard
                            title="불량률 (증가 = 나쁨)"
                            :value="0.61"
                            :precision="2"
                            unit="%"
                            :diff="0.11"
                            diff-unit="%p"
                            reverse
                            description="전일 대비"
                        />
                    </div>
                </PageDemoSection>

                <!-- Progress / Precision -->
                <PageDemoSection class="page-demo-section" title="Progress / Precision" description="하단 진행 막대와 소수점 자리수입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>progress</b> : 0~100</li>
                        <li><b>precision</b> : 숫자 value 소수점 자리수 (기본값 0)</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard title="계획 달성률" :value="78.25" :precision="1" unit="%" :progress="78" tone="info" />
                        <AppStatCard title="설비 가동률" :value="92.3" :precision="1" unit="%" :progress="92" tone="success" />
                    </div>
                </PageDemoSection>

                <!-- Variant / Tone -->
                <PageDemoSection class="page-demo-section" title="Variant / Tone" description="카드 스타일과 색상입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>default</b> : 흰 카드 (기본값)</li>
                        <li><b>soft</b> : tone 연한 면</li>
                        <li><b>fill</b> : tone 진한 면</li>
                        <li><b>tone</b> : primary / secondary / gray / danger / warning / success / info</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard
                            v-for="variant in ['default', 'soft', 'fill']"
                            :key="variant"
                            :title="`variant ${variant}`"
                            :value="87.4"
                            :precision="1"
                            unit="%"
                            :variant="variant"
                            tone="primary"
                            :diff="2.1"
                            diff-unit="%p"
                        />
                    </div>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="카드 여백과 숫자 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 작게</li>
                        <li><b>md</b> : 기본값</li>
                        <li><b>lg</b> : 크게</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard v-for="size in ['sm', 'md', 'lg']" :key="size" :title="`size ${size}`" :value="1284" unit="EA" :size="size" />
                    </div>
                </PageDemoSection>

                <!-- Clickable / Active -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Clickable / Active"
                    description="필터 카드로 사용합니다. AppButton(unstyled) 으로 렌더링되며 click 이벤트가 발생합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>clickable</b> : 클릭 가능</li>
                        <li><b>active</b> : 선택 상태</li>
                    </ul>

                    <div class="demo-kpi-grid">
                        <AppStatCard
                            v-for="card in statusCards"
                            :key="card.key"
                            :title="card.title"
                            :value="card.value"
                            unit="대"
                            :tone="card.tone"
                            variant="soft"
                            size="sm"
                            clickable
                            :active="activeStatus === card.key"
                            @click="activeStatus = card.key"
                        />
                    </div>
                    <p class="page-demo-output">active: {{ activeStatus }}</p>
                </PageDemoSection>
            </main>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconAlert, IconBox, IconCheckCircle, IconFactory } from '~/components/icons';

const { title, description } = useDemoI18n('statCard');

// ---------- temp data ----------
const kpis = [
    {
        title: '금일 생산량',
        value: 12840,
        unit: 'EA',
        diff: 640,
        diffUnit: 'EA',
        description: '전일 대비',
        progress: 86,
        tone: 'primary',
        icon: IconBox,
    },
    {
        title: '설비 가동률',
        value: 92.3,
        precision: 1,
        unit: '%',
        diff: 1.8,
        diffUnit: '%p',
        description: '전일 대비',
        tone: 'success',
        icon: IconFactory,
    },
    {
        title: '불량률',
        value: 0.42,
        precision: 2,
        unit: '%',
        diff: -0.08,
        diffUnit: '%p',
        reverse: true,
        description: '전일 대비',
        tone: 'warning',
        icon: IconAlert,
    },
    { title: '계획 달성률', value: 78, unit: '%', diff: -4, diffUnit: '%p', description: '월 누적', tone: 'info', icon: IconCheckCircle },
] as const;
// icon 은 슬롯으로, 나머지는 v-bind 로 전달합니다.
const kpiCards = kpis.map(({ icon, ...card }) => ({ icon, card }));

const statusCards = [
    { key: 'all', title: '전체', value: 24, tone: 'gray' },
    { key: 'run', title: '가동', value: 18, tone: 'success' },
    { key: 'idle', title: '대기', value: 3, tone: 'warning' },
    { key: 'stop', title: '정지', value: 2, tone: 'danger' },
] as const;
const activeStatus = ref<string>('all');
</script>

<style scoped lang="scss">
.demo-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}
</style>
