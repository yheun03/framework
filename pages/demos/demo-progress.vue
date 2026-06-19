<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <PageDemoAccordionSection class="page-demo-accordion" title="Progress Bar"
                    desc="표시 전용 진행률은 AppProgressBar를 사용합니다.">
                    <div class="page-demo-stack">
                        <AppProgressBar :value="linearDisplayValue" label="단일 값" show-value />

                        <AppProgressBar :range="linearRangeDisplay" label="범위 값" show-value />

                        <div class="page-demo-hint">
                            {{ linearRangeDisplay.start }}% ~ {{ linearRangeDisplay.end }}%
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <PageDemoAccordionSection class="page-demo-accordion" title="Progress Slider"
                    desc="드래그 조작이 필요한 진행률은 AppProgressSlider로 분리했습니다.">
                    <div class="page-demo-stack">
                        <AppProgressSlider v-model:value="linearControlValue" label="단일 값" show-value />

                        <AppProgressSlider :range="linearControlRange" mode="range"
                            @update:range="handleLinearRangeUpdate" />

                        <div class="page-demo-hint">
                            {{ linearControlRange.start }}% ~ {{ linearControlRange.end }}%
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- GAUGE DISPLAY -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Gauge Display"
                    desc="반원 게이지와 반도넛 범위의 기본 표시 예시입니다.">
                    <div class="page-demo-grid">
                        <AppProgressGauge :value="gaugeDisplayValue" type="gauge" label="속도" />

                        <AppProgressGauge :range="gaugeRangeDisplay" type="semi-doughnut-range" label="권장 범위" />
                    </div>
                </PageDemoAccordionSection>

                <!-- GAUGE DRAG -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Gauge Drag Control"
                    desc="드래그로 게이지 값과 반도넛 범위를 조정할 수 있습니다.">
                    <div class="page-demo-grid">
                        <AppProgressGauge v-model:value="gaugeControlValue" type="gauge" mode="control-single"
                            label="속도" />

                        <AppProgressGauge :range="gaugeControlRange" type="semi-doughnut-range" mode="control-range"
                            label="권장 범위" @update:range="handleGaugeRangeUpdate" />
                    </div>
                </PageDemoAccordionSection>

                <!-- DISABLED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled" desc="비활성 상태를 확인합니다.">
                    <div class="page-demo-grid">
                        <AppProgressSlider :value="disabledLinearValue" label="Disabled Linear" show-value disabled />

                        <AppProgressGauge :value="disabledGaugeValue" type="gauge" mode="control-single"
                            label="Disabled Gauge" disabled />
                    </div>
                </PageDemoAccordionSection>
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
/**
 * 프로그레스 데모 화면의 진행률 값과 범위 상태를 관리하는 페이지 컴포넌트입니다.
 */
/* stores/composables */
const { title, description } = useDemoI18n("progress");

/* constants */
const linearDisplayValue = 35;
const gaugeDisplayValue = 68;
const disabledLinearValue = 40;
const disabledGaugeValue = 55;

/* ref/reactive state */
const linearRangeDisplay = reactive({
    start: 20,
    end: 70,
});

const linearControlValue = ref(42);

const linearControlRange = reactive({
    start: 25,
    end: 75,
});

const gaugeRangeDisplay = reactive({
    start: 20,
    end: 70,
});

const gaugeControlValue = ref(68);

const gaugeControlRange = reactive({
    start: 20,
    end: 70,
});

/* event handlers */
function handleLinearRangeUpdate(value: { start: number; end: number }) {
    linearControlRange.start = value.start;
    linearControlRange.end = value.end;
}

function handleGaugeRangeUpdate(value: { start: number; end: number }) {
    gaugeControlRange.start = value.start;
    gaugeControlRange.end = value.end;
}

/* computed */</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
