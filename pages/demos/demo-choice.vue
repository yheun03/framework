<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- CHECKBOX -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Checkbox"
                    desc="checkbox는 variant(default / round)와 size(md / sm) 조합으로 사용할 수 있습니다. default는 각진 형태, round는 둥근 형태를 제공합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Default / MD</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="checkbox.aMd.default" type="checkbox" size="md"
                                    label="기본상태" />
                                <AppChoice v-model="checkbox.aMd.checked" type="checkbox" size="md"
                                    label="체크상태" />
                                <AppChoice v-model="checkbox.aMd.disabled" type="checkbox" size="md"
                                    label="비활성화" disabled />
                                <AppChoice v-model="checkbox.aMd.checkedDisabled" type="checkbox" size="md"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Default / SM</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="checkbox.aSm.default" type="checkbox" size="sm"
                                    label="기본상태" />
                                <AppChoice v-model="checkbox.aSm.checked" type="checkbox" size="sm"
                                    label="체크상태" />
                                <AppChoice v-model="checkbox.aSm.disabled" type="checkbox" size="sm"
                                    label="비활성화" disabled />
                                <AppChoice v-model="checkbox.aSm.checkedDisabled" type="checkbox" size="sm"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Round / MD</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="checkbox.bMd.default" type="checkbox" variant="round" size="md"
                                    label="기본상태" />
                                <AppChoice v-model="checkbox.bMd.checked" type="checkbox" variant="round" size="md"
                                    label="체크상태" />
                                <AppChoice v-model="checkbox.bMd.disabled" type="checkbox" variant="round" size="md"
                                    label="비활성화" disabled />
                                <AppChoice v-model="checkbox.bMd.checkedDisabled" type="checkbox" variant="round" size="md"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Round / SM</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="checkbox.bSm.default" type="checkbox" variant="round" size="sm"
                                    label="기본상태" />
                                <AppChoice v-model="checkbox.bSm.checked" type="checkbox" variant="round" size="sm"
                                    label="체크상태" />
                                <AppChoice v-model="checkbox.bSm.disabled" type="checkbox" variant="round" size="sm"
                                    label="비활성화" disabled />
                                <AppChoice v-model="checkbox.bSm.checkedDisabled" type="checkbox" variant="round" size="sm"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- RADIO -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Radio"
                    desc="radio는 variant(default / round)와 size(md / sm) 조합으로 사용할 수 있습니다. default는 흰 배경 + 검은 dot, round는 검은 배경 + 흰 dot 구조입니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Default / MD</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="radio.aMd" type="radio" name="radio-a-md" value="default"
                                    size="md" label="기본상태" />
                                <AppChoice v-model="radio.aMd" type="radio" name="radio-a-md" value="checked"
                                    size="md" label="체크상태" />
                                <AppChoice v-model="radioDisabled.aMd" type="radio" name="radio-a-md-disabled"
                                    value="default" size="md" label="비활성화" disabled />
                                <AppChoice v-model="radioDisabledChecked.aMd" type="radio"
                                    name="radio-a-md-disabled-checked" value="checked" size="md"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Default / SM</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="radio.aSm" type="radio" name="radio-a-sm" value="default"
                                    size="sm" label="기본상태" />
                                <AppChoice v-model="radio.aSm" type="radio" name="radio-a-sm" value="checked"
                                    size="sm" label="체크상태" />
                                <AppChoice v-model="radioDisabled.aSm" type="radio" name="radio-a-sm-disabled"
                                    value="default" size="sm" label="비활성화" disabled />
                                <AppChoice v-model="radioDisabledChecked.aSm" type="radio"
                                    name="radio-a-sm-disabled-checked" value="checked" size="sm"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Round / MD</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="radio.bMd" type="radio" name="radio-b-md" value="default" variant="round"
                                    size="md" label="기본상태" />
                                <AppChoice v-model="radio.bMd" type="radio" name="radio-b-md" value="checked" variant="round"
                                    size="md" label="체크상태" />
                                <AppChoice v-model="radioDisabled.bMd" type="radio" name="radio-b-md-disabled"
                                    value="default" variant="round" size="md" label="비활성화" disabled />
                                <AppChoice v-model="radioDisabledChecked.bMd" type="radio"
                                    name="radio-b-md-disabled-checked" value="checked" variant="round" size="md"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>

                        <div class="page-demo-compare">
                            <h3 class="page-demo-compare__title">Round / SM</h3>

                            <div class="page-demo-row">
                                <AppChoice v-model="radio.bSm" type="radio" name="radio-b-sm" value="default" variant="round"
                                    size="sm" label="기본상태" />
                                <AppChoice v-model="radio.bSm" type="radio" name="radio-b-sm" value="checked" variant="round"
                                    size="sm" label="체크상태" />
                                <AppChoice v-model="radioDisabled.bSm" type="radio" name="radio-b-sm-disabled"
                                    value="default" variant="round" size="sm" label="비활성화" disabled />
                                <AppChoice v-model="radioDisabledChecked.bSm" type="radio"
                                    name="radio-b-sm-disabled-checked" value="checked" variant="round" size="sm"
                                    label="체크 비활성화" disabled />
                            </div>
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- CHIP FILTER -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Chip Filter"
                    desc="다중 선택 가능한 태그/필터 UI 패턴입니다. checkbox + chip variant 조합으로 사용합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice v-model="chipFilter.development" type="checkbox" variant="chip" label="개발" />
                            <AppChoice v-model="chipFilter.design" type="checkbox" variant="chip" label="디자인" />
                            <AppChoice v-model="chipFilter.planning" type="checkbox" variant="chip" label="기획" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chipFilter.outlineA" type="checkbox" variant="chip-outline"
                                label="Outline A" />
                            <AppChoice v-model="chipFilter.outlineB" type="checkbox" variant="chip-outline"
                                label="Outline B" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- CHIP RADIO GROUP -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Chip Radio Group"
                    desc="탭, 세그먼트 버튼, 단일 선택 필터처럼 사용하는 패턴입니다. radio + chip variant 조합으로 사용합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-row">
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="all"
                                variant="fill" label="전체" />
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="news"
                                variant="fill" label="뉴스" />
                            <AppChoice v-model="chipRadio.category" type="radio" name="chip-category" value="notice"
                                variant="fill" label="공지" />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="chipRadio.view" type="radio" name="chip-view" value="card"
                                variant="ghost" label="카드형" />
                            <AppChoice v-model="chipRadio.view" type="radio" name="chip-view" value="list"
                                variant="ghost" label="리스트형" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- TOGGLE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Toggle"
                    desc="ON/OFF 스위치 형태의 checkbox variant입니다.">
                    <div class="page-demo-row">
                        <AppChoice v-model="toggle.basic" type="checkbox" variant="toggle" label="ON" />
                        <AppChoice v-model="toggle.off" type="checkbox" variant="toggle" label="OFF" />
                        <AppChoice v-model="toggle.custom" type="checkbox" variant="toggle" checked-label="사용"
                            unchecked-label="중지" />
                        <AppChoice v-model="toggle.pure" type="checkbox" variant="toggle" />
                        <AppChoice v-model="toggle.disabled" type="checkbox" variant="toggle" label="ON" disabled />
                        <AppChoice v-model="toggle.disabledOff" type="checkbox" variant="toggle" label="OFF" disabled />
                    </div>
                </PageDemoAccordionSection>

                <!-- STATE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="State" desc="hint와 state를 함께 사용해 상태 메시지를 표시합니다.">
                    <div class="page-demo-stack">
                        <AppChoice v-model="state.error" type="checkbox" label="Error" hint="에러 메시지" state="error" />

                        <AppChoice v-model="state.warning" type="checkbox" label="Warning" hint="경고 메시지"
                            state="warning" />

                        <AppChoice v-model="state.success" type="checkbox" label="Success" hint="선택 가능"
                            state="success" />
                    </div>
                </PageDemoAccordionSection>

                <!-- DISABLED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled"
                    desc="checkbox / radio / chip 계열 각각의 비활성 상태를 확인합니다.">
                    <div class="page-demo-stack">
                        <AppChoice v-model="disabled.checkbox" type="checkbox" label="Disabled Checkbox" hint="선택 불가"
                            disabled />

                        <div class="page-demo-row">
                            <AppChoice v-model="disabled.radio" type="radio" name="disabled-plan" value="basic"
                                label="Disabled Radio A" hint="선택 불가" disabled />

                            <AppChoice v-model="disabled.radio" type="radio" name="disabled-plan" value="pro"
                                label="Disabled Radio B" hint="선택 불가" disabled />
                        </div>

                        <div class="page-demo-row">
                            <AppChoice v-model="disabledChip.chip" type="checkbox" variant="chip" label="Disabled Chip"
                                disabled />

                            <AppChoice v-model="disabledChip.fill" type="radio" name="disabled-chip-radio"
                                value="option-a" variant="fill" label="Disabled Fill A" disabled />

                            <AppChoice v-model="disabledChip.fill" type="radio" name="disabled-chip-radio"
                                value="option-b" variant="fill" label="Disabled Fill B" disabled />
                        </div>
                    </div>
                </PageDemoAccordionSection>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <PageDemoAccordionSection class="page-demo-accordion" title="Current Value">
                        <pre class="page-demo-output">{{ output }}</pre>
                    </PageDemoAccordionSection>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 선택(체크박스/라디오/칩) 데모 화면의 선택 값과 출력 상태를 관리하는 페이지 컴포넌트입니다.
 */
