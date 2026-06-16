<template>
    <div class="page-demo">
        <div class="page-demo-layout">
            <main class="page-demo-main">
                <header class="page-demo__header">
                    <h1 class="page-demo__title">{{ title }}</h1>
                    <p class="page-demo__desc">{{ description }}</p>
                </header>

                <AppAccordion class="page-demo-accordion" :items="demoSections" mode="multiple" initial-open="none">
                    <template #basic>
                        <div class="page-demo-row">
                            <AppUploadFile v-model="basic.file" @change="handleBasicChange" @error="handleError"
                                @remove="handleRemove" />

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
                            <AppUploadFile v-model="multiple.files" multiple :max-count="4"
                                @change="handleMultipleChange" @error="handleError" @remove="handleRemove" />

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
                                <AppUploadFile v-model="drop.enabled" :allow-drop="true"
                                    @change="handleDropEnabledChange" @error="handleError" />

                                <div class="page-demo-hint">드롭 가능 상태입니다.</div>
                            </div>

                            <div class="page-demo-stack">
                                <AppUploadFile v-model="drop.disabled" :allow-drop="false"
                                    @change="handleDropDisabledChange" @error="handleError" />

                                <div class="page-demo-hint">드롭 비허용 상태입니다.</div>
                            </div>
                        </div>
                    </template>

                    <template #rules>
                        <div class="page-demo-grid">
                            <div class="page-demo-stack">
                                <AppUploadFile v-model="rules.docsOnly" accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    @change="handleRulesDocsChange" @error="handleError" />

                                <div class="page-demo-hint">
                                    <strong>accept</strong> 속성으로 문서 형식만 허용합니다.
                                </div>
                            </div>

                            <div class="page-demo-stack">
                                <AppUploadFile v-model="rules.maxSizeFile" :max-size-bytes="rules.maxSizeBytes"
                                    @change="handleRulesSizeChange" @error="handleError" />

                                <div class="page-demo-hint">
                                    <strong>maxSizeBytes</strong> 속성으로 최대 용량을 제한합니다.
                                </div>
                            </div>
                        </div>
                    </template>

                    <template #disabled>
                        <div class="page-demo-row">
                            <AppUploadFile v-model="disabled.file" :disabled="disabled.value"
                                @change="handleDisabledChange" @error="handleError" />

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

            <aside class="page-demo-aside" aria-label="현재 값 패널">
                <div class="page-demo-aside__sticky">
                    <PageDemoPropsSummary />

                    <AppAccordion class="page-demo-accordion" :items="asideSections" mode="multiple"
                        initial-open="none">
                        <template #actions>
                            <div class="page-demo-actions">
                                <AppButton variant="fill" @click="handleAllSamplesSet">
                                    샘플 파일 일괄 적용
                                </AppButton>

                                <AppTextButton @click="handleReset"> 초기화 </AppTextButton>
                            </div>
                        </template>

                        <template #basicValue>
                            <pre class="page-demo-output">{{ basicOutput }}</pre>
                        </template>

                        <template #multipleValue>
                            <pre class="page-demo-output">{{ multipleOutput }}</pre>
                        </template>

                        <template #dropValue>
                            <pre class="page-demo-output">{{ dropOutput }}</pre>
                        </template>

                        <template #rulesValue>
                            <pre class="page-demo-output">{{ rulesOutput }}</pre>
                        </template>

                        <template #disabledValue>
                            <pre class="page-demo-output">{{ disabledOutput }}</pre>
                        </template>

                        <template #eventValue>
                            <pre class="page-demo-output">{{ eventOutput }}</pre>
                        </template>
                    </AppAccordion>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 파일 업로드 데모 화면의 샘플 파일, 상태, 이벤트 출력을 관리하는 페이지 컴포넌트입니다.
 */
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

const asideSections: AppAccordionItem[] = [
    {
        id: "actions",
        title: "Actions",
        desc: "샘플 적용과 초기화를 실행합니다.",
        slot: "actions",
    },
    {
        id: "basicValue",
        title: "Current Value: Basic",
        desc: "basic.file과 basic.meta 값만 확인합니다.",
        slot: "basicValue",
    },
    {
        id: "multipleValue",
        title: "Current Value: Multiple",
        desc: "multiple.files 개수와 metas 값만 확인합니다.",
        slot: "multipleValue",
    },
    {
        id: "dropValue",
        title: "Current Value: Drag & Drop",
        desc: "drop.enabled / disabled 상태만 확인합니다.",
        slot: "dropValue",
    },
    {
        id: "rulesValue",
        title: "Current Value: File Rules",
        desc: "accept와 maxSize 관련 값만 확인합니다.",
        slot: "rulesValue",
    },
    {
        id: "disabledValue",
        title: "Current Value: Disabled",
        desc: "disabled 상태와 선택 파일 값만 확인합니다.",
        slot: "disabledValue",
    },
    {
        id: "eventValue",
        title: "Current Value: Events",
        desc: "마지막 에러와 삭제 횟수만 확인합니다.",
        slot: "eventValue",
    },
];

type FileMeta = {
    name: string;
    type: string;
    size: number;
    lastModified?: number;
    path?: string;
    source?: "sample" | "upload";
};

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
    meta: null as FileMeta | null,
});

const multiple = reactive({
    files: [] as UploadFileItem[],
    metas: [] as FileMeta[],
});

