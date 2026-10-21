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
                <PageDemoSection class="page-demo-section" title="Basic" description="가장 기본적인 Select 사용 예시입니다.">
                    <div class="page-demo-grid">
                        <AppSelect
                            v-model="basic.department"
                            label="부서"
                            placeholder="부서를 선택하세요"
                            hint="부서를 선택해주세요"
                            :items="departmentOptions"
                        />
                        <AppSelect v-model="basic.job" label="직무" placeholder="직무를 선택하세요" :items="jobOptions" />
                        <AppSelect v-model="basic.country" placeholder="국가 선택" :items="countryOptions" />
                    </div>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection class="page-demo-section" title="Size" description="Select의 높이를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect size="xs" label="XS" v-model="sizes.xs" :items="departmentOptions" />
                        <AppSelect size="sm" label="SM" v-model="sizes.sm" :items="departmentOptions" />
                        <AppSelect size="md" label="MD" v-model="sizes.md" :items="departmentOptions" />
                        <AppSelect size="lg" label="LG" v-model="sizes.lg" :items="departmentOptions" />
                    </div>
                </PageDemoSection>

                <!-- SHAPE -->
                <PageDemoSection class="page-demo-section" title="Shape" description="Select의 border 스타일을 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect shape="square" label="Square" v-model="shape.square" :items="departmentOptions" />
                        <AppSelect shape="round" label="Round" v-model="shape.round" :items="departmentOptions" />
                        <AppSelect shape="pill" label="Pill" v-model="shape.pill" :items="departmentOptions" />
                        <AppSelect shape="underline" label="Underline" v-model="shape.underline" :items="departmentOptions" />
                    </div>
                </PageDemoSection>

                <!-- STATE -->
                <PageDemoSection class="page-demo-section" title="State" description="선택 상태에 따른 스타일을 제공합니다.">
                    <div class="page-demo-grid">
                        <AppSelect v-model="stateError" label="Error" state="error" hint="에러 메시지" :items="departmentOptions" />
                        <AppSelect v-model="stateWarning" label="Warning" state="warning" hint="경고 메시지" :items="departmentOptions" />
                        <AppSelect v-model="stateSuccess" label="Success" state="success" hint="선택 가능" :items="departmentOptions" />
                    </div>
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="선택 불가 상태를 제어합니다.">
                    <div class="page-demo-grid">
                        <AppSelect v-model="disabledValue" label="Disabled" disabled hint="비활성 상태" :items="departmentOptions" />
                    </div>
                </PageDemoSection>

                <!-- IMAGE / DESCRIPTION -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Image / Description"
                    description="Figma 이미지 포함 셀렉트 - item.image, item.description, item.disabled(품절) 를 지원합니다. width 로 가로 크기 지정"
                >
                    <div class="page-demo-row">
                        <AppSelect v-model="product" :items="productItems" label="상품 선택" :width="360" size="lg" />
                        <AppSelect v-model="product" :items="productItems" label="width='full'" width="full" />
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
/**
 * 셀렉트 데모 화면의 선택 값과 출력 상태를 관리하는 페이지 컴포넌트입니다.
 */
import type { AppSelectOption } from '~/components/AppSelect.vue';

/* stores/composables */
const { title, description } = useDemoI18n('select');

const productThumb = (color: string) =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" rx="6" fill="${color}"/></svg>`)}`;
const product = ref<string | number | boolean | null>('p2');
const productItems: AppSelectOption[] = [
    { value: 'p1', label: '스웨이드 웰티드 부츠', description: 'UGG · 268,200원', image: productThumb('#1b2679') },
    { value: 'p2', label: '스웨이드 웰티드 부츠 (울트라짓 포미닛)', description: 'UGG · 268,200원', image: productThumb('#3b2824') },
    { value: 'p3', label: '스웨이드 웰티드 부츠 (레드)', description: 'UGG · 268,200원', image: productThumb('#c23e38') },
    { value: 'p4', label: '스웨이드 웰티드 부츠 (품절)', description: '(품절)', image: productThumb('#94a4ad'), disabled: true },
];

/* 예제 데이터 */
const departmentOptions: AppSelectOption[] = [
    { value: 'dev', label: '개발' },
    { value: 'design', label: '디자인' },
    { value: 'plan', label: '기획' },
    { value: 'ops', label: '운영', disabled: true },
];

const jobOptions: AppSelectOption[] = [
    { value: 'publisher', label: '<span>퍼블리셔</span> <span>Publisher</span>' },
    { value: 'frontend', label: '프론트엔드' },
    { value: 'designer', label: '디자이너' },
    { value: 'pm', label: 'PM' },
];

const countryOptions: AppSelectOption[] = [
    { value: 'kr', label: '대한민국' },
    { value: 'jp', label: '일본' },
    { value: 'us', label: '미국' },
    { value: 'tw', label: '대만' },
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

const disabledValue = ref<string | null>('dev');
</script>

<!-- demo 공통 스타일은 assets/scss/pages/demo.scss 에서 관리 -->
