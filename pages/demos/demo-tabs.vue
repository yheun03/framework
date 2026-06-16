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
                <PageDemoAccordionSection class="page-demo-accordion" title="Basic" desc="기본적인 line 탭 예시입니다.">
                    <AppTabs :items="basicItems" variant="line" v-model:active-id="basicActiveId" />
                </PageDemoAccordionSection>

                <!-- VARIANT -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Variant" desc="line / box / pill 스타일을 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "line"</div>

                            <AppTabs :items="variantItems" variant="line" v-model:active-id="lineActiveId" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "box"</div>

                            <AppTabs :items="variantItems" variant="box" v-model:active-id="boxActiveId" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">variant = "pill"</div>

                            <AppTabs :items="variantItems" variant="pill" v-model:active-id="pillActiveId" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- DEFAULT ACTIVE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Default Active Id"
                    desc="defaultActiveId로 특정 탭을 기본 활성 상태로 지정할 수 있습니다.">
                    <AppTabs :items="defaultItems" variant="line" default-active-id="default-2" />
                </PageDemoAccordionSection>

                <!-- DISABLED -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Disabled" desc="disabled 탭은 선택할 수 없습니다.">
                    <AppTabs :items="disabledItems" variant="box" v-model:active-id="disabledActiveId" />
                </PageDemoAccordionSection>

                <!-- SIZE -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Size" desc="sm / md / lg 크기를 비교합니다.">
                    <div class="page-demo-stack">
                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "sm"</div>

                            <AppTabs :items="sizeItems" size="sm" variant="pill" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "md"</div>

                            <AppTabs :items="sizeItems" size="md" variant="pill" />
                        </div>

                        <div class="page-demo-stack">
                            <div class="page-demo-hint">size = "lg"</div>

                            <AppTabs :items="sizeItems" size="lg" variant="pill" />
                        </div>
                    </div>
                </PageDemoAccordionSection>

                <!-- VERTICAL -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Vertical" desc="orientation을 vertical로 지정한 좌측 탭 예시입니다.">
                    <AppTabs :items="verticalItems" orientation="vertical" variant="line"
                        v-model:active-id="verticalActiveId" />
                </PageDemoAccordionSection>

                <!-- COMPONENT RENDER -->
                <PageDemoAccordionSection class="page-demo-accordion" title="Renderer / Component"
                    desc="bodyRenderer와 component 기반 렌더링을 함께 확인합니다.">
                    <AppTabs :items="rendererItems" variant="line" v-model:active-id="rendererActiveId">
                        <template #custom="{ item }">
                            <div class="page-demo-stack">
                                <p>{{ item.title }} 슬롯 콘텐츠입니다.</p>
                                <AppButton variant="fill"> Slot Button </AppButton>
                            </div>
                        </template>
                    </AppTabs>
                </PageDemoAccordionSection>
            </main>

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <PageDemoAccordionSection class="page-demo-accordion" title="Current Value">
                        <pre class="page-demo-output">{{ output }}</pre>
                    </PageDemoAccordionSection>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 탭 데모 화면의 탭 항목, 렌더러 예제, 현재 값을 관리하는 페이지 컴포넌트입니다.
 */
import { h, resolveComponent } from "vue";
import type { AppTabItem } from "~/components/AppTabs.vue";
import PageDemoModalRendererExample from "~/pages/demos/Page_demo/renderer/PageDemoModalRendererExample.vue";

const { title, description } = useDemoI18n("tabs");

const basicActiveId = ref<string | number | null>(null);
const lineActiveId = ref<string | number | null>(null);
const boxActiveId = ref<string | number | null>(null);
const pillActiveId = ref<string | number | null>(null);
const disabledActiveId = ref<string | number | null>(null);
const verticalActiveId = ref<string | number | null>(null);
const rendererActiveId = ref<string | number | null>(null);

