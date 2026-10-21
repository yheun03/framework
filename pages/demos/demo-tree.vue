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
                    description="BOM·공정·메뉴 트리입니다. 펼침 버튼은 AppIconButton 입니다. 행을 클릭하면 선택(v-model)되고 select 이벤트가 발생합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>items</b> : { id, label, children, icon, tag, tagTone, disabled } 배열</li>
                        <li><b>v-model</b> : 선택된 id</li>
                        <li><b>@select</b> : 선택된 항목</li>
                    </ul>

                    <AppTree v-model="selectedId" :items="bom" initial="all" @select="(item) => (selectedLabel = item.label)" />
                    <p class="page-demo-output">v-model: {{ selectedId }} {{ selectedLabel }}</p>
                </PageDemoSection>

                <!-- Initial -->
                <PageDemoSection class="page-demo-section" title="Initial" description="최초 펼침 상태입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>none</b> : 모두 접힘</li>
                        <li><b>first</b> : 1단계만 펼침 (기본값)</li>
                        <li><b>all</b> : 모두 펼침</li>
                    </ul>

                    <div class="demo-tree-grid">
                        <div v-for="initial in ['none', 'first', 'all']" :key="initial" class="page-demo-stack">
                            <p class="page-demo-hint">initial = "{{ initial }}"</p>
                            <AppTree :items="bom" :initial="initial" size="sm" />
                        </div>
                    </div>
                </PageDemoSection>

                <!-- Filter -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Filter"
                    description="검색어와 일치하는 항목과 상위 경로만 보여주고 일치 부분을 강조합니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>filter</b> : 검색어 (string)</li>
                        <li><b>emptyText</b> : 결과 없음 문구</li>
                    </ul>

                    <div class="page-demo-stack">
                        <AppInput v-model="keyword" size="xs" placeholder="품목 검색 (예: 볼트, S45C)" clearable :width="320">
                            <template #iconLeft><IconSearch /></template>
                        </AppInput>
                        <AppTree :items="bom" :filter="keyword" />
                    </div>
                </PageDemoSection>

                <!-- Checkable / v-model:checked -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Checkable / v-model:checked"
                    description="체크박스(AppChoice) 트리입니다. 상위를 체크하면 하위가 모두 체크되고, 일부만 체크되면 부분 체크로 표시됩니다."
                >
                    <ul class="page-demo-hint-list">
                        <li><b>checkable</b> : 체크박스 노출</li>
                        <li><b>v-model:checked</b> : 체크된 id 배열</li>
                    </ul>

                    <AppTree v-model:checked="checkedIds" :items="menus" checkable initial="all" />
                    <p class="page-demo-output">checked: {{ checkedIds }}</p>
                </PageDemoSection>

                <!-- Guide / Size -->
                <PageDemoSection class="page-demo-section" title="Guide / Size" description="들여쓰기 가이드 라인과 크기입니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>guide</b> : 가이드 라인 (기본값 true)</li>
                        <li><b>size</b> : sm(28px) / md(34px, 기본값)</li>
                    </ul>

                    <div class="demo-tree-grid">
                        <AppTree :items="bom" initial="all" :guide="false" />
                        <AppTree :items="bom" initial="all" size="sm" />
                    </div>
                </PageDemoSection>

                <!-- expandAll() / collapseAll() -->
                <PageDemoSection class="page-demo-section" title="expandAll() / collapseAll()" description="ref 로 전체 펼치기/접기를 호출합니다.">
                    <ul class="page-demo-hint-list">
                        <li><b>expandAll()</b> : 모두 펼치기</li>
                        <li><b>collapseAll()</b> : 모두 접기</li>
                    </ul>

                    <div class="page-demo-row">
                        <AppButton size="sm" @click="treeRef?.expandAll()">모두 펼치기</AppButton>
                        <AppButton size="sm" @click="treeRef?.collapseAll()">모두 접기</AppButton>
                    </div>
                    <AppTree ref="treeRef" :items="bom" initial="none" />
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
import { IconSearch } from '~/components/icons';
import type { AppTreeItem } from '~/types/appTree';

const { title, description } = useDemoI18n('tree');
const treeRef = ref<{ expandAll: () => void; collapseAll: () => void } | null>(null);
const keyword = ref('');
const selectedId = ref<string | number | null>('SF-030');
const selectedLabel = ref('');
const checkedIds = ref<Array<string | number>>(['m-11']);

// ---------- temp data ----------
const bom: AppTreeItem[] = [
    {
        id: 'GS-410',
        label: '기어 세트 (GS-410)',
        tag: '완제품',
        tagTone: 'primary',
        children: [
            {
                id: 'HC-220',
                label: '하우징 커버 (HC-220)',
                tag: '반제품',
                children: [
                    { id: 'RM-AL6061', label: '알루미늄 판재 AL6061', tag: '원자재', tagTone: 'warning' },
                    { id: 'BT-M8', label: '볼트 M8 x 20', tag: '부자재' },
                ],
            },
            {
                id: 'SF-030',
                label: '샤프트 (SF-030)',
                tag: '반제품',
                children: [{ id: 'RM-S45C', label: '환봉 S45C Ø30', tag: '원자재', tagTone: 'warning' }],
            },
            { id: 'BR-6204', label: '베어링 6204ZZ', tag: '구매품', disabled: true },
        ],
    },
];

const menus: AppTreeItem[] = [
    {
        id: 'm-1',
        label: '생산관리',
        children: [
            { id: 'm-11', label: '작업지시' },
            { id: 'm-12', label: '작업실적' },
            { id: 'm-13', label: '생산계획' },
        ],
    },
    {
        id: 'm-2',
        label: '품질관리',
        children: [
            { id: 'm-21', label: '수입검사' },
            { id: 'm-22', label: '공정검사' },
        ],
    },
];
</script>

<style scoped lang="scss">
.demo-tree-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
}
</style>
