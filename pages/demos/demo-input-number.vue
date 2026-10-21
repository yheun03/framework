<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Variant -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Variant"
                    description="Figma 수량 버튼 3가지 타입입니다. AppIconButton(−) + AppInput + AppIconButton(+) 로 구성됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>box</b> : A 타입 - 사각 라인 (기본값)</li>
                        <li><b>circle</b> : B 타입 - 원형 버튼</li>
                        <li><b>plain</b> : C 타입 - 테두리 없음</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppInputNumber v-for="variant in ['box', 'circle', 'plain']" :key="variant" v-model="quantity" :variant="variant" />
                    </div>
                    <p class="page-demo-output">v-model: {{ quantity }}</p>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Size"
                    description="버튼/입력 높이를 정합니다. Figma 기준은 xs(24) / sm(36) 2가지입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>xs</b> : 24px</li>
                        <li><b>sm</b> : 36px (기본값)</li>
                        <li><b>md</b> : 44px</li>
                        <li><b>lg</b> : 48px</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppInputNumber v-for="size in ['xs', 'sm', 'md', 'lg']" :key="size" v-model="quantity" :size="size" />
                    </div>
                </PageDemoSection>

                <!-- Min / Max / Step / Precision -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Min / Max / Step / Precision"
                    description="입력 범위와 증감 단위, 소수점 자리수를 정합니다. 범위를 넘으면 자동 보정되고 끝값에서 버튼이 비활성화됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>min / max</b> : 최소·최대값 (기본 0 / 무제한)</li>
                        <li><b>step</b> : 증감 단위 (기본 1) - 키보드 ↑ ↓ 로도 증감</li>
                        <li><b>precision</b> : 소수점 자리수 (기본 0)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppInputNumber v-model="lotQty" label="LOT 수량 (0~500, 10단위)" :min="0" :max="500" :step="10" />
                        <AppInputNumber v-model="weight" label="투입 중량 kg (0.1단위)" :step="0.1" :precision="1" />
                    </div>
                </PageDemoSection>

                <!-- Label / Hint / State -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Label / Hint / State"
                    description="공통 필드 속성입니다. state 에 따라 테두리와 hint 색상이 바뀝니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>label</b> : 상단 라벨</li>
                        <li><b>hint</b> : 하단 보조 문구</li>
                        <li><b>state</b> : error / warning / success</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppInputNumber
                            v-model="defect"
                            label="불량 수량"
                            :state="defect > 10 ? 'error' : 'success'"
                            :hint="defect > 10 ? '불량 10개 초과' : '정상 범위'"
                        />
                        <AppInputNumber :model-value="3" label="warning" state="warning" hint="확인 필요" />
                    </div>
                </PageDemoSection>

                <!-- Disabled / Readonly -->
                <PageDemoSection class="page-demo-section" title="Disabled / Readonly" description="입력 불가 상태입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>disabled</b> : 버튼·입력 모두 비활성</li>
                        <li><b>readonly</b> : 값 표시만 (버튼 비활성)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppInputNumber :model-value="10" disabled />
                        <AppInputNumber :model-value="10" variant="circle" disabled />
                        <AppInputNumber :model-value="10" readonly />
                    </div>
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
const { title, description } = useDemoI18n('inputNumber');
const quantity = ref(10);
const lotQty = ref(100);
const weight = ref(12.5);
const defect = ref(3);
</script>
