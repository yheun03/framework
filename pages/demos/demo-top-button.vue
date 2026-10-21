<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Variant -->
                <PageDemoSection class="page-demo-section" title="Variant" description="Figma 탑 버튼 스타일입니다. AppButton(unstyled) 기반입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>outline</b> : 흰 바탕 + 라인 (기본값)</li>
                        <li><b>fill</b> : 검정 면</li>
                        <li><b>shadow</b> : 흰 바탕 + 그림자</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTopButton v-for="variant in ['outline', 'fill', 'shadow']" :key="variant" :variant="variant" :fixed="false" />
                    </div>
                </PageDemoSection>

                <!-- Shape -->
                <PageDemoSection class="page-demo-section" title="Shape" description="버튼 모양입니다. (사이즈는 Figma 기준 1종 48px)">
                    <ul class="page-demo-hint-list">
                        <li><b>square</b> : 사각 (기본값)</li>
                        <li><b>round</b> : 6px 라운드</li>
                        <li><b>circle</b> : 원형</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTopButton v-for="shape in ['square', 'round', 'circle']" :key="shape" :shape="shape" variant="fill" :fixed="false" />
                    </div>
                </PageDemoSection>

                <!-- Icon -->
                <PageDemoSection class="page-demo-section" title="Icon" description="아이콘 종류입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>chevron</b> : 꺾쇠 (기본값)</li>
                        <li><b>arrow</b> : 화살표</li>
                        <li><b>bar</b> : 맨 위 막대 화살표</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTopButton v-for="icon in ['chevron', 'arrow', 'bar']" :key="icon" :icon="icon" :fixed="false" />
                    </div>
                </PageDemoSection>

                <!-- Label -->
                <PageDemoSection class="page-demo-section" title="Label" description="아이콘 아래 텍스트입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>label</b> : 예: TOP</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTopButton label="TOP" :fixed="false" />
                        <AppTopButton label="TOP" variant="shadow" shape="circle" icon="arrow" :fixed="false" />
                    </div>
                </PageDemoSection>

                <!-- Fixed / Threshold / Position -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Fixed / Threshold / Position"
                    description="화면 우하단 고정과 노출 조건입니다. 이 페이지 우하단에 실제 고정 버튼이 있습니다(200px 스크롤 후 노출)."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>fixed</b> : 화면 고정 (기본값 true)</li>
                        <li><b>threshold</b> : 노출 시작 스크롤 위치(px), 0 이면 항상 노출 (기본값 200)</li>
                        <li><b>right / bottom</b> : 고정 위치 (기본값 24)</li>
                        <li><b>target</b> : 스크롤 대상 선택자 (기본: 레이아웃 콘텐츠 → window)</li>
                    </ul>

                    <div class="demo-scroll-space">아래로 스크롤해 보세요 ↓</div>
                </PageDemoSection>
            </main>
            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>

        <AppTopButton variant="shadow" shape="circle" icon="arrow" label="TOP" />
    </div>
</template>

<script setup lang="ts">
const { title, description } = useDemoI18n('topButton');
</script>

<style scoped lang="scss">
.demo-scroll-space {
    display: grid;
    place-items: center;
    height: 900px;
    border: 1px dashed var(--border-search-panel);
    color: var(--color-steps-desc);
}
</style>