const drop = reactive({
    enabled: null as UploadFileItem | null,
    disabled: null as UploadFileItem | null,
    enabledMeta: null as FileMeta | null,
    disabledMeta: null as FileMeta | null,
});

const rules = reactive({
    docsOnly: null as UploadFileItem | null,
    maxSizeFile: null as UploadFileItem | null,
    maxSizeBytes: 5 * 1024 * 1024,
    docsOnlyMeta: null as FileMeta | null,
    maxSizeMeta: null as FileMeta | null,
});

const disabled = reactive({
    file: null as UploadFileItem | null,
    value: true,
    meta: null as FileMeta | null,
});

const lastError = ref<{ message: string; detail?: unknown } | null>(null);
const removedCount = ref(0);

function toMeta(item: UploadFileItem): FileMeta {
    if (item.file) {
        return {
            name: item.file.name,
            type: item.file.type,
            size: item.file.size,
            lastModified: item.file.lastModified,
            source: item.source,
        };
    }

    return {
        name: item.name,
        type: item.type,
        size: item.size,
        path: item.path,
        source: item.source,
    };
}

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

function updateMeta(
    item: UploadFileItem | UploadFileItem[] | null,
    assign: (meta: FileMeta | null) => void,
) {
    const nextItem = Array.isArray(item) ? (item[0] ?? null) : item;
    assign(nextItem ? toMeta(nextItem) : null);
    lastError.value = null;
}

function updateMetaList(
    item: UploadFileItem | UploadFileItem[] | null,
    assign: (meta: FileMeta[]) => void,
) {
    const nextItems = Array.isArray(item) ? item : item ? [item] : [];

    assign(nextItems.map(toMeta));
    lastError.value = null;
}

function handleBasicChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        basic.meta = meta;
    });
}

function handleMultipleChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMetaList(item, (meta) => {
        multiple.metas = meta;
    });
}

function handleDropEnabledChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        drop.enabledMeta = meta;
    });
}

function handleDropDisabledChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        drop.disabledMeta = meta;
    });
}

function handleRulesDocsChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        rules.docsOnlyMeta = meta;
    });
}

function handleRulesSizeChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        rules.maxSizeMeta = meta;
    });
}

function handleDisabledChange(item: UploadFileItem | UploadFileItem[] | null) {
    updateMeta(item, (meta) => {
        disabled.meta = meta;
    });
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

function handleAllSamplesSet() {
    basic.file = toSampleFile(
        "project-overview.pdf",
        "application/pdf",
        240000,
        "/samples/project-overview.pdf",
    );
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
    drop.enabled = toSampleFile(
        "drop-guide.pdf",
        "application/pdf",
        120000,
        "/samples/drop-guide.pdf",
    );
    rules.docsOnly = toSampleFile(
        "manual.docx",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        68000,
        "/samples/manual.docx",
    );
    rules.maxSizeFile = toSampleFile(
        "report.pdf",
        "application/pdf",
        440000,
        "/samples/report.pdf",
    );
}

function handleBasicClear() {
    basic.file = null;
    basic.meta = null;
}

function handleMultipleClear() {
    multiple.files = [];
    multiple.metas = [];
}

function handleDisabledClear() {
    disabled.file = null;
    disabled.meta = null;
}

function handleDisabledToggle() {
    disabled.value = !disabled.value;
}

function handleError(payload: { message: string; detail?: unknown }) {
    lastError.value = payload;
}

function handleRemove() {
    removedCount.value += 1;
}

function handleReset() {
    basic.file = null;
    basic.meta = null;

    multiple.files = [];
    multiple.metas = [];

    drop.enabled = null;
    drop.disabled = null;
    drop.enabledMeta = null;
    drop.disabledMeta = null;

    rules.docsOnly = null;
    rules.maxSizeFile = null;
    rules.docsOnlyMeta = null;
    rules.maxSizeMeta = null;

    disabled.file = null;
    disabled.value = true;
    disabled.meta = null;

    lastError.value = null;
    removedCount.value = 0;
}

function stringifyOutput(value: unknown) {
    return JSON.stringify(value, null, 2);
}

const basicOutput = computed(() =>
    stringifyOutput({
        file: basic.file ? "(set)" : "",
        meta: basic.meta,
    }),
);

const multipleOutput = computed(() =>
    stringifyOutput({
        files: multiple.files.length,
        metas: multiple.metas,
    }),
);

const dropOutput = computed(() =>
    stringifyOutput({
        enabled: drop.enabled ? "(set)" : "",
        disabled: drop.disabled ? "(set)" : "",
        enabledMeta: drop.enabledMeta,
        disabledMeta: drop.disabledMeta,
    }),
);

const rulesOutput = computed(() =>
    stringifyOutput({
        docsOnly: rules.docsOnly ? "(set)" : "",
        maxSizeFile: rules.maxSizeFile ? "(set)" : "",
        maxSizeBytes: rules.maxSizeBytes,
        docsOnlyMeta: rules.docsOnlyMeta,
        maxSizeMeta: rules.maxSizeMeta,
    }),
);

const disabledOutput = computed(() =>
    stringifyOutput({
        file: disabled.file ? "(set)" : "",
        value: disabled.value,
        meta: disabled.meta,
    }),
);

const eventOutput = computed(() =>
    stringifyOutput({
        lastError: lastError.value,
        removedCount: removedCount.value,
    }),
);
</script>

<!-- demo 공통 스타일은 assets/scss/main.scss 로 이동 -->
