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
                <PageDemoSection class="page-demo-section" title="Content"
                    description="아코디언 안에 입력, 선택, 버튼 컴포넌트를 배치한 예시입니다.">
                    <AppAccordion :items="basicItems" type="multiple" initial-open="none">
                        <template #basicInfo>
                            <div class="page-demo-stack">
                                <p>기본 아코디언 콘텐츠입니다.</p>
                                <AppInput model-value="sample text" placeholder="입력하세요." />
                            </div>
                        </template>

                        <template #basicSelect>
                            <AppSelect :model-value="null" :options="[
                                { label: '옵션 A', value: 'a' },
                                { label: '옵션 B', value: 'b' },
                            ]" placeholder="선택하세요." />
                        </template>

                        <template #basicButton>
                            <AppButton variant="fill">확인</AppButton>
                        </template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- TYPE -->
                <PageDemoSection class="page-demo-section" title="Type"
                    description="한 개만 열리는 single 타입과 여러 개를 자유롭게 여는 multiple 타입을 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">single</div>

                            <AppAccordion :items="typeItems" type="single" initial-open="first">
                                <template #panel1>Panel 1 Content</template>
                                <template #panel2>Panel 2 Content</template>
                                <template #panel3>Panel 3 Content</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">multiple</div>

                            <AppAccordion :items="typeItems" type="multiple" initial-open="none">
                                <template #panel1>Panel 1 Content</template>
                                <template #panel2>Panel 2 Content</template>
                                <template #panel3>Panel 3 Content</template>
                            </AppAccordion>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- INITIAL OPEN -->
                <PageDemoSection class="page-demo-section" title="Initial Open"
                    description="페이지 최초 진입 시 none / first / all 상태를 확인할 수 있습니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "none"</div>

                            <AppAccordion :items="initialItems" type="multiple" initial-open="none">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "first"</div>

                            <AppAccordion :items="initialItems" type="multiple" initial-open="first">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "all"</div>

                            <AppAccordion :items="initialItems" type="multiple" initial-open="all">
                                <template #initial1>Initial Content 1</template>
                                <template #initial2>Initial Content 2</template>
                                <template #initial3>Initial Content 3</template>
                            </AppAccordion>
                        </div>
                    </div>
                </PageDemoSection>

                <!-- DEFAULT OPEN IDS -->
                <PageDemoSection class="page-demo-section" title="Default Open Ids"
                    description="defaultOpenIds로 특정 패널만 기본 열림 상태로 지정할 수 있습니다.">
                    <AppAccordion :items="defaultItems" type="multiple"
                        :default-open-ids="['default-2', 'default-3']">
                        <template #default1>Default Content 1</template>
                        <template #default2>Default Content 2</template>
                        <template #default3>Default Content 3</template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- DISABLED -->
                <PageDemoSection class="page-demo-section" title="Disabled"
                    description="disabled 항목은 열고 닫을 수 없습니다.">
                    <AppAccordion :items="disabledItems" type="multiple" initial-open="first">
                        <template #active1>Active Content</template>
                        <template #disabled>Disabled Content</template>
                        <template #active2>Active Content 2</template>
                    </AppAccordion>
                </PageDemoSection>

                <!-- SLOT -->
                <PageDemoSection class="page-demo-section" title="Slot" description="아코디언 본문을 슬롯으로 연결합니다.">
                    <AppAccordion :items="slotItems" type="multiple" initial-open="first">
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
import type { AppAccordionItem } from "~/components/AppAccordion.vue";

/* stores/composables */
const { title, description } = useDemoI18n("accordion");

const basicItems: AppAccordionItem[] = [
    {
        id: "basic-1",
        title: "기본 정보",
        description: "텍스트와 입력 필드 예시",
        slot: "basicInfo",
    },
    {
        id: "basic-2",
        title: "선택 영역",
        description: "셀렉트 컴포넌트 예시",
        slot: "basicSelect",
    },
    {
        id: "basic-3",
        title: "버튼 영역",
        description: "버튼 예시",
        slot: "basicButton",
    },
];

const typeItems: AppAccordionItem[] = [
    {
        id: "type-1",
        title: "Panel 1",
        description: "첫 번째 패널",
        slot: "panel1",
    },
    {
        id: "type-2",
        title: "Panel 2",
        description: "두 번째 패널",
        slot: "panel2",
    },
    {
        id: "type-3",
        title: "Panel 3",
        description: "세 번째 패널",
        slot: "panel3",
    },
];

const initialItems: AppAccordionItem[] = [
    {
        id: "initial-1",
        title: "초기 패널 1",
        slot: "initial1",
    },
    {
        id: "initial-2",
        title: "초기 패널 2",
        slot: "initial2",
    },
    {
        id: "initial-3",
        title: "초기 패널 3",
        slot: "initial3",
    },
];

const defaultItems: AppAccordionItem[] = [
    {
        id: "default-1",
        title: "Default 1",
        slot: "default1",
    },
    {
        id: "default-2",
        title: "Default 2",
        slot: "default2",
    },
    {
        id: "default-3",
        title: "Default 3",
        slot: "default3",
    },
];

const disabledItems: AppAccordionItem[] = [
    {
        id: "disabled-1",
        title: "활성 패널",
        description: "열고 닫을 수 있습니다.",
        slot: "active1",
    },
    {
        id: "disabled-2",
        title: "비활성 패널",
        description: "disabled 상태",
        disabled: true,
        slot: "disabled",
    },
    {
        id: "disabled-3",
        title: "활성 패널 2",
        description: "열고 닫을 수 있습니다.",
        slot: "active2",
    },
];

const slotItems: AppAccordionItem[] = [
    {
        id: "slot-1",
        title: "진행 상태",
        description: "slot으로 내용 연결",
        slot: "progress",
    },
    {
        id: "slot-2",
        title: "액션",
        description: "버튼 직접 배치",
        slot: "actions",
    },
];

/* computed */</script>
