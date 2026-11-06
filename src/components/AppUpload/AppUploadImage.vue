<template>
    <div
        class="app-image-upload"
        :class="rootClasses"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
    >
        <div class="app-image-upload__head">
            <div class="app-image-upload__dropzone">
                <input
                    ref="fileInput"
                    class="app-image-upload__input"
                    type="file"
                    :accept="accept"
                    :multiple="multiple"
                    :disabled="disabled"
                    @change="handleFileChange"
                />

                <button type="button" class="app-image-upload__trigger" :disabled="disabled" @click="handleFileOpen">
                    <span class="app-image-upload__trigger-icon" aria-hidden="true">
                        <IconImagePlus />
                    </span>

                    <span class="app-image-upload__trigger-text">
                        {{ triggerText }}
                    </span>

                    <span class="app-image-upload__trigger-subtext">
                        {{ helperText }}
                    </span>
                </button>
            </div>

            <div class="app-image-upload__actions">
                <AppButton variant="outline" size="sm" :disabled="disabled || !items.length" @click="handleClearAll">
                    {{ multiple ? '전체 삭제' : '이미지 삭제' }}
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
                            {{ uploadItem.type || 'unknown' }}
                        </span>
                        <span class="app-image-upload__meta-divider">·</span>
                        <span class="app-image-upload__meta-item">
                            {{ formatBytes(uploadItem.size) }}
                        </span>
                    </div>
                </div>

                <div class="app-image-upload__item-actions">
                    <AppTextButton v-if="uploadItem.url" size="sm" aria-label="이미지 미리보기" @click="handlePreviewItem(uploadItem)">
                        미리보기
                    </AppTextButton>

                    <AppIconButton aria-label="파일 삭제" :size="28" :icon-size="16" :disabled="disabled" @click="handleRemoveItem(uploadItem.id)"
                        ><IconClose
                    /></AppIconButton>
                </div>
            </li>
        </ul>

        <p v-if="hint" class="app-image-upload__hint">
            {{ hint }}
        </p>
    </div>
</template>

<script setup>
import { IconClose, IconImagePlus } from '@/components/icons';
import { useModalViewer } from '@/composables/useModalViewer';
import { createUploadId, formatBytes, resolveNextUploadItems } from '@/utils/upload';
import { normalizeUploadItems, resolveUploadValue, useAppUpload } from '@/composables/useAppUpload';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import AppButton from '@/components/AppButton/AppButton.vue';
import AppIconButton from '@/components/AppButton/AppIconButton.vue';
import AppTextButton from '@/components/AppButton/AppTextButton.vue';

const props = defineProps({
    modelValue: { type: null, default: null },
    disabled: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: 'image/*' },
    hint: { type: String, default: '' },
    triggerText: { type: String, default: '이미지 업로드' },
    allowDrop: { type: Boolean, default: true },
    maxSize: { type: Number, default: undefined },
    maxCount: { type: Number, default: undefined },
    readMode: { type: String, default: 'dataUrl' },
});

const emit = defineEmits(['update:modelValue', 'change', 'remove', 'clear', 'error']);

const objectUrls = ref([]);
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

function createUrlItem(url, index = 0) {
    const fallbackName = url.split('/').pop()?.split('?')[0] || `image-${index + 1}`;
    return {
        id: `url-${index}-${url}`,
        name: fallbackName,
        type: 'image/url',
        size: 0,
        url,
        alt: fallbackName,
        source: 'sample',
    };
}

const items = computed(() => {
    return normalizeUploadItems(props.modelValue, createUrlItem);
});

function createId() {
    return createUploadId('image');
}

function cleanupObjectUrls() {
    objectUrls.value.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.value = [];
}

function emitValue(nextItems) {
    const value = resolveUploadValue(nextItems, props.multiple);

    emit('update:modelValue', value);
    emit('change', value);
}

function error(message, detail) {
    emit('error', { message, detail });
}

function toObjectUrl(file) {
    const url = URL.createObjectURL(file);
    objectUrls.value.push(url);
    return url;
}

function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
        reader.onload = () => resolve(String(reader.result ?? ''));

        reader.readAsDataURL(file);
    });
}

async function createItemFromFile(file) {
    const accepted = shouldAcceptFile(file);
    if (!accepted) return null;

    const url = props.readMode === 'objectUrl' ? toObjectUrl(file) : await readAsDataUrl(file);

    return {
        id: createId(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        alt: file.name,
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

function handlePreviewItem(item) {
    openImageViewer({
        name: item.name,
        url: item.url,
        alt: item.alt,
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

watch(
    () => props.modelValue,
    () => {
        if (props.readMode !== 'objectUrl') return;

        const validUrls = items.value.filter((uploadItem) => uploadItem.source === 'upload').map((uploadItem) => uploadItem.url);

        objectUrls.value = objectUrls.value.filter((url) => validUrls.includes(url));
    },
    { deep: true },
);

onBeforeUnmount(() => {
    cleanupObjectUrls();
});
</script>
