<template>
    <div class="app-image-upload" :class="rootClasses" @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
        <div class="app-image-upload__head">
            <div class="app-image-upload__dropzone">
                <input ref="fileInput" class="app-image-upload__input" type="file" :accept="accept" :multiple="multiple"
                    :disabled="disabled" @change="handleFileChange" />

                <component :is="'button'" type="button" class="app-image-upload__trigger" :disabled="disabled"
                    @click="handleFileOpen">
                    <span class="app-image-upload__trigger-icon" aria-hidden="true">
                        <IconImagePlus />
                    </span>

                    <span class="app-image-upload__trigger-text">
                        {{ triggerText }}
                    </span>

                    <span class="app-image-upload__trigger-subtext">
                        {{ helperText }}
                    </span>
                </component>
            </div>

            <div class="app-image-upload__actions">
                <AppButton variant="outline" size="sm" :disabled="disabled || !items.length" @click="handleClearAll">
                    {{ multiple ? "전체 삭제" : "이미지 삭제" }}
                </AppButton>
            </div>
        </div>

        <ul v-if="items.length" class="app-image-upload__list">
            <li v-for="uploadItem in items" :key="uploadItem.id" class="app-image-upload__item">
                <div class="app-image-upload__preview">
                    <img v-if="uploadItem.url" :src="uploadItem.url" :alt="uploadItem.alt || uploadItem.name" />

                    <div v-else class="app-image-upload__preview-empty">NO IMAGE</div>
                </div>

                <div class="app-image-upload__content">
                    <p class="app-image-upload__name">
                        {{ uploadItem.name }}
                    </p>

                    <div class="app-image-upload__meta">
                        <span class="app-image-upload__meta-item">
                            {{ uploadItem.type || "unknown" }}
                        </span>
                        <span class="app-image-upload__meta-divider">·</span>
                        <span class="app-image-upload__meta-item">
                            {{ formatBytes(uploadItem.size) }}
                        </span>
                    </div>
                </div>

                <div class="app-image-upload__item-actions">
                    <AppTextButton v-if="uploadItem.url" size="sm" aria-label="이미지 미리보기"
                        @click="handlePreviewItem(uploadItem)">
                        미리보기
                    </AppTextButton>

                    <AppIconButton :icon="IconClose" aria-label="파일 삭제" :button-size="28" :icon-size="16"
                        :disabled="disabled" @click="handleRemoveItem(uploadItem.id)" />
                </div>
            </li>
        </ul>

        <p v-if="hint" class="app-image-upload__hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { IconClose, IconImagePlus } from "~/components/icons";
import { useModalViewer } from "~/composables/useModalViewer";
import {
    createUploadId,
    formatBytes,
    resolveNextUploadItems,
} from "~/utils/upload";
import {
    normalizeUploadItems,
    resolveUploadValue,
    useAppUpload,
    type AppUploadModelValue,
} from "~/composables/useAppUpload";

type ReadMode = "dataUrl" | "objectUrl";
type AppImageUploadModelValue = AppUploadModelValue<AppImageUploadItem>;

export type AppImageUploadItem = {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    alt?: string;
    file?: File;
    source?: "sample" | "upload";
};

const props = withDefaults(
    defineProps<{
        modelValue?: AppImageUploadModelValue;
        disabled?: boolean;
        multiple?: boolean;
        accept?: string;
        hint?: string;
        triggerText?: string;
        allowDrop?: boolean;
        maxSizeBytes?: number;
        maxCount?: number;
        readMode?: ReadMode;
    }>(),
    {
        modelValue: null,
        disabled: false,
        multiple: false,
        accept: "image/*",
        hint: "",
        triggerText: "이미지 업로드",
        allowDrop: true,
        maxSizeBytes: undefined,
        maxCount: undefined,
        readMode: "dataUrl",
    },
);

const emit = defineEmits<{
    (
        e: "update:modelValue",
        value: AppImageUploadItem | AppImageUploadItem[] | null,
    ): void;
    (e: "change", value: AppImageUploadItem | AppImageUploadItem[] | null): void;
    (e: "remove", item: AppImageUploadItem): void;
    (e: "clear"): void;
    (e: "error", payload: { message: string; detail?: unknown }): void;
}>();

const objectUrls = ref<string[]>([]);
const { openImageViewer } = useModalViewer();
const {
    fileInput,
    rootClasses,
    helperText,
    handleFileOpen,
    shouldAcceptFile,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop: handleUploadDrop,
} = useAppUpload(props, error);

function createUrlItem(url: string, index = 0): AppImageUploadItem {
    const fallbackName =
        url.split("/").pop()?.split("?")[0] || `image-${index + 1}`;
    return {
        id: `url-${index}-${url}`,
        name: fallbackName,
        type: "image/url",
        size: 0,
        url,
        alt: fallbackName,
        source: "sample",
    };
}

const items = computed<AppImageUploadItem[]>(() => {
    return normalizeUploadItems(props.modelValue, createUrlItem);
});

function createId() {
    return createUploadId("image");
}

function cleanupObjectUrls() {
    objectUrls.value.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.value = [];
}

function emitValue(nextItems: AppImageUploadItem[]) {
    const value = resolveUploadValue(nextItems, props.multiple);

    emit("update:modelValue", value);
    emit("change", value);
}

function error(message: string, detail?: unknown) {
    emit("error", { message, detail });
}

function toObjectUrl(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.value.push(url);
    return url;
}

function readAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () =>
            reject(new Error("파일을 읽는 중 오류가 발생했습니다."));
        reader.onload = () => resolve(String(reader.result ?? ""));

        reader.readAsDataURL(file);
    });
}

async function createItemFromFile(
    file: File,
): Promise<AppImageUploadItem | null> {
    const accepted = shouldAcceptFile(file);
    if (!accepted) return null;

    const url =
        props.readMode === "objectUrl"
            ? toObjectUrl(file)
            : await readAsDataUrl(file);

    return {
        id: createId(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        alt: file.name,
        file,
        source: "upload",
    };
}

async function appendFiles(files: File[]) {
    const createdItems = (
        await Promise.all(files.map(createItemFromFile))
    ).filter(Boolean) as AppImageUploadItem[];

    const nextItems = resolveNextUploadItems({
        currentItems: items.value,
        createdItems,
        multiple: props.multiple,
        maxCount: props.maxCount,
    });
    if (!nextItems.length) return;

    emitValue(nextItems);
}

function handleRemoveItem(id: string) {
    const target = items.value.find((uploadItem) => uploadItem.id === id);
    if (!target) return;

    emit("remove", target);
    emitValue(items.value.filter((uploadItem) => uploadItem.id !== id));
}

function handlePreviewItem(item: AppImageUploadItem) {
    openImageViewer({
        name: item.name,
        url: item.url,
        alt: item.alt,
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

async function handleDrop(event: DragEvent) {
    await handleUploadDrop(event, appendFiles);
}

watch(
    () => props.modelValue,
    () => {
        if (props.readMode !== "objectUrl") return;

        const validUrls = items.value
            .filter((uploadItem) => uploadItem.source === "upload")
            .map((uploadItem) => uploadItem.url);

        objectUrls.value = objectUrls.value.filter((url) =>
            validUrls.includes(url),
        );
    },
    { deep: true },
);

onBeforeUnmount(() => {
    cleanupObjectUrls();
});
</script>
