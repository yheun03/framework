<template>
    <div class="app-grid-cell-control">
        <AppDatePicker v-model="value" size="sm" :type="type" :min="min" :max="max" :placeholder="placeholder" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue';
import type { DateRangeValue } from '~/components/AppDatePicker.vue';

type DatePickerModelValue = string | string[] | DateRangeValue | null | undefined;
type DatePickerRendererParams = {
    type?: 'single' | 'multiple' | 'range' | 'range-input';
    min?: string;
    max?: string;
    placeholder?: string;
};

const props = defineProps<{ params: any }>();

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue<DatePickerModelValue, DatePickerRendererParams>(params);

const type = computed(() => rendererParams.value.type ?? 'single');
const min = computed(() => rendererParams.value.min);
const max = computed(() => rendererParams.value.max);
const placeholder = computed(() => rendererParams.value.placeholder ?? '날짜 선택');
</script>