/* stores/composables */
const { title, description } = useDemoI18n("choice");

type ChoiceValue = string | number | null;

/* ref/reactive state */
const checkbox = reactive({
    aMd: {
        default: false,
        checked: true,
        disabled: false,
        checkedDisabled: true,
    },
    aSm: {
        default: false,
        checked: true,
        disabled: false,
        checkedDisabled: true,
    },
    bMd: {
        default: false,
        checked: true,
        disabled: false,
        checkedDisabled: true,
    },
    bSm: {
        default: false,
        checked: true,
        disabled: false,
        checkedDisabled: true,
    },
});

const radio = reactive({
    aMd: "checked" as ChoiceValue,
    aSm: "checked" as ChoiceValue,
    bMd: "checked" as ChoiceValue,
    bSm: "checked" as ChoiceValue,
});

const radioDisabled = reactive({
    aMd: "default" as ChoiceValue,
    aSm: "default" as ChoiceValue,
    bMd: "default" as ChoiceValue,
    bSm: "default" as ChoiceValue,
});

const radioDisabledChecked = reactive({
    aMd: "checked" as ChoiceValue,
    aSm: "checked" as ChoiceValue,
    bMd: "checked" as ChoiceValue,
    bSm: "checked" as ChoiceValue,
});

const chipFilter = reactive({
    development: true,
    design: false,
    planning: true,
    outlineA: false,
    outlineB: true,
});

const chipRadio = reactive({
    category: "all" as ChoiceValue,
    view: "card" as ChoiceValue,
});

const toggle = reactive({
    basic: true,
    off: false,
    custom: true,
    pure: false,
    disabled: true,
    disabledOff: false,
});

const state = reactive({
    error: false,
    warning: false,
    success: true,
});

const disabled = reactive({
    checkbox: true,
    radio: "basic" as ChoiceValue,
});

const disabledChip = reactive({
    chip: true,
    fill: "option-a" as ChoiceValue,
});

/* computed */
const output = computed(() =>
    JSON.stringify(
        {
            checkbox: { ...checkbox },
            radio: { ...radio },
            radioDisabled: { ...radioDisabled },
            radioDisabledChecked: { ...radioDisabledChecked },
            chipFilter: { ...chipFilter },
            chipRadio: { ...chipRadio },
            toggle: { ...toggle },
            state: { ...state },
            disabled: { ...disabled },
            disabledChip: { ...disabledChip },
        },
        null,
        2,
    ),
);
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
