<template>
    <div class="app-file-upload" :class="rootClasses" @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
        <div class="app-file-upload__head">
            <div class="app-file-upload__dropzone">
                <input ref="fileInput" class="app-file-upload__input" type="file" :accept="accept" :multiple="multiple"
                    :disabled="disabled" @change="handleFileChange" />

                <component :is="'button'" type="button" class="app-file-upload__trigger" :disabled="disabled"
                    @click="handleFileOpen">
                    <span class="app-file-upload__trigger-icon" aria-hidden="true">
                        <Icon icon="mdi:file-upload-outline" />
                    </span>

                    <span class="app-file-upload__trigger-text">
                        {{ triggerText }}
                    </span>

                    <span class="app-file-upload__trigger-subtext">
                        {{ helperText }}
                    </span>
                </component>
            </div>

            <div class="app-file-upload__actions">
                <AppButton variant="outline" size="sm" :disabled="disabled || !items.length" @click="handleClearAll">
                    {{ multiple ? "전체 삭제" : "파일 삭제" }}
                </AppButton>
            </div>
        </div>

        <ul v-if="items.length" class="app-file-upload__list">
            <li v-for="uploadItem in items" :key="uploadItem.id" class="app-file-upload__item">
                <div class="app-file-upload__icon" aria-hidden="true">
                    <Icon icon="mdi:file-document-outline" />
                </div>

                <div class="app-file-upload__content">
                    <p class="app-file-upload__name">
                        {{ uploadItem.name }}
                    </p>

                    <div class="app-file-upload__meta">
                        <span class="app-file-upload__meta-item">
                            {{ uploadItem.type || "unknown" }}
                        </span>
                        <span class="app-file-upload__meta-divider">·</span>
                        <span class="app-file-upload__meta-item">
                            {{ formatBytes(uploadItem.size) }}
                        </span>
                    </div>
                </div>

                <div class="app-file-upload__item-actions">
                    <AppTextButton v-if="isPdfItem(uploadItem)" size="sm" aria-label="PDF 미리보기"
                        @click="handlePreviewPdf(uploadItem)">
                        미리보기
                    </AppTextButton>

                    <AppIconButton icon="mdi:close" aria-label="파일 삭제" :button-size="28" :icon-size="16"
                        :disabled="disabled" @click="handleRemoveItem(uploadItem.id)" />
                </div>
            </li>
        </ul>

        <p v-if="hint" class="app-file-upload__hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { useModalViewer } from "~/composables/useModalViewer";
import {
    buildUploadHelperText,
    createUploadId,
    formatBytes,
    isAcceptedUploadType,
} from "~/utils/upload";

type AppUploadFileValue = string | AppUploadFileItem;
type AppUploadFileModelValue = AppUploadFileValue | AppUploadFileValue[] | null;

export type AppUploadFileItem = {
    id: string;
    name: string;
    type: string;
    size: number;
    path?: string;
    file?: File;
    source?: "sample" | "upload";
};

const props = withDefaults(
    defineProps<{
        modelValue?: AppUploadFileModelValue;
        disabled?: boolean;
        multiple?: boolean;
        accept?: string;
        hint?: string;
        triggerText?: string;
        allowDrop?: boolean;
        maxSizeBytes?: number;
        maxCount?: number;
    }>(),
    {
        modelValue: null,
        disabled: false,
        multiple: false,
        accept: "*/*",
        hint: "",
        triggerText: "파일 업로드",
        allowDrop: true,
        maxSizeBytes: undefined,
        maxCount: undefined,
    },
);

