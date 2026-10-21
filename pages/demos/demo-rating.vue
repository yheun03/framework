<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- v-model -->
                <PageDemoSection
                    class="page-demo-section"
                    title="v-model"
                    description="점수를 입력합니다. 입력 모드의 별은 AppButton(unstyled) 이며 마우스를 올리면 미리보기됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>v-model</b> : 점수 (number)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppRating v-model="score" size="xl" show-value />
                    </div>
                    <p class="page-demo-output">v-model: {{ score }}</p>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="Figma 평점 5단계 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>xl</b> : 24px</li>
                        <li><b>lg</b> : 20px</li>
                        <li><b>md</b> : 16px (기본값)</li>
                        <li><b>sm</b> : 12px</li>
                        <li><b>xs</b> : 10px</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppRating v-for="size in ['xl', 'lg', 'md', 'sm', 'xs']" :key="size" :model-value="4" :size="size" readonly show-value />
                    </div>
                </PageDemoSection>

                <!-- Max -->
                <PageDemoSection class="page-demo-section" title="Max" description="별 개수입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>max</b> : 기본값 5</li>
                    </ul>

                    <AppRating v-model="score10" :max="10" size="lg" show-value />
                </PageDemoSection>

                <!-- Readonly -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Readonly"
                    description="표시 전용입니다. 4.5, 3.7 처럼 소수점 부분 채움을 지원합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>readonly</b> : 표시 전용</li>
                    </ul>

                    <div class="page-demo-stack">
                        <div v-for="review in reviews" :key="review.name" class="page-demo-row">
                            <strong class="demo-rating-name">{{ review.name }}</strong>
                            <AppRating :model-value="review.score" readonly show-value :count="review.count" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- ShowValue / Count -->
                <PageDemoSection class="page-demo-section" title="ShowValue / Count" description="숫자 점수와 리뷰 수를 함께 표시합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>showValue</b> : 숫자 점수 노출</li>
                        <li><b>count</b> : 리뷰 수 (괄호로 표시)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppRating :model-value="4" readonly show-value />
                        <AppRating :model-value="4" readonly show-value :count="299" size="sm" />
                    </div>
                </PageDemoSection>

                <!-- Disabled -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="입력 불가 상태입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>disabled</b> : 클릭 불가</li>
                    </ul>

                    <AppRating :model-value="3" disabled size="lg" />
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
const { title, description } = useDemoI18n('rating');
const score = ref(3);
const score10 = ref(7);

// temp data
const reviews = [
    { name: '협력사 A', score: 4.5, count: 128 },
    { name: '협력사 B', score: 3.7, count: 42 },
    { name: '협력사 C', score: 2.2, count: 9 },
];
</script>

<style scoped lang="scss">
.demo-rating-name {
    width: 100px;
}
</style>
