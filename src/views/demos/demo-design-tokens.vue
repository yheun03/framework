<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
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

                <!-- Font Weight -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Font Weight"
                    description="Figma 06. Pretendard Light 300 / Regular 400 / SemiBold 600 (+ 썸네일 브랜드명용 Medium 500). 국문 자간 -2.5%, 영문·숫자 0."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>SCSS</b> : @include font(t3, lt) / font(t3, md) / font(t3, sb, en)</li>
                        <li><b>Class</b> : typo-lt / typo-rg / typo-md / typo-sb / typo-en</li>
                    </ul>

                    <div class="demo-typo">
                        <div v-for="weight in weights" :key="weight.key" class="demo-typo__row">
                            <code class="demo-typo__token">{{ weight.key }}</code>
                            <span class="demo-typo__size">{{ weight.value }}</span>
                            <span :class="['typo-t3', `typo-${weight.key}`]" class="demo-typo__sample">스타일 가이드 Style 123</span>
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
                        <AppInput aria-label="비밀번호" :model-value="'********'" state="error" hint="비밀번호가 일치하지 않습니다." :width="240" />
                        <AppInput aria-label="비밀번호" :model-value="'********'" state="success" hint="사용 가능한 비밀번호입니다." :width="240" />
                        <AppInput aria-label="비밀번호" :model-value="'********'" state="warning" hint="보안 수준이 낮습니다." :width="240" />
                    </div>
                </PageDemoSection>

                <!-- System Palette -->
                <PageDemoSection
                    class="page-demo-section"
                    title="System Palette"
                    description="Figma 05. Color Guide 시스템 컬러(Variables System/{Hue}/{50~900}) 입니다. 차트 · 태그 · 일러스트 등 보조 색상으로 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>CSS</b> : var(--theme-system-{hue}-{step}) 예) var(--theme-system-blue-700)</li>
                        <li><b>SCSS</b> : map.get($system-palette, 'blue', 700)</li>
                    </ul>

                    <div class="demo-palette">
                        <div v-for="hue in paletteHues" :key="hue" class="demo-palette__row">
                            <code class="demo-palette__hue">{{ hue }}</code>
                            <template v-for="step in paletteSteps" :key="step">
                                <span v-if="paletteMissing.includes(`${hue}-${step}`)" class="demo-palette__chip">—</span>
                                <span
                                    v-else
                                    class="demo-palette__chip"
                                    :style="{ background: `var(--theme-system-${hue}-${step})` }"
                                    :title="`--theme-system-${hue}-${step}`"
                                >
                                    {{ step }}
                                </span>
                            </template>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Spacing -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Spacing"
                    description="Figma 01. Spacing (PC/MO). 세로 간격 기준이며 짝수만 사용합니다. 56 은 PC, 60 은 MO 가이드 값입니다. 가로 여백은 Grid 를 따릅니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>SCSS</b> : margin-top: space(24) → var(--ds-space-24)</li>
                        <li><b>Class</b> : mt-{n} / mb-{n} / pt-{n} / pb-{n} / gap-{n}</li>
                    </ul>

                    <div class="demo-space">
                        <div v-for="space in spaces" :key="space" class="demo-space__row">
                            <code class="demo-space__token">{{ space }}</code>
                            <span class="demo-space__bar" :style="{ height: `var(--ds-space-${space})` }" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Layout Grid -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Layout Grid"
                    description="Figma 02. Layout Guide (12 Column) / 03~04. Resolution Guide. PC 12 → Tablet(1199px 이하) 8 → MO(767px 이하) 4 Column 으로 전환되며 Gutter 는 고정, Column 이 비율대로 줄어듭니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>Class</b> : ds-container(기본 1580) + ds-container--{name} / ds-grid / ds-col-{1~12}</li>
                        <li>
                            <b>Tablet / MO</b> : PC span 자동 환산 (1·2·3 → 1·2·2 / 4 이상 → Tablet 4~8 · MO 4), 덮어쓰기 ds-col-t-{1~8} /
                            ds-col-m-{1~4}
                        </li>
                        <li><b>MO</b> : 좌우 마진 16 · 20(기본) · 24 / Gutter 12</li>
                        <li><b>현재</b> : {{ gridInfo }}</li>
                    </ul>

                    <table class="demo-grid-table">
                        <caption class="sr-only">
                            기본 그리드 해상도별 값
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col">name</th>
                                <th scope="col">width</th>
                                <th scope="col">margin</th>
                                <th scope="col">column</th>
                                <th scope="col">gutter</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="grid in grids" :key="grid.name">
                                <th scope="row">
                                    <code>{{ grid.name }}</code>
                                </th>
                                <td>{{ grid.width }}</td>
                                <td>{{ grid.margin }}</td>
                                <td>{{ grid.column }}</td>
                                <td>{{ grid.gutter }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="demo-grid-preview ds-grid">
                        <span v-for="col in 12" :key="col" class="ds-col-1">{{ col }}</span>
                        <span class="ds-col-6">ds-col-6</span>
                        <span class="ds-col-6">ds-col-6</span>
                        <span class="ds-col-4">ds-col-4</span>
                        <span class="ds-col-4">ds-col-4</span>
                        <span class="ds-col-4">ds-col-4</span>
                    </div>
                </PageDemoSection>

                <!-- Radius / Shadow -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Radius / Shadow"
                    description="Figma 14. Thumbnail 라운드 사용 정의(썸네일 크기별) 와 21. Shadow Guide 수직 그림자입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>Radius</b> : radius(sm|md|lg|xl) / .radius-{key} → 10 · 12 · 20 · 28px</li>
                        <li><b>Shadow</b> : var(--shadow-level-1 ~ 3)</li>
                    </ul>

                    <div class="demo-radius">
                        <div v-for="radius in radii" :key="radius.key" class="demo-radius__item">
                            <span class="demo-radius__box" :class="`radius-${radius.key}`" />
                            <code>{{ radius.key }} · {{ radius.value }}</code>
                            <small>{{ radius.use }}</small>
                        </div>
                        <div v-for="level in 3" :key="`shadow-${level}`" class="demo-radius__item">
                            <span class="demo-radius__box demo-radius__box--shadow" :style="{ boxShadow: `var(--shadow-level-${level})` }" />
                            <code>shadow-level-{{ level }}</code>
                        </div>
                    </div>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppInput from '@/components/AppInput.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

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

const weights = [
    { key: 'lt', value: '300 Light' },
    { key: 'rg', value: '400 Regular' },
    { key: 'md', value: '500 Medium' },
    { key: 'sb', value: '600 SemiBold' },
];

const paletteHues = [
    'red',
    'violet',
    'purple',
    'purple-haze',
    'navy-blue',
    'blue',
    'sky-blue',
    'emerald',
    'navy-green',
    'green',
    'khaki',
    'brown',
    'orange',
    'tangerine',
    'amber',
    'dark-amber',
    'maroon',
    'blue-black',
    'black',
];
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
// Figma 에 900 단계가 없는 색상
const paletteMissing = ['red-900', 'purple-haze-900'];

const spaces = [2, 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 60, 70, 80, 100, 120, 140, 180];

const grids = [
    { name: '1920-wide', width: 1920, margin: 56, column: 114, gutter: 40 },
    { name: '1920-narrow', width: 1920, margin: 40, column: 135, gutter: 20 },
    { name: '1580-narrow (기본)', width: 1580, margin: 20, column: 110, gutter: 20 },
    { name: '1560-wide', width: 1560, margin: 20, column: 90, gutter: 40 },
    { name: '1320-wide', width: 1320, margin: 20, column: 70, gutter: 40 },
    { name: '1280-narrow', width: 1280, margin: 20, column: 85, gutter: 20 },
];

const radii = [
    { key: 'sm', value: '10px', use: '~120px 썸네일' },
    { key: 'md', value: '12px', use: '140~216px' },
    { key: 'lg', value: '20px', use: '240~500px' },
    { key: 'xl', value: '28px', use: '620px~' },
];

// SCSS 토큰이 실제로 적용된 값을 화면에서 읽어 표시합니다.
const values = ref({});
const sizes = ref({});
const viewport = ref(0);
const gridInfo = ref('');
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
    gridInfo.value = `${style.getPropertyValue('--ds-grid-columns').trim()} Column · margin ${style.getPropertyValue('--ds-grid-margin').trim()} · gutter ${style.getPropertyValue('--ds-grid-gutter').trim()}`;
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
        @include font(c2, rg);
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
    @include font(c2, rg);

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
    @include font(c2, rg);
}
.demo-palette {
    display: grid;
    gap: 4px;
    overflow-x: auto;

    &__row {
        display: grid;
        grid-template-columns: 96px repeat(10, minmax(44px, 1fr));
        gap: 4px;
        align-items: center;
    }

    &__hue {
        color: var(--theme-color-03-gray);
        @include font(c2, rg);
    }

    &__chip {
        display: flex;
        align-items: flex-end;
        height: 36px;
        padding: 2px 4px;
        border-radius: 4px;
        color: rgb(0 0 0 / 55%);
        @include font(c3, rg);
    }
}

