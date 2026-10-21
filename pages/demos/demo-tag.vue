<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- Variant -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Variant"
                    description="태그의 스타일을 정합니다. Figma 셀링아이콘은 outline(라인) / fill(면) 2가지입니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>default</b> : 흰 바탕 + 회색 라인 + 검정 글자 (선택 태그)</li>
                        <li><b>outline</b> : tone 색상 라인 (기본값)</li>
                        <li><b>soft</b> : tone 색상 연한 면 - MES 상태 배지</li>
                        <li><b>fill</b> : tone 색상 진한 면</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag variant="default" label="default" />
                        <AppTag variant="outline" tone="primary" label="outline" />
                        <AppTag variant="soft" tone="primary" label="soft" />
                        <AppTag variant="fill" tone="primary" label="fill" />
                    </div>
                </PageDemoSection>

                <!-- Tone -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Tone"
                    description="색상 의미를 정합니다. 공통 tone 7종 + Figma 셀링아이콘 색상 7종을 지원합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>공통</b> : primary / secondary / gray / danger / warning / success / info</li>
                        <li><b>셀링아이콘</b> : black / red / orange / green / blue / navy / purple</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag v-for="tone in commonTones" :key="tone" variant="soft" :tone="tone" :label="tone" />
                    </div>
                    <div v-for="variant in ['outline', 'fill']" :key="variant" class="page-demo-row">
                        <AppTag v-for="item in sellingItems" :key="item.label" :variant="variant" :tone="item.tone" :label="item.label" />
                    </div>
                </PageDemoSection>

                <!-- Size -->
                <PageDemoSection class="page-demo-section" title="Size" description="태그 높이를 정합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>xs</b> : 18px</li>
                        <li><b>sm</b> : 22px (기본값, Figma 셀링아이콘)</li>
                        <li><b>md</b> : 28px (선택 태그)</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag v-for="size in ['xs', 'sm', 'md']" :key="size" :size="size" tone="navy" :label="`size ${size}`" />
                    </div>
                </PageDemoSection>

                <!-- Shape -->
                <PageDemoSection class="page-demo-section" title="Shape" description="모서리 형태를 정합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>square</b> : 각진 모서리 (기본값)</li>
                        <li><b>round</b> : 4px 라운드</li>
                        <li><b>pill</b> : 완전 라운드</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag v-for="shape in ['square', 'round', 'pill']" :key="shape" :shape="shape" variant="soft" tone="info" :label="shape" />
                    </div>
                </PageDemoSection>

                <!-- Dot / Icon -->
                <PageDemoSection class="page-demo-section" title="Dot / Icon" description="상태 점(dot) 또는 아이콘 슬롯(#icon)을 앞에 붙입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>dot</b> : 앞쪽 상태 점 - 설비/작업 상태 배지</li>
                        <li><b>#icon</b> : 아이콘 슬롯</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag
                            v-for="status in statusItems"
                            :key="status.label"
                            variant="soft"
                            shape="round"
                            dot
                            :tone="status.tone"
                            :label="status.label"
                        />
                        <AppTag variant="outline" tone="warning" label="알람">
                            <template #icon><IconBell /></template>
                        </AppTag>
                    </div>
                </PageDemoSection>

                <!-- Closable -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Closable"
                    description="삭제(X) 버튼을 노출합니다. X 버튼은 AppIconButton 이며 close 이벤트가 발생합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>closable</b> : 삭제 버튼 노출</li>
                        <li><b>@close</b> : 삭제 버튼 클릭</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag v-for="tag in selectedTags" :key="tag" variant="default" size="md" closable :label="tag" @close="removeTag(tag)" />
                        <AppTextButton v-if="selectedTags.length < initialTags.length" size="sm" @click="resetTags">다시 채우기</AppTextButton>
                    </div>
                </PageDemoSection>

                <!-- Clickable / Active -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Clickable / Active"
                    description="필터 칩처럼 클릭해서 선택합니다. AppButton(unstyled) 으로 렌더링됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>clickable</b> : 클릭 가능 - click 이벤트</li>
                        <li><b>active</b> : 선택 상태</li>
                        <li><b>disabled</b> : 클릭 불가</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppTag
                            v-for="filter in filters"
                            :key="filter"
                            clickable
                            size="md"
                            shape="pill"
                            tone="primary"
                            :active="activeFilter === filter"
                            :label="filter"
                            @click="activeFilter = filter"
                        />
                        <AppTag clickable disabled size="md" shape="pill" label="disabled" />
                    </div>
                    <p class="page-demo-output">activeFilter: {{ activeFilter }}</p>
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

const { title, description } = useDemoI18n('tag');

// temp data
const commonTones = ['primary', 'secondary', 'gray', 'danger', 'warning', 'success', 'info'] as const;
const sellingItems = [
    { label: '이벤트', tone: 'red' },
    { label: '베스트', tone: 'black' },
    { label: '재구매', tone: 'blue' },
    { label: '한달사용기', tone: 'purple' },
    { label: '사은품', tone: 'green' },
    { label: '특가세일', tone: 'orange' },
    { label: '공식브랜드관', tone: 'navy' },
] as const;
const statusItems = [
    { label: '가동', tone: 'success' },
    { label: '대기', tone: 'warning' },
    { label: '정지', tone: 'danger' },
    { label: '점검', tone: 'info' },
] as const;

const initialTags = ['선택 태그', '1라인', '야간조', '긴급'];
const selectedTags = ref([...initialTags]);
const removeTag = (tag: string) => (selectedTags.value = selectedTags.value.filter((item) => item !== tag));
const resetTags = () => (selectedTags.value = [...initialTags]);

const filters = ['전체', '진행중', '완료', '보류'];
const activeFilter = ref('전체');
</script>
