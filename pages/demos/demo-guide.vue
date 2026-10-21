<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <PageDemoSection
                    title="공통 속성 사전"
                    description="같은 의미는 모든 컴포넌트에서 같은 이름을 사용합니다. 이 표의 이름만 기억하면 됩니다."
                >
                    <AppDataTable :columns="propColumns" :items="commonProps" size="sm" variant="line">
                        <template #cell-name="{ value }"
                            ><code>{{ value }}</code></template
                        >
                    </AppDataTable>
                </PageDemoSection>

                <PageDemoSection title="width 사용법" description="모든 입력/버튼/레이어 컴포넌트에서 동일하게 동작합니다.">
                    <div class="page-demo-stack">
                        <AppInput v-model="sample" :width="240" placeholder=':width="240" (px)' />
                        <AppSelect v-model="selected" :items="items" width="50%" placeholder='width="50%"' />
                        <AppButton width="full" variant="fill" tone="primary">width="full" (100%)</AppButton>
                    </div>
                </PageDemoSection>

                <PageDemoSection
                    title="state 사용법"
                    description="검증 상태(error / warning / success)는 state 하나로, 하단 문구는 hint 하나로 표시합니다."
                >
                    <div class="page-demo-grid">
                        <AppInput v-model="sample" label="Input" state="error" hint="필수 입력입니다." />
                        <AppSelect v-model="selected" label="Select" :items="items" state="warning" hint="확인이 필요합니다." />
                        <AppDatePicker v-model="date" label="DatePicker" state="success" hint="사용 가능한 날짜입니다." />
                        <AppTextarea v-model="sample" label="Textarea" state="error" hint="10자 이상 입력하세요." :rows="2" />
                        <AppInputNumber :model-value="5" label="InputNumber" state="error" hint="재고 초과" />
                        <AppFormField label="FormField" state="success" hint="FormField 도 state + hint">
                            <AppInput v-model="sample" state="success" />
                        </AppFormField>
                    </div>
                </PageDemoSection>

                <PageDemoSection
                    title="변경된 속성 (마이그레이션)"
                    description="비슷한 이름을 하나로 합치면서 바뀐 속성입니다. 기존 화면은 모두 치환되었습니다."
                >
                    <AppDataTable :columns="migrationColumns" :items="migrations" size="sm">
                        <template #cell-before="{ value }"
                            ><del>{{ value }}</del></template
                        >
                        <template #cell-after="{ value }"
                            ><code>{{ value }}</code></template
                        >
                    </AppDataTable>
                </PageDemoSection>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AppDataTableColumn } from '~/components/Table/AppDataTable.vue';

const { title, description } = useDemoI18n('guide');

const sample = ref('');
const selected = ref<string | number | boolean | null>(null);
const date = ref<string | null>('2026-10-21');
const items = [
    { value: 'A', label: '옵션 A' },
    { value: 'B', label: '옵션 B' },
];

const propColumns: AppDataTableColumn[] = [
    { key: 'name', label: '속성', width: 150, align: 'left' },
    { key: 'values', label: '값', width: 300, align: 'left' },
    { key: 'desc', label: '설명', align: 'left' },
];

const commonProps = [
    { id: 1, name: 'v-model', values: '컴포넌트별 값', desc: '입력값, 선택 id(Tabs/Steps/Tree), 열린 id 배열(Accordion), 선택 행 배열(DataTable)' },
    { id: 2, name: 'v-model:open', values: 'boolean', desc: '레이어 열림 여부 (Drawer / Popover / Tooltip)' },
    {
        id: 3,
        name: 'items',
        values: 'Array',
        desc: '목록 데이터 - Select, Tabs, Accordion, Segmented, Steps, Timeline, Tree, Transfer, Carousel, Breadcrumb, DataTable',
    },
    { id: 4, name: 'label', values: 'string', desc: '필드 라벨 또는 짧은 표시 텍스트 (Tag, Choice)' },
    { id: 5, name: 'title / description', values: 'string', desc: '블록 제목 / 설명 (Section, Empty, Alert, Drawer, Popover, StatCard)' },
    { id: 6, name: 'hint', values: 'string', desc: '필드 하단 보조 문구 - state 색상을 따라감 (기존 error, helperText 통합)' },
    { id: 7, name: 'size', values: 'xs | sm | md | lg | xl', desc: '버튼 기준 24 / 36 / 44 / 48 / 56px' },
    { id: 8, name: 'width', values: "number | '50%' | 'full'", desc: '가로 크기 - 숫자는 px, full 은 100% (기존 block 통합)' },
    { id: 9, name: 'height', values: 'number | string', desc: '세로 크기' },
    {
        id: 10,
        name: 'tone',
        values: 'primary | secondary | gray | danger | warning | success | info',
        desc: '색상 의미. Tag 는 black·red·orange·green·blue·navy·purple 추가',
    },
    { id: 11, name: 'variant', values: 'fill | soft | outline | plain | line ...', desc: '시각 스타일 (컴포넌트별 지원 값은 Props 패널 참고)' },
    { id: 12, name: 'shape', values: 'square | round | pill (circle, underline)', desc: '모서리 형태' },
    { id: 13, name: 'state', values: 'error | warning | success', desc: '검증 상태 (기존 invalid, error 통합)' },
    { id: 14, name: 'placement', values: 'top | bottom | left | right', desc: '레이어 위치 (Tooltip, Popover, Drawer 는 left/right)' },
    { id: 15, name: 'initial', values: 'none | first | all', desc: '최초 열림/선택 규칙 (Tabs, Accordion, Tree)' },
    {
        id: 16,
        name: 'boolean',
        values: 'disabled · readonly · loading · active · required · clearable · closable · multiple',
        desc: '상태/기능 on-off 속성',
    },
];

const migrationColumns: AppDataTableColumn[] = [
    { key: 'component', label: '컴포넌트', width: 180, align: 'left' },
    { key: 'before', label: '이전', width: 260, align: 'left' },
    { key: 'after', label: '변경', align: 'left' },
];

const migrations = [
    { id: 1, component: 'AppButton', before: 'block', after: 'width="full"' },
    { id: 2, component: 'AppSelect', before: ':options', after: ':items' },
    { id: 3, component: 'AppTabs', before: 'activeId / defaultActiveId / initialActive', after: 'v-model / initial' },
    { id: 4, component: 'AppAccordion', before: 'openIds / defaultOpenIds / initialOpen / type', after: 'v-model / initial / multiple' },
    { id: 5, component: 'AppTextarea', before: 'invalid / error', after: 'state + hint (label 추가)' },
    { id: 6, component: 'AppFormField', before: 'error', after: 'state + hint' },
    { id: 7, component: 'AppTable', before: 'defaultLabelWidth / cell.options / cell.helperText', after: 'labelWidth / cell.items / cell.hint' },
    { id: 8, component: 'AppGrid (search/cell)', before: 'options', after: 'items' },
    { id: 9, component: 'AppUpload*', before: 'maxSizeBytes', after: 'maxSize' },
    { id: 10, component: 'AppChart', before: "variant='semi-doughnut'", after: "type='semi-doughnut'" },
    { id: 11, component: 'AppBadge (미구현)', before: 'AppBadge color', after: 'AppTag tone' },
];
</script>
