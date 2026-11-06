<template>
    <div class="app-grid-cell-control">
        <AppDatePicker v-model="value" size="sm" :type="type" :min="min" :max="max" :placeholder="placeholder" />
    </div>
</template>

<script setup>
import { useAppGridCellRendererValue } from '@/composables/useAppGridCellRendererValue';
import { computed } from 'vue';
import AppDatePicker from '@/components/AppDatePicker.vue';

const props = defineProps({
    params: { type: null, required: true },
});

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue(params);

const type = computed(() => rendererParams.value.type ?? 'single');
const min = computed(() => rendererParams.value.min);
const max = computed(() => rendererParams.value.max);
const placeholder = computed(() => rendererParams.value.placeholder ?? '날짜 선택');
</script>
