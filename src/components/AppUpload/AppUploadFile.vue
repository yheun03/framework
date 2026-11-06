<template>
    <div
        class="app-file-upload"
        :class="rootClasses"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
    >
        <div class="app-file-upload__head">
            <div class="app-file-upload__dropzone">
                <input
                    ref="fileInput"
                    class="app-file-upload__input"
                    type="file"
                    :accept="accept"
                    :multiple="multiple"
                    :disabled="disabled"
                    @change="handleFileChange"
                />

                <button type="button" class="app-file-upload__trigger" :disabled="disabled" @click="handleFileOpen">
                    <span class="app-file-upload__trigger-icon" aria-hidden="true">
                        <IconFileUpload />
                    </span>

                    <span class="app-file-upload__trigger-text">
                        {{ triggerText }}
                    </span>

                    <span class="app-file-upload__trigger-subtext">
                        {{ helperText }}
                    </span>
                </button>
            </div>

            <div class="app-file-upload__actions">
                <AppButton variant="outline" size="sm" :disabled="disabled || !items.length" @click="handleClearAll">
                    {{ multiple ? '전체 삭제' : '파일 삭제' }}
                </AppButton>
            </div>
        </div>

        <ul v-if="items.length" class="app-file-upload__list">
            <li v-for="uploadItem in items" :key="uploadItem.id" class="app-file-upload__item">
                <div class="app-file-upload__icon" aria-hidden="true">
                    <IconFile />
                </div>

                <div class="app-file-upload__content">
                    <p class="app-file-upload__name">
                        {{ uploadItem.name }}
                    </p>

                    <div class="app-file-upload__meta">
                        <span class="app-file-upload__meta-item">
                            {{ uploadItem.type || 'unknown' }}
                        </span>
                        <span class="app-file-upload__meta-divider">·</span>
                        <span class="app-file-upload__meta-item">
                            {{ formatBytes(uploadItem.size) }}
                        </span>
                    </div>
                </div>

                <div class="app-file-upload__item-actions">
                    <AppTextButton v-if="isPdfItem(uploadItem)" size="sm" aria-label="PDF 미리보기" @click="handlePreviewPdf(uploadItem)">
                        미리보기
                    </AppTextButton>

                    <AppIconButton aria-label="파일 삭제" :size="28" :icon-size="16" :disabled="disabled" @click="handleRemoveItem(uploadItem.id)"
                        ><IconClose
                    /></AppIconButton>
                </div>
            </li>
        </ul>

        <p v-if="hint" class="app-file-upload__hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>
import { IconClose, IconFile, IconFileUpload } from '@/components/icons';
import { useModalViewer } from '@/composables/useModalViewer';
import { createUploadId, formatBytes, resolveNextUploadItems } from '@/utils/upload';
import { normalizeUploadItems, resolveUploadValue, useAppUpload } from '@/composables/useAppUpload';
import { computed } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';

const props = defineProps({
    modelValue: { type: null, default: null },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: '*/*' },
    hint: { type: String, default: '' },
    triggerText: { type: String, default: '파일 업로드' },
    allowDrop: { type: Boolean, default: true },
    maxSize: { type: Number, default: undefined },
    maxCount: { type: Number, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'change', 'remove', 'clear', 'error']);

const { openPdfViewer } = useModalViewer();
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

function createPathItem(path, index = 0) {
    const fallbackName = path.split('/').pop()?.split('?')[0] || `file-${index + 1}`;
    return {
        id: `path-${index}-${path}`,
        name: fallbackName,
        type: 'file/path',
        size: 0,
        path,
        source: 'sample',
    };
}

const items = computed(() => {
    return normalizeUploadItems(props.modelValue, createPathItem);
});

function createId() {
    return createUploadId('file');
}

function emitValue(nextItems) {
    const value = resolveUploadValue(nextItems, props.multiple);

    emit('update:modelValue', value);
    emit('change', value);
}

function error(message, detail) {
    emit('error', { message, detail });
}

async function createItemFromFile(file) {
    const accepted = shouldAcceptFile(file);
    if (!accepted) return null;

    return {
        id: createId(),
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        file,
        source: 'upload',
    };
}

async function appendFiles(files) {
    const createdItems = (await Promise.all(files.map(createItemFromFile))).filter(Boolean);

    const nextItems = resolveNextUploadItems({
        currentItems: items.value,
        createdItems,
        multiple: props.multiple,
        maxCount: props.maxCount,
    });
    if (!nextItems.length) return;

    emitValue(nextItems);
}

function handleRemoveItem(id) {
    const target = items.value.find((uploadItem) => uploadItem.id === id);
    if (!target) return;

    emit('remove', target);
    emitValue(items.value.filter((uploadItem) => uploadItem.id !== id));
}

function isPdfItem(item) {
    const name = item.name.toLowerCase();
    const path = item.path?.toLowerCase() ?? '';
    return item.type === 'application/pdf' || name.endsWith('.pdf') || path.endsWith('.pdf');
}

function handlePreviewPdf(item) {
    openPdfViewer({
        name: item.name,
        path: item.path,
        file: item.file,
    });
}

function handleClearAll() {
    if (items.value.length === 1) {
        emit('remove', items.value[0]);
    }
    emit('clear');
    emitValue([]);
}

async function handleFileChange(event) {
    const target = event.target;
    const files = Array.from(target.files ?? []);

    if (!files.length) return;

    await appendFiles(files);
    target.value = '';
}

async function handleDrop(event) {
    await handleUploadDrop(event, appendFiles);
}
</script>
