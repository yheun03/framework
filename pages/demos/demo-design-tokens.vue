<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Typography -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Typography"
                    description="Figma 06. Typography (PC) / 08. Typography (MO). 같은 토큰을 쓰면 767px 이하에서 MO 크기로 자동 전환됩니다. (창 크기를 줄여 확인)"
                >
                    <ul class="page-demo-hint-list">
                        <li><b>SCSS</b> : @include font(b3, rg) / font(t1, sb, en)</li>
                        <li><b>Class</b> : typo-b3 + typo-lt | typo-rg | typo-sb + typo-en</li>
                        <li><b>자간</b> : 국문 -2.5% (kr, 기본) / 영문 0 (en)</li>
                        <li><b>굵기</b> : lt 300 / rg 400 / sb 600</li>
                    </ul>

                    <p class="page-demo-output">
                        현재 적용: <b>{{ isMobile ? 'MO' : 'PC' }}</b> 스케일 (뷰포트 {{ viewport }}px)
                    </p>
                    <div class="demo-typo">
                        <div v-for="token in typoTokens" :key="token" class="demo-typo__row">
                            <code class="demo-typo__token">{{ token }}</code>
                            <span class="demo-typo__size">{{ sizes[token] }}</span>
                            <span :class="[`typo-${token}`, 'typo-sb']" class="demo-typo__sample">스타일 가이드 Style 123</span>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Font Color -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Font Color"
                    description="Figma 06. 폰트 컬러 - 접근성 4.5:1 이상. #999999 는 비활성 전용입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>SCSS</b> : var(--theme-color-02-black) / $color-02-black</li>
                        <li><b>Class</b> : text-02-black / text-03-gray / text-04-gray / text-05-gray-disabled</li>
                    </ul>

                    <div class="demo-swatches">
                        <div v-for="item in fontColors" :key="item.var" class="demo-swatch">
                            <span class="demo-swatch__chip" :style="{ background: `var(${item.var})` }" />
                            <strong>{{ item.name }}</strong>
                            <code>{{ item.var }}</code>
                            <code>{{ values[item.var] }}</code>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Brand Color / Gradient -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Brand Color / Gradient"
                    description="Figma 01~02. 메인 + 서브 컬러. 프로젝트 테마($primary / $secondary / $tertiary)에 반영되어 버튼·탭 등 컴포넌트 색상이 됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>Class</b> : bg-brand-main / text-brand-main / bg-gradient-main-sub-1</li>
                    </ul>

                    <div class="demo-swatches">
                        <div v-for="item in brandColors" :key="item.var" class="demo-swatch">
                            <span class="demo-swatch__chip" :style="{ background: `var(${item.var})` }" />
                            <strong>{{ item.name }}</strong>
                            <code>{{ item.var }}</code>
                            <code>{{ values[item.var] }}</code>
                        </div>
                    </div>
                    <div class="demo-gradients">
                        <div v-for="name in gradients" :key="name" :class="`bg-gradient-${name}`" class="demo-gradient">bg-gradient-{{ name }}</div>
                    </div>
                </PageDemoSection>

                <!-- Line / Background Color -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Line / Background Color"
                    description="Figma 07~08. 버튼·인풋·셀렉트는 중간 라인(regular), BG 위 폰트는 #505050 이하 사용."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>Class</b> : line-light / line-regular / line-black , bg-light / bg-regular</li>
                    </ul>

                    <div class="demo-swatches">
                        <div v-for="item in lineBgColors" :key="item.var" class="demo-swatch">
                            <span class="demo-swatch__chip" :style="{ background: `var(${item.var})` }" />
                            <strong>{{ item.name }}</strong>
                            <code>{{ item.var }}</code>
                            <code>{{ values[item.var] }}</code>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- State Color -->
                <PageDemoSection
                    class="page-demo-section"
                    title="State Color"
                    description="Figma 09. 상태 컬러 - 컴포넌트 state(error / success / warning) 와 tone(danger / success / warning) 에 반영됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>Class</b> : text-error / text-success / text-warning</li>
                    </ul>

                    <div class="demo-swatches">
                        <div v-for="item in stateColors" :key="item.var" class="demo-swatch">
                            <span class="demo-swatch__chip" :style="{ background: `var(${item.var})` }" />
                            <strong>{{ item.name }}</strong>
                            <code>{{ item.var }}</code>
                            <code>{{ values[item.var] }}</code>
                        </div>
                    </div>
                    <div class="page-demo-row">
                        <AppInput :model-value="'********'" state="error" hint="비밀번호가 일치하지 않습니다." :width="240" />
                        <AppInput :model-value="'********'" state="success" hint="사용 가능한 비밀번호입니다." :width="240" />
                        <AppInput :model-value="'********'" state="warning" hint="보안 수준이 낮습니다." :width="240" />
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
const { title, description } = useDemoI18n('designTokens');

