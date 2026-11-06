<template>
    <div class="app-grid-cell-image" @dragenter.stop @dragover.stop @dragleave.stop @drop.stop>
        <AppUploadImage
            v-model="value"
            :multiple="imageOptions.multiple"
            :max-count="imageOptions.maxCount"
            :accept="imageOptions.accept"
            :hint="imageOptions.hint"
            :trigger-text="imageOptions.triggerText"
            :allow-drop="imageOptions.allowDrop"
            :max-size="imageOptions.maxSize"
            :read-mode="imageOptions.readMode"
        />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppUploadImage from '@/components/AppUpload/AppUploadImage.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);

const imageOptions = computed(() => ({
    multiple: Boolean(rendererParams.value.multiple),
    maxCount: rendererParams.value.maxCount,
    accept: rendererParams.value.accept,
    hint: rendererParams.value.hint,
    triggerText: rendererParams.value.triggerText,
    allowDrop: rendererParams.value.allowDrop ?? true,
    maxSize: rendererParams.value.maxSize,
    readMode: rendererParams.value.readMode,
}));
</script>