const basicItems: AppTabItem[] = [
    {
        id: "basic-1",
        title: "기본 정보",
        desc: "텍스트와 입력 필드",
        icon: "mdi:information-outline",
        bodyRenderer: () =>
            h("div", { class: "page-demo-stack" }, [
                h("p", "기본 탭 콘텐츠입니다."),
                h(resolveComponent("AppInput"), {
                    modelValue: "sample text",
                    placeholder: "입력하세요.",
                }),
            ]),
    },
    {
        id: "basic-2",
        title: "선택 영역",
        desc: "셀렉트 컴포넌트",
        icon: "mdi:form-select",
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
        icon: "mdi:gesture-tap-button",
        bodyRenderer: () =>
            h(
                resolveComponent("AppButton"),
                { variant: "fill" },
                { default: () => "확인" },
            ),
    },
];

const variantItems: AppTabItem[] = [
    {
        id: "variant-1",
        title: "Account",
        badge: 3,
        bodyRenderer: () => h("div", "Account Content"),
    },
    {
        id: "variant-2",
        title: "Profile",
        bodyRenderer: () => h("div", "Profile Content"),
    },
    {
        id: "variant-3",
        title: "Security",
        bodyRenderer: () => h("div", "Security Content"),
    },
];

const defaultItems: AppTabItem[] = [
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

const disabledItems: AppTabItem[] = [
    {
        id: "disabled-1",
        title: "활성 탭",
        desc: "선택할 수 있습니다.",
        bodyRenderer: () => h("div", "Active Content"),
    },
    {
        id: "disabled-2",
        title: "비활성 탭",
        desc: "disabled 상태",
        disabled: true,
        bodyRenderer: () => h("div", "Disabled Content"),
    },
    {
        id: "disabled-3",
        title: "활성 탭 2",
        desc: "선택할 수 있습니다.",
        bodyRenderer: () => h("div", "Active Content 2"),
    },
];

const sizeItems: AppTabItem[] = [
    {
        id: "size-1",
        title: "Small",
        bodyRenderer: () => h("div", "Small Content"),
    },
    {
        id: "size-2",
        title: "Medium",
        bodyRenderer: () => h("div", "Medium Content"),
    },
    {
        id: "size-3",
        title: "Large",
        bodyRenderer: () => h("div", "Large Content"),
    },
];

const verticalItems: AppTabItem[] = [
    {
        id: "vertical-1",
        title: "Overview",
        desc: "요약 정보",
        icon: "mdi:view-dashboard-outline",
        bodyRenderer: () => h("div", "Overview Content"),
    },
    {
        id: "vertical-2",
        title: "Members",
        desc: "구성원 정보",
        icon: "mdi:account-group-outline",
        bodyRenderer: () => h("div", "Members Content"),
    },
    {
        id: "vertical-3",
        title: "Settings",
        desc: "설정 정보",
        icon: "mdi:cog-outline",
        bodyRenderer: () => h("div", "Settings Content"),
    },
];

const rendererItems: AppTabItem[] = [
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
            lastAction: "tabs renderer",
            onAction: () => { },
        },
    },
    {
        id: "renderer-3",
        title: "slot 방식",
        desc: "slot name으로 내용 연결",
        slot: "custom",
    },
];

const output = computed(() =>
    JSON.stringify(
        {
            basicActiveId: basicActiveId.value,
            lineActiveId: lineActiveId.value,
            boxActiveId: boxActiveId.value,
            pillActiveId: pillActiveId.value,
            disabledActiveId: disabledActiveId.value,
            verticalActiveId: verticalActiveId.value,
            rendererActiveId: rendererActiveId.value,
            propsSummary: {
                activeId: true,
                defaultActiveId: true,
                initialActive: ["first", "none"],
                variant: ["line", "box", "pill"],
                size: ["sm", "md", "lg"],
                orientation: ["horizontal", "vertical"],
                stretch: true,
            },
        },
        null,
        2,
    ),
);
</script>
