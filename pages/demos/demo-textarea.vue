<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- BASIC -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Basic" desc="기본 textarea 입력 예시입니다.">
                    <AppTextarea v-model="basicValue" placeholder="내용을 입력하세요." />
                </PageDemoAccordionSection>

                <!-- WITH FORM FIELD -->
                <PageDemoAccordionSection class="page-demo-accordion" title="With FormField"
                    desc="AppFormField와 함께 label, hint, error를 연결합니다.">
                    <AppFormField label="문의 내용" required hint="최대 200자까지 입력할 수 있습니다."
                        :error="content && content.length < 10 ? '문의 내용은 10자 이상 입력해주세요.' : ''">
                        <AppTextarea v-model="content" placeholder="문의 내용을 입력하세요." :max-length="200" show-count
                            clearable />
                    </AppFormField>
                </PageDemoAccordionSection>

                <!-- SIZE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Size" desc="sm / md / lg 크기를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "sm"</div>

                            <AppTextarea v-model="smallValue" size="sm" placeholder="small textarea" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "md"</div>

                            <AppTextarea v-model="mediumValue" size="md" placeholder="medium textarea" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "lg"</div>

                            <AppTextarea v-model="largeValue" size="lg" placeholder="large textarea" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- RESIZE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Resize" desc="resize 옵션별 textarea 크기 조절 방식을 확인합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "none"</div>

                            <AppTextarea v-model="resizeNoneValue" resize="none" placeholder="resize none" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "vertical"</div>

                            <AppTextarea v-model="resizeVerticalValue" resize="vertical"
                                placeholder="resize vertical" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "horizontal"</div>

                            <AppTextarea v-model="resizeHorizontalValue" resize="horizontal"
                                placeholder="resize horizontal" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "both"</div>

                            <AppTextarea v-model="resizeBothValue" resize="both" placeholder="resize both" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- STATES -->
                <PageDemoAccordionSection class="page-demo-accordion" title="States" desc="disabled, readonly, invalid 상태를 확인합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">disabled</div>

                            <AppTextarea v-model="disabledValue" disabled placeholder="disabled textarea" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">readonly</div>

                            <AppTextarea v-model="readonlyValue" readonly placeholder="readonly textarea" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">invalid</div>

                            <AppTextarea v-model="invalidValue" invalid placeholder="invalid textarea" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- COUNT / CLEAR -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Count / Clear" desc="글자 수 표시와 clearable 옵션을 확인합니다.">
                    <AppTextarea v-model="countValue" placeholder="최대 100자까지 입력하세요." :max-length="100" show-count
                        clearable />
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
 * 텍스트에어리어 데모 화면의 입력 값과 검증 상태를 관리하는 페이지 컴포넌트입니다.
 */
const { title, description } = useDemoI18n("textarea");

const basicValue = ref("");
const content = ref("");
const smallValue = ref("");
const mediumValue = ref("");
const largeValue = ref("");
const resizeNoneValue = ref("resize none");
const resizeVerticalValue = ref("resize vertical");
const resizeHorizontalValue = ref("resize horizontal");
const resizeBothValue = ref("resize both");
const disabledValue = ref("disabled value");
const readonlyValue = ref("readonly value");
const invalidValue = ref("invalid value");
const countValue = ref("");

const output = computed(() =>
    JSON.stringify(
        {
            basicValue: basicValue.value,
            content: content.value,
            contentError: content.value && content.value.length < 10 ? "문의 내용은 10자 이상 입력해주세요." : "",
            smallValue: smallValue.value,
            mediumValue: mediumValue.value,
            largeValue: largeValue.value,
            resizeNoneValue: resizeNoneValue.value,
            resizeVerticalValue: resizeVerticalValue.value,
            resizeHorizontalValue: resizeHorizontalValue.value,
            resizeBothValue: resizeBothValue.value,
            disabledValue: disabledValue.value,
            readonlyValue: readonlyValue.value,
            invalidValue: invalidValue.value,
            countValue: countValue.value,
            propsSummary: {
                modelValue: true,
                placeholder: true,
                disabled: true,
                readonly: true,
                rows: true,
                maxLength: true,
                showCount: true,
                clearable: true,
                invalid: true,
                size: ["sm", "md", "lg"],
                resize: ["none", "vertical", "horizontal", "both"],
            },
        },
        null,
        2,
    ),
);
</script>
