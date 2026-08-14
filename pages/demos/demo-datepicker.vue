<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- TYPE -->
                <PageDemoSection class="page-demo-section" title="Type"
                    description="single / range / range-input / multiple 타입을 비교합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="types.single" type="single" label="Single" placeholder="날짜를 선택하세요"
                            hint="하나의 날짜를 선택합니다">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="types.range" type="range" label="Range" placeholder="기간을 선택하세요"
                            hint="하나의 입력에서 시작일과 종료일을 선택합니다">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="types.rangeInput" type="range-input" label="Range Input"
                            start-placeholder="시작일 선택" end-placeholder="종료일 선택"
                            hint="시작일을 선택하면 종료일 입력이 활성화됩니다">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="types.multiple" type="multiple" label="Multiple"
                            placeholder="여러 날짜를 선택하세요" hint="여러 날짜를 선택합니다">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection class="page-demo-section" title="Size" description="DatePicker의 높이를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="sizes.xs" size="xs" label="XS">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="sizes.sm" size="sm" label="SM">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="sizes.md" size="md" label="MD">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="sizes.lg" size="lg" label="LG">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>

                <!-- SHAPE -->
                <PageDemoSection class="page-demo-section" title="Shape"
                    description="DatePicker의 border 스타일을 제어합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="shapes.square" shape="square" label="Square">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="shapes.round" shape="round" label="Round">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="shapes.pill" shape="pill" label="Pill">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="shapes.underline" shape="underline" label="Underline">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>

                <!-- STATE -->
                <PageDemoSection class="page-demo-section" title="State" description="입력 상태에 따른 스타일을 제공합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="states.error" label="Error" state="error" hint="에러 메시지">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="states.warning" label="Warning" state="warning" hint="경고 메시지">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="states.success" label="Success" state="success" hint="선택 가능">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>

                <!-- DISABLED & READONLY -->
                <PageDemoSection class="page-demo-section" title="Disabled &amp;amp; Readonly"
                    description="선택 불가 또는 읽기 전용 상태를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="disabledValue" label="Disabled" disabled hint="비활성 상태">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                        <AppDatePicker v-model="readonlyValue" label="Readonly" readonly hint="읽기 전용 상태">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>

                <!-- CONSTRAINTS -->
                <PageDemoSection class="page-demo-section" title="Constraints"
                    description="min / max 속성으로 선택 가능한 날짜 범위를 제한합니다.">
                    <div class="page-demo-grid">
                        <AppDatePicker v-model="constraints.single" label="Min / Max" :min="min" :max="max"
                            hint="2026년 내에서만 선택 가능">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>

                        <AppDatePicker v-model="constraints.range" type="range" label="Range with Min / Max" :min="min"
                            :max="max" hint="범위 선택에도 동일하게 적용">
                            <template #iconRight>
                                <IconCalendar />
                            </template>
                        </AppDatePicker>
                    </div>
                </PageDemoSection>
            </main>

            <!-- STATE PANEL -->
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DateRangeValue } from "~/components/AppDatePicker.vue";
import { IconCalendar } from "~/components/icons";

const { title, description } = useDemoI18n("datepicker");

const min = "2026-04-01";
const max = "2026-12-31";

const types = reactive({
    single: null as string | null,
    range: null as DateRangeValue | null,
    rangeInput: null as DateRangeValue | null,
    multiple: [] as string[],
});

const sizes = reactive({
    xs: null as string | null,
    sm: null as string | null,
    md: null as string | null,
    lg: null as string | null,
});

const shapes = reactive({
    square: null as string | null,
    round: null as string | null,
    pill: null as string | null,
    underline: null as string | null,
});

const states = reactive({
    error: null as string | null,
    warning: null as string | null,
    success: null as string | null,
});

const disabledValue = ref<string | null>("2026-05-10");
const readonlyValue = ref<string | null>("2026-05-10");

const constraints = reactive({
    single: null as string | null,
    range: null as DateRangeValue | null,
});
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
