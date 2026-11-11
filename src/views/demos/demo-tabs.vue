<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <div class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- BASIC -->
                <PageDemoSection class="page-demo-section" title="Basic" description="기본적인 line 탭 예시입니다.">
                    <AppTabs :items="basicItems" variant="line">
                        <template #basicInfo>
                            <div class="page-demo-stack">
                                <p>기본 탭 콘텐츠입니다.</p>
                                <AppInput model-value="sample text" placeholder="입력하세요." aria-label="입력하세요." />
                            </div>
                        </template>

                        <template #basicSelect>
                            <AppSelect
                                :model-value="null"
                                :items="[
                                    { label: '옵션 A', value: 'a' },
                                    { label: '옵션 B', value: 'b' },
                                ]"
                                placeholder="선택하세요."
                                aria-label="선택하세요."
                            />
                        </template>

                        <template #basicButton>
                            <AppButton variant="fill">확인</AppButton>
                        </template>
                    </AppTabs>
                </PageDemoSection>

                <!-- VARIANT -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Variant"
                    description="Figma 탭 스타일 - line(언더바) / fill(면) / outline(라인) / text(텍스트 언더라인) / divider(텍스트 구분자) / box(폴더형, MES 확장)"
                >
                    <div class="page-demo-stack">
                        <template v-for="variant in ['line', 'fill', 'outline', 'text', 'divider', 'box']" :key="variant">
                            <div class="page-demo-hint">variant = "{{ variant }}"</div>
                            <AppTabs
                                v-model="figmaTab"
                                :items="figmaTabs"
                                :variant="variant"
                                :stretch="['line', 'fill', 'outline'].includes(variant)"
                            />
                        </template>
                        <p class="page-demo-output">v-model: {{ figmaTab }}</p>
                    </div>
                </PageDemoSection>

                <!-- LAYOUT -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Layout"
                    description="fill · outline 의 배치 - group(붙은 기본형) / button(떨어진 버튼형) / grid(2단 버튼형, columns 로 한 줄 칸 수)"
                >
                    <div class="page-demo-stack">
                        <template v-for="variant in ['fill', 'outline']" :key="variant">
                            <div class="page-demo-hint">variant = "{{ variant }}" layout = "group" stretch</div>
                            <AppTabs v-model="figmaTab" :items="figmaTabs" :variant="variant" layout="group" stretch />
                            <div class="page-demo-hint">variant = "{{ variant }}" layout = "button"</div>
                            <AppTabs v-model="figmaTab" :items="figmaTabs" :variant="variant" layout="button" />
                            <div class="page-demo-hint">variant = "{{ variant }}" layout = "grid" :columns="6"</div>
                            <AppTabs
                                v-model="figmaTab"
                                :items="[...figmaTabs.slice(0, 6), ...extraTabs]"
                                :variant="variant"
                                layout="grid"
                                :columns="6"
                            />
                        </template>
                    </div>
                </PageDemoSection>

                <!-- SHAPE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Shape"
                    description="fill · outline 의 모서리 - square(직각, 기본값) / round(라운드) / pill(써클). AppButton 과 같은 이름입니다."
                >
                    <div class="page-demo-stack">
                        <template v-for="shape in ['square', 'round', 'pill']" :key="shape">
                            <div class="page-demo-hint">shape = "{{ shape }}"</div>
                            <AppTabs v-model="figmaTab" :items="figmaTabs" variant="fill" :shape="shape" stretch />
                            <AppTabs v-model="figmaTab" :items="figmaTabs" variant="outline" layout="button" :shape="shape" />
                        </template>
                    </div>
                </PageDemoSection>

                <!-- SIZE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Size"
                    description="높이 sm 36 · md 44 (기본값) · lg 48 · xl 56 - AppButton · AppInput 과 같은 이름 = 같은 높이. text · divider 는 글자 크기 14 · 16 · 18 · 20"
                >
                    <div class="page-demo-stack">
                        <template v-for="size in ['sm', 'md', 'lg', 'xl']" :key="size">
                            <div class="page-demo-hint">size = "{{ size }}"</div>
                            <AppTabs v-model="figmaTab" :items="figmaTabs" variant="fill" shape="round" :size="size" stretch />
                        </template>
                        <template v-for="size in ['md', 'xl']" :key="`text-${size}`">
                            <div class="page-demo-hint">variant = "text" / "divider" size = "{{ size }}"</div>
                            <AppTabs v-model="figmaTab" :items="figmaTabs" variant="text" :size="size" />
                            <AppTabs v-model="figmaTab" :items="figmaTabs" variant="divider" :size="size" />
                        </template>
                    </div>
                </PageDemoSection>

                <!-- STRETCH -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Stretch (타이틀형)"
                    description="stretch 는 탭 너비를 균등하게 나눕니다. 타이틀형 A타입 = stretch, B타입 = 기본(글자 너비)"
                >
                    <div class="page-demo-stack">
                        <div class="page-demo-hint">variant = "line" stretch (A타입)</div>
                        <AppTabs :items="titleTabs" variant="line" size="xl" stretch />
                        <div class="page-demo-hint">variant = "line" (B타입)</div>
                        <AppTabs :items="titleTabs.slice(0, 2)" variant="line" size="xl" />
                    </div>
                </PageDemoSection>

                <!-- DIRECTION -->
                <PageDemoSection class="page-demo-section" title="Direction" description='direction="vertical" 은 탭을 왼쪽 세로로 배치합니다.'>
                    <AppTabs :items="verticalItems" variant="line" direction="vertical">
                        <template #overview>Overview Content</template>
                        <template #members>Members Content</template>
                        <template #settings>Settings Content</template>
                    </AppTabs>
                </PageDemoSection>

                <!-- DEFAULT ACTIVE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="v-model"
                    description="v-model(활성 탭 id)로 특정 탭을 활성화하고 현재 탭을 확인합니다."
                >
                    <AppTabs :items="defaultItems" variant="line" v-model="defaultTab">
                        <template #default1>Default Content 1</template>
                        <template #default2>Default Content 2</template>
                        <template #default3>Default Content 3</template>
                    </AppTabs>
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="disabled 탭은 선택할 수 없습니다.">
                    <AppTabs :items="disabledItems" variant="box">
                        <template #active1>Active Content</template>
                        <template #disabled>Disabled Content</template>
                        <template #active2>Active Content 2</template>
                    </AppTabs>
                </PageDemoSection>

                <!-- SLOT -->
                <PageDemoSection class="page-demo-section" title="Slot" description="탭 본문을 슬롯으로 연결합니다. item.badge 로 건수를 표시합니다.">
                    <AppTabs :items="slotItems" variant="line">
                        <template #progress>
                            <div class="page-demo-stack">
                                <p>이 콘텐츠는 슬롯으로 렌더링됩니다.</p>
                                <AppProgress :value="65" variant="linear" />
                            </div>
                        </template>

                        <template #actions>
                            <div class="page-demo-stack">
                                <div>
                                    <strong>액션 영역</strong>
                                    <p>탭 안에 버튼을 직접 배치한 예시입니다.</p>
                                </div>

                                <div class="page-demo-actions">
                                    <AppButton variant="fill">새로고침</AppButton>
                                    <AppButton variant="outline">상세 보기</AppButton>
                                </div>
                            </div>
                        </template>

                        <template #custom="{ item }">
                            <div class="page-demo-stack">
                                <p>{{ item.title }} 슬롯 콘텐츠입니다.</p>
                                <AppButton variant="fill"> Slot Button </AppButton>
                            </div>
                        </template>
                    </AppTabs>
                </PageDemoSection>
            </div>

            <aside class="page-demo-aside" aria-label="컴포넌트 속성 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