const typoTokens = [
    'd1',
    'd2',
    'd3',
    'd4',
    'd5',
    'd6',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    't1',
    't2',
    't3',
    't4',
    't5',
    'b1',
    'b2',
    'b3',
    'b4',
    'c1',
    'c2',
    'c3',
    'btn1',
    'btn2',
    'btn3',
    'btn4',
];

const fontColors = [
    { name: 'Main Text', var: '--theme-color-02-black' },
    { name: 'Sub Text 1', var: '--theme-color-03-gray' },
    { name: 'Sub Text 2', var: '--theme-color-04-gray' },
    { name: 'Disabled', var: '--theme-color-05-gray-disabled' },
    { name: 'White', var: '--theme-color-01-white' },
];
const brandColors = [
    { name: 'Brand Main', var: '--theme-brand-main' },
    { name: 'Brand Sub 1', var: '--theme-brand-sub-1' },
    { name: 'Brand Sub 2', var: '--theme-brand-sub-2' },
    { name: 'Theme Primary', var: '--theme-primary' },
];
const gradients = ['main', 'main-sub-1', 'main-sub-2', 'sub-1-sub-2'];
const lineBgColors = [
    { name: 'Line Light', var: '--theme-line-light' },
    { name: 'Line Regular', var: '--theme-line-regular' },
    { name: 'Line Black', var: '--theme-line-black' },
    { name: 'BG Light', var: '--theme-bg-light' },
    { name: 'BG Regular', var: '--theme-bg-regular' },
];
const stateColors = [
    { name: 'Error (금지·실패·위험)', var: '--theme-status-error' },
    { name: 'Success (성공·진행·안전)', var: '--theme-status-success' },
    { name: 'Warning (주의·경고)', var: '--theme-status-warning' },
];

// SCSS 토큰이 실제로 적용된 값을 화면에서 읽어 표시합니다.
const values = ref<Record<string, string>>({});
const sizes = ref<Record<string, string>>({});
const viewport = ref(0);
const isMobile = computed(() => viewport.value > 0 && viewport.value <= 767);

function readTokens() {
    const style = getComputedStyle(document.documentElement);
    const allVars = [...fontColors, ...brandColors, ...lineBgColors, ...stateColors].map((item) => item.var);
    values.value = Object.fromEntries(allVars.map((name) => [name, style.getPropertyValue(name).trim()]));
    sizes.value = Object.fromEntries(
        typoTokens.map((token) => [
            token,
            `${style.getPropertyValue(`--ds-font-${token}-size`).trim()} / ${style.getPropertyValue(`--ds-font-${token}-lh`).trim()}`,
        ]),
    );
    viewport.value = window.innerWidth;
}

onMounted(() => {
    readTokens();
    window.addEventListener('resize', readTokens);
});
onBeforeUnmount(() => window.removeEventListener('resize', readTokens));
</script>

<style scoped lang="scss">
.demo-typo {
    display: grid;

    &__row {
        display: grid;
        grid-template-columns: 64px 110px minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--theme-line-light);
    }

    &__size {
        color: var(--theme-color-04-gray);
        font-size: 12px;
    }

    &__sample {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--theme-color-02-black);
    }
}

.demo-swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
}

.demo-swatch {
    display: grid;
    gap: 4px;
    font-size: 12px;

    &__chip {
        height: 56px;
        border: 1px solid var(--theme-line-regular);
        border-radius: 8px;
    }

    code {
        color: var(--theme-color-04-gray);
    }
}

.demo-gradients {
    display: grid;
    gap: 8px;
    margin-top: 12px;
}

.demo-gradient {
    padding: 14px 16px;
    border-radius: 8px;
    color: var(--theme-color-01-white);
    font-size: 12px;
}
</style>
