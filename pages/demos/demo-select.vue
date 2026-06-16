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
                <AppSection class="page-demo-accordion" title="Basic" desc="가장 기본적인 Select 사용 예시입니다.">
                    <div class="page-demo-grid">
                        <AppSelect v-model="basic.department" label="부서" placeholder="부서를 선택하세요" hint="부서를 선택해주세요"
                            :options="departmentOptions" />
                        <AppSelect v-model="basic.job" label="직무" placeholder="직무를 선택하세요" :options="jobOptions" />
                        <AppSelect v-model="basic.country" placeholder="국가 선택" :options="countryOptions" />
                    </div>
                </AppSection>

                <!-- SIZE -->
                <AppSection class="page-demo-accordion" title="Size" desc="Select의 높이를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect size="xs" label="XS" v-model="sizes.xs" :options="departmentOptions" />
                        <AppSelect size="sm" label="SM" v-model="sizes.sm" :options="departmentOptions" />
                        <AppSelect size="md" label="MD" v-model="sizes.md" :options="departmentOptions" />
                        <AppSelect size="lg" label="LG" v-model="sizes.lg" :options="departmentOptions" />
                    </div>
                </AppSection>

                <!-- SHAPE -->
                <AppSection class="page-demo-accordion" title="Shape" desc="Select의 border 스타일을 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect shape="square" label="Square" v-model="shape.square" :options="departmentOptions" />
                        <AppSelect shape="round" label="Round" v-model="shape.round" :options="departmentOptions" />
                        <AppSelect shape="pill" label="Pill" v-model="shape.pill" :options="departmentOptions" />
                        <AppSelect shape="underline" label="Underline" v-model="shape.underline"
                            :options="departmentOptions" />
                    </div>
                </AppSection>

                <!-- STATE -->
                <AppSection class="page-demo-accordion" title="State" desc="선택 상태에 따른 스타일을 제공합니다.">
                    <div class="page-demo-grid">
                        <AppSelect v-model="stateError" label="Error" state="error" hint="에러 메시지"
                            :options="departmentOptions" />
                        <AppSelect v-model="stateWarning" label="Warning" state="warning" hint="경고 메시지"
                            :options="departmentOptions" />
                        <AppSelect v-model="stateSuccess" label="Success" state="success" hint="선택 가능"
                            :options="departmentOptions" />
                    </div>
                </AppSection>

                <!-- DISABLED -->
                <AppSection class="page-demo-accordion" title="Disabled" desc="선택 불가 상태를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect v-model="disabledValue" label="Disabled" disabled hint="비활성 상태"
                            :options="departmentOptions" />
                    </div>
                </AppSection>
            </main>

            <!-- STATE PANEL -->
            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <AppSection class="page-demo-accordion" title="Current Value">
                        <pre class="page-demo-output">{{ output }}                        </pre>
                    </AppSection>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 셀렉트 데모 화면의 선택 값과 출력 상태를 관리하는 페이지 컴포넌트입니다.
 */
import type { AppSelectOption } from "~/components/AppSelect.vue";

/* stores/composables */
const { title, description } = useDemoI18n("select");

/* 예제 데이터 */
const departmentOptions: AppSelectOption[] = [
    { value: "dev", label: "개발" },
    { value: "design", label: "디자인" },
    { value: "plan", label: "기획" },
    { value: "ops", label: "운영", disabled: true },
];

const jobOptions: AppSelectOption[] = [
    { value: "publisher", label: "<span>퍼블리셔</span> <span>Publisher</span>" },
    { value: "frontend", label: "프론트엔드" },
    { value: "designer", label: "디자이너" },
    { value: "pm", label: "PM" },
];

const countryOptions: AppSelectOption[] = [
    { value: "kr", label: "대한민국" },
    { value: "jp", label: "일본" },
    { value: "us", label: "미국" },
    { value: "tw", label: "대만" },
];

/* ref/reactive state */
const basic = reactive({
    department: null as string | null,
    job: null as string | null,
    country: null as string | null,
});

const sizes = reactive({
    xs: null as string | null,
    sm: null as string | null,
    md: null as string | null,
    lg: null as string | null,
});

const shape = reactive({
    square: null as string | null,
    round: null as string | null,
    pill: null as string | null,
    underline: null as string | null,
});

const stateError = ref<string | null>(null);
const stateWarning = ref<string | null>(null);
const stateSuccess = ref<string | null>(null);

const disabledValue = ref<string | null>("dev");

/* computed */
const output = computed(() =>
    JSON.stringify(
        {
            basic,
            sizes,
            shape,
            stateError: stateError.value,
            stateWarning: stateWarning.value,
            stateSuccess: stateSuccess.value,
            disabledValue: disabledValue.value,
        },
        null,
        2,
    ),
);
</script>

<!-- demo 공통 스타일은 assets/scss/pages/demo.scss 에서 관리 -->
