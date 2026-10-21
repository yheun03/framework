<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Items -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Items"
                    description="화면 경로입니다. to 가 있는 항목은 AppTextButton 링크로, 마지막 항목은 현재 페이지로 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { label, to } 배열</li>
                    </ul>

                    <AppBreadcrumb :items="items" />
                </PageDemoSection>

                <!-- Separator -->
                <PageDemoSection class="page-demo-section" title="Separator" description="구분자입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>''</b> : > 아이콘 (기본값)</li>
                        <li><b>'/'</b> : 문자 구분자</li>
                    </ul>

                    <AppBreadcrumb :items="items" separator="/" />
                </PageDemoSection>

                <!-- HomeIcon -->
                <PageDemoSection class="page-demo-section" title="HomeIcon" description="첫 항목 앞 홈 아이콘입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>homeIcon</b> : 기본값 true</li>
                    </ul>

                    <AppBreadcrumb :items="items" :home-icon="false" />
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="글자 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 12px</li>
                        <li><b>md</b> : 13px (기본값)</li>
                    </ul>

                    <AppBreadcrumb :items="items" size="sm" />
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
const { title, description } = useDemoI18n('breadcrumb');
// ---------- temp data ----------
const items = [
    { label: '홈', to: '/' },
    { label: '생산관리', to: '/work-orders' },
    { label: '작업지시', to: '/work-orders' },
    { label: '작업지시 상세' },
];
</script>
