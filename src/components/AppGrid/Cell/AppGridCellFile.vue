<template>
    <div class="app-grid-cell-file" @dragenter.stop @dragover.stop @dragleave.stop @drop.stop>
        <AppUploadFile
            v-model="value"
            :multiple="fileOptions.multiple"
            :max-count="fileOptions.maxCount"
            :accept="fileOptions.accept"
            :hint="fileOptions.hint"
            :trigger-text="fileOptions.triggerText"
            :allow-drop="fileOptions.allowDrop"
            :max-size="fileOptions.maxSize"
        />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppUploadFile from '@/components/AppUpload/AppUploadFile.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);

const fileOptions = computed(() => ({
    multiple: Boolean(rendererParams.value.multiple),
    maxCount: rendererParams.value.maxCount,
    accept: rendererParams.value.accept,
    hint: rendererParams.value.hint,
    triggerText: rendererParams.value.triggerText,
    allowDrop: rendererParams.value.allowDrop ?? true,
    maxSize: rendererParams.value.maxSize,
}));
</script>
