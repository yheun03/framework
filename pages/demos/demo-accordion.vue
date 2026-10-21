<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- CONTENT -->
                <PageDemoSection class="page-demo-section" title="Content" description="아코디언 안에 입력, 선택, 버튼 컴포넌트를 배치한 예시입니다.">
                    <AppAccordion :items="basicItems" initial="none">
                        <template #basicInfo>
                            <div class="page-demo-stack">
                                <p>기본 아코디언 콘텐츠입니다.</p>
                                <AppInput model-value="sample text" placeholder="입력하세요." />
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
                            />
                        </template>

                        <template #basicButton>
                            <AppButton variant="fill">확인</AppButton>
                        </template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- TYPE -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Multiple"
                    description=':multiple="false" 는 한 개만, 기본값(true)은 여러 개를 동시에 열 수 있습니다.'
                >
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">:multiple="false"</div>

                            <AppAccordion :items="typeItems" :multiple="false" initial="first">
                                <template #panel1>Panel 1 Content</template>
                                <template #panel2>Panel 2 Content</template>
                                <template #panel3>Panel 3 Content</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">multiple (기본값)</div>

                            <AppAccordion :items="typeItems" initial="none">
                                <template #panel1>Panel 1 Content</template>
                                <template #panel2>Panel 2 Content</template>
                                <template #panel3>Panel 3 Content</template>
                            </AppAccordion>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- INITIAL OPEN -->
                <PageDemoSection
                    class="page-demo-section"
                    title="Initial Open"
                    description="페이지 최초 진입 시 none / first / all 상태를 확인할 수 있습니다."
                >
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initial = "none"</div>

                            <AppAccordion :items="initialItems" initial="none">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initial = "first"</div>

                            <AppAccordion :items="initialItems" initial="first">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initial = "all"</div>

                            <AppAccordion :items="initialItems" initial="all">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- DEFAULT OPEN IDS -->
                <PageDemoSection
                    class="page-demo-section"
                    title="v-model"
                    description="v-model(열린 id 배열)로 특정 패널을 열거나 현재 열린 패널을 확인합니다."
                >
                    <AppAccordion :items="defaultItems" v-model="defaultOpen">
                        <template #default1>Default Content 1</template>
                        <template #default2>Default Content 2</template>
                        <template #default3>Default Content 3</template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled" description="disabled 항목은 열고 닫을 수 없습니다.">
                    <AppAccordion :items="disabledItems" initial="first">
                        <template #active1>Active Content</template>
                        <template #disabled>Disabled Content</template>
                        <template #active2>Active Content 2</template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- SLOT -->
                <PageDemoSection class="page-demo-section" title="Slot" description="아코디언 본문을 슬롯으로 연결합니다.">
                    <AppAccordion :items="slotItems" initial="first">
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
                                    <p>아코디언 안에 버튼을 직접 배치한 예시입니다.</p>
                                </div>

                                <div class="page-demo-actions">
                                    <AppButton variant="fill">실행</AppButton>
                                    <AppButton variant="outline">취소</AppButton>
                                </div>
                            </div>
                        </template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- LINE VARIANT -->
                <PageDemoSection
                    class="page-demo-section"
                    title="variant = line (드롭 다운 테이블 / FAQ)"
                    description="Figma 13. Table Guide - 드롭 다운 테이블. prefix 로 'Q.' 머리글, item.content 로 간단한 본문을 넣습니다."
                >
                    <AppAccordion :items="faqItems" variant="line" prefix="Q." :multiple="false" initial="none" />
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
const faqItems: AppAccordionItem[] = [
    {
        id: 'faq-1',
        title: '작업지시는 언제 생성되나요?',
        content: '매일 06:00 에 생산계획 기준으로 자동 생성됩니다.\n긴급 작업은 작업지시 화면에서 수동 등록할 수 있습니다.',
    },
    {
        id: 'faq-2',
        title: '실적 수정은 어떻게 하나요?',
        content: '작업실적 현황 > 행 클릭 > 상세 Drawer 에서 수정 후 저장합니다.\n마감된 실적은 관리자 승인이 필요합니다.',
    },
    { id: 'faq-3', title: '불량 사유 코드를 추가하고 싶어요.', content: '기준정보 > 공통코드 > DEFECT_REASON 그룹에 추가합니다.' },
];
import type { AppAccordionItem } from '~/components/AppAccordion.vue';

/* stores/composables */
const { title, description } = useDemoI18n('accordion');

const defaultOpen = ref<Array<string | number>>(['default-2', 'default-3']);

const basicItems: AppAccordionItem[] = [
    {
        id: 'basic-1',
        title: '기본 정보',
        description: '텍스트와 입력 필드 예시',
        slot: 'basicInfo',
    },
    {
        id: 'basic-2',
        title: '선택 영역',
        description: '셀렉트 컴포넌트 예시',
        slot: 'basicSelect',
    },
    {
        id: 'basic-3',
        title: '버튼 영역',
        description: '버튼 예시',
        slot: 'basicButton',
    },
];

const typeItems: AppAccordionItem[] = [
    {
        id: 'type-1',
        title: 'Panel 1',
        description: '첫 번째 패널',
        slot: 'panel1',
    },
    {
        id: 'type-2',
        title: 'Panel 2',
        description: '두 번째 패널',
        slot: 'panel2',
    },
    {
        id: 'type-3',
        title: 'Panel 3',
        description: '세 번째 패널',
        slot: 'panel3',
    },
];

const initialItems: AppAccordionItem[] = [
    {
        id: 'initial-1',
        title: '초기 패널 1',
        slot: 'initial1',
    },
    {
        id: 'initial-2',
        title: '초기 패널 2',
        slot: 'initial2',
    },
    {
        id: 'initial-3',
        title: '초기 패널 3',
        slot: 'initial3',
    },
];

const defaultItems: AppAccordionItem[] = [
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

const disabledItems: AppAccordionItem[] = [
    {
        id: 'disabled-1',
        title: '활성 패널',
        description: '열고 닫을 수 있습니다.',
        slot: 'active1',
    },
    {
        id: 'disabled-2',
        title: '비활성 패널',
        description: 'disabled 상태',
        disabled: true,
        slot: 'disabled',
    },
    {
        id: 'disabled-3',
        title: '활성 패널 2',
        description: '열고 닫을 수 있습니다.',
        slot: 'active2',
    },
];

const slotItems: AppAccordionItem[] = [
    {
        id: 'slot-1',
        title: '진행 상태',
        description: 'slot으로 내용 연결',
        slot: 'progress',
    },
    {
        id: 'slot-2',
        title: '액션',
        description: '버튼 직접 배치',
        slot: 'actions',
    },
];

/* computed */
</script>
