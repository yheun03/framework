<template>
    <div class="app-grid-cell-control app-grid-cell-control--textarea">
        <AppTextarea v-model="value" size="sm" :rows="rows" :resize="resize" :placeholder="placeholder" />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppTextarea from '@/components/AppTextarea.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);

const rows = computed(() => rendererParams.value.rows ?? 2);
const resize = computed(() => rendererParams.value.resize ?? 'none');
const placeholder = computed(() => rendererParams.value.placeholder ?? '');
</script>
