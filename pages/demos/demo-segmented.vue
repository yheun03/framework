<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Items / v-model -->
                <PageDemoSection class="page-demo-section" title="Items / v-model" description="보기 전환·기간 단위 선택입니다. 각 항목은 AppButton(unstyled) 입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { value, label, disabled } 배열</li>
                        <li><b>v-model</b> : 선택 값</li>
                        <li><b>@change</b> : 값 변경</li>
                    </ul>

                    <AppSegmented v-model="period" :items="periods" />
                    <p class="page-demo-output">v-model: {{ period }}</p>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="높이입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 26px</li>
                        <li><b>md</b> : 32px (기본값)</li>
                        <li><b>lg</b> : 40px</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppSegmented v-for="size in ['sm', 'md', 'lg']" :key="size" v-model="period" :items="periods" :size="size" />
                    </div>
                </PageDemoSection>

                <!-- Width -->
                <PageDemoSection class="page-demo-section" title="Width" description="공통 가로 속성입니다. full 이면 항목이 균등 분할됩니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>width</b> : number(px) | '50%' | 'full'</li>
                    </ul>

                    <AppSegmented v-model="view" :items="views" width="full" />
                </PageDemoSection>

                <!-- Disabled -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="전체 또는 개별 항목 비활성입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>disabled</b> : 전체 비활성</li>
                        <li><b>items[].disabled</b> : 개별 항목 비활성 (예: 년)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppSegmented v-model="period" :items="periods" disabled />
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
const { title, description } = useDemoI18n('segmented');
// ---------- temp data ----------
const periods = [
    { value: 'day', label: '일' },
    { value: 'week', label: '주' },
    { value: 'month', label: '월' },
    { value: 'year', label: '년', disabled: true },
];
const views = [
    { value: 'all', label: '전체 (24)' },
    { value: 'run', label: '가동 (18)' },
    { value: 'stop', label: '정지 (2)' },
];
const period = ref<string | number | boolean | null>('week');
const view = ref<string | number | boolean | null>('all');
</script>
