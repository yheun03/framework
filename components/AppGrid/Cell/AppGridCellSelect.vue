<template>
    <div class="app-grid-cell-control">
        <AppSelect v-model="value" :options="options" size="sm" />
    </div>
</template>

<script setup lang="ts">
import { useAppGridCellRendererValue } from '~/composables/useAppGridCellRendererValue';

type SelectOption = {
    label: string;
    value: string | number | boolean | null;
    disabled?: boolean;
};
type SelectRendererParams = {
    options?: SelectOption[];
};

const props = defineProps<{ params: any }>();

const params = props.params;
const { rendererParams, value } = useAppGridCellRendererValue<string | number | boolean | null, SelectRendererParams>(params);
const options = computed<SelectOption[]>(() => rendererParams.value.options ?? []);
</script>
