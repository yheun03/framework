<template>
    <div class="app-pdf-viewer">
        <div v-if="sourceUrl" class="app-pdf-viewer__frame-wrap">
            <iframe class="app-pdf-viewer__frame" :src="sourceUrl" :title="fileName || 'PDF 미리보기'" />
        </div>

        <div v-else class="app-pdf-viewer__empty">미리보기할 PDF가 없습니다.</div>
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';

const props = defineProps({
    src: { type: String },
    file: { type: null },
    fileName: { type: String },
});

const objectUrl = ref(null);

const sourceUrl = computed(() => {
    if (props.src) return props.src;
    return objectUrl.value;
});

watchEffect((onCleanup) => {
    if (!props.file) {
        objectUrl.value = null;
        return;
    }

    const nextUrl = URL.createObjectURL(props.file);
    objectUrl.value = nextUrl;

    onCleanup(() => {
        URL.revokeObjectURL(nextUrl);
        if (objectUrl.value === nextUrl) {
            objectUrl.value = null;
        }
    });
});
</script>
