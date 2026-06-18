<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <AppAccordion class="page-demo-accordion" :items="demoSections" mode="multiple" initial-open="all">
                    <template #basic>
                        <div class="page-demo-row">
                            <AppUploadFile v-model="basic.file" />

                            <div class="page-demo-stack">
                                <div class="page-demo-hint">
                                    단일 파일 업로드용 기본 예시입니다.
                                </div>

                                <div class="page-demo-actions">
                                    <AppButton size="sm" variant="outline" @click="handleBasicSampleSet">
                                        샘플 파일
                                    </AppButton>

                                    <AppTextButton size="sm" :disabled="!basic.file" @click="handleBasicClear">
                                        값 비우기
                                    </AppTextButton>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #multiple>
                        <div class="page-demo-row">
                            <AppUploadFile v-model="multiple.files" multiple :max-count="4" />

                            <div class="page-demo-stack">
                                <div class="page-demo-hint">
                                    최대 4개까지 업로드할 수 있습니다.
                                </div>

                                <div class="page-demo-actions">
                                    <AppButton size="sm" variant="outline" @click="handleMultipleSamplesSet">
                                        샘플 파일
                                    </AppButton>

                                    <AppTextButton size="sm" :disabled="!multiple.files.length"
                                        @click="handleMultipleClear">
                                        값 비우기
                                    </AppTextButton>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #drop>
                        <div class="page-demo-grid">
                            <div class="page-demo-stack">
                                <AppUploadFile v-model="drop.enabled" :allow-drop="true" />

                                <div class="page-demo-hint">드롭 가능 상태입니다.</div>
                            </div>

                            <div class="page-demo-stack">
                                <AppUploadFile v-model="drop.disabled" :allow-drop="false" />

                                <div class="page-demo-hint">드롭 비허용 상태입니다.</div>
                            </div>
                        </div>
                    </template>

                    <template #rules>
                        <div class="page-demo-grid">
                            <div class="page-demo-stack">
                                <AppUploadFile v-model="rules.docsOnly" accept=".pdf,.doc,.docx,.xls,.xlsx" />

                                <div class="page-demo-hint">
                                    <strong>accept</strong> 속성으로 문서 형식만 허용합니다.
                                </div>
                            </div>

                            <div class="page-demo-stack">
                                <AppUploadFile v-model="rules.maxSizeFile" :max-size-bytes="rules.maxSizeBytes" />

                                <div class="page-demo-hint">
                                    <strong>maxSizeBytes</strong> 속성으로 최대 용량을 제한합니다.
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #disabled>
                        <div class="page-demo-row">
                            <AppUploadFile v-model="disabled.file" :disabled="disabled.value" />

                            <div class="page-demo-stack">
                                <div class="page-demo-actions">
                                    <AppTextButton size="sm" @click="handleDisabledToggle">
                                        disabled: {{ disabled.value ? "ON" : "OFF" }}
                                    </AppTextButton>

                                    <AppTextButton size="sm" :disabled="!disabled.file" @click="handleDisabledClear">
                                        값 비우기
                                    </AppTextButton>
                                </div>
                            </div>
                        </div>
                    </template>
                </AppAccordion>
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

const { title, description } = useDemoI18n("uploadFile");

const demoSections: AppAccordionItem[] = [
    {
        id: "basic",
        title: "Basic",
        desc: "가장 기본적인 단일 파일 업로드 예시입니다. PDF 파일은 항목의 미리보기 버튼으로 PDF 뷰어 모달을 열 수 있습니다.",
        slot: "basic",
    },
    {
        id: "multiple",
        title: "Multiple",
        desc: "여러 파일을 업로드하고 최대 개수 제한을 적용하는 예시입니다.",
        slot: "multiple",
    },
    {
        id: "drop",
        title: "Drag & Drop",
        desc: "allowDrop 속성으로 드래그 앤 드롭 허용 여부를 제어합니다.",
        slot: "drop",
    },
    {
        id: "rules",
        title: "File Rules",
        desc: "파일 형식과 최대 용량 제한 예시입니다.",
        slot: "rules",
    },
    {
        id: "disabled",
        title: "Disabled",
        desc: "비활성 상태에서 선택/드롭을 막는 예시입니다.",
        slot: "disabled",
    },
];

type UploadFileItem = {
    id: string;
    name: string;
    type: string;
    size: number;
    path?: string;
    file?: File;
    source?: "sample" | "upload";
};

const basic = reactive({
    file: null as UploadFileItem | null,
});

const multiple = reactive({
    files: [] as UploadFileItem[],
});

const drop = reactive({
    enabled: null as UploadFileItem | null,
    disabled: null as UploadFileItem | null,
});

const rules = reactive({
    docsOnly: null as UploadFileItem | null,
    maxSizeFile: null as UploadFileItem | null,
    maxSizeBytes: 5 * 1024 * 1024,
});

const disabled = reactive({
    file: null as UploadFileItem | null,
    value: true,
});

function toSampleFile(name: string, type: string, size: number, path: string) {
    return {
        id: `sample-${name}`,
        name,
        type,
        size,
        path,
        source: "sample" as const,
    } satisfies UploadFileItem;
}

function handleBasicSampleSet() {
    basic.file = toSampleFile(
        "project-overview.pdf",
        "application/pdf",
        240000,
        "/samples/project-overview.pdf",
    );
}

function handleMultipleSamplesSet() {
    multiple.files = [
        toSampleFile(
            "contract.pdf",
            "application/pdf",
            180000,
            "/samples/contract.pdf",
        ),
        toSampleFile(
            "budget.xlsx",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            92000,
            "/samples/budget.xlsx",
        ),
        toSampleFile(
            "notes.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            76000,
            "/samples/notes.docx",
        ),
    ];
}

function handleBasicClear() {
    basic.file = null;
}

function handleMultipleClear() {
    multiple.files = [];
}

function handleDisabledClear() {
    disabled.file = null;
}

function handleDisabledToggle() {
    disabled.value = !disabled.value;
}
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
