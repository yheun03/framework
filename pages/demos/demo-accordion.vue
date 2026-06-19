<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <!-- HEADER -->
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>

                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <!-- BASIC -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Basic" desc="기본적인 multiple 아코디언 예시입니다.">
                    <AppAccordion :items="basicItems" mode="multiple" initial-open="none" />
                </PageDemoAccordionSection>

                <!-- OPEN MODE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Open Mode"
                    desc="한 개만 열리는 single 모드와 여러 개를 자유롭게 여는 multiple 모드를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">single</div>

                            <AppAccordion :items="modeItems" mode="single" initial-open="first" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">multiple</div>

                            <AppAccordion :items="modeItems" mode="multiple" initial-open="none" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- INITIAL OPEN -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Initial Open"
                    desc="페이지 최초 진입 시 none / first / all 상태를 확인할 수 있습니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "none"</div>

                            <AppAccordion :items="initialItems" mode="multiple" initial-open="none" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "first"</div>

                            <AppAccordion :items="initialItems" mode="multiple" initial-open="first" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">initialOpen = "all"</div>

                            <AppAccordion :items="initialItems" mode="multiple" initial-open="all" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- DEFAULT OPEN IDS -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Default Open Ids"
                    desc="defaultOpenIds로 특정 패널만 기본 열림 상태로 지정할 수 있습니다.">
                    <AppAccordion :items="defaultItems" mode="multiple"
                        :default-open-ids="['default-2', 'default-3']" />
                </PageDemoAccordionSection>

                <!-- DISABLED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled"
                    desc="disabled 항목은 열고 닫을 수 없습니다.">
                    <AppAccordion :items="disabledItems" mode="multiple" initial-open="first" />
                </PageDemoAccordionSection>

                <!-- COMPONENT RENDER -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Renderer / Component"
                    desc="bodyRenderer와 component 기반 렌더링을 함께 확인합니다.">
                    <AppAccordion :items="rendererItems" mode="multiple" initial-open="first" />
                </PageDemoAccordionSection>
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
import { h, resolveComponent } from "vue";
import type { AppAccordionItem } from "~/components/AppAccordion.vue";
import PageDemoModalRendererExample from "~/pages/demos/Page_demo/renderer/PageDemoModalRendererExample.vue";

/* stores/composables */
const { title, description } = useDemoI18n("accordion");

const basicItems: AppAccordionItem[] = [
    {
        id: "basic-1",
        title: "기본 정보",
        desc: "텍스트와 입력 필드 예시",
        bodyRenderer: () =>
            h("div", { class: "page-demo-stack" }, [
                h("p", "기본 아코디언 콘텐츠입니다."),
                h(resolveComponent("AppInput"), {
                    modelValue: "sample text",
                    placeholder: "입력하세요.",
                }),
            ]),
    },
    {
        id: "basic-2",
        title: "선택 영역",
        desc: "셀렉트 컴포넌트 예시",
        bodyRenderer: () =>
            h(resolveComponent("AppSelect"), {
                modelValue: null,
                options: [
                    { label: "옵션 A", value: "a" },
                    { label: "옵션 B", value: "b" },
                ],
                placeholder: "선택하세요.",
            }),
    },
    {
        id: "basic-3",
        title: "버튼 영역",
        desc: "버튼 예시",
        bodyRenderer: () =>
            h(
                resolveComponent("AppButton"),
                { variant: "fill" },
                { default: () => "확인" },
            ),
    },
];

const modeItems: AppAccordionItem[] = [
    {
        id: "mode-1",
        title: "Panel 1",
        desc: "첫 번째 패널",
        bodyRenderer: () => h("div", "Panel 1 Content"),
    },
    {
        id: "mode-2",
        title: "Panel 2",
        desc: "두 번째 패널",
        bodyRenderer: () => h("div", "Panel 2 Content"),
    },
    {
        id: "mode-3",
        title: "Panel 3",
        desc: "세 번째 패널",
        bodyRenderer: () => h("div", "Panel 3 Content"),
    },
];

const initialItems: AppAccordionItem[] = [
    {
        id: "initial-1",
        title: "초기 패널 1",
        bodyRenderer: () => h("div", "Initial Content 1"),
    },
    {
        id: "initial-2",
        title: "초기 패널 2",
        bodyRenderer: () => h("div", "Initial Content 2"),
    },
    {
        id: "initial-3",
        title: "초기 패널 3",
        bodyRenderer: () => h("div", "Initial Content 3"),
    },
];

const defaultItems: AppAccordionItem[] = [
    {
        id: "default-1",
        title: "Default 1",
        bodyRenderer: () => h("div", "Default Content 1"),
    },
    {
        id: "default-2",
        title: "Default 2",
        bodyRenderer: () => h("div", "Default Content 2"),
    },
    {
        id: "default-3",
        title: "Default 3",
        bodyRenderer: () => h("div", "Default Content 3"),
    },
];

const disabledItems: AppAccordionItem[] = [
    {
        id: "disabled-1",
        title: "활성 패널",
        desc: "열고 닫을 수 있습니다.",
        bodyRenderer: () => h("div", "Active Content"),
    },
    {
        id: "disabled-2",
        title: "비활성 패널",
        desc: "disabled 상태",
        disabled: true,
        bodyRenderer: () => h("div", "Disabled Content"),
    },
    {
        id: "disabled-3",
        title: "활성 패널 2",
        desc: "열고 닫을 수 있습니다.",
        bodyRenderer: () => h("div", "Active Content 2"),
    },
];

const rendererItems: AppAccordionItem[] = [
    {
        id: "renderer-1",
        title: "bodyRenderer 방식",
        desc: "render function으로 내용 생성",
        bodyRenderer: () =>
            h("div", { class: "page-demo-stack" }, [
                h("p", "이 콘텐츠는 bodyRenderer로 렌더링됩니다."),
                h(resolveComponent("AppProgress"), {
                    value: 65,
                    variant: "linear",
                }),
            ]),
    },
    {
        id: "renderer-2",
        title: "component 방식",
        desc: "component + componentProps 전달",
        component: PageDemoModalRendererExample,
        componentProps: {
            lastAction: "accordion renderer",
            onAction: () => { },
        },
    },
];

/* computed */</script>