const emit = defineEmits<{
    (
        e: "update:modelValue",
        value: AppUploadFileItem | AppUploadFileItem[] | null,
    ): void;
    (e: "change", value: AppUploadFileItem | AppUploadFileItem[] | null): void;
    (e: "remove", item: AppUploadFileItem): void;
    (e: "clear"): void;
    (e: "error", payload: { message: string; detail?: unknown }): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const { openPdfViewer } = useModalViewer();

const rootClasses = computed(() => ({
    "is-disabled": props.disabled,
    "is-dragover": dragOver.value,
    "is-multiple": props.multiple,
}));

function createPathItem(path: string, index = 0): AppUploadFileItem {
    const fallbackName =
        path.split("/").pop()?.split("?")[0] || `file-${index + 1}`;
    return {
        id: `path-${index}-${path}`,
        name: fallbackName,
        type: "file/path",
        size: 0,
        path,
        source: "sample",
    };
}

const items = computed<AppUploadFileItem[]>(() => {
    if (!props.modelValue) return [];

    const sourceItems = Array.isArray(props.modelValue)
        ? props.modelValue
        : [props.modelValue];

    return sourceItems.map((value, index) =>
        typeof value === "string" ? createPathItem(value, index) : value,
    );
});

const helperText = computed(() => buildUploadHelperText(props));

function createId() {
    return createUploadId("file");
}

function handleFileOpen() {
    if (props.disabled) return;
    fileInput.value?.click();
}

function emitValue(nextItems: AppUploadFileItem[]) {
    const value = props.multiple ? nextItems : (nextItems[0] ?? null);

    emit("update:modelValue", value);
    emit("change", value);
}

function error(message: string, detail?: unknown) {
    emit("error", { message, detail });
}

async function shouldAccept(file: File) {
    if (!isAcceptedUploadType(file, props.accept)) {
        error("허용되지 않는 파일 형식입니다.", {
            accept: props.accept,
            type: file.type,
            name: file.name,
        });
        return false;
    }

    if (props.maxSizeBytes != null && file.size > props.maxSizeBytes) {
        error("파일 용량 제한을 초과했습니다.", {
            maxSizeBytes: props.maxSizeBytes,
            size: file.size,
            name: file.name,
        });
        return false;
    }

    return true;
}

async function createItemFromFile(
    file: File,
): Promise<AppUploadFileItem | null> {
    const accepted = await shouldAccept(file);
    if (!accepted) return null;

    return {
        id: createId(),
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        file,
        source: "upload",
    };
}

async function appendFiles(files: File[]) {
    const createdItems = (
        await Promise.all(files.map(createItemFromFile))
    ).filter(Boolean) as AppUploadFileItem[];

    if (!createdItems.length) return;

    let nextItems = props.multiple
        ? [...items.value, ...createdItems]
        : [createdItems[0]];

    if (props.multiple && props.maxCount != null) {
        nextItems = nextItems.slice(0, props.maxCount);
    }

    emitValue(nextItems);
}

function handleRemoveItem(id: string) {
    const target = items.value.find((uploadItem) => uploadItem.id === id);
    if (!target) return;

    emit("remove", target);
    emitValue(items.value.filter((uploadItem) => uploadItem.id !== id));
}

function isPdfItem(item: AppUploadFileItem) {
    const name = item.name.toLowerCase();
    const path = item.path?.toLowerCase() ?? "";
    return (
        item.type === "application/pdf" ||
        name.endsWith(".pdf") ||
        path.endsWith(".pdf")
    );
}

function handlePreviewPdf(item: AppUploadFileItem) {
    openPdfViewer({
        name: item.name,
        path: item.path,
        file: item.file,
    });
}

function handleClearAll() {
    if (items.value.length === 1) {
        emit("remove", items.value[0]);
    }
    emit("clear");
    emitValue([]);
}

async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files ?? []);

    if (!files.length) return;

    await appendFiles(files);
    target.value = "";
}

function handleDragEnter() {
    if (!props.allowDrop || props.disabled) return;
    dragOver.value = true;
}

function handleDragOver() {
    if (!props.allowDrop || props.disabled) return;
    dragOver.value = true;
}

function handleDragLeave() {
    dragOver.value = false;
}

async function handleDrop(event: DragEvent) {
    dragOver.value = false;

    if (!props.allowDrop || props.disabled) return;

    const files = Array.from(event.dataTransfer?.files ?? []);
    if (!files.length) return;

    await appendFiles(files);
}
</script>
