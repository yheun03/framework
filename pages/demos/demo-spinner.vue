<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="스피너 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>xs</b> : 12px</li>
                        <li><b>sm</b> : 16px</li>
                        <li><b>md</b> : 24px (기본값)</li>
                        <li><b>lg</b> : 32px</li>
                        <li><b>xl</b> : 48px</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppSpinner v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" />
                    </div>
                </PageDemoSection>

                <!-- Tone -->
                <PageDemoSection class="page-demo-section" title="Tone" description="색상입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>tone</b> : primary (기본값) / secondary / gray / danger / warning / success / info</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppSpinner v-for="tone in ['primary', 'success', 'warning', 'danger', 'gray']" :key="tone" :tone="tone" />
                    </div>
                </PageDemoSection>

                <!-- Label -->
                <PageDemoSection class="page-demo-section" title="Label" description="옆(또는 아래)에 표시할 문구입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>label</b> : string</li>
                    </ul>

                    <AppSpinner label="불러오는 중..." />
                </PageDemoSection>

                <!-- Overlay -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Overlay"
                    description="부모 영역(position: relative)을 덮는 로딩입니다. 그리드·카드 조회 중에 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>overlay</b> : 부모 영역 덮기</li>
                    </ul>

                    <div class="demo-overlay-box">
                        <AppButton size="sm" @click="loading = !loading">overlay 토글</AppButton>
                        <AppDataTable :columns="columns" :items="rows" size="sm" />
                        <AppSpinner v-if="loading" overlay size="lg" label="조회 중입니다" />
                    </div>
                </PageDemoSection>

                <!-- Fullscreen -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Fullscreen"
                    description="화면 전체를 덮는 로딩입니다. 저장·마감 처리 중에 사용합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>fullscreen</b> : overlay 와 함께 사용</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" variant="outline" @click="showFullscreen">1.5초 동안 보기</AppButton>
                    </div>
                    <AppSpinner v-if="fullscreen" overlay fullscreen size="xl" label="처리 중..." />
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
const { title, description } = useDemoI18n('spinner');
const loading = ref(true);
const fullscreen = ref(false);

// ---------- temp data ----------
const columns = [
    { key: 'code', label: '설비코드' },
    { key: 'name', label: '설비명', align: 'left' as const },
];
const rows = [
    { id: 1, code: 'EQ-0101', name: '사출기 #1' },
    { id: 2, code: 'EQ-0102', name: '사출기 #2' },
    { id: 3, code: 'EQ-0201', name: 'CNC 선반 #1' },
];

function showFullscreen() {
    fullscreen.value = true;
    setTimeout(() => (fullscreen.value = false), 1500);
}
</script>

<style scoped lang="scss">
.demo-overlay-box {
    position: relative;
    display: grid;
    gap: 8px;
    justify-items: start;
    padding: 16px;
    border: 1px dashed var(--border-search-panel);
    border-radius: 8px;

    .app-data-table {
        width: 100%;
    }
}
</style>