.demo-space {
    display: grid;
    gap: 8px;

    &__row {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        align-items: center;
        gap: 12px;
    }

    &__token {
        color: var(--theme-color-04-gray);
        @include font(c2, rg);
    }

    &__bar {
        display: block;
        background: color-mix(in srgb, var(--theme-brand-main) 30%, transparent);
    }
}

.demo-grid-table {
    width: 100%;
    margin-bottom: 16px;
    border-collapse: collapse;
    @include font(b4, rg);

    th,
    td {
        padding: 8px 12px;
        border-bottom: 1px solid var(--theme-line-light);
        text-align: left;
    }

    thead th {
        background: var(--theme-bg-light);
        color: var(--theme-color-03-gray);
        font-weight: 600;
    }
}

.demo-grid-preview {
    row-gap: 8px;

    > span {
        padding: 10px 0;
        border-radius: 4px;
        background: color-mix(in srgb, var(--theme-system-violet-400) 25%, transparent);
        color: var(--theme-color-03-gray);
        @include font(c2, rg);
        text-align: center;
    }
}

.demo-radius {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;

    &__item {
        display: grid;
        justify-items: start;
        gap: 6px;
        @include font(c2, rg);

        small {
            color: var(--theme-color-04-gray);
        }
    }

    &__box {
        display: block;
        width: 96px;
        height: 96px;
        background: var(--theme-bg-regular);

        &--shadow {
            border-radius: 12px;
            background: var(--theme-bg-white);
        }
    }
}
</style>
