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
                <PageDemoSection class="page-demo-section" title="Basic" description="기본 textarea 입력 예시입니다.">
                    <AppTextarea v-model="basicValue" placeholder="내용을 입력하세요." />
                </PageDemoSection>

                <!-- WITH FORM FIELD -->
                <PageDemoSection class="page-demo-section" title="With FormField" description="AppFormField와 함께 label, hint, error를 연결합니다.">
                    <AppFormField
                        label="문의 내용"
                        required
                        hint="최대 200자까지 입력할 수 있습니다."
                        :error="content && content.length < 10 ? '문의 내용은 10자 이상 입력해주세요.' : ''"
                    >
                        <AppTextarea
                            v-model="content"
                            placeholder="문의 내용을 입력하세요."
                            :max-length="200"
                            show-count
                            clearable
                            :state="content && content.length < 10 ? 'error' : null"
                        />
                    </AppFormField>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection class="page-demo-section" title="Size" description="xs / sm / md / lg 공통 크기를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "xs"</div>

                            <AppTextarea v-model="extraSmallValue" size="xs" placeholder="extra small textarea" />
                        </div>

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
                </PageDemoSection>

                <!-- SHAPE -->
                <PageDemoSection class="page-demo-section" title="Shape" description="Input, Select, DatePicker와 같은 shape 값을 사용합니다.">
                    <div class="page-demo-grid">
                        <AppTextarea v-model="shapeValues.square" shape="square" placeholder="square" />
                        <AppTextarea v-model="shapeValues.round" shape="round" placeholder="round" />
                        <AppTextarea v-model="shapeValues.pill" shape="pill" placeholder="pill" />
                        <AppTextarea v-model="shapeValues.underline" shape="underline" placeholder="underline" />
                    </div>
                </PageDemoSection>

                <!-- RESIZE -->
                <PageDemoSection class="page-demo-section" title="Resize" description="resize 옵션별 textarea 크기 조절 방식을 확인합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "none"</div>

                            <AppTextarea v-model="resizeNoneValue" resize="none" placeholder="resize none" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "vertical"</div>

                            <AppTextarea v-model="resizeVerticalValue" resize="vertical" placeholder="resize vertical" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "horizontal"</div>

                            <AppTextarea v-model="resizeHorizontalValue" resize="horizontal" placeholder="resize horizontal" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">resize = "both"</div>

                            <AppTextarea v-model="resizeBothValue" resize="both" placeholder="resize both" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- STATES -->
                <PageDemoSection class="page-demo-section" title="States" description="공통 state와 disabled, readonly 상태를 확인합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-grid">
                            <AppTextarea v-model="stateValues.error" state="error" placeholder="state = error" />
                            <AppTextarea v-model="stateValues.warning" state="warning" placeholder="state = warning" />
                            <AppTextarea v-model="stateValues.success" state="success" placeholder="state = success" />
                        </div>

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
                </PageDemoSection>

                <!-- COUNT / CLEAR -->
                <PageDemoSection class="page-demo-section" title="Count / Clear" description="글자 수 표시와 clearable 옵션을 확인합니다.">
                    <AppTextarea v-model="countValue" placeholder="최대 100자까지 입력하세요." :max-length="100" show-count clearable />
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
/**
 * 텍스트에어리어 데모 화면의 입력 값과 검증 상태를 관리하는 페이지 컴포넌트입니다.
 */
const { title, description } = useDemoI18n('textarea');

const basicValue = ref('');
const content = ref('');
const extraSmallValue = ref('');
const smallValue = ref('');
const mediumValue = ref('');
const largeValue = ref('');
const resizeNoneValue = ref('resize none');
const resizeVerticalValue = ref('resize vertical');
const resizeHorizontalValue = ref('resize horizontal');
const resizeBothValue = ref('resize both');
const disabledValue = ref('disabled value');
const readonlyValue = ref('readonly value');
const invalidValue = ref('invalid value');
const countValue = ref('');
const shapeValues = reactive({
    square: '',
    round: '',
    pill: '',
    underline: '',
});
const stateValues = reactive({
    error: '',
    warning: '',
    success: '',
});
</script>