const figmaTab = ref('all');
const figmaTabs = ['전체', '1라인', '2라인', '3라인', '4라인', '포장', '검사', '출하', '설비', '자재'].map((title, index) => ({
    id: index === 0 ? 'all' : `t${index}`,
    title,
}));
const extraTabs = ['원자재', '반제품', '완제품', '부자재', '소모품'].map((title, index) => ({ id: `e${index}`, title }));
const titleTabs = ['상세정보', '작업이력 (100)', '불량이력 (12)', '설비정보', '첨부파일'].map((title, index) => ({ id: `title-${index}`, title }));
const defaultTab = ref('default-2');

import { IconAccountGroup, IconCog, IconDashboard, IconForm, IconInfo, IconTap } from '@/components/icons';
import { ref } from 'vue';
import { useDemoI18n } from '@/composables/useI18nText';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import AppProgress from '@/components/AppProgress/AppProgress.vue';
import AppSelect from '@/components/AppSelect.vue';
import AppTabs from '@/components/AppTabs.vue';
import PageDemoPropsSummary from '@/components/PageDemo/content/PageDemoPropsSummary.vue';
import PageDemoSection from '@/components/PageDemoSection.vue';

const { title, description } = useDemoI18n('tabs');

const basicItems = [
    {
        id: 'basic-1',
        title: '기본 정보',
        description: '텍스트와 입력 필드',
        icon: IconInfo,
        slot: 'basicInfo',
    },
    {
        id: 'basic-2',
        title: '선택 영역',
        description: '셀렉트 컴포넌트',
        icon: IconForm,
        slot: 'basicSelect',
    },
    {
        id: 'basic-3',
        title: '버튼 영역',
        description: '버튼 예시',
        icon: IconTap,
        slot: 'basicButton',
    },
];

const defaultItems = [
    {
        id: 'default-1',
        title: 'Default 1',
        slot: 'default1',
    },
    {
        id: 'default-2',
        title: 'Default 2',
        slot: 'default2',
    },
    {
        id: 'default-3',
        title: 'Default 3',
        slot: 'default3',
    },
];

const disabledItems = [
    {
        id: 'disabled-1',
        title: '활성 탭',
        description: '선택할 수 있습니다.',
        slot: 'active1',
    },
    {
        id: 'disabled-2',
        title: '비활성 탭',
        description: 'disabled 상태',
        disabled: true,
        slot: 'disabled',
    },
    {
        id: 'disabled-3',
        title: '활성 탭 2',
        description: '선택할 수 있습니다.',
        slot: 'active2',
    },
];

const verticalItems = [
    {
        id: 'vertical-1',
        title: 'Overview',
        description: '요약 정보',
        icon: IconDashboard,
        slot: 'overview',
    },
    {
        id: 'vertical-2',
        title: 'Members',
        description: '구성원 정보',
        icon: IconAccountGroup,
        slot: 'members',
    },
    {
        id: 'vertical-3',
        title: 'Settings',
        description: '설정 정보',
        icon: IconCog,
        slot: 'settings',
    },
];

const slotItems = [
    {
        id: 'slot-1',
        title: '진행 상태',
        badge: 3,
        description: 'slot으로 내용 연결',
        slot: 'progress',
    },
    {
        id: 'slot-2',
        title: '액션',
        description: '버튼 직접 배치',
        slot: 'actions',
    },
    {
        id: 'slot-3',
        title: 'slot 방식',
        description: 'slot name으로 내용 연결',
        slot: 'custom',
    },
];
</script>
