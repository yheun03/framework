<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Items / v-model -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Items / v-model"
                    description="좌/우 목록 이동입니다. 체크박스는 AppChoice, 검색은 AppInput, 이동 버튼은 AppIconButton 입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { value, label, description, disabled } 배열</li>
                        <li><b>v-model</b> : 오른쪽(선택) 목록의 value 배열</li>
                    </ul>

                    <AppTransfer v-model="assigned" :items="workers" />
                    <p class="page-demo-output">v-model: {{ assigned }}</p>
                </PageDemoSection>

                <!-- Titles -->
                <PageDemoSection class="page-demo-section" title="Titles" description="좌/우 패널 제목입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>titles</b> : [왼쪽, 오른쪽] - 기본값 ['전체 목록', '선택 목록']</li>
                    </ul>

                    <AppTransfer v-model="assigned2" :items="workers" :titles="['미배정 작업자', '1라인 배정']" />
                </PageDemoSection>

                <!-- Searchable / Height -->
                <PageDemoSection class="page-demo-section" title="Searchable / Height" description="패널 검색창과 목록 높이입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>searchable</b> : 검색창 노출 (기본값 true)</li>
                        <li><b>height</b> : 목록 높이 (기본값 260)</li>
                    </ul>

                    <AppTransfer v-model="assigned3" :items="workers" :searchable="false" :height="180" />
                </PageDemoSection>

                <!-- items[].disabled / Disabled -->
                <PageDemoSection class="page-demo-section" title="items[].disabled / Disabled" description="이동할 수 없는 항목과 전체 비활성입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>items[].disabled</b> : 해당 항목 선택 불가</li>
                        <li><b>disabled</b> : 전체 비활성</li>
                    </ul>

                    <AppTransfer :model-value="['W002']" :items="workers" disabled :height="180" />
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
const { title, description } = useDemoI18n('transfer');
// ---------- temp data ----------
type Value = string | number | boolean | null;
const workers = [
    { value: 'W001', label: '김민수', description: '사출 / 주간' },
    { value: 'W002', label: '이서연', description: '검사 / 주간' },
    { value: 'W003', label: '박지훈', description: '가공 / 야간' },
    { value: 'W004', label: '최유진', description: '포장 / 주간' },
    { value: 'W005', label: '정우성', description: '설비보전 (이동 불가)', disabled: true },
    { value: 'W006', label: '한지민', description: '가공 / 주간' },
];
const assigned = ref<Value[]>(['W002']);
const assigned2 = ref<Value[]>([]);
const assigned3 = ref<Value[]>(['W001', 'W004']);
</script>
