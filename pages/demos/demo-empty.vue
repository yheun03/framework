<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Type -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Type"
                    description="상황별 기본 아이콘과 문구입니다. Figma No search result 기반입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>data</b> : 조회된 데이터 없음 (기본값)</li>
                        <li><b>search</b> : 검색 결과 없음</li>
                        <li><b>error</b> : 불러오기 실패</li>
                        <li><b>maintenance</b> : 시스템 정기 점검</li>
                    </ul>

                    <div class="demo-empty-grid">
                        <AppEmpty v-for="type in ['data', 'search', 'error', 'maintenance']" :key="type" :type="type" size="sm" />
                    </div>
                </PageDemoSection>

                <!-- Title / Description -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Title / Description"
                    description="문구를 직접 지정합니다. 줄바꿈(\n)이 그대로 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>title</b> : 제목 (#title 슬롯 가능)</li>
                        <li><b>description</b> : 설명 (#description 슬롯 가능)</li>
                    </ul>

                    <AppEmpty
                        type="search"
                        title="'볼트 M8'에 대한 검색 결과가 없습니다."
                        :description="'단어의 철자가 정확한지 확인해 주세요.\n검색어의 단어 수를 줄이거나 다른 검색어로 검색해 보세요.'"
                    />
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="여백과 글자 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>sm</b> : 테이블·카드 안</li>
                        <li><b>md</b> : 기본값</li>
                        <li><b>lg</b> : 전체 화면 (점검 페이지 등)</li>
                    </ul>

                    <div class="demo-empty-grid">
                        <AppEmpty v-for="size in ['sm', 'md', 'lg']" :key="size" :size="size" :title="`size ${size}`" />
                    </div>
                </PageDemoSection>

                <!-- ShowIcon -->
                <PageDemoSection class="page-demo-section" title="ShowIcon" description="아이콘 노출 여부입니다. (Figma 아이콘 포함 / 없는 타입)">
                    <ul class="page-demo-hint-list">
                        <li><b>showIcon</b> : 기본값 true</li>
                        <li><b>#icon</b> : 아이콘 교체 슬롯</li>
                    </ul>

                    <div class="demo-empty-grid">
                        <AppEmpty :show-icon="false" title="아이콘 없는 타입" />
                        <AppEmpty title="아이콘 교체">
                            <template #icon><IconBell /></template>
                        </AppEmpty>
                    </div>
                </PageDemoSection>

                <!-- #actions -->
                <PageDemoSection class="page-demo-section" title="#actions" description="버튼 영역 슬롯입니다. (Figma 버튼 있는 타입)">
                    <ul class="page-demo-hint-list">
                        <li><b>#actions</b> : AppButton 배치</li>
                    </ul>

                    <AppEmpty type="data" description="조회 조건을 변경해 다시 조회해 주세요.">
                        <template #actions>
                            <AppButton size="sm">이전</AppButton>
                            <AppButton size="sm" variant="fill" tone="primary">신규 등록</AppButton>
                        </template>
                    </AppEmpty>
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
import { IconBell } from '~/components/icons';
const { title, description } = useDemoI18n('empty');
</script>

<style scoped lang="scss">
.demo-empty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;

    > * {
        border: 1px solid var(--border-search-panel);
        border-radius: 8px;
    }
}
</style>
